import React, { Component } from 'react';
import { Redirect, withRouter } from "react-router-dom";
import Parser from 'html-react-parser';
import Moment from "moment";
import * as quizHelper from "../../modules/quiz";

import QuizAttemptsApi from "../../api/quizAttempts";

class QuizAttemptReview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      finishing: false,
      finished: false,
      error: false,
    };
    this.api = new QuizAttemptsApi;
  }

  finish() {
    if (this.state.finishing) return;

    this.setState(() => ({ finishing: true, error: false }));
    return this.api.update({
      id: this.props.id,
      data: {
        context: 'complete'
      },
      cb: () => this.setState({ finished: true }),
      err: () => this.setState({ error: true, finishing: false })
    });
  }

  render() {
    if (this.state.finished)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '?reload=true'} />

    let previousAnswer = null;
    return (
      <div>
        <div className="mb-5">
          <div className="h2 m-0 text-center">Cek kembali Jawaban Anda</div>
          <div className="text-muted text-center">Tekan 'Selesai' untuk menyelesaikan quiz.</div>
        </div>
        <div className="d-flex py-4 mb-4 border-bottom">
          <div style={{ width: 60 }} />
          <div style={{ flex: 1 }} className="pr-4">
            <div className="h4 m-0">Questions</div>
          </div>
        </div>
        <div className="mb-5">
          {
            this.props.questions.data.map((question, index) => {
              let answer = null;
              switch (question.type) {
                case 'MultipleChoice':
                case 'Boolean':
                  answer = quizHelper.getMultipleChoiceAnswer(question, this.props.answers); break;
                case 'MultipleResponse':
                  answer = quizHelper.getMultipleResponseAnswer(question, this.props.answers); break;
                case 'FillIn':
                  answer = quizHelper.getFillInAnswer(question, this.props.answers); break;
                case 'Essay':
                  answer = quizHelper.getEssayAnswer(question, this.props.answers); break;
              }
              
              let previous = previousAnswer;
              previousAnswer = answer;    

              return (
                <div key={question.id} className="d-flex mb-3 align-items-start border-bottom">
                  <div style={{ width: 60 }} className="text-center">
                    <div className="h4 m-0">{index + 1}</div>
                  </div>
                  <div className={"d-flex col-md mx-0 px-0 " + (question.typeLabel == 'Essay' ? "flex-column" : "flex-md-row flex-column")} >
                    <div className={"px-2 mx-0 q-img " + (question.typeLabel !== 'Essay' ? "col-md" : "d-block")}>
                      <div className="text-muted">
                        <i className="fas fa-list mr-2"></i>{question.typeLabel == 'Boolean' ? 'True or False' : question.typeLabel}
                      </div>
                      {Parser(question.content)}
                    </div>
                    {
                      answer ? (
                        <div className={"px-2 mx-0 my-4 mt-md-0 mb-md-4 " + (question.typeLabel !== 'Essay' ? "col-md" : "d-block")}>
                          <div className="text-muted">
                            <span className="d-inline-block pr-2"> <strong> Answers </strong> </span>
                            <div className="d-md-inline-block d-flex align-items-center">
                              <i className="fas fa-clock mr-2"></i>
                              {
                                Moment.duration(
                                  new Moment(answer.answeredAt).diff(new Moment(previous ? previous.answeredAt : this.props.createdAt))
                                ).locale('id').humanize() + ' yang lalu'
                              }
                            </div>
                          </div>
                          {quizHelper.displayAnswerReview(answer, question)}
                        </div>
                      ) : (
                        <div className={"px-2 mx-0 my-4 mt-md-0 mb-md-4 " + (question.typeLabel !== 'Essay' ? "col-md" : "d-block")}>
                          Not answered
                        </div>
                      )
                    }
                    

                  </div>

                </div>
              )
            })
          }
        </div>

        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={() => this.finish()}
            disabled={this.state.finishing}>
            {this.state.finishing ? 'Mohon Tunggu..' : 'Selesai'}
          </button>
        </div>
      </div>
    );
  }
}

export default withRouter(QuizAttemptReview);