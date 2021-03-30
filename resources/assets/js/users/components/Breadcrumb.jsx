import React, { Fragment } from 'react';
import { Link } from "react-router-dom";
import { upperFirst } from 'lodash';

const Breadcrumb = props => (
  <Fragment>
    <div style={{ height: 45 }}></div>
    <nav className="attach-to-navbar bg-light border-bottom">
      <div className="container">
        <ol className="breadcrumb bg-light m-0 px-0">
          {
            props.items.map( ( item, index ) => {
              if ( item.link )
                return <li key={ index } className="breadcrumb-item"><Link to={ item.link }>{ item.label }</Link></li>;
              return <li key={ index } className="breadcrumb-item active">{ item.label }</li>
            } )
          }
        </ol>
      </div>
    </nav>
  </Fragment>
);

export default Breadcrumb;