import React from 'react';
import helpers from "../../modules/helpers";
import { getIcon } from '../../modules/media'

const ListItem = props => (
  <div className="col-xl-3 col-md-4 pr-2 mb-2" style={{ cursor: 'pointer' }} onClick={ () => props.onSelect() }>
    <div className={ "border" + ( props.selected ? ' border-primary' : '' ) }>
      <div className="py-2 px-3 display-1 bg-light text-center text-muted"><i className={ "fas fa-" + getIcon( props.mimeType ) }></i></div>
      <div className="py-2 px-3 bg-white">
        <div className="text-truncate">{ props.name }</div>
        <div className="text-truncate text-muted">{ helpers.getSimpleFilesize( props.size ) }</div>
      </div>
    </div>
  </div>
);

export default ListItem;