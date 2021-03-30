import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";
import Moment from 'moment';

import MediaApi from "../../api/media";
import ActivityIndicator from "../ActivityIndicator";
import MediaWidget from "../media/Widget";

class FilesWidget extends Component {

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      error: false,
      media: [],
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new MediaApi;
  }

  componentDidMount() {
    this.props.cache.data
      && this.props.cache.classroom === this.props.classroom
      && this.validate( this.props.cache.data );
    return this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  load() {
    if ( this.state.fetching ) return;

    this.setState({ fetching: true, error: false });
    return this.api.index({
      params: {
        context: 'classroom',
        classroom: this.props.classroom,
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.validate( data.data.slice(0) );
        this.props.onCache( data.data.slice(0) );
      },
      err: e => !isCancel( e ) && this.setState({ fetching: false, error: true })
    });
  }

  validate( media ) {
    this.setState({ media, fetching: false });
  }

  render() {
    return (
      <Fragment>
        { this.state.media.length === 0 && this.state.fetching && <ActivityIndicator size="small" /> }
        <div className={ 'fade' + ( this.state.media.length > 0 ? ' show' : '' ) }>
          {
            this.state.media.length > 0 &&
            <MediaWidget data={ this.state.media } countThreshold={ 5 } moreLink={ '/classroom/' + this.props.classroom + '/files' } />
          }
        </div>
      </Fragment>
    );
  }
}

export default FilesWidget;