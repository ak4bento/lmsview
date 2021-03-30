import React from 'react';
import { groupBy } from "lodash";

import ListItem from './ListItem';
import ListGroup from './ListGroup';

const List = props => (

  <div>
    {
      Object.entries( groupBy( props.data, props.groupingField ) ).map( group => (
        <ListGroup key={ group[0] } group={ props.grouping[ group[1][0].modelType ] } model={ group[1][0].model.data }>
          {
            group[1].map( media =>
              <ListItem
                { ...media }
                key={ media.id }
                onSelect={ () => props.onSelect( media.id ) }
                selected={ props.selection === media.id } />
            )
          }
        </ListGroup>
      ) )
    }
  </div>

);

export default List;