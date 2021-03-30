import React, { Component, Fragment } from 'react';
import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import { CancelToken, isCancel } from "axios";
import DatetimePicker from "react-datetime";
import { Redirect } from "react-router-dom";
import moment from 'moment';

import TeachablesApi from "../../api/teachables";
import Breadcrumb from '../Breadcrumb';

class AssignmentEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      title: '',
      description: '',
      availableAt: null,
      expiresAt: null,
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

  componentDidMount() {

    const blocksFromHTML = stateFromHTML(this.props.teachable.teachableItem.data.description);

    this.props.teachable ?
      this.setState({
        editorState: EditorState.createWithContent(blocksFromHTML),
        title: this.props.teachable.teachableItem.data.title,
        description: this.props.teachable.teachableItem.data.description,
        availableAt: this.props.teachable.availableAt ? moment.utc(this.props.teachable.availableAt).local().format("YYYY-MM-DD hh:mm:ss") : null,
        expiresAt: this.props.teachable.expiresAt ? moment.utc(this.props.teachable.expiresAt).local().format("YYYY-MM-DD hh:mm:ss") : null
      }) : ''

  }


  save() {
    if (this.state.saving)
      return;

    this.setState({ saving: true, error: false });
    return this.api.update({
      id: this.props.match.params.id,
      data: {
        classroom: this.props.match.params.classroom,
        title: this.state.title,
        description: this.state.description,
        availableAt: this.state.availableAt ? this.state.availableAt.utc().format("YYYY-MM-DD hh:mm:ss") : null,
        expiresAt: this.state.expiresAt ? this.state.expiresAt.utc().format("YYYY-MM-DD hh:mm:ss") : null,

      },
      params: { teachableType: 'assignment' },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.setState({ saved: data.data.id }),
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
          { label: 'Edit Assignment' },
        ]} />

        <div className="row justify-content-center">
          <div className="col-lg-8">

            <div className="mb-5">
              <div className="form-group">
                <input type="text" value={this.state.title} className="form-control form-control-lg" placeholder="Title" onChange={e => this.setState({ title: e.target.value })} />
              </div>
              <div className="form-group">
                <div className={"mb-2 p-3 bg-white border border-muted rounded" + (this.state.saving ? ' bg-light text-muted' : '')}>

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

            <div className="bg-white rounded shadowed py-4 mb-5">
              <div className="px-4 text-uppercase h6 mb-4">Task Settings</div>
              <div className="px-4">
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label>Available At <small>(leave empty if always available)</small></label>
                      <DatetimePicker value={this.state.availableAt} onChange={availableAt => this.setState({ availableAt })} />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      <label>Submission Deadline <small>(required)</small></label>
                      <DatetimePicker value={this.state.expiresAt} onChange={expiresAt => this.setState({ expiresAt })} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                disabled={this.state.saving || !this.state.title.length || !this.state.expiresAt}
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

export default AssignmentEdit;