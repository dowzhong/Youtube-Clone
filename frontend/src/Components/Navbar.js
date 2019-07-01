import React from 'react';

const Navbar = (props) => (
    <div id='navbar'>
        <nav className='navbar navbar-expand-lg bg-primary'>
            <div className='container'>
                <a className='navbar-brand' href='/'>Youtube Clone</a>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                <div className='collapse navbar-collapse' id='navbarNav'>
                    <ul className='navbar-nav ml-auto'>
                        {
                            props.noUpload !== true && props.state.token
                                ?
                                <li className='nav-item'>
                                    <a className='nav-link' href='/upload'>Upload</a>
                                </li>
                                : null
                        }
                        <li className='nav-item'>
                            {
                                !props.state.token
                                    ?
                                    <a className='nav-link' href='/login'>Login</a>
                                    : <a className='nav-link' href='/login'>Logout</a>
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    </div>
)

export default Navbar;