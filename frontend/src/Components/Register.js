import React, { Component } from 'react';

import Navbar from './Navbar.js';
import './Css/Register.css';

import request from 'superagent';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null
        }
        this.register = this.register.bind(this);
    }

    async register(e) {
        e.preventDefault();
        this.setState({ error: null });
        if (!this.refs.username.value) {
            this.setState({ error: 'Invalid username.' });
            return;
        }
        if (this.refs.confirmPassword.value !== this.refs.password.value) {
            this.setState({ error: 'The password you\'ve confirmed does not match.' });
            return;
        }
        try {
            const { body } = await request
                .post(process.env.REACT_APP_API + '/register')
                .send({
                    username: this.refs.username.value,
                    password: this.refs.password.value
                });
            localStorage.setItem('token', body.response.token);
            localStorage.setItem('username', body.response.username);
            window.location.replace('/');
        } catch (err) {
            if (err.response) {
                this.setState({ error: err.response.body.response });
                return;
            }
            this.setState({ error: 'Error communicating with the server! Please try again later.' })
        }
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
                    <div className='register'>
                        <form>
                            <div className='form-group'>
                                <label>Username</label>
                                <input ref='username' type='text' className='form-control' placeholder='Username' />
                            </div>
                            <div className='form-group'>
                                <label>Password</label>
                                <input ref='password' type='password' className='form-control' placeholder='Your super secure password' />
                            </div>
                            <div className='form-group'>
                                <label>Confirm Password</label>
                                <input ref='confirmPassword' type='password' className='form-control' placeholder='Confirm your super secure password' />
                            </div>
                            <button className='btn btn-primary btn-lg' type='submit' onClick={this.register}>Register</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

export default Register;