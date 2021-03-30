import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";
import Dropzone from "react-dropzone";

import ProfileApi from "../../api/profile";
import ActivityIndicator from '../ActivityIndicator';

class AvatarUpload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      avatarUrl:  props.avatar,

      error:      false,
      uploading:  false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new ProfileApi;
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  upload( files ) {
    if ( this.state.uploading )
      return;

    this.setState({ uploading: true, error: false, avatarUrl: false });
    return this.api.storeAvatar({
      file: files[0],
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.setState({ avatarUrl: data.data.avatar, uploading: false }),
      err: e => !isCancel( e ) && this.setState({ uploading: false, error: true })
    })
  }

  render() {
    return (
      <div className="border rounded bg-white px-3 py-4">
        <div className="d-flex justify-content-center">
          <Dropzone
            accept="image/*"
            multiple={ false }
            onDropAccepted={ files => this.upload( files ) }
            className="border d-flex justify-content-center align-items-center rounded-circle bg-light text-muted mb-4"
            activeStyle={{ opacity: 0.5 }}
            style={{ height: 150, width: 150, overflow: 'hidden', transition: 'opacity 0.3s ease-in-out', cursor: 'pointer' }}>
            {
              this.state.uploading ?
              <ActivityIndicator /> :
              (
                this.state.avatarUrl ?
                <img src={ this.state.avatarUrl } alt="Avatar" className="w-100 h-100" /> :
                <div className="h1"><i className="fas fa-camera"></i></div>
              )
            }
          </Dropzone>
        </div>

        <div className="small text-muted">
          Drop an image above to change avatar.
          Only image files allowed (JPG, JPEG, PNG). Max 2 MB.
        </div>
      </div>
    );
  }
}

export default AvatarUpload;