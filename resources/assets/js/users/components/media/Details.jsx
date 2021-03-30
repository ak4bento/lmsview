import React from 'react';
import helpers from "../../modules/helpers";

const Details = props => {
  return (
    <div className="border-left pl-3 pb-5">
      <h4>{ props.name }</h4>

      <div className="mb-3">
        <div className="text-muted">File Size</div>
        <div>{ helpers.getSimpleFilesize( props.size ) }</div>
      </div>

      <div>
        <a href={ props.downloadUrl } className="btn btn-primary">
          <i className="fas fa-download"></i> Download
        </a>&nbsp;
        {
          config.role === 'teacher' && props.modelType === 'classroom' && (
            <a 
              href="#" 
              data-toggle="modal" 
              data-target={'#fileDelete' + props.id} 
              className="btn btn-danger" 
              style={{color: "white"}}>
              <i className="fas fa-trash"></i> Hapus
            </a>
          )
        }
      </div>
    </div>
  );
}


export default Details;