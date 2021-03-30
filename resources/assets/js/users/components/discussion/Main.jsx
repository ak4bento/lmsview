import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";
import Moment from "moment";

import ReplyForm from './ReplyForm';
import Thread from './Thread';

import DiscussionsApi from "../../api/discussions";
import ErrorHandler from '../ErrorHandler';
import ActivityIndicator from '../ActivityIndicator';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      fetching: false,
      replyingTo: null,
      discussions: [],
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new DiscussionsApi;
  }

  componentDidMount() {
    this.props.cache && this.validate(this.props.cache.data);
    return this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  load() {
    if (this.state.fetching)
      return;

    this.setState({ fetching: true, error: false });
    return this.api.index({
      params: {
        context: this.props.context,
        [this.props.context]: this.props.contextData,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.validate(data.data.slice(0));
        this.props.putToCache && this.props.putToCache(data.data.slice(0));
      },
      err: e => !isCancel(e) && this.setState({ fetching: false, error: true })
    });
  }

  validate(discussions) {
    return this.setState({ fetching: false, discussions });
  }

  render() {
    return (
      <div>
        {
          this.props.showHeader && (
            this.props.headerContent ||
            (
              <div className="h4 pb-3 mb-4 border-bottom">
                Diskusi
                {this.state.discussions.length > 0 && <span className="badge badge-pill badge-secondary ml-2">{this.state.discussions.length}</span>}
              </div>
            )
          )
        }
        {
          !this.state.replyingTo &&
          (
            <div className="mb-5">
              <ReplyForm onSaved={data => this.validate(data)} {...this.props} />
            </div>
          )
        }

        {this.state.fetching && this.state.discussions.length === 0 && <ActivityIndicator />}
        {this.state.error && <ErrorHandler message="Failed to fetch discussions." retryAction={() => this.load()} />}
        <Thread
          {...this.props}
          {...this.state}
          onStartReply={replyingTo => this.setState({ replyingTo })}
          onCancelReply={() => this.setState({ replyingTo: null })}
          onSaved={data => this.validate(data, this.props.contextData)} />

      </div>
    );
  }
}

export default Main;