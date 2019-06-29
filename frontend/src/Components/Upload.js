import React, { Component } from 'react';

import './Css/Upload.css'

import request from 'superagent';

class Main extends Component {
    constructor() {
        super();
        this.state = {
            video: null,
            progress: null,
            error: null
        }
        this.uploadVideo = this.uploadVideo.bind(this);
    }

    componentDidMount() {
    }

    uploadVideo(e) {
        e.preventDefault();
        if (!this.refs.video.files.length) {
            this.setState({ error: 'You must specify a video to upload!' });
            return;
        }
        if (!this.refs.title.value) {
            this.setState({ error: 'You must specify a video title!' });
            return;
        }
        const data = new FormData();
        data.append('video', this.refs.video.files[0], this.refs.video.files[0].name);
        data.append('title', this.refs.title.value);

        request
            .post(process.env.REACT_APP_API + '/uploadVideo')
            .send(data)
            .on('progress', event => {
                if (event.direction === 'download') { return; }
                this.setState({ progress: event.percent });
            })
            .then(() => {
                window.location.href = '/';
            })
            .catch(err => {
                if (!err.response) {
                    this.setState({ error: 'Uh oh! It seems like your connection has timed out!' });
                    console.error(err);
                    return;
                }
                this.setState({ error: err.response.body.response });
            })
    }
    render() {
        return (
            <div>
                {
                    this.state.error
                        ? <p>{this.state.error}</p>
                        : null
                }
                <div className='Upload'>
                </div>
                <form>
                    <input type='file' name='video' ref='video' />
                    <div className='form-group'>
                        <label for='title'>Video Title</label>
                        <input type='text' ref='title' className='form-control' id='title' placeholder='Video Title' />
                    </div>
                    <div className='form-group'>
                        <label for='description'>Video Description</label>
                        <textarea className='form-control' id='description' rows='3'></textarea>
                    </div>
                    <button className='btn btn-primary btn-lg' type='submit' onClick={this.uploadVideo}>Upload</button>
                </form>
                {
                    this.state.progress
                        ? <div className='progress-container progress-success'>
                            <span className='progress-badge'>Upload</span>
                            <div className='progress'>
                                <div className='progress-bar progress-bar-success' role='progressbar' aria-valuenow={this.state.progress} aria-valuemin='0' aria-valuemax='100' style={{ width: this.state.progress + '%' }}>
                                </div>
                            </div>
                        </div>
                        : null
                }
            </div>
        )
    }
}

export default Main;