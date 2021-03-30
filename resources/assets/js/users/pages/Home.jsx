import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../actions";
import { ClassroomList } from '../components';

const Home = props => (
  <div className="container py-5">

    <div className="row">
      <div className="col-lg-8">
        <ClassroomList { ...props.classrooms } onGetClassrooms={ props.actions.getClassrooms } />
      </div>
    </div>
  </div>
);

export default connect(
  state => ({ classrooms: state.classrooms }),
  dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
)( Home );