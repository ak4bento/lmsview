import React, { Component } from 'react';
import { upperFirst } from "lodash";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from "../actions";
import ClassroomUsersApi from "../api/classroomUsers";
import UserAvatar from "../components/UserAvatar";
import Breadcrumb from "../components/Breadcrumb";
import ServiceAccessor from "../components/ServiceAccessor";
import ParticipatedTeachables from "../components/classroomParticipant/ParticipatedTeachables";
import Progress from '../components/classroomParticipant/Progress';

class Participant extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classroomUser: null,
    };
  }
  render() {
    return (
      <div className="container py-5">

        <Breadcrumb items={[
          { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
          { link: '/classroom/' + this.props.match.params.classroom + '/participants', label: 'Participants' },
          { label: this.state.classroomUser ? this.state.classroomUser.user.data.name : 'Loading..' }
        ]} />

        <ServiceAccessor
          api={ ClassroomUsersApi }
          dataType="item"
          hasData={ this.state.classroomUser !== null }
          call={{ type: 'show', id: this.props.match.params.id }}
          onValidate={ classroomUser => this.setState({ classroomUser }) }>

          {
            this.state.classroomUser &&
            (
              <div className="row">
                <div className="col-4">
                  <div className="mb-5">
                    <div className="mb-3">
                      <UserAvatar { ...this.state.classroomUser.user.data } size="x-large" />
                    </div>
                    <div className="h2 mb-2">{ this.state.classroomUser.user.data.name }</div>
                    <div className="h5 text-muted">@{ this.state.classroomUser.user.data.username }</div>
                    <div className="text-muted">{ upperFirst( this.state.classroomUser.role ) }</div>
                  </div>
                  <Progress
                    teachables={ this.state.classroomUser.classroom.data.teachables.data }
                    completedTeachables={ this.state.classroomUser.teachableUsers.data.filter( teachableUser => teachableUser.completedAt ) } />
                </div>
                <div className="col-4">
                  <ParticipatedTeachables { ...this.props } />
                </div>
                <div className="col-4"></div>
              </div>
            )
          }

        </ServiceAccessor>
      </div>
    );
  }
}

export default connect(
  state => ({ classrooms: state.classrooms }),
  dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
)( Participant );