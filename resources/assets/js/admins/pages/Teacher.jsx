import React from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';

import Main from '../components/teacher/Main';
import TeacherForm from '../components/teacher/TeacherForm';
import Classrooms from '../components/teacher/Classrooms';

// import * as actions from "../actions";

const Teacher = props => (
    <div className="col-md-9 col-lg-10 padding-tb-2">
        <Switch>
            <Route exact path="/teacher" component={Main} />
            <Route exact path="/teacher/new" component={TeacherForm} />
            <Route exact path="/teacher/:id/edit" component={TeacherForm} />
            <Route exact path="/teacher/:id/:context" component={Classrooms} />
        </Switch>
    </div>
);

// export default connect(
//     state => ({}),
//     dispatch => ({ actions: bindActionCreators( actions, dispatch )})
// )( Teacher );
export default Teacher;
