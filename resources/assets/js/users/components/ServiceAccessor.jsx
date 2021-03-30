import React, { Component } from 'react';
import PropTypes from "prop-types";
import { CancelToken, isCancel } from "axios";
import Moment from "moment";
import ActivityIndicator from './ActivityIndicator';
import ErrorHandler from './ErrorHandler';

class ServiceAccessor extends Component {

  constructor( props ) {
    super( props );
    this.state = {
      error:    false,
      fetching: false,
    };
    this.api = new props.api;
    this.cancelRequestHandler = CancelToken.source();
  }

  componentDidMount() {
    this.props.cache
    && this.props.cache.data
    && this.validate( this.props.cache.data.slice(0) );

    return this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  load() {
    if ( this.state.fetching ) return;

    this.setState({ fetching: true, error: false });
    return this.api[ this.props.call.type ]({
      id: this.props.call.id,
      params: this.props.call.params,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.validate( this.props.dataType === 'item' ? Object.assign( {}, data.data ) : data.data.slice( 0 ) );
        this.props.onCache && this.props.onCache( data.data );
      },
      err: e => {
        if ( !isCancel( e ) ) {
          this.setState({ fetching: false, error: Object.assign( {}, e ) });
          this.props.onError && this.props.onError( e );
        }
      }
    });
  }

  validate( data ) {
    this.setState({ fetching: false });
    this.props.onValidate( data );
  }

  render() {
    if ( this.state.fetching && !this.props.hasData )
      return this.props.fetchingRender || <ActivityIndicator />;

    if ( this.state.error )
      return this.props.errorRender || <ErrorHandler message="Failed fetching data from server" retryAction={ this.load.bind( this ) } />

    return this.props.hasData ? this.props.children : null;
  }

}

ServiceAccessor.propTypes = {
  api:      PropTypes.any.isRequired,
  call:     PropTypes.shape({
    id:     PropTypes.node,
    type:   PropTypes.string.isRequired,
    params: PropTypes.object,
  }),
  cache:    PropTypes.shape({
    data:       PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    timestamp:  PropTypes.instanceOf( Moment )
  }),
  hasData:    PropTypes.bool.isRequired,
  onCache:    PropTypes.func,
  onError:    PropTypes.func,
  dataType:   PropTypes.oneOf([ 'collection', 'item' ]),
  onValidate: PropTypes.func.isRequired
}

export default ServiceAccessor;