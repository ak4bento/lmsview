import React from 'react';

const SearchBox = (props) => {
  return (
    <div className="border-bottom margin-tb-1 padding-1 row justify-content-center padding-reset margin-reset">
      <label className="col-6 margin-reset padding-reset">
        <span className="text secondary-text"> {props.label} </span>
        <div className="margin-reset padding-reset d-flex flex-column">
          <input 
            type="text" 
            className="form-control border-radius" 
            value={props.value || ""} 
            onChange={props.onChange}
            placeholder={props.placeholder}
          />
          <div className="padding-tb-1 d-block text-right">
            <button className="c-btn c-default-btn primary-btn align-self-end small-text" onClick={props.onSubmit}>
              <i className="fa fa-search"> </i> Search
            </button>
          </div>
        </div>
      </label>
    </div>
  )
}

export default SearchBox;
