import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from "react-router-dom";
import QueryString from "query-string";
import { upperFirst } from "lodash";

import * as actions from "../actions";
import TeachableUsersApi from "../api/teachableUsers";
import CompletionStatus from '../components/teachable/CompletionStatus';
import Breadcrumb from '../components/Breadcrumb';
import {
  UserBadge,
  MediaWidget,
  Discussions,
  ErrorHandler,
  TeachableQuiz,
  ActivityIndicator,
  TeachableResource,
  TeachableAssignment,
  TeachableQuizAttempt,
} from '../components';

import Parser from 'html-react-parser';

class TeachableStudent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      fetching: false,
      teachableUser: {
        teachable: {
          data: {
            classroom: (props.classrooms.cache.classroom.data && props.classrooms.cache.classroom.data.slug === props.match.params.classroom) ?
              Object.assign({}, props.classrooms.cache.classroom) : null,
          }
        }
      },
    };
    this.api = new TeachableUsersApi;
  }

  componentDidMount() {
    return this.load();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.search === this.props.location.search)
      return;

    if (QueryString.parse(nextProps.location.search).reload === 'true') return this.load();
  }

  load() {
    if (this.state.fetching)
      return;

    this.setState({ fetching: true, error: false });
    return this.api.store({
      data: {
        classroom: this.props.match.params.classroom,
        teachable: this.props.match.params.id,
      },
      cb: data => {
        this.validate(data.data);
      },
      err: e => this.setState({ fetching: false, error: Object.assign({}, e.response) })
    });
  }

  validate(data) {
    this.setState({ teachableUser: Object.assign({}, data), fetching: false });
  }

  render() {
    if (this.state.error)
      if (this.state.error.status === 403)
        return <ErrorHandler icon="lock" message="You are not permitted to access this page." />

    return (
      <div className="container py-5">

        {
          <Breadcrumb items={[
            { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
            { label: this.state.teachableUser.teachable.data.type ? upperFirst(this.state.teachableUser.teachable.data.type) : 'Loading..' }
          ]} />
        }
        {!this.state.teachableUser.teachable.data.classroom && this.state.fetching && <ActivityIndicator padded />}

        <div className={"fade" + (this.state.teachableUser.teachable.data.teachableItem ? ' show' : '')}>

          {
            this.state.teachableUser.teachable.data.teachableItem &&
            (
              <Switch>
                <Route exact path="/classroom/:classroom/teachable/:id" render={route => {
                  let teachableItemView = null;
                  if (this.state.teachableUser.id)
                    switch (this.state.teachableUser.teachable.data.type) {
                      case 'resource':
                        teachableItemView = <TeachableResource teachableUser={this.state.teachableUser} onUpdate={data => this.validate(data)} />; break;
                      case 'quiz':
                        teachableItemView = <TeachableQuiz teachableUser={this.state.teachableUser} {...route} />; break;
                      case 'assignment':
                        teachableItemView = <TeachableAssignment teachableUser={this.state.teachableUser} onUpdate={data => this.validate(data)} />; break;
                    }

                  return (
                    <Fragment>
                      {teachableItemView && <div className="mb-5">{teachableItemView}</div>}

                      {
                        this.state.teachableUser.teachable.data.teachableItem &&
                        (
                          <div className="row">
                            <div className="col-md-8 order-md-1 order-2">
                              <div className="mb-5">
                                {this.state.teachableUser.teachable.data.teachableItem.data.title && <div className="h3">{this.state.teachableUser.teachable.data.teachableItem.data.title}</div>}
                                <div className="mb-4">{Parser(this.state.teachableUser.teachable.data.teachableItem.data.description)}</div>

                                <div className="d-flex align-items-center">
                                  <UserBadge accent="white" {...this.state.teachableUser.teachable.data.createdBy.data} />
                                  <div className="text-muted">
                                    <i className="fas fa-clock"></i> {this.state.teachableUser.teachable.data.createdAtForHumans}
                                  </div>
                                </div>
                              </div>

                              <div id="discussions">
                                <Discussions context="teachable" contextData={this.props.match.params.id} showHeader />
                              </div>
                            </div>

                            <div className="col-md-4 order-md-2 order-1">
                              <div className="mb-5">
                                <CompletionStatus
                                  complete={this.state.teachableUser.completedAt}
                                  teachableType={this.state.teachableUser.teachable.data.type}
                                  teachableItemType={this.state.teachableUser.teachable.data.teachableItem.data.type} />
                              </div>

                              {
                                this.state.teachableUser.teachable.data.teachableItem.data.type !== 'documents' &&
                                this.state.teachableUser.teachable.data.teachableItem.data.media &&
                                this.state.teachableUser.teachable.data.teachableItem.data.media.data.length > 0 &&
                                (
                                  <div className="mb-5">
                                    <MediaWidget data={this.state.teachableUser.teachable.data.teachableItem.data.media.data} />
                                  </div>
                                )
                              }
                            </div>
                          </div>
                        )
                      }
                    </Fragment>
                  );
                }} />
                <Route exact path="/classroom/:classroom/teachable/:id/attempt" component={TeachableQuizAttempt} />

                <Redirect to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id} />
              </Switch>
            )
          }

        </div>
      </div>
    );

  }

}

export default TeachableStudent;