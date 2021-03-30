import React, { Component } from 'react';
import { times } from "lodash";

class QuizAttemptFillInQuestion extends Component {

  constructor(props) {
    super(props);
    let answers = new Array(props.question.answerCount);
    answers.fill('');

    this.state = {
      answers
    };
  }

  fill(index, answer) {

    let answers = this.state.answers;

    answers[index] = answer;
    this.setState({ answers });

    return this.props.onAnswer({ questionId: this.props.question.id, answers });
  }

  componentWillMount() {
    if (this.props.answer) {
      this.setState({
        answers: this.props.answer.answers ? this.props.answer.answers : this.state.answers
      });
    }
  }

  render() {
    return (
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="bg-white shadowed rounded p-4">
            <div className="h5 mb-4 text-uppercase">Answers</div>
            {
              times(this.props.question.answerCount, index => {
                return (
                  <div className="d-flex align-items-center mb-3" key={index}>
                    <div className="h6 m-0" style={{ width: 40 }}>
                      {index + 1}
                    </div>
                    <input type="text" className="form-control" value={this.state.answers ? (this.state.answers[index] || '') : ''} onChange={e => this.fill(index, e.target.value)} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  }
}

export default QuizAttemptFillInQuestion;