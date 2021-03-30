import React from 'react';
import ProgressBar from "../ProgressBar";

const Progress = props => {
  let progress = !props.teachables.length ? 0 :
    Math.ceil((props.completedTeachables.length / props.teachables.length) * 100);

  return (
    <div className="mb-5">
      <div className="d-flex mb-2 justify-content-between align-items-end">
        <div className="h6 m-0 text-uppercase">Progress</div>
        <div className="small text-muted text-uppercase">
          {props.completedTeachables.length + ' dari ' + props.teachables.length + ' tugas telah diselesaikan'}
        </div>
      </div>
      <ProgressBar progress={progress} />
    </div>
  );
}

export default Progress;