import React, { Component } from 'react';

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
                    console.log(err);
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
                <form ref='uploadForm'
                    id='uploadForm'
                    action={process.env.REACT_APP_API + '/uploadVideo'}
                    method='post'
                    encType='multipart/form-data'>
                    <input type='file' name='video' ref='video' />
                    <input type='text' name='title' ref='title' />
                    <input type='submit' value='Upload!' onClick={this.uploadVideo} />
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