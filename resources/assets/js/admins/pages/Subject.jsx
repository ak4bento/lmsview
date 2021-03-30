import React from 'react';
import { Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/subject/Main';
import SubjectForm from '../components/subject/SubjectForm';

// import * as actions from "../actions";

const Subject = props => (
  <div className="col-md-9 col-lg-10 padding-tb-2">
    <Switch>
      <Route exact path="/subject" component={ Main } />
      <Route exact path="/subject/new" component={ SubjectForm } />
      <Route exact path="/subject/:id/edit" component={ SubjectForm }/>
    </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Subject );
export default Subject;
