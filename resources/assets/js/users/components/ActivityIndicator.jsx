import React from 'react';
import PropTypes from "prop-types";

const ActivityIndicator = props => {
  let sizes = {
    "small": 30,
    "normal": 50,
    "large": 80,
    "x-large": 100,
  };

  return (
    <div className={ "d-flex justify-content-center" + ( props.padded ? ' py-5' : '' ) }>
      <div
        className="preloader"
        style={{
          height: props.size ? sizes[ props.size ] : sizes.normal,
          width: props.size ? sizes[ props.size ] : sizes.normal,
          borderWidth: ( props.size ? sizes[ props.size ] : sizes.normal ) / 5,
        }} />
    </div>
  );
}

ActivityIndicator.propTypes = {
  size: PropTypes.oneOf([ 'small', 'normal', 'large', 'x-large' ]),
  padded: PropTypes.bool,
}

export default ActivityIndicator;