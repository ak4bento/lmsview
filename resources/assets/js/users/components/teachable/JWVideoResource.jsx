import React, { Component } from 'react';
import JWPlayer from "react-jw-player";
import { CancelToken, isCancel } from "axios";

import { ActivityIndicator } from "../../components";
import { getSignedJWPlayerLinks } from "../../api/misc";

class JWVideoResource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      videoUrl:   null,
      playerUrl:  null,
      data:       JSON.parse( props.data ),

      error:    false,
      fetching: false,
    };
    this.cancelRequestHandler = CancelToken.source();
  }

  componentDidMount() {
    this.loadSignedLinks();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  loadSignedLinks() {
    if ( this.state.fetching )
      return;

    this.setState({ fetching: true, error: false })
    return getSignedJWPlayerLinks({
      playerId: this.state.data.playerId,
      videoId: this.state.data.videoId,
      cb: data => this.setState({ fetching: false, videoUrl: data.data.videoUrl, playerUrl: data.data.playerUrl }),
      err: e => !isCancel( e ) && this.setState({ fetching: false, error: true }),
      cancelToken: this.cancelRequestHandler.token,
    });
  }

  render() {
    return (
      <div className="w-100 h-100">
        {
          ( this.state.playerUrl && this.state.videoUrl ) ?
          (
            <JWPlayer playerId={ this.state.data.playerId } playerScript={ this.state.playerUrl } file={ this.state.videoUrl } onNinetyFivePercent={ () => this.props.onComplete() } />
          ) : <ActivityIndicator padded />
        }
      </div>
    );
  }

}

export default JWVideoResource;