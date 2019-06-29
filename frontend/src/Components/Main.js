import React, { Component } from 'react';

import request from 'superagent';

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
                <div id='navbar'>
                    <nav className='navbar navbar-default' role='navigation'>
                        <div className='container-fluid'>
                            <div className='navbar-header'>
                                <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1'>
                                    <span className='sr-only'>Toggle navigation</span>
                                    <span className='icon-bar'></span>
                                    <span className='icon-bar'></span>
                                    <span className='icon-bar'></span>
                                </button>
                                <a className='navbar-brand' href='/'>Youtube Clone</a>
                            </div>
                            <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                                <ul className='nav navbar-nav'>
                                    <li><a href='/upload'>Upload</a></li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                {!this.state.videos.length
                    ? <p>No videos yet :)</p>
                    : (
                        <div>
                            <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
                                <ol class="carousel-indicators">
                                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                                </ol>
                                <div class="carousel-inner">
                                    <div class="carousel-item active">
                                        <img class="d-block w-100" src="..." alt="First slide" />
                                    </div>
                                    <div class="carousel-item">
                                        <img class="d-block w-100" src="..." alt="Second slide" />
                                    </div>
                                    <div class="carousel-item">
                                        <img class="d-block w-100" src="..." alt="Third slide" />
                                    </div>
                                </div>
                                <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </a>
                                <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </a>
                            </div>
                            <div>
                                <div className='videos'>
                                    <div className='row'>
                                        {
                                            this.state.videos.map((video, i) => {
                                                return (
                                                    <div className='col-sm-3 thumbnail' key={i}>
                                                        <img src={process.env.REACT_APP_API + '/thumbnails/' + video.id + '-thumbnail-1280x720-0001.png'} alt='thumbnail' />
                                                        <p>{video.title}</p>
                                                    </div>
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

export default Main;