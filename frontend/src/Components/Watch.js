import React, { Component } from 'react';

import './Navbar.js';
import './Css/Watch.css';

import request from 'superagent';
import Navbar from './Navbar.js';

import { truncate, getThumbnailUrl } from '../utils.js';

async function getVideos() {
    const { body } = await request
        .get(process.env.REACT_APP_API + '/videos');
    return body;
}

class Watch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            videoSrc: this.props.match.params.id,
            videos: [],
            error: null,
            editing: false,
            video: null,
            fullDescription: false,
            suggestions: []
        }
        this.handleDelete = this.handleDelete.bind(this);
        this.editVideo = this.editVideo.bind(this);
        this.save = this.save.bind(this);
        this.renderFullDescription = this.renderFullDescription.bind(this);
    }

    componentDidMount() {
        getVideos()
            .then(body => {
                if (body && body.success) {
                    this.setState({
                        videos: body.response,
                        video: body.response.find(video => video.id === this.state.videoSrc),
                        suggestions: body.response.sort(() => Math.random() - .5).slice(0, 6)
                    });
                    return;
                }
                this.setState({ videos: [] });
            });
    }

    async handleDelete(videoID) {
        try {
            await request
                .del(process.env.REACT_APP_API + '/deleteVideo')
                .send({
                    videoID,
                    token: localStorage.getItem('token')
                })
            window.location.replace('/');
        } catch (err) {
            if (err.response) {
                this.setState({
                    error: err.response.body.response
                });
                return;
            }
            this.setState({ error: err.message });
        }
    }

    editVideo() {
        this.setState({ editing: true });
    }

    renderFullDescription(full) {
        this.setState({ fullDescription: full });
    }

    async save() {
        try {
            await request
                .post(process.env.REACT_APP_API + '/editVideo')
                .send({
                    videoID: this.state.videoSrc,
                    token: localStorage.getItem('token'),
                    title: this.refs.title.value,
                    description: this.refs.description.value
                });
            this.state.video.title = this.refs.title.value;
            this.state.video.description = this.refs.description.value;
            this.setState({ editing: false });
        } catch (err) {
            if (err.response) {
                this.setState({ error: err.response.body.response });
                return;
            }
            this.setState({ error: err.message });
        }
    }

    renderDescription(description) {
        if (description.length > 100 && !this.state.fullDescription) {
            return <p>{description.slice(0, 97)}... <p className='clickable' onClick={this.renderFullDescription.bind(null, true)}>Show More</p></p>;
        }
        return [
            <p>{description}</p>,
            <p className='clickable' onClick={this.renderFullDescription.bind(null, false)}>Show Less</p>
        ];
    }

    render() {
        const video = this.state.video;
        return (
            <div>
                <Navbar />
                <div className='watch'>
                    {
                        this.state.error
                            ? <div className='alert alert-danger' role='alert'>
                                {this.state.error}
                            </div>
                            : null
                    }
                    <div className='video'>
                        <video className='videoPlayer' controls>
                            <source src={process.env.REACT_APP_API + '/videos/' + this.state.videoSrc + '.mp4'} type='video/mp4' />
                            Your browser does not support the video tag. Please use Chrome.
                        </video>
                    </div>
                    <div className='details'>
                        {
                            video
                                ? <div className='metadata'>
                                    {
                                        this.state.editing
                                            ? <div>
                                                <div className='form-group'>
                                                    <label>Video Title</label>
                                                    <input type='text' ref='title' className='form-control' id='title' defaultValue={video.title} />
                                                </div>
                                                <div className='form-group'>
                                                    <label>Video Description</label>
                                                    <textarea className='form-control' id='description' ref='description' rows='3' defaultValue={video.description}></textarea>
                                                </div>
                                                <button className='btn btn-primary btn-lg' type='submit' onClick={this.save}>Save</button>
                                            </div>
                                            : <div>
                                                {
                                                    localStorage.getItem('username') === video.user.username
                                                        ?
                                                        [<span key={0} className='dropdown actions'>
                                                            <button className='btn btn-secondary dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'></button>
                                                            <div className='dropdown-menu' aria-labelledby='dropdownMenuButton'>
                                                                <a onClick={this.editVideo} className='dropdown-item'>Edit</a>
                                                                <a className='dropdown-item' data-toggle='modal' data-target='#exampleModal'>Delete</a>
                                                            </div>
                                                        </span>,
                                                        <div key={1} className='modal fade' id='exampleModal' tabIndex='-1' role='dialog' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                                                            <div className='modal-dialog' role='document'>
                                                                <div className='modal-content'>
                                                                    <div className='modal-header'>
                                                                        <h5 className='modal-title' id='exampleModalLabel'>Confirm?</h5>
                                                                        <button type='button' className='close' data-dismiss='modal' aria-label='Close'>
                                                                            <span aria-hidden='true'>&times;</span>
                                                                        </button>
                                                                    </div>
                                                                    <div className='modal-body'>
                                                                        Are you sure you want to delete this video?
                                                         </div>
                                                                    <div className='modal-footer'>
                                                                        <div className='left-side'>
                                                                            <button type='button' className='btn btn-default btn-link' data-dismiss='modal'>Never mind</button>
                                                                        </div>
                                                                        <div className='divider'></div>
                                                                        <div className='right-side'>
                                                                            <button type='button' className='btn btn-danger btn-link' onClick={this.handleDelete.bind(null, video.id)}>Delete</button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        ]
                                                        : null
                                                }
                                                <p className='title'>{video.title}</p>
                                                <p className='card-text'><small className='text-muted'>Uploaded by <b>{video.user.username}</b> on {new Date(video.createdAt).toLocaleDateString()}</small></p>
                                                {
                                                    video.description
                                                        ? <div className='description'>
                                                            <b className='text-muted'>Description:</b>
                                                            {this.renderDescription(video.description)}
                                                        </div>
                                                        : <p className='noDesc'>No Description</p>
                                                }
                                            </div>
                                    }
                                    <div className='suggestedVideos'>
                                        <h5>Suggested Videos:</h5>
                                        <div className='row justify-content-center'>
                                            {
                                                this.state.suggestions.length
                                                    ? this.state.suggestions.map((video, i) => {
                                                        return (
                                                            <a href={'/watch/' + video.id} key={i}>
                                                                <div className='videoThumbnail card' style={{ width: '15rem' }}>
                                                                    <img className='card-img-top' src={getThumbnailUrl(video.id)} alt='thumbnail' />
                                                                    <div className='card-body'>
                                                                        <b className='card-text'>{truncate(video.title, 20)}</b>
                                                                        <p className="card-text"><small className="text-muted">Uploaded by <b>{truncate(video.user.username, 5)}</b> on {new Date(video.createdAt).toLocaleDateString()}</small></p>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        )
                                                    })
                                                    : <div className='nothing'><h3>No videos with that search term...</h3></div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                : <div className='alert alert-danger' role='alert'>
                                    Failed to fetch video metadata.
                                </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

export default Watch;