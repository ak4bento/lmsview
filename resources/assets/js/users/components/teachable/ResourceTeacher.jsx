import React, { Component } from 'react';
import { CancelToken, isCancel } from 'axios';

import TeachableUsersApi from "../../api/teachableUsers";
import JWVideoResource from './JWVideoResource';
import DocumentsResource from './DocumentsResource';
import AudioResource from './AudioResource';
import ExternalLinkResource from './ExternalLinkResource';
import YoutubeVideoResource from './YoutubeVideoResource';
import LinkVideoResource from './LinkVideoResource';
class TeachableResourceTeacher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      completing: false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new TeachableUsersApi;
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  render() {
    let resourceComponent = null;
    let propsForResourceComponent = {
      ...this.props.teachable.teachableItem.data,
      onComplete: () => {}
    }
    switch ( this.props.teachable.teachableItem.data.type ) {
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

export default TeachableResourceTeacher;