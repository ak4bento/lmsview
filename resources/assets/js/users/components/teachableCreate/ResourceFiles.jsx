import React, { Component } from 'react';
import Dropzone from "react-dropzone";

import { getIcon, getLabel } from "../../modules/media";
import helpers from "../../modules/helpers";

class ResourceFiles extends Component {

  constructor(props) {
    super(props);
    this.state = {
      files: [],
      hoveringOn: null,
    };
  }

  addFiles(newFiles) {
    let files = this.state.files.slice(0);
    for (let index = 0; index < newFiles.length; index++) {
      files.push(newFiles[index]);
    }
    this.setState({ files });
    return this.props.onUpdateFiles(files);
  }

  removeFile(index) {
    let files = this.state.files.slice(0);
    files.splice(index, 1);
    this.setState({ files });
    return this.props.onUpdateFiles(files);
  }

  render() {
    return (
      <div className="px-4">
        <Dropzone
          className="border-primary rounded d-flex flex-column align-items-center p-4 mb-4"
          style={{ borderWidth: 5, borderStyle: 'dashed' }}
          onDropAccepted={files => this.addFiles(files)}>

          <div className="display-3"><i className="fas fa-arrow-down"></i></div>
          <div className="h5">Drop your files here</div>
          <div className="text-muted">Accepts files up to 50MB each.</div>

        </Dropzone>

        {
          this.state.files.length > 0 ?
            (
              <div className="list-group">
                {
                  this.state.files.map((file, index) => (
                    <div
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-center"
                      onMouseEnter={() => this.setState({ hoveringOn: index })}
                      onMouseLeave={() => this.setState({ hoveringOn: null })}>
                      <div className="d-flex align-items-center">
                        <div className="h1 m-0 mr-3 text-muted text-center" style={{ width: 36 }}>
                          <i className={"fas fa-" + getIcon(file.type)}></i>
                        </div>
                        <div>
                          <div className="text-truncate d-inline-block col-md mx-0">{file.name}</div>
                          <div className="small">{getLabel(file.type)}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center">
                        <span className="text-muted">{helpers.getSimpleFilesize(file.size)}</span>
                        {
                          this.state.hoveringOn === index &&
                          (
                            <span className="ml-2">
                              <button type="button" onClick={() => this.removeFile(index)} className="btn btn-link text-muted"><i className="fas fa-trash"></i></button>
                            </span>
                          )
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
            ) :
            (this.props.obligatory && <div className="text-muted small">Please add at least one file.</div>)

        }

      </div>
    );
  }
}

export default ResourceFiles;