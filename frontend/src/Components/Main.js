import React, { Component } from 'react';

import request from 'superagent';

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
        return (
            <div>
                <Navbar />
                {!this.state.videos.length
                    ? <div className='nothing'><h3>No videos yet...</h3></div>
                    : (
                        <div>
                            <div>
                                <div className='videos'>
                                    <div className='row justify-content-center'>
                                        {
                                            this.state.videos.map((video, i) => {
                                                return (
                                                    <a href={'/watch/' + video.id}>
                                                        <div className='videoThumbnail card' style={{ width: '20rem' }} key={i}>
                                                            <img className='card-img-top' src={getThumbnailUrl(video.id)} alt='thumbnail' />
                                                            <div className='card-body'>
                                                                <b className='card-text'>{video.title}</b>
                                                                <span class="badge badge-pill badge-primary uploadDate">{new Date(video.createdAt).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    </a>
                                                )
                                            })
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