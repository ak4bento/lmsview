import React from 'react';
import ProgressBar from '../ProgressBar';

const Progress = props => {
  let completedTeachables = props.teachables.filter(teachable => teachable.teachableSelf && teachable.teachableSelf.data.completedAt !== null).slice(0);
  let progress = props.teachables.length === 0 ? 0 : Math.ceil((completedTeachables.length / props.teachables.length) * 100);

  return (
    <div>
      <div className="d-flex mb-2 justify-content-between align-items-end">
        <div className="h6 m-0 text-uppercase">Progress Saya </div>
        <div className="small text-muted text-uppercase">
          {
            props.fetching ?
              'Loading' :
              completedTeachables.length + ' dari ' + props.teachables.length + ' selesai'
          }
        </div>
      </div>
      <div className="mb-3">
        <ProgressBar progress={progress} indeterminate={props.fetching} />
      </div>
    </div>
  );
}

export default Progress;