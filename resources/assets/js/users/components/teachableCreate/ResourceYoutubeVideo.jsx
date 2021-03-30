import React from 'react';

const ResourceYoutubeVideo = props => {
  let settings = Object.assign( {
    videoId: ''
  }, props.settings );

  return (
    <div className="px-4">
      <div className="form-group row">
        <label htmlFor="videoId" className="col-3 col-form-label">Youtube Video ID</label>
        <div className="col-3">
          <input type="text" className="form-control" name="videoId" value={ settings.videoId } onChange={ e => props.onUpdate( Object.assign( settings, { videoId: e.target.value } ) ) } />
        </div>
      </div>
      <div className="text-muted small">You can obtain the YouTube Video ID by taking the last URL segment of the video.</div>
    </div>
  );
}

export default ResourceYoutubeVideo;
