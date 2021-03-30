import React, { Component, Fragment } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink, Redirect, Route, Switch } from "react-router-dom";
import Moment from "moment";

import * as actions from "../actions";
import ClassroomsApi from '../api/classrooms';
import {
  UserBadge,
  ErrorHandler,
  ActivityIndicator,
  ClassroomFiles as Files,
  ClassroomOverview as Overview,
  ClassroomDiscussions as Discussions,
} from '../components';
import ParticipantsList from '../components/classroom/ParticipantsList';

import Parser from 'html-react-parser';

class Classroom extends Component {

  constructor(props) {
    super(props);
    let classroom = props.classrooms.data.filter(classroom => classroom.slug === props.match.params.slug)[0];
    this.state = {
      error: false,
      fetching: false,
      classroom: classroom ? Object.assign({}, classroom) : null,
    };
    this.api = new ClassroomsApi;
  }

  componentDidMount() {
    if (
      this.props.classrooms.cache.classroom.data
      && (this.props.classrooms.cache.classroom.data.slug === this.props.match.params.slug)
      && Moment().isBefore(this.props.classrooms.cache.classroom.timestamp.add(1, 'hour'))
    ) {
      this.validate(Object.assign({}, this.props.classrooms.cache.classroom.data));
    } else {
      this.props.actions.clearClassroomCache();
    }
    return this.load();
  }

  load() {
    if (this.state.fetching)
      return;

    this.setState({ fetching: true, error: false });

    return this.api.show({
      id: this.props.match.params.slug,
      params: {},
      cb: data => {
        this.validate(data.data);
        this.props.actions.cacheClassroom(data.data);
      },
      err: e => this.setState({ error: Object.assign({}, e.response), fetching: false }),
    });
  }

  validate(data) {
    this.setState({ classroom: data, fetching: false });
  }

  render() {
    if (this.state.error && this.state.error.status === 403)
      return (
        <ErrorHandler
          message="You are not authorized to access this classroom."
          icon="lock" />
      );

    return (
      <Fragment>
        {this.state.fetching && this.state.classroom === null && <ActivityIndicator padded />}
        <div className={'fade' + (this.state.classroom !== null ? ' show' : '')}>
          {
            this.state.classroom !== null &&
            (
              <Fragment>
                <div className="bg-white pt-5">
                  <div className="pt-3 border-bottom">
                    <div className="container">
                      <div className="pb-5">
                        <h1 className="mb-2">{this.state.classroom.title}</h1>
                        <div className="mb-3">
                          <div className="lead"> {Parser(this.state.classroom.description)} </div>
                        </div>
                        {/* <div>
                          <div>
                            {
                              this.state.classroom.teachers.data.map(teacher => (
                                <UserBadge key={teacher.user.data.username} {...teacher.user.data} />
                              ))
                            }
                          </div>
                        </div> */}
                      </div>

                      <nav className="nav nav-tabs" style={{ marginBottom: -1 }}>
                        <NavLink exact to={"/classroom/" + this.props.match.params.slug} className="nav-item nav-link">Kelas</NavLink>
                        <NavLink to={"/classroom/" + this.props.match.params.slug + "/discussions"} className="nav-item nav-link">Diskusi</NavLink>
                        <NavLink to={"/classroom/" + this.props.match.params.slug + "/files"} className="nav-item nav-link">File</NavLink>
                        {
                          this.state.classroom.self.data.role === 'teacher' &&
                          (
                            <Fragment>
                              <NavLink to={"/classroom/" + this.props.match.params.slug + "/participants"} className="nav-item nav-link">Partisipan</NavLink>
                              {/* <NavLink to={"/classroom/" + this.props.match.params.slug + "/stats"} className="nav-item nav-link">Statistik</NavLink> */}
                            </Fragment>
                          )
                        }
                      </nav>
                    </div>
                  </div>
                </div>

                <div className="container py-5">

                  {this.state.fetching && this.state.classroom === null && <ActivityIndicator padded />}
                  {
                    !this.state.fetching && this.state.error &&
                    (
                      <div className="text-muted d-flex flex-column align-items-center py-5">
                        <div className="display-1 mb-3"><i className="fas fa-meh"></i></div>
                        <div className="h5"> Maaf, kami gagal menunjukkan kelas Anda. :( <a href="#" className="text-link"> Ulang </a></div>
                      </div>
                    )
                  }

                  {
                    this.state.classroom !== null && !this.state.error &&
                    (
                      <Switch>
                        <Route exact path="/classroom/:slug" render={route =>
                          <Overview
                            {...route}
                            actions={this.props.actions}
                            classroom={this.state.classroom}
                            cache={this.props.classrooms.cache} />
                        } />
                        <Route path="/classroom/:classroom/discussions" render={route =>
                          <Discussions
                            {...route}
                            {...this.state.classroom}
                            cache={this.props.classrooms.cache}
                            actions={this.props.actions} />
                        } />
                        <Route path="/classroom/:classroom/files" render={route =>
                          <Files
                            {...route}
                            {...this.state.classroom}
                            cache={this.props.classrooms.cache.files}
                            actions={this.props.actions} />
                        } />
                        {
                          this.state.classroom.self.data.role === 'teacher' &&
                          <Route path="/classroom/:classroom/participants" render={route =>
                            <ParticipantsList {...route} classroom={this.state.classroom} cache={this.props.classrooms.cache} actions={this.props.actions} />
                          } />
                        }

                        <Redirect to={"/classroom/" + this.props.match.params.slug} />
                      </Switch>
                    )
                  }
                </div>
              </Fragment>
            )
          }
        </div>
      </Fragment>
    );
  }

}

export default connect(
  state => ({ classrooms: state.classrooms }),
  dispatch => ({ actions: bindActionCreators(actions, dispatch) })
)(Classroom);