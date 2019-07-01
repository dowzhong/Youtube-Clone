import React, { Component } from 'react';

import request from 'superagent';
import queryString from 'query-string';

import Navbar from './Navbar.js';
import './Css/Main.css';

async function getVideos() {
    const { body } = await request
        .get(process.env.REACT_APP_API + '/videos');
    return body;
}

class Main extends Component {
    constructor() {
        super();
        this.state = {
            videos: [],
            shownVideos: [],
            token: queryString.parse(window.location.search).token
        }
        this.renderSearch = this.renderSearch.bind(this);
    }

    componentDidMount() {
        getVideos()
            .then(body => {
                if (body && body.success) {
                    this.setState({ videos: body.response, shownVideos: body.response });
                    return;
                }
                this.setState({ videos: [] });
            })
    }

    renderSearch(e) {
        this.setState({ shownVideos: this.state.videos.filter(video => video.title.toLowerCase().includes(e.target.value.toLowerCase())) });
    }

    render() {
        return (
            <div>
                <Navbar state={this.state} />
                {!this.state.videos.length
                    ? <div className='nothing'><h3>No videos yet...</h3></div>
                    : (
                        <div>
                            <div>
                                <div className="search">
                                    <input type="text" className="form-control" placeholder="Search" onChange={this.renderSearch} />
                                </div>
                                <div className='videos'>
                                    <div className='row justify-content-center'>
                                        {
                                            this.state.shownVideos.length
                                                ? this.state.shownVideos.map((video, i) => {
                                                    return (
                                                        <a href={'/watch/' + video.id} key={i}>
                                                            <div className='videoThumbnail card' style={{ width: '20rem' }}>
                                                                <img className='card-img-top' src={getThumbnailUrl(video.id)} alt='thumbnail' />
                                                                <div className='card-body'>
                                                                    <b className='card-text'>{video.title}</b>
                                                                    <span className="badge badge-pill badge-primary uploadDate">{new Date(video.createdAt).toLocaleDateString()}</span>
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
                        </div>
                    )
                }
            </div>
        )
    }
}

function getThumbnailUrl(videoID) {
    return process.env.REACT_APP_API + '/thumbnails/' + videoID + '-thumbnail-1280x720-0001.png';
}

export default Main;