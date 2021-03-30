import React, { Component } from 'react';
import Modal from 'react-responsive-modal';

import InfiniteScroll from 'react-infinite-scroller';
import Loader from '../../../components/Loader';
import classroomApi from '../../api/classroom';

class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isProcessDelete: false,
      openModalRemoveUser: false,
      activeIndexUser: null
    }
  }

  handleRemoveUser(e) {
    this.setState({
      isProcessDelete: true
    });

    classroomApi.destroy({
      params: {
        context: 'user',
        id: this.props.users[this.state.activeIndexUser].id,
      },
      id: this.props.currentClassroom
    }, result => {

      if (result.isSuccess) {
        this.props.recallUser();
      }

      this.setState({
        isProcessDelete: false,
        openModalRemoveUser: false,
        activeIndexUser: null
      });

    }, err => {
      this.setState({
        isProcessDelete: false,
        openModalRemoveUser: false,
        activeIndexUser: null
      });
    })
  }

  render() {
    return (
      <div>
        <InfiniteScroll
          pageStart={0}
          loadMore={this.props.nextPage}
          hasMore={this.props.hasMore}
          loader={<Loader />}
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
                Jurusan
                        </div>
            </div>


            {
              this.props.users.map((user, i) =>

                <div className="d-flex flex-row mx-0 px-0 align-items-center white-bg" key={user.user.username + i}>
                  <div className="col-1 px-2 py-4">
                    {i + 1}
                  </div>
                  <div className="col-6 px-2 py-4">
                    <div className="d-block"> {user.user.name} / <span className="opacity-half"> {user.user.username} </span> </div>
                    <div className="row justify-content-start align-items-center mx-0 px-0 py-2">
                      <a
                        href="#"
                        className="d-inline-block text-danger small-text"
                        data-user={i}
                        onClick={(e) => {
                          this.setState({
                            openModalRemoveUser: true,
                            activeIndexUser: i
                          });
                        }}
                      >
                        <i className="fa fa-trash"> </i> Hapus
                        </a>
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
                    {user.user.categorizable ? user.user.categorizable.category.name : ''}
                  </div>
                </div>
              )
            }

          </div>

        </InfiniteScroll >

        <Modal
          open={this.state.openModalRemoveUser}
          onClose={() => this.setState({ openModalRemoveUser: false })}
          center
        >
          <h4>
            Apakah anda yakin menghapus&nbsp;
            {
              this.props.users[this.state.activeIndexUser] ?
                this.props.users[this.state.activeIndexUser].user.name : ""
            }
          </h4>
          <p className="padding-tb-1">
            Menghapus Mahasiswa / Dosen dari kelas akan menghilangkan progress mahasiswa di dalam kelas
          </p>
          <div className="row margin-reset padding-reset justify-content-end align-items-center border-up">
            <a className="padding-half" onClick={() => this.setState({
              openModalRemoveUser: false,
              activeIndexUser: null
            })}>
              Batalkan
            </a>&nbsp;
            <button className="btn btn-danger" onClick={this.handleRemoveUser.bind(this)}>
              Ya
            </button>
          </div>
        </Modal>
      </div >
    )
  }
}

export default UserList;