import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import { Redirect, Link } from "react-router-dom";

import TeachablesApi from "../../api/teachables";
import QuizApi from "../../api/quiz";
import QuestionApi from "../../api/question";

import Breadcrumb from '../Breadcrumb';

import QuizDescriptions from './QuizDescriptions';
import QuizSidebar from './QuizSidebar';
import DeleteComponent from './DeleteComponent';

import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { stateFromHTML } from 'draft-js-import-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import Parser from 'html-react-parser';
import Moment from 'moment';

import Richtextarea from '../../../components/RichTextArea.jsx';
import htmlDecode from 'decode-html';

class QuizEdit extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: {
        title: '',
        description: '',
        sidebar: {
          threshold: 80,
          maxAttempts: 1,
          availableAt: null,
          expiresAt: null
        }
      },
      isEdit: {
        general: false,
        sidebar: false
      },
      onSubmitProcess: false,
      error: false,
      questions: []
    };

    this.api = new TeachablesApi;
    this.load = new QuizApi;
    this.question = new QuestionApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  componentDidMount() {

    if (this.props.match.params.id) {
      this.load.index({
        params: { id: this.props.match.params.id },
        cb: data => {

          const blocksFromHTML = stateFromHTML(data.data[0].description || "");
                    
          this.setState({
            data: {
              title: data.data[0].title,
              description: data.data[0].description,
              sidebar: {
                threshold: data.data[0].teachables.data[0].pass_threshold ? data.data[0].teachables.data[0].pass_threshold : 80,
                maxAttempts: data.data[0].teachables.data[0].max_attempts_count ? data.data[0].teachables.data[0].max_attempts_count : 1,
                availableAt: data.data[0].teachables.data[0].available_at ? data.data[0].teachables.data[0].available_at : null,
                expiresAt: data.data[0].teachables.data[0].expires_at ? data.data[0].teachables.data[0].expires_at : null
              }
            },
            questions: data.data[0].questions ? data.data[0].questions.data : [],
            editorState: EditorState.createWithContent(blocksFromHTML),
            isEdit: {
              general: false
            }
          });


        },
        err: errMsg => console.log(errMsg)
      });
    }
  }

  save() {
    if (this.state.onSubmitProcess)
      return;

    this.setState({ onSubmitProcess: true }); 

    return this.api.update({
      id: this.props.match.params.id,
      data: {
        classroom: this.props.match.params.classroom,
        title: this.state.data.title,
        description: this.state.data.description,
        availableAt: this.state.data.sidebar.availableAt ? this.state.data.sidebar.availableAt : null,
        expiresAt: this.state.data.sidebar.expiresAt ? this.state.data.sidebar.expiresAt : null,
        max_attempts_count: this.state.data.sidebar.maxAttempts ? this.state.data.sidebar.maxAttempts : 1,
        pass_threshold: this.state.data.sidebar.threshold ? this.state.data.sidebar.threshold : 80
      },
      params: { teachableType: 'quiz' },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => { this.setState({ saved: data.id, onSubmitProcess: true, error: false, isEdit: { general: false, sidebar: false } }), console.log('saved', this.state.saved) },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, onSubmitProcess: false }),
    });


  }

  sidebar(sidebar) {
    this.setState(() => ({ data: { ...this.state.data, sidebar } }));
  }

  delete(id) {
    return this.question.destroy({
      id: id,
      params: {
        context: 'teacher'
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        window.location.reload();
      },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, onSubmitProcess: false })
    });
  }

  render() {
    // console.log("isEdit", this.state.isEdit.general);
    // console.log("editorState", this.state.editorState);
    // console.log("Quiz data", this.state.data);
    // console.log("deskripsi:", this.state.data.description);

    return (

      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
          { label: 'Edit Quiz' },
        ]} />

        <div className="d-block w-100 text-right pb-2">
          <a href="#" onClick={() => this.setState({ isEdit: { general: true } })}> <i className="fa fa-edit"> </i> Edit </a>
        </div>

        <div className="bg-white p-4 shadowed">
          <div className="row">
            <div className="col-md-8">
              {!this.state.isEdit.general &&
                <QuizDescriptions data={this.state.data} setState={this.setState.bind(this)} />
              }

              {this.state.isEdit.general &&
                <div className="p-relative">
                  <div className="px-2 py-3 mb-4 border-bottom row mx-0 ">
                    <div className="text-uppercase h6 mb-0"> Edit Quiz </div>
                  </div>
                  <div className="px-4 pb-2">
                    <div className="form-group">
                      <label className="d-block"> Judul Quiz <small>(required)</small> </label>
                      <input 
                        type="text" 
                        className="d-block form-control" 
                        value={this.state.data.title} 
                        onChange={e => this.setState({ data: { ...this.state.data, title: e.target.value } })} 
                      />
                    </div>
                    <div className="form-group">
                      <label> Deskripsi  <small>(required)</small></label>

                      {/* <Editor
                        defaultEditorState={this.state.editorState}
                        editorClassName="form-control"
                        onEditorStateChange={
                          (description) => this.setState({
                            data: { description: draftToHtml(convertToRaw(description.getCurrentContent())), ...this.state.data },
                            editorState: description
                          })
                        }

                        toolbar={{
                          options: ['inline']
                        }}

                        placeholder="Description"

                      /> */}

                      <Richtextarea id={"richtextarea-" + (this.props.page + 1)} 
                        initValue={htmlDecode(this.state.data.description)}
                        onChange={(val) => this.setState({
                          data: { ...this.state.data, description: val }
                        })} style={true} fillIn={true} />
                    </div>
                  </div>

                </div>}

            </div>


            <div className="col-md-4">
              <QuizSidebar edit={this.state.isEdit.general} data={this.state.data} setState={this.setState.bind(this)} />
            </div>

          </div>
        </div>

        {
          this.state.isEdit.general &&

          <div className="d-block w-100 mb-4 text-center py-4">
            <div className="pt-4 d-inline text-center ">
              <button
                type="button"
                className="btn btn-primary btn-lg px-5" onClick={() => this.save()} 
                disabled={this.state.onSubmitProcess}>
                { this.state.onSubmitProcess ? "Mohon Tunggu" : "Simpan" }
                </button>
            </div>
            <a href="#" className="d-inline px-4" onClick={() => this.setState({ isEdit: { general: false } })}> batal </a>
          </div>
        }


        <div className="d-block w-100 py-5">

          <div className="row mx-0 mb-2 align-items-center">
            <div className="col-6 mx-0 px-2 text-uppercase h6 "> Pertanyaan
            </div>

            <div className="col-6 mx-0 text-right">
              <Link to={"/classroom/" + this.props.match.params.classroom + "/teachable/" + this.props.match.params.id + "/edit/new"} className="btn btn-primary my-2" >
                <i className="fa fa-plus"> </i> Pertanyaan Baru
              </Link>
            </div>
          </div>

          <div className="p-relative bg-white rounded shadowed px-2 py-3">
            {
              this.state.questions ? this.state.questions.map((data, i) =>
                <div key={i}>
                  <div className="row mx-0 py-4 px-2 border-bottom align-items-center" >
                    <div className="col-lg">
                      <p className="text-secondary mb-0 text-small"> 
                        <strong> 
                          <span className="text-uppercase"> 
                            {data.questionType} 
                          </span> , {data.createdAtForHumans} {(Moment(data.createdAt) == Moment().endOf('day')) && <span className="badge badge-secondary"> New</span>}  
                        </strong>  
                      </p>
                      <p className="mb-0 question text-truncate"> {Parser(data.content)} </p>
                    </div>

                    <div className="col-lg-3 text-right py-4 py-md-0">
                      <Link to={"/classroom/" + this.props.match.params.classroom + "/teachable/" + this.props.match.params.id + "/edit/" + data.id} className="text-secondary py-2 px-4"> <i className="fa fa-edit"> </i> Edit </Link>
                      <a href="#" className="text-danger py-2 px-4" data-toggle="modal" data-target={'#' + data.id}> <i className="fa fa-trash"> </i> Delete </a>
                    </div>
                  </div>

                  <DeleteComponent delete={this.delete.bind(this)} id={data.id} />
                </div>
              ) : (
                  <div> Belum ada data </div>
                )
            }

          </div>
        </div>

        {/* {console.log(this.state.questions)} */}





      </Fragment>
    );
  }

}

export default QuizEdit;