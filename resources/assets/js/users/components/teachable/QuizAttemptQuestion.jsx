import React, { Component } from 'react';

import QuizAttemptsApi from "../../api/quizAttempts";
import QuizAttemptMultipleChoiceQuestion from './QuizAttemptMultipleChoiceQuestion';
import QuizAttemptBooleanQuestion from './QuizAttemptBooleanQuestion';
import QuizAttemptFillInQuestion from './QuizAttemptFillInQuestion';
import QuizAttemptEssayQuestion from './QuizAttemptEssayQuestion';

import Parser from 'html-react-parser';
import htmlDecode from 'decode-html';

class QuizAttemptQuestion extends Component {

  constructor(props) {
    super(props);

    this.state = {
      answer: null,
      answering: false,
      error: false,
      finish: false
    };

    this.api = new QuizAttemptsApi;
  }

  answer(answer) {
    return this.setState({
      answer
    });
  }

  next(onNext) {
    console.log(this.state.answer);
    
    this.setState({
      answering: true,
      error: false
    });
    return this.api.update({
      id: this.props.attempt.id,
      data: {
        context: 'answer',
        answer: this.state.answer,
      },
      cb: data => {
        this.reset();
        this.props.onAnswer(
          Object.assign({}, data.data), onNext
        );


      },
      err: () => this.setState({
        answering: false,
        error: true
      })
    });
  }

  reset() {
    this.setState({
      answering: false,
      error: false,
      answer: null
    });
  }

  finish() {
    this.next(false);
    this.setState({ finish: true });
    this.props.onFinished(true);
  }

  componentWillMount() {
    if (!this.state.answer) this.state.answer = this.props.answer;
  }

  render() {

    // console.log('props-data', this.props);

    return (
      <div style={{ userSelect: 'none' }}>

        <div className="mb-5 lead question q-img" dangerouslySetInnerHTML={{ __html: htmlDecode(this.props.question.content) }}>
          {/* {Parser(this.props.question.content)}  */}
        </div>
        <div className="mb-5">
          {
            (this.props.question.type === 'MultipleChoice' || this.props.question.type === 'MultipleResponse') &&
            <QuizAttemptMultipleChoiceQuestion
              question={this.props.question}
              {...this.state}
              onAnswer={this.answer.bind(this)}
            />
          }
          {
            this.props.question.type === 'Boolean' &&
            <QuizAttemptBooleanQuestion
              question={this.props.question}
              {...this.state}
              onAnswer={this.answer.bind(this)}
            />
          }
          {
            this.props.question.type === 'FillIn' &&
            <QuizAttemptFillInQuestion
              question={this.props.question}
              {...this.state}
              onAnswer={this.answer.bind(this)}
            />
          }
          {
            this.props.question.type === 'Essay' &&
            <QuizAttemptEssayQuestion
              question={this.props.question}
              {...this.state}
              onAnswer={this.answer.bind(this)}
              page={this.props.page}
            />
          }
        </div>

        <div className="d-flex justify-content-end">

          <div>

            {
              (this.props.question.type === 'FillIn' || this.props.question.type === 'Essay') &&
              <a href="#" className="secondary-link py-3 px-5" onClick={() => this.next(false)}> Simpan Sementara </a>
            }


            <button
              type="button"
              className="btn btn-primary py-3 px-5"
              onClick={() => this.next(true)}
              disabled={this.state.answer === '' || this.state.answering}
            >
              {this.state.answering ? 'Mohon Tunggu..' : 'Submit Jawaban'} <i className="fas fa-arrow-right"></i>
            </button>


            {(this.props.page + 1) === this.props.attempt.questions.data.length &&
              <button type="button" className="btn btn-success py-3 px-5 ml-4" onClick={() => this.finish()}>
                Selesai
              </button>
            }



          </div>
        </div>
      </div>
    );
  }
}

export default QuizAttemptQuestion;