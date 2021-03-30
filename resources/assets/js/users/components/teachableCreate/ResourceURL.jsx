import React from 'react';

const ResourceURL = props => {
  let settings = Object.assign( {
    url: ''
  }, props.settings );

  return (
    <div className="px-4">
      <div className="form-group row">
        <label htmlFor="url" className="col-3 col-form-label">External Page URL</label>
        <div className="col-9">
          <input type="text" className="form-control" name="url" value={ settings.url } onChange={ e => props.onUpdate( Object.assign( settings, { url: e.target.value } ) ) } />
        </div>
      </div>
    </div>
  );
}

export default ResourceURL;
