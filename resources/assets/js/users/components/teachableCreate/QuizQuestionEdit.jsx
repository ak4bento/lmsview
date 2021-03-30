import React, { Component, Fragment } from 'react';
import { Redirect, Switch } from "react-router-dom";
import { CancelToken, isCancel } from "axios";

import QuestionApi from "../../api/question";
import Breadcrumb from '../Breadcrumb';

// import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import draftToHtml from 'draftjs-to-html';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { stateFromHTML } from 'draft-js-import-html';

import QuizMultipleChoice from './QuizMultipleChoice';
import QuizFillIn from './QuizFillIn';

import Richtextarea from '../../../components/RichTextArea.jsx';
import htmlDecode from 'decode-html';

class QuizQuestions extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // editorState: EditorState.createEmpty(),
      questionType: '',
      content: '',
      saving: false,
      choices: [],
      update: false,
      initContent: '' ,
      isProcess: true
    };

    this.api = new QuestionApi;
    this.cancelRequestHandler = CancelToken.source();

  }

  handleChoices(choices) {
    this.setState(() => ({
      choices
    }))
  }

  componentDidMount() {

    if (this.props.match.params.idquestion) {
      this.setState({isProcess: true});
      return this.api.show({
        id: this.props.match.params.idquestion,
        cb: data => {

          const blocksFromHTML = stateFromHTML(data.data.content);

          let questiontype;

          switch (data.data.question_type) {
            case 'multiple-choice':
              questiontype = 'MultipleChoice'
              break;

            case 'multiple-response':
              questiontype = 'MultipleResponse'
              break;

            case 'fill-in':
              questiontype = 'FillIn'
              break;
            case 'boolean':
              questiontype = 'Boolean'
              break;

            default:
              questiontype = 'Essay';
              break;
          }

          this.setState({
            questionType: questiontype,
            content: data.data.content,
            choices: 
                questiontype == 'Boolean' ? (data.data.choice_items ? data.data.choice_items : []) 
              : 
                questiontype == 'MultipleChoice' ? (data.data.choice_items ? data.data.choice_items : []) 
              :
                questiontype == 'MultipleResponse' ? (data.data.choice_items ? data.data.choice_items : []) 
              :
                questiontype == 'FillIn' ? JSON.parse(data.data.answers) : '',
            
            // editorState: EditorState.createWithContent(blocksFromHTML),
            initContent: data.data.content,
            update: true,
            error: false ,
            isProcess: false
          });

          // console.log(data)

        },
        err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true }),
      })
    }

  }

  save() {
    if (this.state.saving)
      return;

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
      content: this.state.content ? this.state.content : this.state.initContent,
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


    return this.api.update({
      id: this.props.match.params.idquestion,
      params: {
        question_type: questionType
      },
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.setState({
          saving: true,
          error: false
        }),
          console.log("saving update", this.state.saving)
      },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false }),
    })
  }


  render() {
    let showSwitch;

    switch (this.state.questionType) {
      case 'MultipleChoice':
      case 'MultipleResponse':
      case 'Boolean':
        showSwitch = <QuizMultipleChoice update={this.state.update} answer={this.state.choices} onChange={this.handleChoices.bind(this)} type={this.state.questionType} />
        break
      case 'FillIn':
        showSwitch = <QuizFillIn update={this.state.update} answer={this.state.choices} onChange={this.handleChoices.bind(this)} />
        break
      default:
        showSwitch = null
    }

    if (this.state.saving)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/edit'} />

    return (

      <Fragment>
        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/edit', label: 'Quiz' },
          { label: 'Edit Questions' },
        ]} />

        <div className="row justify-content-center">
          <div className="col-md-8 order-md-1 order-2">

            <div className="px-2 py-3 mb-4 row mx-0 ">
              <div className="text-uppercase h6 mb-0"> Edit Questions </div>
            </div>

            <div className="d-block p-relative bg-white rounded shadowed mb-4">
              <div className="px-4 py-2">
                <div className="form-group">
                  <label className="d-block"> Questions <small>(required)</small> </label>
                  {/* <Editor
                    editorState={this.state.editorState}
                    editorClassName="form-control"
                    onEditorStateChange={(val) => {
                      this.setState({
                        content: draftToHtml(convertToRaw(val.getCurrentContent())),
                        editorState: val
                      })
                    }}
                  /> */}
                  
                  {
                    !this.state.isProcess && (
                      <Richtextarea 
                        initValue={htmlDecode(this.state.initContent)} 
                        onChange={(val) => this.setState({ content: val })} 
                        style={true} 
                        fillIn={this.state.questionType == 'fillIn' ? true : false} 
                      />
                    )
                  }

                </div>
              </div>
            </div>



            {showSwitch !== null &&
              <div className="d-block p-relative bg-white rounded shadowed">
                <div className="form-group px-4 py-4">

                  {showSwitch}

                </div>
              </div>
            }




            <div className="py-4 d-block text-right ">

              <button
                type="button"
                className="btn btn-primary btn-lg m-2 medium-text" onClick={() => this.save()}>
                Save
                    </button>

            </div>

          </div>

        </div>

        {/* {console.log('answers', this.state)} */}

      </Fragment >
    );
  }

}

export default QuizQuestions;