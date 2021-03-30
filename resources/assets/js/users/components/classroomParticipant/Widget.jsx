import React from 'react';

const Widget = props => (
  <div className="shadowed bg-white rounded mb-4 py-4">
    { props.children }
  </div>
);

export default Widget;