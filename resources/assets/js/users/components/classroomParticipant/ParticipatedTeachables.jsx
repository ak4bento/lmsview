import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Moment from "moment";

import TeachableUsersApi from "../../api/teachableUsers";
import ServiceAccessor from "../ServiceAccessor";
import Widget from "./Widget";

class ParticipatedTeachables extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teachableUsers: [],
      expanded:       false,
    };
    this.expandThreshold = 5;
  }

  render() {
    return (
      <Widget>
        <div className="h6 text-uppercase mb-4 px-4">
          Participated in Tasks
          { this.state.teachableUsers.length > 0 && <span className="badge badge-secondary badge-pill ml-2">{ this.state.teachableUsers.length }</span> }
        </div>
        <ServiceAccessor
          api={ TeachableUsersApi }
          call={{ type: 'index', params: { context: 'classroomUser', classroomUser: this.props.match.params.id } }}
          hasData={ this.state.teachableUsers.length > 0 }
          onValidate={ teachableUsers => this.setState({ teachableUsers }) }>

          <div>
            {
              this.state.teachableUsers.length > 0 ?
              this.state.teachableUsers.map( ( teachableUser, index ) =>
                index < this.expandThreshold || this.state.expanded ? (
                  <div key={ teachableUser.id } className={ "py-3 px-4" + ( index < this.state.teachableUsers.length - 1 ? ' border-bottom' : '' ) }>
                    <div>
                      <Link className="text-dark text-link" to={ '/classroom/' + this.props.match.params.classroom + '/teachables/' + teachableUser.teachable.data.id + '/participants' }>
                        { teachableUser.teachable.data.teachableItem.data.title }
                      </Link>
                    </div>
                    <div className={ "small" + ( teachableUser.completedAt ? ' text-success' : ' text-muted' ) }>
                      { teachableUser.completedAt ? 'Completed ' + Moment( teachableUser.completedAt ).fromNow() : 'Not completed' }
                    </div>
                  </div>
                ) : null
              ) :
              <div>No tasks</div>
            }
          </div>
        </ServiceAccessor>
        {
          !this.state.expanded && this.state.teachableUsers.length > this.expandThreshold && (
            <button type="button" onClick={ () => this.setState({ expanded: true }) } className="btn btn-link px-4">See all</button>
          )
        }
      </Widget>
    );
  }
}

export default ParticipatedTeachables;