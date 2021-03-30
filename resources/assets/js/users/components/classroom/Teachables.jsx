import React from 'react';

import TeachableItem from './TeachableItem';

const Teachables = props => {

  let teachables = [];

  switch (props.filter.key) {
    case 'resource':
    case 'assignment':
    case 'quiz':
      teachables = props.teachables.filter(teachable => teachable.type === props.filter.key).slice(0);
      break;
    case 'not-done':
      teachables = props.teachables.filter(teachable => !teachable.teachableSelf || teachable.teachableSelf.data.completedAt === null);
      break;
    default:
      teachables = props.teachables.slice(0)
      break;
  }

  if (teachables.length === 0 && !props.fetching)
    return (
      <div className="text-muted d-flex flex-column align-items-center py-5">
        <div className="display-1 mb-3"><i className="fas fa-meh"></i></div>
        <div className="h5"> Tidak ada item. </div>
      </div>
    );

  return (
    <div>
      {
        teachables.map((teachable, index) => (
          <TeachableItem
            {...teachable}
            key={index}
            role={props.role}
            teachables={props.teachables}
            filter={props.filter}
          />
        ))
      }
    </div>
  );
}

export default Teachables;