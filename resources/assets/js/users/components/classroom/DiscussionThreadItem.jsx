import React from 'react';
import { Link } from "react-router-dom";

import helpers from "../../modules/helpers";

const DiscussionThreadItem = props => (
  <Link to={ '/classroom/' + props.classroom + '/teachable/' + props.teachable.data.id + '#discussions' } className="list-group-item list-group-item-action">
    <div className="mb-2 h6">{ props.title }</div>
    <div className="text-muted">
      <span className="mr-3"><i className="fas fa-users"></i> { props.usersCount }</span>
      <span className="mr-3"><i className="fas fa-comment-alt"></i> { props.messagesCount }</span>
      <span className="mr-3"><i className="fas fa-clock"></i> { helpers.getSimpleDateDiff( props.lastActiveAt ) }</span>
    </div>
  </Link>
);

export default DiscussionThreadItem;