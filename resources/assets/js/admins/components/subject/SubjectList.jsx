import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';

class SubjectList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.props.callSubject}
        hasMore={this.props.hasMore}
        loader={<Loader key={0}/>}
      >
        <div>
          <div className="d-flex flex-row mx-0 px-0 align-items-center">
            <div className="col-1 px-2 py-4 text-uppercase strong text-info text-small">
              No
                        </div>
            <div className="col px-2 py-4 text-uppercase strong text-info text-small">
              Judul
            </div>

            <div className="col-2 px-2 py-4 text-uppercase strong text-info text-small">
              Kode
            </div>

            <div className="col-3 px-2 py-4 text-uppercase strong text-info text-small">
              Blok
            </div>
          </div>

          {
            this.props.subjects.map((subject, i) =>

              <div className="d-flex flex-row mx-0 px-0 align-items-start white-bg border-bottom" key={subject.slug + i}>
                <div className="col-1 px-2 py-4">
                  {i + 1}
                </div>
                <div className="col px-2 py-4">
                  <p className="d-block text-truncate"> {subject.title} </p>
                  <div className="row justify-content-start align-items-center mx-0">
                    <Link
                      to={`subject/${subject.id}/edit`}
                      className="d-inline-block link third-link small-text"
                    >
                      <i className="fa fa-cog"> </i> Edit
                      </Link>
                  </div>
                </div>

                <div className="col-2 px-2 py-4">
                  {subject.code}
                </div>

                <div className="col-3 px-2 py-4">
                  {subject.category ? subject.category.name : ''}
                </div>
              </div>

            )
          }
        </div>
      </InfiniteScroll >
    )
  }
}

export default SubjectList;
