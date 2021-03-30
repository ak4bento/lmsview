import React, { Fragment } from 'react';

import TimeRemaining from './TimeRemaining';
import AssignmentUpload from './AssignmentUpload';
import AssignmentLocked from './AssignmentLocked';
import AssignmentGrade from './AssignmentGrade';
import AssignmentReview from './AssignmentReview';

const AssignmentStudent = props => (
  <div>

    <h2> Tes </h2>
    {
      props.teachableUser.grade
      && (
        props.teachableUser.grade.data.completedAt ?
          <AssignmentGrade {...props.teachableUser.grade.data} /> : <AssignmentLocked />
      )
    }
    {
      !props.teachableUser.grade &&
      (
        <Fragment>
          {props.teachableUser.teachable.data.expiresAt && <TimeRemaining expiresAt={props.teachableUser.teachable.data.expiresAt} />}
          <AssignmentUpload teachableUser={props.teachableUser} onSuccess={teachable => props.onUpdate(teachable)} />
        </Fragment>
      )
    }
  </div>
);

const AssignmentTeacher = props => (
  <AssignmentReview {...props} />
);

const Assignment = props => {
  return (
    props.teachable && props.teachable.classroom.data.self.data.role === 'teacher' ?
      <AssignmentTeacher {...props} /> : <AssignmentStudent {...props} />
  );
}

export default Assignment;