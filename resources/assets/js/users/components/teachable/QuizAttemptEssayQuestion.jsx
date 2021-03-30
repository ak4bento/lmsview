import React, { Component } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from 'draftjs-to-html';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import PropTypes from 'prop-types';
// import { findLinkEntities, findImageEntities, Image, Link } from 'medium-draft';
import { stateFromHTML } from 'draft-js-import-html';

import Richtextarea from '../../../components/RichTextArea.jsx';
import htmlDecode from 'decode-html';


class QuizAttemptEssayQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // editorState: EditorState.createEmpty(),
      initContent: ''
    }
  }

  componentWillMount() {

    if (this.props.answer) {

      //fetch answer.content if available

      // const sampleMarkup = this.props.answer.content ? this.props.answer.content : "";


      // const blocksFromHTML = stateFromHTML(sampleMarkup);

      // this.setState({
      //   editorState: EditorState.createWithContent(
      //     blocksFromHTML
      //   )
      // });

      const propsAnswer = this.props.answer.content ? this.props.answer.content : '';

      this.setState({
        initContent: propsAnswer
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.question.id !== nextProps.question.id) {
      //clear content text editor when next question is activated
      //
      // const editorState = EditorState.push(this.state.editorState, ContentState.createFromText(''));
      // this.setState({ editorState });

      this.setState({ initContent: '' })
    }
  }

  render() {
    return (
      <div className="rounded bg-white shadowed p-4">
        <div className="h6 text-uppercase mb-3">Type in your answer below</div>
        {/* 
        <Editor
          editorState={this.state.editorState}
          wrapperClassName="texteditor-wrapper"
          editorClassName="texteditor-editor form-control"
          onEditorStateChange={(val) => {
            this.setState({ editorState: val })
            this.props.onAnswer({
              questionId: this.props.question.id,
              content: draftToHtml(convertToRaw(val.getCurrentContent()))
            })
          }}

          toolbar={{
            options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'colorPicker', 'link']
          }}

          disabled={this.props.answering}
        /> */}

        <Richtextarea id={"richtextarea-" + (this.props.page + 1)} initValue={htmlDecode(this.state.initContent)}
          onChange={(val) => this.props.onAnswer({
            questionId: this.props.question.id,
            content: val
          })} style={true} />


      </div>
    );
  }
}

QuizAttemptEssayQuestion.propTypes = {
  answer: PropTypes.object
}

export default QuizAttemptEssayQuestion;