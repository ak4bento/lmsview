import React from 'react';
import { Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/classroom/Main';
import ClassroomForm from '../components/classroom/ClassroomForm';
import Users from '../components/classroom/Users';

// import * as actions from "../actions";

const Classroom = props => (
  <div className="col-md-9 col-lg-10 padding-tb-2">
    <Switch>
      <Route exact path="/classroom" component={ Main } />
      <Route exact path="/classroom/new" component={ ClassroomForm } />
      <Route exact path="/classroom/:slug/edit" component={ ClassroomForm } />
      <Route exact path="/classroom/:slug/:context" component={ Users } />
    </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Classroom );
export default Classroom;