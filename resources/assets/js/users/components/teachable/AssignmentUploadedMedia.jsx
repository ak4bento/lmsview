import React from 'react';
import Moment from "moment";

import { getIcon } from "../../modules/media";

const AssignmentUploadedMedia = props => {

  return (
    <div className="mt-5 border border-warning rounded d-flex align-items-stretch">
      <div className="d-flex align-items-center bg-warning px-3">
        <div className="h1 text-light"><i className="fas fa-exclamation-triangle"></i></div>
      </div>
      <div className="py-3 px-3">
        <div className="mb-3 text-muted">By uploading, you will replace your existing submission below.</div>
        <div style={{ minWidth: 350 }} className="text-muted border rounded px-3 py-2 d-flex align-items-center">
          <div className="mr-3 text-muted h1 m-0 text-center">
            <i className={ 'fas fa-' + getIcon( props.media.mimeType ) }></i>
          </div>
          <div style={{ flex: 1 }}>
            <div className="text-truncate">{ props.media.name }</div>
            <div className="text-muted">{ Moment( props.media.createdAt ).fromNow() }</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignmentUploadedMedia;