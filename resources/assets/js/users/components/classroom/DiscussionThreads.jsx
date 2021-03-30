import React, { Component } from 'react';
import { CancelToken, isCancel } from "axios";

import ThreadsApi from "../../api/threads";
import DiscussionThreadItem from './DiscussionThreadItem';
import helpers from "../../modules/helpers";
import ActivityIndicator from '../ActivityIndicator';

class DiscussionThreads extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      threads: [],
      fetching: false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new ThreadsApi;
  }

  componentDidMount() {
    this.props.cache.data && this.props.cache.data.threads && this.validate(this.props.cache.data.threads);
    return this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  load() {
    if (this.state.fetching) return;

    this.setState({ fetching: true, error: false });
    return this.api.index({
      params: {
        context: 'classroom',
        classroom: this.props.classroom
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.validate(data.data.slice(0));
        this.props.cacheClassroom(Object.assign(this.props.cache.data, { threads: data.data.slice(0) }))
      },
      err: () => this.setState({ fetching: false, error: true })
    });
  }

  validate(threads) {
    this.setState({ threads, fetching: false });
  }

  render() {
    if (this.state.threads.length === 0 && this.state.fetching)
      return <ActivityIndicator size="small" />;

    return (
      <div>
        <div className="h6 mb-3 text-uppercase">Diskusi lainnya</div>
        {
          this.state.threads.length > 0 &&
          (
            <div className="list-group">
              {
                this.state.threads
                  .sort((a, b) => helpers.sortByDate(a.lastActiveAt, b.lastActiveAt))
                  .reverse()
                  .map((thread, index) => <DiscussionThreadItem key={index} {...thread} />)
              }
            </div>
          )
        }
        {this.state.threads.length === 0 && !this.state.fetching && !this.state.error && <div>Tidak ada diskusi</div>}
      </div>
    );
  }

}

export default DiscussionThreads;