import React, { Component } from 'react';
import renderHTML from "react-render-html";
import Moment from "moment";
import * as quizHelper from "../../modules/quiz";
import QuizAttemptApi from "../../api/quizAttempts";
import GradeApi from "../../api/grade";

class QuizTeacherAttemptsAttempt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isReview: false,
      scores: {}
    };

    this.api = new QuizAttemptApi;
    this.gradeApi = new GradeApi;
  }

  onScoring(id, score) {
    const scores = Object.assign(this.state.scores, { [id]: score });
    this.setState({ scores });
  }

  save() {
    const listAnswers = this.props.attempt.answers.data;

    Object.keys(this.state.scores).forEach(key => {
      const index = listAnswers.findIndex(answer => answer.questionId === key);
      if (index >= 0) listAnswers[index].score = this.state.scores[key];
    });

    listAnswers.forEach((answer, indexAnswer) => {
      const currScore = this.state.scores[answer.questionId] >= 0 ? this.state.scores[answer.questionId] : false;
      listAnswers[indexAnswer].score = currScore !== false ? currScore : (listAnswers[indexAnswer].score || 0);
    });

    const grade = quizHelper.grading({
      gradingMethod: this.props.attempt.grading_method,
      questions: this.props.attempt.questions.data,
      answers: listAnswers
    });

    this.api.update({
      id: this.props.attempt.id,
      data: { scores: this.state.scores, context: 'scoring' },
      params: null,
      cb: result => {
        if (this.props.grade) {
          this.gradeApi.update({
            id: this.props.grade.data.id,
            data: {
              score: grade || 0
            },
            params: null,
            cb: result => {
              this.setState({ isReview: false });
            }
          })
        } else {
          this.gradeApi.store({
            data: {
              score: grade,
              attempt: this.props.attempt.id,
              context: 'quizAttempt'
            },
            params: null,
            cb: result => {
              this.setState({ isReview: false });
            }
          })
        }
      }
    })
  }

  render() {
    let previousAnswer = null;

    return (
      <div>
        <div className="row mx-0">
          <div className="col mx-0 px-0">
            <div><a href="#" onClick={e => { e.preventDefault(); this.props.onClose(); }}>Back to Attempts List</a></div>
            <div className="h3 mb-4">Attempt #{this.props.attempt.index + 1} by {this.props.classroomUser.user.data.name}</div>
          </div>

          <div className="h3 py-4 col mx-0 px-0 text-right"> Nilai: {this.props.attempt.grade ? this.props.attempt.grade.data.grade : 'Belum dinilai '}</div>

        </div>

        <div>
          <button onClick={() => this.setState({ isReview: true })} className="btn btn-primary">Periksa</button>
        </div>

        <div className="d-flex py-4 mb-4 border-bottom">
          <div style={{ width: 60 }} />
          <div style={{ flex: 2 }} className="pr-4">
            <div className="h4 m-0">Questions</div>
          </div>
          <div style={{ flex: 2 }}>
            <div className="h4 m-0">Answers</div>
          </div>
          <div style={{ flex: 1 }}>
            <div className="h4 m-0">Score</div>
          </div>
          {this.state.isReview ? <div style={{ flex: 1 }}> </div> : null}
        </div>


        {
          this.props.attempt.questions.data.map((question, index) => {
            let answer = null;
            switch (question.type) {
              case 'MultipleChoice':
              case 'Boolean':
                answer = quizHelper.getMultipleChoiceAnswer(question, this.props.attempt.answers); break;
              case 'MultipleResponse':
                answer = quizHelper.getMultipleResponseAnswer(question, this.props.attempt.answers); break;
              case 'FillIn':
                answer = quizHelper.getFillInAnswer(question, this.props.attempt.answers); break;
              case 'Essay':
                answer = quizHelper.getEssayAnswer(question, this.props.attempt.answers); break;
            }
            let previous = previousAnswer;
            previousAnswer = answer;

            return (
              <div key={question.id} className="d-flex mb-3">
                <div style={{ width: 60 }} className="text-center">
                  <div className="h4 m-0">{index + 1}</div>
                </div>
                <div style={{ flex: 2 }} className="pr-4">
                  <div className="text-muted"><i className="fas fa-list mr-2"></i>{question.typeLabel}</div>
                  {renderHTML(question.content)}
                </div>
                <div style={{ flex: 2 }}>
                  <div className="text-muted">
                    <i className="fas fa-clock mr-2"></i>
                    {
                      Moment.duration(
                        new Moment(answer.answeredAt).diff(
                          new Moment(previous ? previous.answeredAt : this.props.createdAt)
                        )
                      ).humanize()
                    }
                  </div>
                  {quizHelper.displayAnswerReview(answer, question)}
                </div>
                <div style={{ flex: 1 }}>
                  {
                    answer.score !== '' && answer.score !== null && answer.score !== undefined ?
                      quizHelper.displayScore({
                        gradingMethod: this.props.attempt.grading_method,
                        score: answer.score,
                        questionLength: this.props.attempt.questions.data.length
                      }) : 'Belum diperiksa'
                  }
                </div>

                {
                  this.state.isReview &&
                  (
                    <div style={{ flex: 1 }} className="borderbox">
                      {
                        question.type !== 'MultipleChoice' &&
                        question.type !== 'MultipleResponse' &&
                        quizHelper.displayFormScoring({
                          questionId: question.id,
                          gradingMethod: this.props.attempt.grading_method,
                          answer: answer,
                          weight: question.weight,
                          currentScore: answer.score,
                          choiceItems: question.choiceItems ? question.choiceItems.data : null
                        },
                          this.onScoring.bind(this)
                        )
                      }
                    </div>
                  )
                }

              </div>
            )
          })
        }



        {
          this.state.isReview && (
            <div>
              <a onClick={() => this.setState({ isReview: false })}>Batalkan</a>
              <button onClick={this.save.bind(this)}>Simpan</button>
            </div>
          )
        }

      </div>
    );
  }
}

export default QuizTeacherAttemptsAttempt;