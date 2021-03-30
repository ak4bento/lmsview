import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import Moment from "moment";
import { upperFirst } from 'lodash';

import UserAvatar from "../UserAvatar";

const ParticipantsListItem = props => {
  let
    isSelf = props.user.data.username === window.config.user.username,
    detailsURL = '/classroom/' + props.classroom + '/participants/' + props.id;

  return (
    <tr>
      <td>
        <div className="d-flex">
          <UserAvatar { ...props.user.data } />
          <div>
            <div>
              { isSelf ? props.user.data.name : <Link to={ detailsURL }>{ props.user.data.name }</Link> }
              { isSelf && <span className="badge badge-pill badge-success ml-2">You</span> }
            </div>
            <div className="small text-muted">{ props.user.data.username }</div>
          </div>
        </div>
      </td>
      <td className="align-middle">{ upperFirst( props.role ) }</td>
      <td className="align-middle">
        {
          props.role === 'student' && (
            <div>
              <div>{ Moment( props.joinedAt ).fromNow() }</div>
              <div className="text-muted small">{ Moment( props.joinedAt ).format( 'D/M/YYYY H:mm' ) }</div>
            </div>
          )
        }
      </td>
    </tr>
  );
}

export default ParticipantsListItem;