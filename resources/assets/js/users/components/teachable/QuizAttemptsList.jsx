import React, { Component } from 'react';
import Moment from 'moment';

import QuizAttemptsAttempt from './QuizAttemptsAttempt';

class QuizAttemptsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: false
    }
  }

  render() {
    if ( this.state.attempt )
      return <QuizAttemptsAttempt 
        // classroomUser={ this.props.classroomUser } 
        attempt={ this.state.attempt } 
        onClose={ () => this.setState({ attempt: null }) } 
      />
    
     return  (
      <table className="table mt-5">
        <thead>
          <tr>
            <th className="text-uppercase">Your Previous Attempts</th>
            <th className="text-uppercase text-right">Time Elapsed</th>
            <th></th>      
          </tr>
        </thead>
        <tbody>
          {
            this.props.attempts.map( (attempt, index) => (
              <tr key={ attempt.attempt }>
                <td>#{ attempt.attempt } - { attempt.createdAtForHumans }</td>
                <td className="text-right">
                  {
                    attempt.completedAt ?
                    Moment.duration( new Moment( attempt.createdAt ).diff( new Moment( attempt.completedAt ) ) ).humanize() :
                    'On Progress'
                  }
                </td>
                <td>
                  { 
                    attempt.completedAt && 
                    <a href="#" onClick={ e => { e.preventDefault(); this.setState({ attempt: { ...attempt, index } }) } }>
                      Lihat hasil
                    </a> 
                  }
                </td>
              </tr>
            ) )
          }
        </tbody>
      </table>
    );
  }
}

export default QuizAttemptsList;