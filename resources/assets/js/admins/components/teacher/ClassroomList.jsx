import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';
import UserApi from "../../api/user";

class ClassroomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessDelete: false,
      openModalRemoveClassroom: false,
      activeIndexClassroom: '',
    }
  }

  handleRemoveClassroom(e) {
    this.setState({
      isProcessDelete: true
    });

    UserApi.destroy(
      { params: { context: 'classroom' }, id: this.props.classrooms[this.state.activeIndexClassroom].id } , 
      (result, err) => {
        this.setState({
          isProcessDelete: false ,
          openModalRemoveClassroom: false ,
          activeIndexClassroom: null
        }, _ => {
          if (result.isSuccess) {
            this.props.searchClassroom();
          }
        });
      }
    )
  }

  render() {
    const { classrooms } = this.props;
    
    return (
      <div> 
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.nextPage}
          hasMore={this.props.hasMore}
          loader={<Loader key={0}/>}
        > 
          <table className="gk-table" key="child">
            <tbody>
              <tr>
                <th className="text-center"> No </th>
                <th> Judul </th>
                <th className="text-center"> Kode </th>
                <th> Tahun Ajar </th>
                <th> </th>
              </tr>
              {
                classrooms.map((classroom, i) =>
                  <tr key={ i }>
                    <td className="text-center"> { i + 1} </td>
                    <td> { classroom.classroom.title } </td>
                    <td className="text-center"> { classroom.classroom.code } </td>
                    <td> { classroom.classroom.teaching_period ? classroom.classroom.teaching_period.name : '' } </td>
                    <td>
                    <div className="row justify-content-around align-items-center">
                    <a
                      href="#"
                      className="d-inline-block padding-half link third-link small-text"
                      data-classroom={i}
                      onClick={(e) => {
                        this.setState({
                          openModalRemoveClassroom: true ,
                          activeIndexClassroom: i
                        });
                      }}
                    >
                        <i className="fa fa-trash"> </i> Hapus
                      </a>
                    </div>
                    </td>
                  </tr>
                )
              }
            </tbody>
          </table>
        </InfiniteScroll> 

        <Modal 
          open={this.state.openModalRemoveClassroom} 
          onClose={() => this.setState({openModalRemoveClassroom: false})} 
          center
        >
          <h4>
            Apakah anda yakin menghapus&nbsp;
            {
              this.props.classrooms[this.state.activeIndexClassroom] ? 
                this.props.classrooms[this.state.activeIndexClassroom].classroom.title : ""
            }
          </h4>
          <p className="padding-tb-1">
            Menghapus Kelas akan menghilangkan progress mahasiswa di dalam kelas
          </p>
          <div className="row margin-reset padding-reset justify-content-end align-items-center border-up">
            <a className="padding-half" onClick={() => this.setState({
              openModalRemoveClassroom: false ,
              activeIndexClassroom: null,
            })}>
              Batalkan
            </a>&nbsp;
            <button className="btn btn-danger" onClick={this.handleRemoveClassroom.bind(this)}>
              Ya
            </button> 
          </div>
        </Modal>

      </div>
    )
  }
}

export default ClassroomList;