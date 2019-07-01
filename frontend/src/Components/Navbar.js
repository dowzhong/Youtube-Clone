import React from 'react';

function logout() {
    localStorage.removeItem('token');
}

const Navbar = (props) => {
    const token = localStorage.getItem('token');
    return (
        <div id='navbar'>
            <nav className='navbar navbar-expand-lg bg-primary'>
                <div className='container'>
                    <a className='navbar-brand' href='/'>Youtube Clone</a>
                    <button className='navbar-toggler' type='button' data-toggle='collapse' data-target='#navbarNav' aria-controls='navbarNav' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon'></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <p class="nav-link">{localStorage.getItem('username')}</p>
                            </li>
                        </ul>
                    </div>
                    <div className='collapse navbar-collapse' id='navbarNav'>
                        <ul className='navbar-nav ml-auto'>
                            {
                                props.noUpload !== true && token
                                    ?
                                    <li className='nav-item'>
                                        <a className='nav-link' href='/upload'>Upload</a>
                                    </li>
                                    : null
                            }
                            {
                                !token
                                    ?
                                    [
                                        <li className='nav-item'>
                                            <a className='nav-link' href='/login'>Login</a>
                                        </li>,
                                        <li className='nav-item'>
                                            <a className='nav-link' href='/register'>Register</a>
                                        </li>
                                    ]
                                    : <li className='nav-item'><a className='nav-link' onClick={logout} href='/'>Logout</a></li>
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div >
    )
}

export default Navbar;