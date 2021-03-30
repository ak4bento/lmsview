import React, { Fragment } from 'react';
import PropTypes from "prop-types";

const Pagination = props => {

  let perPage = props.perPage || 10;
  let
    pages = Math.ceil(props.data.length / perPage),
    onLast = props.page + 1 === pages,
    onFirst = props.page === 0;

  return (
    <div className="d-flex align-items-center">
      {props.showStatus && <div className="mr-2"><PaginationStatus {...props} pages={pages} perPage={perPage} /></div>}

      <div className="btn-group">
        {
          props.hasEndButtons &&
          <button onClick={() => props.onNavigate(0)} className="btn btn-outline-secondary" disabled={onFirst} style={{ opacity: onFirst ? 0.2 : 1 }}><i className="fas fa-angle-double-left"></i></button>
        }
        <button onClick={() => props.onNavigate(props.page - 1)} className="btn btn-outline-secondary" disabled={onFirst}><i className="fas fa-angle-left"></i></button>
        <button onClick={() => props.onNavigate(props.page + 1)} className="btn btn-outline-secondary" disabled={onLast} style={{ opacity: onLast ? 0.2 : 1 }}><i className="fas fa-angle-right"></i></button>
        {
          props.hasEndButtons &&
          <button onClick={() => props.onNavigate(pages - 1)} className="btn btn-outline-secondary" disabled={onLast}><i className="fas fa-angle-double-right"></i></button>
        }
      </div>
    </div >
  );
}

const PaginationStatus = props => {
  let
    startIndex = props.page * props.perPage + 1,
    endIndex = props.pages - 1 === props.page ? props.data.length : (props.page + 1) * props.perPage;

  return <Fragment>Showing {startIndex} {endIndex !== startIndex && " to " + endIndex} from {props.data.length} {props.users} </Fragment>
}

export const withinPage = ({ index, page, perPage }) =>
  index >= page * perPage && index <= (page + 1) * perPage - 1;

Pagination.propTypes = {
  data: PropTypes.array.isRequired,
  page: PropTypes.number.isRequired,
  perPage: PropTypes.number,
  showStatus: PropTypes.bool
};

export default Pagination;