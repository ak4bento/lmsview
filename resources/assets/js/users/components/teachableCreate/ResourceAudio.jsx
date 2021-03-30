import React, { Component } from 'react';
import Dropzone from "react-dropzone";

import helpers from "../../modules/helpers";

class ResourceAudio extends Component {

  constructor(props) {
    super(props);
    this.state = {
      file: null,
    };
  }

  addAudioFile( file ) {
    this.setState({ file });
    this.props.onUpdateResourceFile( file );
  }

  render() {
    return (
      <div className="px-4">

        {
          this.state.file === null ?
          (
            <Dropzone
              accept="audio/*"
              multiple={ false }
              className="border-primary rounded d-flex flex-column align-items-center p-4 mb-4"
              style={{ borderWidth: 5, borderStyle: 'dashed' }}
              onDropAccepted={ files => this.addAudioFile( files[ 0 ] ) }>

              <div className="display-3"><i className="fas fa-arrow-down"></i></div>
              <div className="h5">Drop your audio file here</div>
              <div className="text-muted">Accepts a single audio file up to 50MB.</div>

            </Dropzone>
          ) : (
            <div className="border rounded p-4 d-flex align-items-center">
              <div className="h1 m-0 mr-3 text-muted text-center" style={{ width: 36 }}>
                  <i className="fas fa-music"></i>
              </div>
              <div>
                <div className="text-truncate">{ this.state.file.name }</div>
                <div className="small">{ helpers.getSimpleFilesize( this.state.file.size ) }</div>
              </div>
            </div>
          )
        }

      </div>
    );
  }
}

export default ResourceAudio;