import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import { Redirect, Link } from "react-router-dom";

import TeachablesApi from "../../api/teachables";

import Breadcrumb from '../Breadcrumb';

import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import QuizSidebar from './QuizSidebar';

import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';

class QuizCreate extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      data: {
        title: '',
        description: '',
        sidebar: {
          threshold: 80,
          maxAttempts: '1',
          availableAt: null,
          expiresAt: null
        }
      },
      isEdit: {
        general: false
      },
      saving: false,
      saved: '',
      error: false,
      questions: []
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

    return this.api.store({
      data: {
        classroom: this.props.match.params.classroom,
        teachableType: 'quiz',
        title: this.state.data.title,
        description: this.state.data.description,
        availableAt: this.state.data.sidebar.availableAt ? this.state.data.sidebar.availableAt : null,
        expiresAt: this.state.data.sidebar.expiresAt ? this.state.data.sidebar.expiresAt : null,
        max_attempts_count: this.state.data.sidebar.maxAttempts,
        pass_threshold: this.state.data.sidebar.threshold
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => { this.setState({ saved: data.id, saving: true, error: false }) },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false }),
    });


  }

  sidebar(sidebar) {
    this.setState(() => ({ data: { ...this.state.data, sidebar } }));
  }

  render() {
    if (this.state.saving)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.state.saved + '/edit'} />


    return (

      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Kelas' },
          { label: 'Buat Kuis' },
        ]} />

        <div className="row">
          <div className="col-md-8">

            <div className="p-relative bg-white rounded shadowed">
              <div className="px-2 py-3 mb-4 border-bottom row mx-0 ">
                <div className="text-uppercase h6 mb-0"> Buat Kuis </div>
              </div>
              <div className="p-4">
                <div className="form-group">
                  <label className="d-block"> Judul Kuis <small>(wajib diisi)</small> </label>
                  <input type="text" className="d-block form-control" value={this.state.data.title} onChange={e => this.setState({ data: { ...this.state.data, title: e.target.value } })} />
                </div>
                <div className="form-group">
                  <label> Deskripsi  <small>(wajib diisi)</small></label>
                  <Editor
                    initialEditorState={this.state.data.description}
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
          </div>

          <div className="col-md-4">
            <QuizSidebar data={this.state.data} setState={this.setState.bind(this)}
            // onChange={this.sidebar.bind(this)} 
            />
          </div>

        </div>

        <div className="d-block w-100 mb-4">
          <div className="py-4 d-block text-center ">
            <button
              type="button"
              className="btn btn-primary btn-lg px-5" onClick={() => this.save()} >
              Simpan
            </button>
          </div>
        </div>



      </Fragment>
    );
  }

}

export default QuizCreate;