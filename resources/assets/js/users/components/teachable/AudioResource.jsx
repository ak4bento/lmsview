import React, { Component } from 'react';
import Player from "react-audio-player";

class AudioResource extends Component {

  constructor(props) {
    super(props);
    this.state = {
      audioMedia: props.media.data.filter( media => media.collection === 'audio' )[0] || null,
      audioDuration: 0,
      listenDuration: 0,
    };
  }

  listen() {
    let listenDuration = this.state.listenDuration;
    listenDuration++;

    if ( this.state.audioDuration > 0 && ( listenDuration > this.state.audioDuration * 0.9 ) )
      this.props.onComplete();

    this.setState({ listenDuration });
  }

  render() {
    const { audioMedia } = this.state;
    
    return (
      <div>
        <Player
          controls
          listenInterval={ 1000 }
          src={ audioMedia ? audioMedia.downloadUrl : null }
          ref={ player => { this.player = player; } }
          onLoadedMetadata={ data => this.setState({ audioDuration: data.target.duration }) }
          onListen={ () => this.listen() } />
      </div>
    );
  }

}

export default AudioResource;