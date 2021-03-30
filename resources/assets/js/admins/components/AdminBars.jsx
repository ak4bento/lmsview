import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";

class AdminBars extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="d-block">
        <div className="strong"> {this.props.labelBar} </div>
        <div className="progress">
          <div className={"progress-bar " + this.props.type} role="progressbar" style={{ width: (this.props.progress + "%") }} aria-valuenow={this.props.progress} aria-valuemin="0" aria-valuemax="100"> {this.props.progress} % </div>
        </div>
      </div>
    )
  }
}

export default AdminBars;