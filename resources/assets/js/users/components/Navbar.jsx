import React, { Component } from 'react';
import { Link, NavLink } from "react-router-dom";

import { logout } from "../api/misc";
import helpers from "../modules/helpers";

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggingOut: false,
    };
  }

  logout() {
    if ( this.state.loggingOut ) return;
    
    this.setState({ loggingOut: true });
    return logout({
      cb: () => { 
        window.location.href = window.config.baseURL + '/login'; 
      },
      // cb: () => { window.location.href = window.config.gakkenURL + '/logout'; },
      err: () => this.setState({ loggingOut: false })
    });
  }

  render() {
    return (
      <div className="navbar navbar-light navbar-expand-sm fixed-top bg-white border-bottom py-1">
        <div className="container d-flex justify-content-between">
          <div className="d-flex justify-content-start">
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <div className="pr-3 border-right mr-3"><img src={ config.baseURL + '/images/logo.svg' } alt="Gakken Indonesia" height="50" className="mb-2" /></div>
              {
                helpers.getConfig( 'ORGANIZATION.LOGO' ) ?
                <div><img src={ helpers.getConfig( 'ORGANIZATION.LOGO' ) } alt={ helpers.getConfig( 'ORGANIZATION.NAME' ) } height="44" /></div>:
                <div>{ helpers.getConfig( 'ORGANIZATION.NAME' ) } <span className="text-muted">LMS</span></div>
              }
            </Link>
          </div>
          <div>
            <div className="nav navbar-nav">
              <div className="dropdown">
                <a href="#" data-toggle="dropdown" className="nav-item nav-link dropdown-toggle d-flex align-items-center">
                  {
                    ( config.user.avatar && config.user.avatar.length > 0 ) ?
                    <img className="rounded-circle" style={{ height: 40, width: 40, overflow: 'hidden' }} src={ config.user.avatar } alt={ config.user.name } /> :
                    (
                      <span className="rounded-circle bg-warning d-inline-flex justify-content-center align-items-center" style={{ height: 40, width: 40 }}>
                        <span className="h5 m-0 text-white">{ config.user.initials }</span>
                      </span>
                    )
                  }
                </a>
                <ul className="dropdown-menu dropdown-menu-right rounded-0">
                  <Link to="/profile" className="dropdown-item">
                    <i className="fas fa-fw fa-cog mr-2 text-muted"></i> Account Settings
                  </Link>
                  <a href="#" className={ "dropdown-item" + ( this.state.loggingOut ? ' text-muted' : '' ) } onClick={ e => { e.preventDefault(); this.logout(); } }>
                    <i className="fas fa-fw fa-sign-out-alt mr-2 text-muted"></i> Log Out
                  </a>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;