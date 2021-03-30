import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
import Form from '../components/admin/Form';
// 
import * as actions from "../actions";

const Home = props => (
  <div className="container py-5">
     <Switch>
        <Route path="/admin/new" component={ Form } />
      </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Home );

export default Home;