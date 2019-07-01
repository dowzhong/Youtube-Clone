import React, { Component } from 'react';

import Navbar from './Navbar.js';
import './Css/login.css';

import request from 'superagent';

class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: null
        }
        this.login = this.login.bind(this);
    }

    login() {
        request
            .post(process.env.REACT_APP_API + '/login')
            .send({
                username: this.refs.username.nodeValue,
                password: this.refs.password.value
            })
    }

    render() {
        return (
            <div>
                <Navbar noUpload={true} state={{}} />
                <div className='loginForm'>
                    {
                        this.state.error
                            ? <div className='alert alert-danger' role='alert'>
                                {this.state.error}
                            </div>
                            : null
                    }
                    <div className='login'>
                    </div>

                    <div className='form-group'>
                        <label>Username</label>
                        <input ref='username' type='text' className='form-control' id='title' placeholder='Username' />
                    </div>
                    <div className='form-group'>
                        <label>Password</label>
                        <input ref='password' type='password' className='form-control' id='title' placeholder='Your super secure password' />
                    </div>
                    <button className='btn btn-primary btn-lg' type='submit' onClick={this.login}>Log in</button>

                </div>
            </div>
        )
    }
}

export default Login;