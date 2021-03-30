import React from 'react';

const MiniSearchBox = (props) => {
  return (
    <div className="w-100">
      <div className="input-group">
        <input
          type="text"
          className="form-control input-lg"
          placeholder={props.placeholder || ""}
          value={props.value || ""}
          onChange={e => props.onChange(e.currentTarget.value)}
        />
        <span className="input-group-btn">
          <button className="btn btn-info btn-lg" onClick={props.onSearch}>
            <i className="fa fa-search"></i>
          </button>
        </span>
      </div>
    </div>
  )
}

export default MiniSearchBox;