import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";

import ProfileApi from "../../api/profile";
import AvatarUpload from './AvatarUpload';
import EmailChangeDialog from './EmailChangeDialog';

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      email: props.email,
      name: props.name,

      error: false,
      saved: false,
      saving: false,
      focusingOn: null,
      changingEmail: false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new ProfileApi;
  }

  componentWillReceiveProps(nextProps) {
    this.setState(Object.assign(this.state, nextProps));
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  save() {
    if (this.state.saving) return;

    this.setState({ error: false, saving: true, saved: false });
    return this.api.store({
      data: {
        username: this.state.username,
        name: this.state.name,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.setState({ saving: false, saved: true });
        return this.props.onSaved(data.data);
      },
      err: e =>
        !isCancel(e) &&
        this.setState({
          error: (e.response && e.response.status === 422) ? e.response.data : { message: 'Failed to save settings.' },
          saving: false
        })
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-4">
          <label className="text-muted small text-uppercase">Avatar</label>
          <AvatarUpload avatar={this.props.avatar} />
        </div>
        <div className="col-8">
          <div className="mb-3">
            <div className="form-group">
              <label className="text-muted text-uppercase small" htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                onFocus={() => this.setState({ focusingOn: 'name' })}
                onBlur={() => this.setState({ focusingOn: null })}
                value={this.state.name}
                spellCheck="false"
                autoComplete="off"
                className={"form-control py-2" + (this.state.error.errors && this.state.error.errors.name ? ' is-invalid' : '')}
                onChange={e => this.setState({ name: e.target.value, saved: false })}
                disabled={this.state.saving} />

              {
                this.state.error.errors && this.state.error.errors.name &&
                (
                  <div className="invalid-feedback">
                    {this.state.error.errors.name[0]}
                  </div>
                )
              }
              <div className={"small mt-1 text-muted fade" + (this.state.focusingOn === 'name' ? ' show' : '')}>Your full name as identifiable in your learning records.</div>
            </div>
            <div className="row">
              <div className="col form-group">
                <label className="text-muted text-uppercase small" htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  onFocus={() => this.setState({ focusingOn: 'username' })}
                  onBlur={() => this.setState({ focusingOn: null })}
                  value={this.state.username}
                  autoComplete="off"
                  spellCheck="false"
                  className={"form-control py-2" + (this.state.error.errors && this.state.error.errors.username ? ' is-invalid' : '')}
                  onChange={e => this.setState({ username: e.target.value, saved: false })}
                  disabled={this.state.saving} disabled />

                {
                  this.state.error.errors && this.state.error.errors.username &&
                  (
                    <div className="invalid-feedback">
                      {this.state.error.errors.username[0]}
                    </div>
                  )
                }
                <div className={"small mt-1 text-muted fade" + (this.state.focusingOn === 'username' ? ' show' : '')}>A unique name that you use for logging in. No spaces, please.</div>
              </div>
              <div className="col form-group">
                <label className="text-muted text-uppercase small" htmlFor="email">Email Address (Optional)</label>
                <p className="py-2 m-0">
                  {this.state.email || 'Not set'}
                  <a href="#" className="ml-3 text-link" onClick={e => { e.preventDefault(); this.setState({ changingEmail: true }) }}>{this.state.email ? 'Change' : 'Set an email'}</a>
                </p>
                <div className="small mt-1 text-muted">
                  By setting an email address, you will have an option to reset your password by yourself.
                </div>

                <EmailChangeDialog isOpen={this.state.changingEmail} onClose={() => this.setState({ changingEmail: false })} />
              </div>
            </div>
          </div>

          <div>
            <button type="button" onClick={() => this.save()} disabled={this.state.saving} className={"btn btn-" + (this.state.saved ? 'success' : 'primary')}>
              {this.state.saved ? 'Saved!' : (this.state.saving ? 'Please wait..' : 'Save Changes')}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;