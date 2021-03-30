import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

import * as Pages from '../components/teachableCreate'

const CreateTeachable = props => (

  <div className="container py-5">
    <Switch>
      <Route path="/classroom/:classroom/teachable/create/assignment" component={Pages.Assignment} />
      <Route path="/classroom/:classroom/teachable/create/resource" component={Pages.Resource} />
      <Route path="/classroom/:classroom/teachable/create/quiz" component={Pages.Quiz} />

      <Redirect to={"/classroom/" + props.match.params.classroom} />
    </Switch>
  </div>

);

export default CreateTeachable;