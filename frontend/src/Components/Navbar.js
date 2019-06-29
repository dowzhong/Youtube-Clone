import React from 'react';

const Navbar = (props) => (
    <div id='navbar'>
        <nav className='navbar navbar-expand-lg bg-primary'>
            <div className='container'>
                <p className='navbar-brand'>Youtube Clone</p>
                <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                    <span className='navbar-toggler-icon'></span>
                </button>
                {
                    props.noUpload !== true
                        ? <div className='collapse navbar-collapse' id='navbarNav'>
                            <ul className='navbar-nav ml-auto'>
                                <li className='nav-item'>
                                    <a className='nav-link' href='/upload'>Upload</a>
                                </li>
                            </ul>
                        </div>
                        :null
                }
            </div>
        </nav>
    </div>
)

export default Navbar;