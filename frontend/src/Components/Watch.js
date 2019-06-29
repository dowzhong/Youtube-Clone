import React, { Component } from 'react';

import './Navbar.js';
import './Css/Watch.css';

import request from 'superagent';
import Navbar from './Navbar.js';

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
            videos: []
        }
    }

    componentDidMount() {
        getVideos()
            .then(body => {
                if (body && body.success) {
                    this.setState({ videos: body.response });
                    return;
                }
                this.setState({ videos: [] });
            })
    }

    render() {
        const video = this.state.videos.find(video => video.id === this.state.videoSrc);
        return (
            <div>
                <Navbar />
                <div className='watch'>
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
                                    <p className='title'>{video.title}</p>
                                    <span class="badge badge-primary dateUploaded">{new Date(video.createdAt).toLocaleDateString()}</span>
                                    <p>{video.description}</p>
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