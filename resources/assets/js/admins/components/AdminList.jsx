import React, { Component } from 'react';
import moment from 'moment';

import Loader from '../../components/Loader.jsx';

class AdminList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="border-box p-2 rounded shadowed white-bg">

        {
          !this.props.isLoading ?

            this.props.classrooms.map((classroom) =>
              <div className="d-block p-2">
                <p> {classroom.title} {classroom.start_at ? <span className="d-inline-block small opacity-half"> <i className="fa fa-clock-o"> </i> {moment(classroom.start_at).locale('id').fromNow()}  </span> : ''} </p>
              </div>
            )

            :
            <Loader />
        }

      </div>
    )
  }
}
export default AdminList;