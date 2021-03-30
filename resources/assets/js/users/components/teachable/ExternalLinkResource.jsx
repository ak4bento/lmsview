import React, { Component } from 'react';

class ExternalLinkResource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      continued: false,
    };
  }

  continue() {
    window.open( config.baseURL + '/external?to=' + encodeURI( JSON.parse( this.props.data ).url ), '_blank' );
    this.props.onComplete();
  }

  render() {
    return (
      <div className="bg-white border w-100">
        <div className="mx-4 my-5">

          <p>By opening this resource, you will be redirected to</p>
          <div className="h4 mb-5 text-truncate">
            { JSON.parse( this.props.data ).url }
          </div>

          <button onClick={ () => this.continue() } className="btn btn-primary">
            I agree. Continue <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </div>
      </div>
    );
  }
}

export default ExternalLinkResource;