import React from 'react';
import { Link } from "react-router-dom";
import Parser from 'html-react-parser';

const StudentListItem = props => (
  <Link to={'/classroom/' + props.slug} className={
    // props.featured ? 'rounded shadowed mb-4 mt-2 list-group-item list-group-item-action py-4 px-4' : 
    'rounded shadowed mb-2 mt-2 list-group-item list-group-item-action py-4 px-4'} key={props.slug}>
    {/* {
      props.featured &&
      (
        <div className="text-uppercase text-muted border-bottom pb-3 mb-4">
          Lanjutkan belajar <i className="fa fa-angle-right"></i>
        </div>
      )
    } */}
    {
      props.categories.data
      && props.categories.data.length > 0 &&
      (
        <div className="mb-2 h6 text-truncate text-uppercase text-primary">
          {props.categories.data.map(category => category.name).join(', ')}
        </div>
      )
    }
    <div className={
      // props.featured ? 'mb-3 h3' : 
      'mb-2 h5 text-truncate'}>{props.title}</div>
    <div className={
      // props.featured ? 'mb-3 lead' : 
      "mb-2 text-truncate"}> {Parser(props.description)} </div>
    <div className={
      // props.featured ? 'border-top pt-2 mt-4 text-muted d-flex justify-content-between' : 
      "small text-truncate text-muted d-flex justify-content-between"}>
      {/* {
        props.teachers.data.length > 0 &&
        (
          <span className="mr-3">
            {props.featured ? 'Class by ' : <i className="fas fa-user-tie mr-1"></i>}
            {props.teachers.data.map(teacher => teacher.user.data.name).join(',')}
          </span>
        )
      } */}
      <span>
        {/* {props.featured ? 'Last time visited ' : <i className="fas fa-clock mr-1"></i>} */}
        {/* {props.self.data.lastAccessedAtForHumans} */}
      </span>
    </div>
    <div className="p-1 row margin-reset padding-reset justify-content-end align-items-center">
      <a href="#" className="d-inline-block link primary-link p-1">
        {
          //   props.featured ? (
          //   "Lanjutkan"
          // ) : (
          "Pelajari"
          // )
        } <i className="fa fa-angle-right"> </i> </a>
    </div>
  </Link>
);

export default StudentListItem;