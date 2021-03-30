import React from 'react';
import { Link } from "react-router-dom";
import Parser from 'html-react-parser';

const TeacherListItem = props => (
  <Link to={'/classroom/' + props.slug} className="list-group-item list-group-item-action py-3" key={props.slug}>
    {
      props.categories.data
      && props.categories.data.length > 0 &&
      (
        <div className="mb-2 h6 text-truncate text-uppercase text-primary">
          {props.categories.data.map(category => category.name).join(', ')}
        </div>
      )
    }
    <div className={props.featured ? 'mb-3 h3' : 'mb-2 h5 text-truncate'}>{props.title}</div>
    <div className={props.featured ? 'mb-3 lead' : "mb-2 text-truncate"}> {Parser(props.description)}</div>
    <div className="small text-truncate text-muted">
      {
        props.teachers.data.length > 0 &&
        (
          <span className="mr-3">
            <i className="fas fa-users mr-1"></i> {props.studentsCount} Mahasiswa
          </span>
        )
      }
    </div>
  </Link>
);

export default TeacherListItem;