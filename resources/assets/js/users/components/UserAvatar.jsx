import React from 'react';
import PropTypes from "prop-types";

const UserAvatar = props =>
  props.avatar.length > 0 ?
  <img
    className="rounded-circle mr-3"
    style={{
      height: sizes[ props.size || 'normal' ].circle,
      width: sizes[ props.size || 'normal' ].circle, overflow: 'hidden'
    }}
    src={ props.avatar }
    alt={ props.name } /> :
  (
    <span
      className="rounded-circle bg-warning d-inline-flex justify-content-center align-items-center mr-3"
      style={{
        height: sizes[ props.size || 'normal' ].circle,
        width: sizes[ props.size || 'normal' ].circle
      }}>
      <span className={ "m-0 text-white " + ( sizes[ props.size || 'normal' ].content ) }>{ props.initials }</span>
    </span>
  );

UserAvatar.propTypes = {
  name:       PropTypes.string.isRequired,
  size:       PropTypes.oneOf([ 'small', 'normal', 'large', 'x-large' ]),
  avatar:     PropTypes.string,
  initials:   PropTypes.string.isRequired,
}

const sizes = {
  'small': { circle: 30, content: 'h6' },
  'normal': { circle: 40, content: 'h5' },
  'large': { circle: 60, content: 'h3' },
  'x-large': { circle: 100, content: 'h1' },
}

export default UserAvatar;