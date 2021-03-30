import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { upperFirst } from "lodash";
import Moment from "moment";

import ServiceAccessor from "../ServiceAccessor";
import ClassroomUsersApi from "../../api/classroomUsers";
import { default as Pagination, withinPage } from '../Pagination';
import ParticipantsListItem from './ParticipantsListItem';

class ParticipantsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      classroomUsers: [],
      page: 0,
    };
    this.perPage = 10;
  }

  render() {
    return (
      <ServiceAccessor
        api={ClassroomUsersApi}
        call={{ type: 'index', params: { context: 'classroom', classroom: this.props.classroom.slug } }}
        cache={this.props.cache.participants}
        onCache={participants => this.props.actions.cacheClassroomParticipants({ classroom: this.props.classroom.slug, participants })}
        hasData={this.state.classroomUsers.length > 0}
        onValidate={classroomUsers => {
          this.setState(() => ({ classroomUsers }));
        }}>

        <div className="d-flex align-items-center justify-content-between mb-4">
          <div></div>
          <div className="text-right">
            <Pagination
              showStatus
              data={this.state.classroomUsers}
              onNavigate={page => this.setState({ page })}
              perPage={this.perPage}
              page={this.state.page}
              users="users" />
          </div>
        </div>

        <table className="table table-hover">
          <thead className="small text-uppercase">
            <tr>
              <th>Participant</th>
              <th style={{ width: 150 }}>Role</th>
              <th style={{ width: 150 }}>Enrolled</th>
            </tr>
          </thead>
          <tbody>
            {
              this.state.classroomUsers.filter((user, index) => withinPage({ index, page: this.state.page, perPage: this.perPage }))
                .map(classroomUser => <ParticipantsListItem key={classroomUser.user.data.username} classroom={this.props.match.params.classroom} {...classroomUser} />)
            }
          </tbody>
        </table>

      </ServiceAccessor>
    );
  }

}

export default ParticipantsList;