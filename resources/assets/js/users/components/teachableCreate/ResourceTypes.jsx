import React from 'react';

const ResourceTypes = props => (
  <div className="d-flex">
    {
      types.map(type => (
        <button
          key={type.key}
          type="button"
          className={"d-flex flex-column align-items-center p-lg-3 p-1 btn" + (props.selection !== type.key ? ' btn-link' : ' btn-primary')}
          onClick={() => props.onSelect(type.key)}
          style={{ flex: 1 }}>

          <div className="h2"><i className={"fas fa-" + type.icon}></i></div>
          <div>{type.label}</div>
        </button>
      ))
    }
  </div>
);

const types = [
  { key: 'jwvideo', label: 'Cloud Video', icon: 'film' },
  // { key: 'linkvideo', label: 'Link Video', icon: 'play-circle'} ,
  { key: 'youtubevideo', label: 'YouTube', icon: 'video' },
  { key: 'documents', label: 'Documents', icon: 'copy' },
  { key: 'audio', label: 'Audio', icon: 'headphones' },
  { key: 'url', label: 'Webpage', icon: 'link' },
];

export default ResourceTypes;