import React from 'react';
import UserAvatar from './UserAvatar';

const UserBadge = props => (
  <div className={ "bg-" + ( props.accent || 'light' ) + " rounded px-3 py-2 d-inline-flex align-items-center mr-3" }>
    <UserAvatar { ...props } />
    <span>{ props.name }</span>
  </div>
);

export default UserBadge;