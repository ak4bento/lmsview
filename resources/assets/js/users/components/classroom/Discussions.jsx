import React, { Component } from 'react';

import DiscussionsComponent from "../discussion/Main";
import DiscussionThreads from './DiscussionThreads';

class Discussions extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div className="row">
        <div className="col-8">

          <DiscussionsComponent
            context="classroom"
            contextData={ this.props.match.params.classroom }
            cache={ this.props.cache.discussions.classroom === this.props.match.params.classroom ? this.props.cache.discussions : null }
            putToCache={ discussions => this.props.actions.cacheClassroomDiscussions( { classroom: this.props.match.params.classroom, discussions } ) } />

        </div>
        <div className="col-4">
          <DiscussionThreads classroom={ this.props.match.params.classroom } cache={ this.props.cache.classroom } cacheClassroom={ this.props.actions.cacheClassroom } />
        </div>
      </div>
    );
  }
}

export default Discussions;