import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as Pages from './';
import QuizCreate from './QuizCreate';

import ServiceAccessor from '../ServiceAccessor';
import ActivityIndicator from '../ActivityIndicator';

import QuizApi from '../../api/quiz';

class Quiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      quiz: {}
    }
  }

  render() {
    return (
      <div className="container">
        <Switch>
          <Route path="/classroom/:classroom/teachable/create/quiz/new" component={Pages.QuizCreate} />

          <Redirect to={"/classroom/" + this.props.match.params.classroom + "/teachable/create/quiz/new"} />
        </Switch>
      </div>
    )
  }
}

export default Quiz;