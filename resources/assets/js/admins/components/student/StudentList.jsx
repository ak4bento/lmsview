import React, { Component } from 'react';
import { Link } from "react-router-dom";

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';

class StudentList extends Component {
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
            <div className="col-1 px-2 py-4 text-uppercase strong text-info text-small">
              No
            </div>
            <div className="col-6 px-2 py-4 text-uppercase strong text-info text-small">
              Data Mahasiswa
            </div>

            <div className="col px-2 py-4 text-uppercase strong text-info text-small">
              Fakultas
            </div>
          </div>

          {
            this.props.students.map((student, i) =>
              <div className="d-flex flex-row mx-0 px-0 align-items-start white-bg border-bottom" key={student.username + i}>
                <div className="col-1 px-2 py-4">
                  {i + 1}
                </div>
                <div className="col-6 px-2 py-4 text-truncate">
                  <div>
                    <p className="d-block mb-0 strong"> {student.name} </p>
                    {student.detail && student.detail !== "null" ? <p className="d-block"> {JSON.parse(student.detail).nim} </p> : ''}
                    <p className="d-block opacity-half"> {student.email} </p>
                  </div>

                  <div className="row mx-0 px-0 align-items-center">
                    <Link
                      to={`/student/${student.id}/edit/`}
                      className="d-inline-block pr-2 link third-link small-text">
                      <i className="fa fa-cog"> </i> Pengaturan Akun
                    </Link>

                    <Link
                      to={`/student/${student.id}/students/`}
                      className="d-inline-block p-2 link first-link small-text"
                    >
                      <i className="fa fa-list"> </i> Daftar Kelas
                    </Link>

                    {/* <div>
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
                      </div> */}
                  </div>

                </div>

                <div className="col px-2 py-4">
                  {student.categorizable ? student.categorizable.category.name : ''}
                </div>
              </div>
            )
          }


        </div>

      </InfiniteScroll>
    )
  }
}

export default StudentList;
