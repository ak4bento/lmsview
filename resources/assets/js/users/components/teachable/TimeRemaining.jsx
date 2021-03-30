import React, { Component } from 'react';
import Moment from "moment";

class TimeRemaining extends Component {

  constructor(props) {
    super(props);
    this.state = {
      timeRemaining: null
    };
    this.expiresAt = new Moment(this.props.expiresAt);
  }

  componentDidMount() {
    this.recalculateTimeRemaining();
    this.recalculateInterval = setInterval(() => this.recalculateTimeRemaining(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.recalculateInterval);
  }

  recalculateTimeRemaining() {
    this.setState({ timeRemaining: Moment.duration(this.expiresAt.diff(new Moment())) });
  }

  render() {
    return (
      <div className="bg-dark px-3 py-3 d-flex flex-md-row flex-column justify-content-start align-items-md-center align-items-start rounded-top">
        <div className="text-light h4 m-0 mr-2">
          {this.expiresAt.isAfter() ? 'Pengerjaan ditutup' : 'Jatuh tempo pengerjaan'}
        </div>
        <div className={"h4 m-0" + (this.expiresAt.isAfter() ? ' text-warning' : ' text-danger')}>
          {this.state.timeRemaining && this.state.timeRemaining.locale('id').humanize(true)}
          <span className="small ml-2">({this.expiresAt.format('ddd, D MMM Y, HH:mm')})</span>
        </div>
      </div>
    );
  }
}

export default TimeRemaining;