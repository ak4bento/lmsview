import React, { Component } from 'react';
import Moment from "moment";
import QuizTeacherAttemptsAttempt from './QuizTeacherAttemptsAttempt';

class QuizTeacherAttempts extends Component {

  constructor(props) {
    super(props);
    this.state = {
      attempt: null,
    };
  }

  render() {
    if ( this.state.attempt )
      return <QuizTeacherAttemptsAttempt 
        classroomUser={ this.props.classroomUser } 
        attempt={ this.state.attempt } 
        onClose={ () => this.setState({ attempt: null }) } 
      />
    return (
      <div>
        <div><a href="#" onClick={ e => { e.preventDefault(); this.props.onClose(); } }>Back to Quiz</a></div>
        <div className="h3 mb-4">Attempts by { this.props.classroomUser.user.data.name }</div>

        <table className="table table-hover">
          <tbody>
            { this.props.teachableUser.quizAttempts.data ? (
              this.props.teachableUser.quizAttempts.data.map( ( attempt, index ) => (
                <tr key={ index }>
                  <td>Attempt #{ index + 1 } - { Moment( attempt.createdAt ).fromNow() }</td>
                  <td>
                    { attempt.completedAt ? 'Attempt done ' + Moment( attempt.completedAt ).fromNow() : 'On Progress' }
                  </td>
                  <td>
                    { 
                      attempt.completedAt ?
                        attempt.grade ? ` Nilai: ${attempt.grade.data.grade}` : 'Belum dinilai' :
                        null
                    }
                  </td>
                  <td>
                    { 
                      attempt.completedAt && 
                      <a 
                        href="#" 
                        onClick={ e => { e.preventDefault(); this.setState({ attempt: { ...attempt, index } }) } 
                      }>
                        See results
                      </a> 
                    }
                  </td>
                </tr>
              ) ) ) : null
            }
          </tbody>
        </table>
      </div>
    );
  }

}

export default QuizTeacherAttempts;