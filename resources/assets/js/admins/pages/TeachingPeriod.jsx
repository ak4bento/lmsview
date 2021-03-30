import React from 'react';
import { Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/teaching-period/Main';
import TeachingPeriodForm from '../components/teaching-period/TeachingPeriodForm';

// import * as actions from "../actions";

const TeachingPeriod = props => (
  <div className="col-md-9 col-lg-10 padding-tb-2">
    <Switch>
      <Route exact path="/teaching-period" component={ Main } />
      <Route exact path="/teaching-period/new" component={ TeachingPeriodForm } />
      <Route exact path="/teaching-period/:id/edit" component={ TeachingPeriodForm } />
    </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( TeachingPeriod );
export default TeachingPeriod;