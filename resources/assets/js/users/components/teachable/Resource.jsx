import React, { Component } from 'react';
import { CancelToken, isCancel } from 'axios';
import Moment from 'moment';

import TeachableUsersApi from "../../api/teachableUsers";
import JWVideoResource from './JWVideoResource';
import DocumentsResource from './DocumentsResource';
import AudioResource from './AudioResource';
import ExternalLinkResource from './ExternalLinkResource';
import YoutubeVideoResource from './YoutubeVideoResource';
import LinkVideoResource from './LinkVideoResource';

class TeachableResource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completing: false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new TeachableUsersApi;
  }

  componentDidMount() {
    if ( this.props.teachableUser.teachable.data.teachableItem.data.type === 'documents' )
      return this.complete();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  complete() {
    if ( this.state.completing )
      return;

    let data = new FormData();
    data.append( 'context', 'completion' );
    return this.api.update({
      id: this.props.teachableUser.id,
      data,
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.setState({ completing: false });
        this.props.onUpdate( data.data );
      },
      err: e => {
        if ( isCancel( e ) )
          return;
        this.setState({ completing: false });
        this.complete();
      }
    })
  }

  render() {
    if ( Moment( this.props.teachableUser.teachable.data.expiresAt ).isBefore() )
      return (
        <div className="bg-dark text-light h3 mb-5 p-5 text-center">
          This resource is no longer available.
        </div>
      );

    let resourceComponent = null;
    let propsForResourceComponent = {
      ...this.props.teachableUser.teachable.data.teachableItem.data,
      onComplete: () => this.complete()
    }
    switch ( this.props.teachableUser.teachable.data.teachableItem.data.type ) {
      case 'jwvideo':
        resourceComponent = <JWVideoResource { ...propsForResourceComponent } />; break;
      case 'youtubevideo':
        resourceComponent = <YoutubeVideoResource { ...propsForResourceComponent } />; break;
      case 'linkvideo':
        resourceComponent = <LinkVideoResource { ...propsForResourceComponent } />; break;
      case 'audio':
        resourceComponent = <AudioResource { ...propsForResourceComponent } />; break;
      case 'documents':
        resourceComponent = <DocumentsResource { ...propsForResourceComponent } />; break;
      case 'url':
        resourceComponent = <ExternalLinkResource { ...propsForResourceComponent } />; break;
    }

    return (
      <div>
        <div style={{ minHeight: '200px' }} className="d-flex justify-content-center align-items-center bg-dark text-muted mb-4">
          { resourceComponent || <div>This is where the (action to) resource will be displayed</div> }
        </div>
      </div>
    );
  }

}

export default TeachableResource;