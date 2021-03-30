import React, { Component } from 'react';
import { CancelToken, isCancel } from 'axios';
import Moment from "moment";

import { getJWPlayerVideos } from "../../api/misc";
import ActivityIndicator from "../ActivityIndicator";

class ResourceJWVideo extends Component {

  constructor(props) {
    super(props);
    this.state = {
      term: '',
      searchResults: [],
      selection: null,
      searching: false,
      error: false,
    };
    this.searchLagPromise = null;
    this.cancelRequestHandler = CancelToken.source();
  }

  search( term ) {
    this.setState( () => ({ term }) );

    this.searchLagPromise && clearTimeout( this.searchLagPromise ) && this.cancelRequestHandler.cancel();
    this.setState(() => ({ searching: false }));
    if ( term.length > 0 ) {
      this.searchLagPromise = setTimeout( () => {
        this.searchLagPromise = null;
        this.load();
      }, 1000 );
      return;
    }
    return this.setState({ searchResults: [] });
  }

  load() {
    this.setState({ error: false, searching: true });
    return getJWPlayerVideos({
      term: this.state.term,
      cb: data => this.setState({ searchResults: data.data.slice( 0 ), searching: false }),
      err: e => !isCancel( e ) && this.setState({ error: true, searching: false }),
      cancelToken: this.cancelRequestHandler.token,
    });
  }

  removeSelection() {
    this.setState({ selection: null });
    return this.props.onUpdate({});
  }

  select( selection ) {
    this.setState({ selection, term: '', searchResults: [] });
    return this.props.onUpdate({ videoId: selection.key });
  }

  render() {
    return (
      <div className="px-4">
        {
          this.state.selection ?
          (
            <div className="rounded border mb-4" style={{ overflow: 'hidden', position: 'relative' }}>
              <img src={ 'http://content.jwplatform.com/thumbs/' + this.state.selection.key + '-1280.jpg' } alt={ this.state.selection.title } className="w-100" />
              <div className="p-4">
                <div className="h3">{ this.state.selection.title }</div>
                <div className="text-muted"><i className="fas fa-clock"></i> { Moment.duration( this.state.selection.duration * 1000 ).humanize() }</div>
              </div>

              <a href="#" onClick={ e => { e.preventDefault(); this.removeSelection(); } } className="text-link text-danger h3" style={{ position: 'absolute', top: 16, right: 16 }}><i className="fas fa-times"></i></a>
            </div>
          ) : (
            <div className="form-group">
              <input type="text" className="form-control" placeholder="Type here to search uploaded videos.." value={ this.state.term } onChange={ e => this.search( e.target.value ) } />
              { this.state.searching && <ActivityIndicator size="small" padded /> }
              {
                this.state.searchResults.length > 0 &&
                (
                  <div className="list-group">
                    {
                      this.state.searchResults.map( ( video, index ) => (
                        <div
                          key={ video.key }
                          className={ "list-group-item list-group-item-action d-flex" + ( index === 0 ? ' border-top-0 rounded-0' : '' ) }
                          onClick={ () => this.select( video ) }
                          style={{ cursor: 'pointer' }}>
                          <div className="d-flex justify-content-center mr-3" width="70" style={{ overflow: 'hidden' }}>
                            <img src={ 'http://content.jwplatform.com/thumbs/' + video.key + '-1280.jpg' } alt={ video.title } height="50" className="border" />
                          </div>
                          <div>
                            <div>{ video.title }</div>
                            <div className="text-muted">{ Moment.duration( video.duration * 1000 ).humanize() }</div>
                          </div>
                        </div>
                      ) )
                    }
                  </div>
                )
              }
            </div>
          )
        }

        <div className="text-muted small">Please contact our staff to upload videos to JWPlayer.</div>
      </div>
    );
  }
}

export default ResourceJWVideo;
