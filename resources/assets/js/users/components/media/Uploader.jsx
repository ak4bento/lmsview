import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import PropTypes from "prop-types";
import Dropzone from "react-dropzone";

import MediaApi from "../../api/media";
import ProgressBar from "../ProgressBar";

class Uploader extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      uploading: false,
      progress: 0,
    };
    this.api = new MediaApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  upload( files ) {
    if ( this.state.uploading )
      return;

    let data = new FormData;
    data.append( 'context', this.props.context );
    data.append( this.props.context, this.props.contextData );
    data.append( 'collection', this.props.collection || 'files' );

    files.forEach( ( file, index ) => {
      data.append( 'files[' + index + ']', file );
    });

    this.setState({ uploading: true, error: false });
    return this.api.store({
      data,
      cb: media => {
        this.setState({ uploading: false, progress: 0 });
        return this.props.onSuccess( media.data );
      },
      err: e =>
        !isCancel( e ) &&
        this.setState({ uploading: false, error: e.response.data ? Object.assign( {}, e.response.data ) : false, progress: 0 }),
      progress: event => {
        event.lengthComputable && this.setState({ progress: Math.ceil( ( event.loaded / event.total ) * 100 ) })
      }
    })
  }

  render() {
    return (
      <Dropzone
        className="border-primary rounded d-flex flex-column align-items-center p-4 mb-4"
        style={{ borderWidth: 5, borderStyle: 'dashed' }}
        onDropAccepted={ files => this.upload( files ) }
        activeStyle={{ opacity: 0.5 }}>

        {
          this.state.uploading ?
          (
            <div className="w-100">
              <ProgressBar progress={ this.state.progress } indeterminate={ this.state.progress === 100 } />
            </div>
          ) : (
            <Fragment>
              <div className="display-3"><i className="fas fa-arrow-down"></i></div>
              <div className="h5">Drop your files here</div>
              <div className="text-muted">Accepts files up to 50MB each.</div>
            </Fragment>
          )
        }

      </Dropzone>
    );
  }

}

Uploader.propTypes = {
  context:      PropTypes.string.isRequired,
  contextData:  PropTypes.string.isRequired,
  onSuccess:    PropTypes.func.isRequired,
};

export default Uploader;