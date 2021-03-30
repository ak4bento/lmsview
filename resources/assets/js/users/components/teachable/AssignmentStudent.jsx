import React, { Component, Fragment } from 'react';

class AssignmentReview extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        <table className="table table-hover w-100">
          <tr>
            <th> Student </th>
            <th> Score </th>
            <th> </th>
          </tr>

          {
            this.props.students && this.props.students.map((student, i) =>
              <tr key={student.user.data.username}>
                <td>
                  {student.user.data ? student.user.data.name : null}
                </td>
                { 
                  student.teachableUsers.data.length ? student.teachableUsers.data[0].grade ? 
                  (
                    <td>
                        <strong style={{ opacity: ('1') }}> 
                          { student.teachableUsers.data[0].grade.data.grade }
                        </strong>
                      </td>
                  ) : null : null
                } 
                <td>
                  {
                    student.teachableUsers.data[0].grade ? null : student.teachableUsers.data[0].media ? (
                      <button
                        className="btn btn-primary"
                        onClick={(e) => this.props.setState(
                          { activeStudent: i + 1 }
                        )}
                      >
                        Periksa<i className="fas fa-arrow-right ml-2"></i>
                      </button>
                    ) : null
                  }
                </td>                  
              </tr>
            )
          }
        </table>

      </Fragment>
    );
  }
}

export default AssignmentReview;