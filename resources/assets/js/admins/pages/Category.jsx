import React from 'react';
import { Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/category/Main';
import CategoryForm from '../components/category/CategoryForm';

import * as actions from "../actions";

const Category = props => (
  <div className="col-md-9 col-lg-10 padding-tb-2">
    <Switch>
      <Route exact path="/category" component={ Main } />
      <Route exact path="/category/new" component={ CategoryForm } />
      <Route exact path="/category/:id/edit" component={ CategoryForm }/>
    </Switch>
  </div>
);

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Subject );
export default Category;
