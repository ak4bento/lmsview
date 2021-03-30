import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import Dropzone from "react-dropzone";

import TeachableUsersApi from "../../api/teachableUsers";
import AssignmentUploadedMedia from './AssignmentUploadedMedia';

class AssignmentUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error:          false,
      progress:       0,
      uploading:      false,
      uploadedMedia:  null,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new TeachableUsersApi;
  }

  componentDidMount() {
    this.validate( this.props.teachableUser.media );
  }

  componentWillReceiveProps(nextProps) {
    this.validate( nextProps.teachableUser.media );
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  upload( submissionFile ) {
    if ( this.state.uploading )
      return;

    this.setState({ uploading: true, error: false, progress: 0 });
    let data = new FormData();
    data.append( 'context', 'submission' );
    data.append( 'submissionFile', submissionFile );
    return this.api.update({
      id: this.props.teachableUser.id,
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: teachable => {
        this.setState({ uploading: false, progress: 0 });
        return this.props.onSuccess( teachable.data );
      },
      err: e =>
        !isCancel( e ) &&
        this.setState({ uploading: false, error: e.response.data ? Object.assign( {}, e.response.data ) : false, progress: 0 }),
      progress: event => {
        event.lengthComputable && this.setState({ progress: Math.ceil( ( event.loaded / event.total ) * 100 ) })
      }
    });
  }

  validate( media ) {
    let submissions = media.data.filter( media => media.collection === 'submission' );
    this.setState({ uploadedMedia: submissions.length > 0 ? submissions[0] : null });
  }

  render() {
    return (
      <Dropzone
        className="border border-top-0 rounded-bottom bg-white p-3"
        activeStyle={{ opacity: 0.5 }}
        onDropAccepted={ files => this.upload( files[0] ) }>
        <div
          className={ "rounded d-flex flex-column justify-content-center align-items-center p-5" + ( this.state.uploading ? ' border-light' : ' border-primary' ) }
          style={{ borderWidth: 5, borderStyle: 'dashed', minHeight: 300 }}>
          {
            this.state.uploading ?
            (
              <div className="w-100">
                <div className="text-muted h3">Uploading..</div>
                <div className="progress">
                  <div className={ "progress-bar" + ( this.state.progress === 100 ? ' progress-bar-striped progress-bar-animated' : '' ) } style={{ width: this.state.progress + '%' }}></div>
                </div>
              </div>
            ) : (
              <Fragment>
                <div className="text-muted display-1 mb-2"><i className="fas fa-arrow-down"></i></div>
                <div className="text-muted h3">Drop your assignment here</div>
                <div className="text-muted">Just make sure it is a document file less than 50MB in size.</div>
              </Fragment>
            )
          }

          <div className={ "w-100 fade" + ( this.state.uploadedMedia ? ' show' : '' ) }>
            { this.state.uploadedMedia && <AssignmentUploadedMedia media={ this.state.uploadedMedia } /> }
          </div>
        </div>

      </Dropzone>
    );
  }

}

export default AssignmentUpload;