import React, { Component } from 'react';
import { Link } from "react-router-dom";

import helpers from "../../modules/helpers";
import { getIcon, isMimeTypeSupported } from "../../modules/media";

class Widget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveringOn: null,
    };
    this.countThreshold = props.countThreshold || 999;
  }

  render() {
    return (
      <div>
        <div className="h6 mb-2 text-uppercase">Files for Download <span className="badge badge-secondary">{ this.props.data.filter( file => file.collection === 'files' ).length }</span></div>

        {
          this.props.data.filter( file => file.collection === 'files' ).map( ( file, index ) =>
            index < this.countThreshold ? (
              <div
                key={ index }
                className={ "mb-2 px-3 py-2 border rounded" + ( this.state.hoveringOn === index ? ' bg-white' : '' ) }
                onMouseEnter={ () => this.setState({ hoveringOn: index }) }
                onMouseLeave={ () => this.setState({ hoveringOn: null }) }>
                <div className="d-flex align-items-center">
                  {
                    isMimeTypeSupported( file.mimeType ) &&
                    (
                      <div className="h1 m-0 mr-3 text-muted text-center" style={{ width: 36 }}>
                        <i className={ "fas fa-" + getIcon( file.mimeType ) }></i>
                      </div>
                    )
                  }
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="text-truncate">{ file.name }</div>
                    <div className="d-flex justify-content-between">
                      <div className="text-muted">{ helpers.getSimpleFilesize( file.size ) }</div>
                      {
                        this.state.hoveringOn === index &&
                        <a href={ file.downloadUrl } className="text-link">Download</a>
                      }
                    </div>
                  </div>
                </div>
              </div>
            ) : null
          )
        }

        {
          this.props.data.length > this.countThreshold && this.props.moreLink &&
          (
            <Link to={ this.props.moreLink }>Show all files</Link>
          )
        }

      </div>
    );
  }
}

export default Widget;