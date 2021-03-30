import React from 'react';
import { Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/student/Main';
import StudentForm from '../components/student/StudentForm';
import Classrooms from '../components/student/Classrooms';

// import * as actions from "../actions";

const Student = props => (
  <div className="col-md-9 col-lg-10 padding-tb-2">
    <Switch>
      <Route exact path="/student" component={ Main } />
      <Route exact path="/student/new" component={ StudentForm } />
      <Route exact path="/student/:id/edit" component={ StudentForm } />
      <Route exact path="/student/:id/:context" component={ Classrooms } />
    </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Student );
export default Student;