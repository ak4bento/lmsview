import React from 'react';
import PropTypes from "prop-types";

const ProgressBar = props => {
  // console.log( props.progress );
  return (
    <div className="progress">
      <div
        className={ "progress-bar" + ( props.indeterminate ? ' progress-bar-striped progress-bar-animated' : '' ) }
        style={{ width: ( props.indeterminate ? 100 : ( props.progress || 0 ) ) + '%' }} />
    </div>
  );
}

ProgressBar.propTypes = {
  progress: PropTypes.number,
  indeterminate: PropTypes.bool,
};

export default ProgressBar;