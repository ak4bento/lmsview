import React, { Component } from 'react';
import { Link } from "react-router-dom";

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';

import moment from 'moment';

class TeachingPeriodList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <InfiniteScroll
        pageStart={0}
        loadMore={this.props.nextPage}
        hasMore={this.props.hasMore}
        loader={<Loader key={0}/>}
      >
        <div>
          <div className="d-flex flex-row mx-0 px-0 align-items-center">
            <div className="col-4 px-2 py-4 text-uppercase strong text-info text-small">
              Tahun Ajar
            </div>
            <div className="col-2 px-2 py-4 text-uppercase strong text-info text-small">
              Mulai
            </div>

            <div className="col-2 px-2 py-4 text-uppercase strong text-info text-small">
              Selesai
            </div>
          </div>

          {
            this.props.teachingPeriods.map((teachingPeriod, i) =>
              <div className="d-flex flex-row mx-0 px-0 align-items-center white-bg" key={`teaching-period${i}`}>
                <div className="col-4 p-4">
                  {teachingPeriod.name}
                  {/* <div className="row justify-content-start align-items-start mx-0 px-0">
                    <div>
                      <a
                        href="#"
                        id="dropdownMenu1"
                        className="d-inline-block padding-half link primary-link small-text dropdown-toggle"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false">
                        <i className="fa fa-print"> </i> Print Laporan
                      </a>
                      <div className="dropdown-menu" aria-labelledby="dropdownMenu1">
                        <a className="dropdown-item" href="#!" data-toggle="modal" data-target="#report-modal">
                          Print Laporan Semester
                          </a>
                        <a className="dropdown-item" href="#!"> Print Seluruh Nilai </a>
                      </div>
                    </div>
                  </div> */}

                </div>
                <div className="col-2 px-2 py-4">
                  {moment(teachingPeriod.stars_at).format('D MMMM YY')}
                </div>

                <div className="col-2 px-2 py-4">
                  {moment(teachingPeriod.ends_at).format('D MMMM YY')}
                </div>
                <div className="col px-2 py-4">
                  <div className="row justify-content-around align-items-center mx-0 px-0">
                    <Link
                      to={`/teaching-period/${teachingPeriod.id}/edit`}
                      className="d-inline-block link third-link small-text"
                    >
                      <i className="fa fa-cog"> </i> Edit
                    </Link>
                  </div>
                </div>
              </div>
            )
          }
        </div>
      </InfiniteScroll>
    )
  }
}

export default TeachingPeriodList;