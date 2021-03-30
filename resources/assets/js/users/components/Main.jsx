import React, { Component } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import * as Pages from '../pages';
import Navbar from './Navbar';

class Main extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router basename="/">
        <div>
          <Navbar />

          <main>
            <Switch>
              <Route path="/home" component={Pages.Home} />
              <Route path="/classroom/:classroom/teachable/create/:type" component={Pages.CreateTeachable} />
              <Route path="/classroom/:classroom/teachable/:id/edit" component={Pages.EditTeachable} />
              <Route path="/classroom/:classroom/teachable/:id" component={Pages.Teachable} />
              <Route path="/classroom/:classroom/participants/:id" component={Pages.Participant} />
              <Route path="/classroom/:slug" component={Pages.Classroom} />
              <Route path="/profile" component={Pages.Profile} />
              <Redirect to="/home" />
            </Switch>
          </main>
        </div>

      </Router>
    );
  }
}

export default Main;
