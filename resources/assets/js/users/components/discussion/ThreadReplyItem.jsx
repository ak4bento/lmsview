import React, { Component } from 'react';
import renderHTML from "react-render-html";
import Moment from "moment";

class ThreadReplyItem extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="mb-3">
        <div className="text-muted">
          <span className="mr-3"><strong>{ this.props.user.data.name }</strong></span>
          <span className="mr-3"><i className="fas fa-clock"></i> { Moment( this.props.createdAt ).format( Moment( this.props.createdAt ).isSame( Moment(), 'day' ) ? 'H:mm' : 'D MMM Y' ) }</span>
        </div>
        <div>
          { renderHTML( this.props.message ) }
        </div>
      </div>
    );
  }
}

export default ThreadReplyItem;