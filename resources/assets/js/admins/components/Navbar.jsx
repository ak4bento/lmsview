import React from 'react';
import { Link, NavLink } from "react-router-dom";

import authApi from "../api/auth";

const Navbar = () => (
    <nav className="navbar navbar-expand-lg navbar-light blue-top">
        <div className="container-lg container-fluid">
            <a className="navbar-brand padding-half d-inline-block" href="#">
                <img src="/images/logo.png" className="small-logo" /> </a>
            <a className="navbar-brand border-left padding-half d-inline-block" href="#">
                <img src="/images/co-logo.png" className="small-logo" /> </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse row justify-content-end" id="navbarSupportedContent">
                <ul className="navbar-nav row align-items-center">

                    {/* <li className="nav-item active">
                        <a className="nav-link" href="#">
                            <i className="fa fa-bell notifications"> </i>
                            <span className="sr-only">(current)</span>
                        </a>
                    </li>

                    <li className="nav-item">
                        <a className="dropdown-item" href="#!">Profile</a>
                    </li> */}

                    <li className="nav-item">
                        <a className="dropdown-item" onClick={() => {
                                authApi.logout(result => {
                                    // window.location.href=`${window.config.gakkenURL}/logout?ext=${window.location.origin}`;
                                    window.location.href = window.config.baseURL + '/login'; 
                                });
                            }}>
                            <i className="fa fa-logout"> </i> Logout
                        </a>
                    </li>

                    {/* <li className="nav-item dropdown">
                        <a 
                            className="dropdown-toggle user row align-items-center d-block" 
                            id="dropdown-nav" 
                            data-toggle="dropdown" 
                            aria-haspopup="true" 
                            aria-expanded="false">
                            <h6 className="padding-half"> FirstName Last </h6>
                            <img src="assets/images/user-profile.png" height="30px" className="rounded-circle" />
                        </a>
                        <div className="dropdown-menu" aria-labelledby="dropdown-nav">
                            <a className="dropdown-item" href="#!">Profile</a>
                            <a className="dropdown-item" href="#!">
                                Logout
                            </a>
                        </div>
                    </li> */}

                </ul>
            </div>
        </div>
    </nav>
);

export default Navbar;