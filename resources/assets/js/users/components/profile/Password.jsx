import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";

import ProfileApi from "../../api/profile";

class Password extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      password: '',
      passwordConfirmation: '',

      error:  false,
      saved:  false,
      saving: false,
    };
    this.state = Object.assign( {}, this.defaultState );
    this.cancelRequestHandler = CancelToken.source();
    this.api = new ProfileApi;
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  save() {
    if ( this.state.saving )
      return;

    this.setState({ saving: true, error: false, saved: false });
    return this.api.store({
      data: {
        password: this.state.password,
        passwordConfirmation: this.state.passwordConfirmation,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: () => this.setState( Object.assign( this.defaultState, { saved: true } ) ),
      err: e => !isCancel( e ) && this.setState({ saving: false, error: Object.assign( {}, e.response.data ) })
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-4">

          <div className="form-group">
            <label className="text-muted text-uppercase small" htmlFor="name">New Password</label>
            <input
              type="password"
              name="password"
              value={ this.state.password }
              disabled={ this.state.saving }
              className="form-control mb-2"
              onChange={ e => this.setState({ password: e.target.value, saved: false }) } />

            <div className="text-muted mb-3">
              <div>Tips for creating a secure password:</div>
              <ul>
                <li>Use more than 8 characters</li>
                <li>Use alphabets, numbers and symbols</li>
                <li>Don't use passwords you have used previously</li>
              </ul>
            </div>
          </div>
          <div className="form-group mb-5">
            <label className="text-muted text-uppercase small" htmlFor="name">Confirm Password</label>
            <input
              type="password"
              name="passwordConfirmation"
              value={ this.state.passwordConfirmation }
              disabled={ this.state.saving }
              className="form-control"
              onChange={ e => this.setState({ passwordConfirmation: e.target.value, saved: false }) } />
          </div>

          <div>
            <button type="button" disabled={ this.state.saving } className={ "btn btn-" + ( this.state.saved ? 'success' : 'primary' ) } onClick={ () => this.save() }>
              { this.state.saved ? 'Saved!' : ( this.state.saving ? 'Please wait..' : 'Set new password' ) }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Password;