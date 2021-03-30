import React, { Component, Fragment } from 'react';
import { Redirect } from "react-router-dom";
import { isCancel , CancelToken } from "axios";

import QuestionApi from "../../api/question";
import Breadcrumb from '../Breadcrumb';

// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToHtml from 'draftjs-to-html';
// import { EditorState, convertToRaw } from 'draft-js';
// import { stateFromHTML } from 'draft-js-import-html';

import QuizMultipleChoice from './QuizMultipleChoice';
import QuizFillIn from './QuizFillIn';
import RichTextArea from '../../../components/RichTextArea.jsx';

class QuizQuestions extends Component {

  constructor(props) {
    super(props);

    this.state = {
      // editorState: EditorState.createEmpty(),
      questionType: '',
      content: '',
      onProcess: false,
      choices: [],
      update: false,
      redirect: false
    };

    this.api = new QuestionApi;
    this.cancelRequestHandler = CancelToken.source();
    this.richTeaxtArea = null;
  }

  handleChoices(choices) {
    this.setState(() => ({
      choices
    }))
  }

  save({ addOther = false }) {
    if (this.state.onProcess)
      return;
    
    this.setState({ onProcess: true });

    let questionType;

    switch (this.state.questionType) {
      case 'MultipleChoice':
        questionType = 'multiple-choice'
        break;

      case 'MultipleResponse':
        questionType = 'multiple-response'
        break;

      case 'FillIn':
        questionType = 'fill-in'
        break;
      case 'Boolean':
        questionType = 'boolean'
        break;

      default:
        questionType = 'essay';
        break;

    }

    const data = {
      question_type: questionType,
      content: this.state.content,
    };

    if (
      questionType === 'boolean' ||
      questionType === 'multiple-response' ||
      questionType === 'multiple-choice'
    ) {
      data['choices'] = JSON.stringify(this.state.choices);
    } else if (questionType === 'fill-in') {
      data['answers'] = this.state.choices;
    }

    return this.api.store({
      params: {
        id: this.props.match.params.id,
        question_type: questionType
      },
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.setState({
          redirect: !addOther,
          onProcess: false,
          error: false
        });
        
        if (addOther)
          this.resetField();
      },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, onProcess: false }),
    })
  }

  resetField() {
    this.setState({
      questionType: '',
      content: '',
      onProcess: false,
      choices: [],
      update: false,
      redirect: false
    });

    if (this.richTeaxtArea)
      this.richTeaxtArea.reset();
  }
  render() {

    let showSwitch;

    switch (this.state.questionType) {
      case 'MultipleChoice':
      case 'MultipleResponse':
      case 'Boolean':
        showSwitch = <QuizMultipleChoice 
          update={this.state.update} 
          answer={this.state.choices} 
          onChange={this.handleChoices.bind(this)} 
          type={this.state.questionType} />
        break
      case 'FillIn':
        showSwitch = <QuizFillIn 
          update={this.state.update} 
          answer={this.state.choices} 
          onChange={this.handleChoices.bind(this)} />
        break
      default:
        showSwitch = null
    }

    if (this.state.redirect)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/edit'} />

    return (

      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/edit', label: 'Quiz' },
          { label: 'Pertanyaan Baru' },
        ]} />

        <div className="row justify-content-center">
          <div className="col-md-8 order-md-1 order-2">

            <div className="px-2 py-3 mb-4 row mx-0 ">
              <div className="text-uppercase h6 mb-0"> Pertanyaan Baru </div>
            </div>

            <div className="d-block p-relative bg-white rounded shadowed mb-4">
              <div className="px-4 py-2">
                <div className="form-group">
                  <label className="d-block"> Questions <small>(required)</small> </label>
                  {/* <Editor
                    editorState={this.state.editorState}
                    wrapperClassName="texteditor-wrapper"
                    editorClassName="texteditor-editor form-control"
                    onEditorStateChange={(val) => {
                      this.setState({
                        content: draftToHtml(convertToRaw(val.getCurrentContent())),
                        editorState: val
                      })
                    }}
                  /> */}

                  <RichTextArea 
                    onChange={val => this.setState({ content: val })} 
                    style={true} 
                    fillIn={true} 
                    ref={child => { this.richTeaxtArea = child; }}
                  />

                </div>
              </div>
            </div>


            <div className="d-block p-relative bg-white rounded shadowed">
              <div className="form-group px-4 py-4">
                <label className="d-block"> Questions Type <small>(required)</small> </label>
                <select className="form-control" value={this.state.questionType} onChange={e => this.setState({ questionType: e.target.value })}>
                  <option>Select Value </option>
                  <option value="MultipleChoice">Multiple Choice </option>
                  <option value="MultipleResponse">Multiple Responses</option>
                  {/* <option value="FillIn">Fill-in</option> */}
                  <option value="Boolean">True-false </option>
                  <option value="Essay">Essay</option>
                </select>

                {showSwitch}

              </div>



            </div>

            <div className="py-4 d-block text-right ">

              <button
                type="button"
                className="btn btn-link btn-lg m-2 medium-text" onClick={() => this.save({addOther: true})}>
                Save and add another Question
              </button>

              <button
                type="button"
                className="btn btn-primary btn-lg m-2 medium-text" onClick={() => this.save({ addOther: false })}>
                Save
              </button>
            </div>

          </div>

        </div>

      </Fragment >
    );
  }

}

export default QuizQuestions;