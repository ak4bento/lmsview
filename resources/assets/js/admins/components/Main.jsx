import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import Navbar from './Navbar';
import Sidebar from './Sidebar';

import Home from '../pages/Home';
import Admin from '../pages/Admin';
import Student from '../pages/Student';
import Teacher from '../pages/Teacher';
import TeachingPeriod from '../pages/TeachingPeriod';
import Classroom from '../pages/Classroom';
import Subject from '../pages/Subject';
import Category from '../pages/Category';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router basename="/">
        <div>
          <Navbar />

          <section id="content" className="grey-bg">
            <div className="row no-gutters align-content-stretch min-100">
              <Sidebar />
              <Switch>
                <Route exact path="/" component={ Home } />
                <Route path="/student" component={ Student } />
                <Route path="/teacher" component={ Teacher } />
                <Route path="/teaching-period" component={ TeachingPeriod } />
                <Route path="/classroom" component={ Classroom } />
                <Route path="/subject" component={ Subject } />
                <Route path="/category" component={ Category } />
              </Switch>
            </div>
          </section>
        </div>

      </Router>
    );
  }
}

export default Main;
