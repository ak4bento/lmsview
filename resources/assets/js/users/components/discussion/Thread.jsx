import React from 'react';

import helpers from "../../modules/helpers";
import ThreadItem from './ThreadItem';

const Thread = props => {

  return (
    <div className={'fade' + (props.discussions.length > 0 ? ' show' : '')}>
      {
        props.discussions.length > 0 ?
          props.discussions.sort((a, b) => helpers.sortByDate(a.createdAt, b.createdAt)).reverse().map((message, index) => (
            <ThreadItem key={index} isFirst={index === 0} {...message} {...props} />
          )) :
          (
            <p>Belum ada diskusi.</p>
          )
      }
    </div>

  );
}

export default Thread;