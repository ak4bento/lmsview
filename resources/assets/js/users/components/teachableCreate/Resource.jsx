import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import { Editor } from 'react-draft-wysiwyg';
import { convertToRaw, EditorState, RichUtils } from "draft-js";
import draftToHtml from 'draftjs-to-html';
import { isEmpty } from "lodash";
import { Redirect } from "react-router-dom";

import TeachablesApi from "../../api/teachables";
import Breadcrumb from '../Breadcrumb';
import ResourceTypes from './ResourceTypes';
import ResourceFiles from './ResourceFiles';
import ResourceSettings from './ResourceSettings';

class Resource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      editorState: EditorState.createEmpty(),
      resourceType: null,
      resourceFile: null,
      typeSettings: {},
      files: [],
      audio: null,

      saving: false,
      saved: false,
    };
    this.api = new TeachablesApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  save() {
    if (this.state.saving)
      return;

    this.setState({ saving: true, error: false });
    let data = new FormData;
    data.append('classroom', this.props.match.params.classroom);
    data.append('teachableType', 'resource');
    data.append('title', this.state.title);
    data.append('description', this.state.description);
    data.append('resourceType', this.state.resourceType);
    data.append('resourceTypeSettings', JSON.stringify(this.state.typeSettings));
    data.append('resourceFile', this.state.resourceFile);

    this.state.files.forEach((file, index) => {
      data.append('files[' + index + ']', file);
    });

    return this.api.store({
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.setState({ saved: data.id }),
      err: (e) => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false }),
    });
  }

  render() {
    if (this.state.saved)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.state.saved} />

    return (
      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
          { label: 'Create Resource' },
        ]} />
        <div className="row">
          <div className="col-lg-8 col-12">

            <div className="mb-4">
              <ResourceTypes selection={this.state.resourceType} onSelect={resourceType => this.setState({ resourceType, typeSettings: {}, resourceFile: null })} />
            </div>

            {
              this.state.resourceType === null ?
                <div className="h4 text-muted text-center">Select a resource type</div> :
                (
                  <Fragment>
                    <div className="mb-5">
                      <div className="form-group">
                        <input type="text" value={this.state.title} className="form-control form-control-lg" placeholder="Title" onChange={e => this.setState({ title: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <div className={"mb-2 p-3 bg-white border border-muted rounded" + (this.state.saving ? ' bg-light text-muted' : '')}>
                          {/* <Editor readOnly={this.state.saving} editorState={this.state.description} onChange={description => this.setState({ description })} placeholder="Description" /> */}

                          <Editor
                            editorState={this.state.editorState}
                            editorClassName="form-control"
                            onEditorStateChange={
                              description => this.setState({
                                description: draftToHtml(convertToRaw(description.getCurrentContent())),
                                editorState: description
                              })
                            }
                            toolbar={{
                              options: ['inline']
                            }}
                            placeholder="Description" />

                        </div>
                      </div>
                    </div>
                    <div className="mb-5">
                      <ResourceSettings
                        type={this.state.resourceType}
                        settings={this.state.typeSettings}
                        onUpdate={typeSettings => this.setState({ typeSettings })}
                        onUpdateResourceFile={resourceFile => this.setState({ resourceFile })}
                        onUpdateFiles={files => this.setState({ files })} />
                    </div>

                    {
                      this.state.resourceType !== 'documents' &&
                      (
                        <div className="bg-white rounded shadowed py-4 mb-5">
                          <div className="px-4 text-uppercase h6 mb-2">Additional Files</div>
                          <div className="px-4 mb-4">You can add files to supplement this task.</div>
                          <div>
                            <ResourceFiles onUpdateFiles={files => this.setState({ files })} />
                          </div>
                        </div>
                      )
                    }

                    <div>
                      <button
                        type="button"
                        disabled={
                          this.state.saving
                          || !this.state.title.length
                          || (this.state.resourceType !== 'documents' && this.state.resourceType !== 'audio' && isEmpty(this.state.typeSettings))
                          || (this.state.resourceType === 'documents' && isEmpty(this.state.files))
                          || (this.state.resourceType === 'audio' && this.state.resourceFile === null)
                        }
                        className="btn btn-primary btn-lg px-5"
                        onClick={() => this.save()}>
                        {this.state.saving ? 'Please wait..' : 'Save'}
                      </button>
                    </div>
                  </Fragment>
                )
            }

            {console.log(this.state)}

          </div>
        </div>
      </Fragment>
    );
  }

}

export default Resource;