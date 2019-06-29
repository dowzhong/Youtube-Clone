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
                    <nav className='navbar navbar-expand-lg bg-danger'>
                        <div className='container'>
                            <p className='navbar-brand'>Youtube Clone</p>
                            <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                                <span className='navbar-toggler-icon'></span>
                            </button>
                            <div className='collapse navbar-collapse' id='navbarNav'>
                                <ul className='navbar-nav ml-auto'>
                                    <li className='nav-item'>
                                        <a className='nav-link' href='/upload'>Upload</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </nav>
                </div>
                {!this.state.videos.length
                    ? <p>No videos yet :)</p>
                    : (
                        <div>
                            {
                                this.state.videos.length >= 5
                                    ? <div id="carouselExampleControls" className="carousel slide" data-ride="carousel">
                                        <div className="carousel-inner">
                                            <div className="carousel-item active">
                                                <img src="https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all&w=782" className="d-block w-100" alt="dog" />
                                            </div>
                                            <div className="carousel-item">
                                                <img src="https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all&w=782" className="d-block w-100" alt="dog" />
                                            </div>
                                            <div className="carousel-item">
                                                <img src="https://boygeniusreport.files.wordpress.com/2016/11/puppy-dog.jpg?quality=98&strip=all&w=782" className="d-block w-100" alt="dog" />
                                            </div>
                                        </div>
                                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="sr-only">Previous</span>
                                        </a>
                                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="sr-only">Next</span>
                                        </a>
                                    </div>
                                    : null
                            }
                            <div>
                                <div className='videos'>
                                    <div className='row'>
                                        {
                                            this.state.videos.map((video, i) => {
                                                return (
                                                    <div className='videoThumbnail card' style={{ width: '20rem' }} key={i}>
                                                        <img className='card-img-top' src={process.env.REACT_APP_API + '/thumbnails/' + video.id + '-thumbnail-1280x720-0001.png'} alt='thumbnail' />
                                                        <div className='card-body'>
                                                            <b className='card-text'>{video.title}</b>
                                                        </div>
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