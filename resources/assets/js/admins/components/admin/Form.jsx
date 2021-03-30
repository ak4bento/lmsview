import React, { Component } from 'react';

class Form extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: props.username,
      email:    props.email,
      name:     props.name,

      error:      false,
      saving:     false,
      focusingOn: null
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState( Object.assign( this.state, nextProps ) );
  }

  save() {
    
  }

  componentWillMount() {
    
  }

  render() {
    return (
      <div className="row" style={{marginTop: '20px'}}>
        <div className="col-8">
          <div className="mb-3">
            <div className="form-group">
              <label className="text-muted text-uppercase small" htmlFor="name">Full Name</label>
              <input
                type="text"
                name="name"
                value={ this.state.name }
                className={ "form-control py-2" + ( this.state.error.errors && this.state.error.errors.name ? ' is-invalid' : '' ) }
                onChange={ e => this.setState({ name: e.target.value }) }
                disabled={ this.state.saving } />

                {
                  this.state.error.errors && this.state.error.errors.name &&
                  (
                    <div className="invalid-feedback">
                      { this.state.error.errors.name[0] }
                    </div>
                  )
                }
              <div className={ "small mt-1 text-muted fade" + ( this.state.focusingOn === 'name' ? ' show' : '' ) }>Your full name as identifiable in your learning records.</div>
            </div>
            <div className="form-row">
              <div className="col form-group">
                <label className="text-muted text-uppercase small" htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  onFocus={ () => this.setState({ focusingOn: 'username' }) }
                  onBlur={ () => this.setState({ focusingOn: null }) }
                  value={ this.state.username }
                  className={ "form-control py-2" + ( this.state.error.errors && this.state.error.errors.username ? ' is-invalid' : '' ) }
                  onChange={ e => this.setState({ username: e.target.value }) }
                  disabled={ this.state.saving } />

                {
                  this.state.error.errors && this.state.error.errors.username &&
                  (
                    <div className="invalid-feedback">
                      { this.state.error.errors.username[0] }
                    </div>
                  )
                }
                <div className={ "small mt-1 text-muted fade" + ( this.state.focusingOn === 'username' ? ' show' : '' ) }>A unique name that you use for logging in. No spaces, please.</div>
              </div>
              <div className="col form-group">
                <label className="text-muted text-uppercase small" htmlFor="email">Email Address</label>
                <input
                  type="email"
                  name="email"
                  onFocus={ () => this.setState({ focusingOn: 'email' }) }
                  onBlur={ () => this.setState({ focusingOn: null }) }
                  value={ this.state.email }
                  className={ "form-control py-2" + ( this.state.error.errors && this.state.error.errors.email ? ' is-invalid' : '' ) }
                  onChange={ e => this.setState({ email: e.target.value }) }
                  disabled={ this.state.saving } />

                  {
                    this.state.error.errors && this.state.error.errors.email &&
                    (
                      <div className="invalid-feedback">
                        { this.state.error.errors.email[0] }
                      </div>
                    )
                  }
                <div className={ "small mt-1 text-muted fade" + ( this.state.focusingOn === 'email' ? ' show' : '' ) }>Your valid and reachable email address.</div>
              </div>
            </div>
          </div>

          <div>
            <button type="button" onClick={ () => this.save() } disabled={ this.state.saving } className="btn btn-primary">
              { this.state.saving ? 'Please wait..' : 'Save' }
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Form;