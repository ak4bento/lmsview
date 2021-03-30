import React from 'react';

const ListGroup = props => (

  <div className="mb-3">

    <div className="py-2 mb-2 h6 text-muted text-uppercase">
      { props.group.isGroup ? props.model[ props.group.titleField ] : 'Other Media' }
      <span className="badge badge-secondary badge-pill ml-2">{ props.children.length }</span>
    </div>

    <div className="row no-gutters">
      { props.children }
    </div>
  </div>

);

export default ListGroup;