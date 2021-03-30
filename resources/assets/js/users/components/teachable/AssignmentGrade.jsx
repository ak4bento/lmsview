import React from 'react';

const AssignmentGrade = props => (
  <div className="bg-white border rounded d-flex justify-content-between align-items-center p-5">

    <div>
      <div className="h3 m-0">Your Results</div>
      {
        props.gradedBy ?
        <div>as graded by { props.gradedBy.data.name } { props.completedAtForHumans }</div> :
        <div>automatically graded { props.completedAtForHumans }</div>
      }

      {
        props.comments.length > 0 &&
        (
          <blockquote className="blockquote mt-3 mb-0">"{ props.comments }"</blockquote>
        )
      }
    </div>

    <div className="display-2 m-0">{ props.grade }</div>

  </div>
);

export default AssignmentGrade;