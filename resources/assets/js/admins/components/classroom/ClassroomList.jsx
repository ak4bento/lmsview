import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';

class ClassroomList extends Component {
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
              Nama Kelas
            </div>
            <div className="col-2 px-2 py-4 text-uppercase strong text-info text-small text-center">
              Kode
            </div>
            <div className="col-1 px-2 py-4 text-uppercase strong text-info text-small text-center">
              Jumlah Mahasiswa
            </div>
            <div className="col-2 px-2 py-4 text-uppercase strong text-info text-small text-center">
              Tahun Ajar
            </div>
          </div>


          {
            this.props.classrooms.map((classroom, i) =>
              <div className="d-flex flex-row mx-0 px-0 align-items-start border-bottom white-bg" key={classroom.slug + i}>
                <div className="col-1 px-2 py-4">
                  {i + 1}
                </div>
                <div className="col-6 px-2 py-4">
                  <div className="d-block"> {classroom.title} </div>
                  <div className="row justify-content-start align-items-center mx-0 px-0">
                    <Link
                      to={`/classroom/${classroom.slug}/edit`}
                      className="d-inline-block link third-link small-text"
                    >
                      <i className="fa fa-cog"> </i> Edit
                      </Link>
                    <Link
                      to={`/classroom/${classroom.slug}/students/`}
                      className="d-inline-block link third-link small-text px-2"
                    >
                      <i className="fa fa-user"> </i> Mahasiswa
                      </Link>
                    <Link
                      to={`/classroom/${classroom.slug}/teachers/`}
                      className="d-inline-block link third-link small-text px-2"
                    >
                      <i className="fa fa-graduation-cap"> </i> Dosen
                      </Link>
                  </div>
                </div>
                <div className="col-2 px-2 py-4 text-center">
                  {classroom.code}
                </div>
                <div className="col-1 px-2 py-4 text-center">
                  {classroom.students_count}
                </div>
                <div className="col-2 px-2 py-4 text-center">
                  {classroom.teaching_period ? classroom.teaching_period.name : ''}
                </div>
              </div>
            )
          }

        </div>

        {/* <table className="gk-table table table-fit" key="child">
          <tbody>
            <tr>
              <th className="text-center"> No </th>
              <th> Judul </th>
              <th className="text-center"> Kode </th>
              <th className="text-center"> Mahasiswa </th>
              <th> Tahun Ajar </th>
              <th> </th>
            </tr>
            {
              this.props.classrooms.map((classroom, i) =>
                <tr key={classroom.slug + i}>
                  <td className="text-center">
                    {i + 1}
                  </td>
                  <td>
                    {classroom.title}
                  </td>
                  <td className="text-center">
                    {classroom.code}
                  </td>
                  <td className="text-center">
                    {classroom.students_count}
                  </td>
                  <td>
                    {classroom.teaching_period ? classroom.teaching_period.name : ''}
                  </td>
                  <td>
                    <div className="row justify-content-around align-items-center">
                      <Link
                        to={`/classroom/${classroom.slug}/edit`}
                        className="d-inline-block padding-half link third-link small-text"
                      >
                        <i className="fa fa-cog"> </i> Edit
                      </Link>
                      <Link
                        to={`/classroom/${classroom.slug}/students/`}
                        className="d-inline-block padding-half link third-link small-text"
                      >
                        <i className="fa fa-user"> </i> Daftar Mahasiswa
                      </Link>
                      <Link
                        to={`/classroom/${classroom.slug}/teachers/`}
                        className="d-inline-block padding-half link third-link small-text"
                      >
                        <i className="fa fa-user"> </i> Daftar Dosen
                      </Link>
                    </div>
                  </td>
                </tr>
              )
            }

          </tbody>
        </table> */}
      </InfiniteScroll>
    )
  }
}

export default ClassroomList;