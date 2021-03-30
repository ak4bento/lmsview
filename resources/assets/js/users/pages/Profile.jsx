import React, { Component } from 'react';
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {
  ProfileSettings as Settings,
  ProfilePassword as Password,
  ProfileNotifications as Notifications,
} from "../components";
import * as actions from '../actions';

class Profile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      profile: Object.assign( {}, config.user ),
    };
  }

  componentDidMount() {
    return this.props.actions.getProfile();
  }

  componentWillReceiveProps( nextProps ) {
    return this.validate( nextProps.profile.data );
  }

  validate( data ) {
    this.setState({ profile: Object.assign( this.state.profile, data ) });
  }

  render() {
    return (
      <div>

        <div className="bg-white border-bottom pt-5">
          <div className="container">
            <div className="text-muted">My Profile</div>
            <div className="h2 mb-5">{ this.state.profile.name }</div>
            <nav className="nav nav-tabs" style={{ marginBottom: -1 }}>
              <NavLink exact to="/profile" className="nav-item nav-link"><i className="fas fa-cog mr-2"></i> Settings</NavLink>
              <NavLink exact to="/profile/password" className="nav-item nav-link"><i className="fas fa-lock mr-2"></i> Password</NavLink>
              <NavLink exact to="/profile/notifications" className="nav-item nav-link"><i className="fas fa-bell mr-2"></i> Notifications</NavLink>
            </nav>
          </div>

        </div>
        <div className="py-5 container">
          <Switch>
            <Route exact path="/profile" render={ route => <Settings { ...route } { ...this.state.profile } onSaved={ data => this.props.actions.validateProfile( data ) } /> } />
            <Route exact path="/profile/password" component={ Password } />
            <Route exact path="/profile/notifications" component={ Notifications } />
            <Redirect to="/profile" />
          </Switch>
        </div>

      </div>
    );
  }
}

export default connect(
  state => ({ profile: state.profile }),
  dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
)( Profile );