import React, { Component } from 'react';

import helpers from "../../modules/helpers";
import { getIcon, getLabel } from "../../modules/media";

class DocumentResource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hoveringOn: null,
    };
  }

  render() {
    return (
      <div className="border bg-white w-100">
        <div className="mx-4 my-5">

          <h3 className="text-dark mb-3">Documents for Download</h3>

          <div className="list-group">
            {
              this.props.media.data.map( ( media, index ) =>
                (
                  <div
                    key={ index }
                    className="list-group-item list-group-item-action"
                    onMouseEnter={ () => this.setState({ hoveringOn: index }) }
                    onMouseLeave={ () => this.setState({ hoveringOn: null }) }>
                    <div className="d-flex justify-content-between align-items-center my-2">
                      <div className="d-flex align-items-center">
                        <div className="h1 m-0 mr-3 text-muted text-center" style={{ width: 36 }}>
                          <i className={ 'fas fa-' + getIcon( media.mimeType ) }></i>
                        </div>
                        <div>
                          <h5 className="m-0">{ media.name }</h5>
                          <div className="text-muted">
                            <span>{ getLabel( media.mimeType ) }</span>
                          </div>
                        </div>
                      </div>
                      <div className={ 'fade' + ( this.state.hoveringOn === index ? ' show' : '' ) }>
                        <span className="mr-2 pr-2 border-right">{ helpers.getSimpleFilesize( media.size ) }</span>
                        <a href={ media.downloadUrl } className="text-link"><i className="fas fa-download"></i> Download</a>
                      </div>
                    </div>
                  </div>
                )
              )
            }
          </div>

        </div>
      </div>
    );
  }
}

export default DocumentResource;