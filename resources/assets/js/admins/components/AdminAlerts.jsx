import React, { Component } from 'react';

class AdminAlerts extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (

      <div className={"row mx-0 " + (this.props.alert > 0 ? '' : ('text-' + this.props.statstype))}>
        <div className="d-inline-block">
          <i className="fa fa-bell"></i>
        </div>
        <div>
          <span className="d-inline-block px-2">{this.props.alert} </span>
          <p className="d-inline-block">
            {this.props.label}
          </p>
        </div>
      </div>

    )
  }
}

export default AdminAlerts;