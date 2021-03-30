import React from 'react';
import ResourceAudio from './ResourceAudio';
import ResourceJWVideo from './ResourceJWVideo';
import ResourceYoutubeVideo from './ResourceYoutubeVideo';
import ResourceFiles from './ResourceFiles';
import ResourceURL from './ResourceURL';
import ResourceLinkVideo from './ResourceLinkVideo';

const ResourceSettings = props => {

  return (

    <div className="bg-white rounded shadowed py-4">
      <div className="px-4 text-uppercase h6 mb-4">Resource Settings</div>
      <div>
        { getSettingsView( props ) }
      </div>
    </div>

  );
}

const getSettingsView = props => {
  switch ( props.type ) {
    case 'jwvideo':
      return <ResourceJWVideo { ...props } />;
    case 'youtubevideo':
      return <ResourceYoutubeVideo { ...props } />;
    case 'linkvideo':
      return <ResourceLinkVideo {...props} />;
    case 'documents':
      return <ResourceFiles { ...props } obligatory />;
    case 'audio':
      return <ResourceAudio { ...props } />;
    case 'url':
      return <ResourceURL { ...props } />;
  }
}

export default ResourceSettings;