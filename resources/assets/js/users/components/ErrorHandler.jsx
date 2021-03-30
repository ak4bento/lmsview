import React from 'react';
import PropTypes from 'prop-types';

const ErrorHandler = props => (
  <div className="text-muted d-flex flex-column align-items-center py-5">
    <div className={ "mb-3" + ( props.size === 'small' ? ' h2' : ' display-1' ) }><i className={ "fas fa-" + ( props.icon || 'meh' ) }></i></div>
    <div className="h5">
      <span className="mr-2">{ props.message }</span>
      { props.retryAction && <a href="#" onClick={ e => { e.preventDefault(); return props.retryAction() } } className="text-link">
        { props.retryText || 'Retry' }</a>
      }
    </div>
  </div>
);

ErrorHandler.propTypes = {
  message: PropTypes.string.isRequired,
  size: PropTypes.oneOf([ 'large', 'small' ]),
  icon: PropTypes.string,
  retryAction: PropTypes.func,
  retryText: PropTypes.string,
};

export default ErrorHandler