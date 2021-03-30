import { prependOnceListener } from "cluster";
import React from "react";

export default ProgressBar = (progress) => {
  const style = {
    height: '5px' ,
    background: 'red' ,
    position: 'absolute',
    float: 'left' ,
    top: '0'
  }

  style.width = `${props.progress || 0}%`;

  return (
    <div id="progressbar" style={style}></div>
  );
};