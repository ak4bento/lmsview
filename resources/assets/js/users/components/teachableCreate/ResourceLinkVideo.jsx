import React from 'react';

const ResourceLinkVideo = props => {
  let settings = Object.assign( {
    videoURL: ''
  }, props.settings );

  return (
    <div className="px-4">
      <div className="form-group row">
        <label htmlFor="videoURL" className="col-3 col-form-label">Link Video</label>
        <div className="col-8">
          <input 
            type="text" 
            className="form-control" 
            name="videoURL" 
            value={ settings.videoURL }
            onChange={ e => props.onUpdate( Object.assign( settings, { videoURL: e.target.value } ) ) } 
          />
        </div>
      </div>
    </div>
  );
}

export default ResourceLinkVideo;
