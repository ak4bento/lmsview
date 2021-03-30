import React from 'react';
import Youtube from "react-youtube";

const YoutubeVideoResource = props => (
  <div className="w-100">
    <Youtube
      videoId={ JSON.parse( props.data ).videoId }
      containerClassName="embed-responsive embed-responsive-16by9"
      onEnd={ () => props.onComplete() }
      opts={{ rel: 0 }} />
  </div>
);

export default YoutubeVideoResource;