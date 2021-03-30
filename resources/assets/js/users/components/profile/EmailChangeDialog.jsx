import React, { Component, Fragment } from 'react';
import Modal from "react-modal";

import ChangeRequestApi from '../../api/changeRequest';

Modal.setAppElement( "#app" );

class EmailChangeDialog extends Component {

  constructor(props) {
    super(props);
    this.defaultState = {
      email: '',

      done:   false,
      error:  false,
      saving: false,
    };
    this.state = Object.assign( {}, this.defaultState );
  }

  close() {
    this.setState( Object.assign( {}, this.defaultState ) )
    this.props.onClose();
  }

  save() {
    if ( this.state.saving )
      return;

    this.setState({ saving: true, error: false });
    return ChangeRequestApi.store({
      context: 'email',
      data: this.state.email,
      cb: () => this.finish(),
      err: e => this.setState({ saving: false, error: Object.assign( {}, e.response.data ) })
    });
  }

  finish() {
    return this.setState({ done: true });
  }

  render() {
    return (
      <Modal
        isOpen={ this.props.isOpen }
        onRequestClose={ () => this.close() }
        className="d-flex flex-column justify-content-center align-items-center h-100">

        <div
          className="bg-white border rounded m-auto p-5 d-flex flex-column align-items-center"
          style={{ minWidth: 480, maxWidth: 640 }}>

          {
            this.state.done ?
            (
              <Fragment>
                <div className="h3 mb-5 text-center">Check your email!</div>
                <div className="mb-2">
                  <p className="text-center">
                    We sent an email with a confirmation link to { this.state.email }.
                    Click the link in the email to complete setting your email address.
                  </p>
                </div>
                <button type="button" className="btn btn-primary" onClick={ () => this.close() }>Okay</button>
              </Fragment>
            ) : (
              <Fragment>
                <div className="h3 mb-5 text-center">Set your email address</div>

                <div className="mb-2 form-group w-100">
                  <input
                    type="email"
                    name="email"
                    value={ this.state.email }
                    disabled={ this.state.saving }
                    onChange={ e => !this.state.saving && this.setState({ email: e.target.value }) }
                    className="form-control py-3"
                    autoComplete="off"
                    spellCheck="false"
                    placeholder="Enter your new email address" />
                </div>
                <div className="text-muted small mb-4">Make sure you are reachable at this email address.</div>
                <div className="mb-4">
                  <button type="button" className="btn btn-primary" disabled={ this.state.saving } onClick={ () => this.save() }>
                    { this.state.saving ? 'Please wait..' : 'Continue' }
                  </button>
                </div>
                <div className="text-center">
                  <a href="#" className="text-link" onClick={ e => { e.preventDefault(); this.close(); } }>Cancel</a>
                </div>
              </Fragment>
            )
          }

        </div>
      </Modal>
    );
  }

}

export default EmailChangeDialog;