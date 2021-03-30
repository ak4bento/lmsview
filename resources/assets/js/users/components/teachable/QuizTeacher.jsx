import React, { Component } from 'react';
import { sortBy } from "lodash";

import ClassroomUsersApi from "../../api/classroomUsers";
import TeachableUsersApi from "../../api/teachableUsers";
import ServiceAccessor from '../ServiceAccessor';
import QuizTeacherAttempts from './QuizTeacherAttempts';

class QuizTeacher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classroomUsers: [],
      teachableUsers: [],
      viewAttemptsByUser: null,
    };
  }

  viewAttempts( classroomUser, teachableUser ) {
    return this.setState({ viewAttemptsByUser: { classroomUser, teachableUser } });
  }

  render() {
    return (
      <div className="bg-white border rounded py-5 px-4">

        {
          this.state.viewAttemptsByUser ?
          <QuizTeacherAttempts 
            { ...this.state.viewAttemptsByUser } 
            onClose={ () => this.setState({ viewAttemptsByUser: null }) } 
          /> :
          (
            <ServiceAccessor
              api={ ClassroomUsersApi }
              call={{ type: 'index', params: { context: 'teachable', teachable: this.props.teachable.id  } }}
              hasData={ this.state.classroomUsers.length > 0 }
              onValidate={ classroomUsers => this.setState({ classroomUsers }) }>

              <div className="h3 mb-4">Attempts Made</div>

              {
                this.state.classroomUsers.length > 0 &&
                (
                  <ServiceAccessor
                    api={ TeachableUsersApi }
                    call={{ type: 'index', params: { context: 'teachable', teachable: this.props.teachable.id } }}
                    hasData={ this.state.teachableUsers.length > 0 }
                    onValidate={ teachableUsers => this.setState({ teachableUsers }) }>

                    <table className="table table-hover w-100">
                      <thead>
                        <tr><th>Student</th><th className="text-right">Attempts</th><th style={{ width: 150 }}></th></tr>
                      </thead>
                      <tbody>
                        {
                          sortBy( this.state.classroomUsers, ( cu ) => cu.user.data.name ).map( ( classroomUser, index ) => {
                            let teachableUser = 
                              this.state.teachableUsers.filter( tu => tu.classroomUser.data.id === classroomUser.id )[0];
                            let attemptsCount = 
                              teachableUser ? ( teachableUser.quizAttempts && teachableUser.quizAttempts.data.length ) : 0;

                            return (
                              <tr key={ index }>
                                <td>{ classroomUser.user.data.name }</td>
                                <td className="text-right">{ attemptsCount }</td>
                                <td>
                                  { attemptsCount > 0 && 
                                    <a href="#" onClick={ () => this.viewAttempts( classroomUser, teachableUser ) }>
                                      See attempts
                                    </a> 
                                  }
                                </td>
                              </tr>
                            )
                          } )
                        }
                      </tbody>
                    </table>

                  </ServiceAccessor>
                )
              }

            </ServiceAccessor>
          )
        }
      </div>
    );
  }
}

export default QuizTeacher;