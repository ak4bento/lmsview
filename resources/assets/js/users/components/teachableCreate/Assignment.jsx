import React, { Component, Fragment } from 'react';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { CancelToken, isCancel } from "axios";
import DatetimePicker from "react-datetime";
import { Redirect } from "react-router-dom";
import moment from "moment";

import TeachablesApi from "../../api/teachables";
import Breadcrumb from '../Breadcrumb';

class Assignment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      data: {
        title: '',
        description: EditorState.createEmpty(),
        availableAt: null,
        expiresAt: null,
      },
      saving: false,
      saved: false,
      error: false,
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
    return this.api.store({
      data: {
        classroom: this.props.match.params.classroom,
        teachableType: 'assignment',
        title: this.state.data.title,
        description: this.state.data.description,
        availableAt: this.state.data.availableAt ? moment.utc(this.state.data.availableAt).format('YYYY-MM-DD HH:mm:ss') : null,
        expiresAt: this.state.data.expiresAt ? moment.utc(this.state.data.expiresAt).format('YYYY-MM-DD HH:mm:ss') : null,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.setState({ saved: data.id }),
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false }),
    });
  }

  render() {
    if (this.state.saved)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.state.saved} />
    return (
      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
          { label: 'Create Assignment' },
        ]} />

        <div className="row">
          <div className="col-md-8">
            <div className="mb-5">
              <div className="form-group">
                <input type="text" value={this.state.data.title} className="form-control form-control-lg" placeholder="Title" onChange={e => this.setState({ data: { ...this.state.data, title: e.target.value } })} />
              </div>
              <div className="form-group">
                <div className={"mb-2 p-3 bg-white border border-muted rounded" + (this.state.saving ? ' bg-light text-muted' : '')}>
                  {/* <Editor readOnly={this.state.saving} editorState={this.state.editorState} onChange={description => this.setState({ data: { ...this.state.data, description }, editorState: description })} placeholder="Description" /> */}
                  <Editor
                    defaultEditorState={this.state.data.description}
                    wrapperClassName="texteditor-wrapper"
                    editorClassName="texteditor-editor form-control"
                    onEditorStateChange={(val) => {
                      this.setState({
                        data: { ...this.state.data, description: draftToHtml(convertToRaw(val.getCurrentContent())) },
                        editorState: val
                      })
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded shadowed py-4 mb-5">
              <div className="px-4 text-uppercase h6 mb-4">Task Settings</div>
              <div className="px-4">
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label>Available At <small>(leave empty if always available)</small></label>
                      <DatetimePicker value={this.state.data.availableAt} onChange={availableAt => this.setState({ data: { ...this.state.data, availableAt } })} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>Submission Deadline <small>(required)</small></label>
                      <DatetimePicker value={this.state.data.expiresAt} onChange={expiresAt => this.setState({ data: { ...this.state.data, expiresAt } })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                disabled={this.state.saving || !this.state.data.title.length || !this.state.data.expiresAt}
                className="btn btn-primary btn-lg px-5"
                onClick={() => this.save()}>
                {this.state.saving ? 'Please wait..' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

}

export default Assignment;