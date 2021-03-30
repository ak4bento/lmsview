import React, { Component } from 'react';
import moment from 'moment-timezone';

class AdminListQuiz extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <div>

        <div className="d-flex flex-row mx-0 px-0 align-items-center">

          <div className="col-6 px-2 py-4 text-uppercase strong text-info text-small">
            Quiz
            </div>
          <div className="col-1 px-2 py-4 text-uppercase strong text-info text-small text-center">
            Min. Lulus
            </div>
          <div className="col-1 px-2 py-4 text-uppercase strong text-info text-small text-center">
            Max. Coba
            </div>
          <div className="col-4 px-2 py-4 text-uppercase strong text-info text-small text-center">
            Mulai
          </div>
        </div>

        {
          this.props.quizzes.map((quiz, i) =>
            <div className="d-flex flex-row mx-0 px-0 align-items-start border-bottom white-bg py-4" key={i}>
              <div className="col-6 px-2">
                {quiz.teachable.title}
              </div>
              <div className="col-1 px-2 text-center">
                {quiz.pass_threshold}
              </div>
              <div className="col-1 px-2 text-center">
                {quiz.max_attempts_count}
              </div>
              <div className="col-4 px-2 text-center">
                {moment(quiz.available_at).format('MMMM Do YYYY, h:mm a')}
              </div>

            </div>
          )
        }
      </div>

    )
  }
}

export default AdminListQuiz;