import React from 'react';
import { Link } from "react-router-dom";

import helpers from "../../modules/helpers";

const ThreadItem = props => (
  <Link to={ props.link } className="list-group-item list-group-item-action">
    <div className="text-truncate">
      [{ props.teachable.data.type }] { props.title.length > 0 ? props.title : '[No title]' }
    </div>
    <div className="d-flex justify-content-between">
      <div>
        <span className="text-muted mr-2">
          <i className="fas fa-users"></i> { props.usersCount }
        </span>
        <span className="text-muted mr-2">
          <i className="fas fa-comments"></i> { props.messagesCount }
        </span>
      </div>
      <div className="text-muted">
        <i className="fas fa-clock"></i> { helpers.getSimpleDateDiff( props.lastActiveAt ) }
      </div>
    </div>
  </Link>

);

export default ThreadItem;