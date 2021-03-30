import React, { Component } from 'react';
import Loader from '../../../components/Loader';

import userApi from '../../api/user';
import classroomApi from '../../api/classroom';

const SearchBox = (props) => (
  <div className="margin-tb-1 padding-1 row justify-content-center padding-reset margin-reset">
    <label className="col-6 margin-reset padding-reset">
      <span className="text secondary-text"> Cari {props.context === 'students' ? 'Mahasiswa' : 'Dosen'} </span>
      <div className="margin-reset padding-reset d-flex flex-column">
        <input
          type="text"
          className="form-control border-radius"
          placeholder="Masukkan nama atau nim"
          onChange={(e) => props.setState({
            searchValue: e.currentTarget.value
          })}
          value={props.searchValue}
        />
        <div className="padding-tb-1 d-block text-right">
          <button className="c-btn c-default-btn primary-btn align-self-end small-text" onClick={props.search}>
            <i className="fa fa-search"> </i> Cari
          </button>
        </div>
      </div>
    </label>
  </div>
);

class UserListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      users: [],
      listAssignUser: [],
      isProcessSearch: false
    };
  }

  search() {
    this.setState({
      isProcessSearch: true
    });

    const { context, currentClassroom } = this.props;

    userApi.index({
      params: {
        context: context === 'students' ? 'studentsNotInClassroom' : 'teachersNotInClassroom', //result will be student or teacher
        classroom: currentClassroom,
        q: this.state.searchValue
      }
    }, (result) => {

      this.setState({
        isProcessSearch: false,
        users: result
      });
    }, err => {
      this.setState({
        isProcessSearch: false
      });
    })
  }

  save() {
    classroomApi.store({
      form: {
        assignUser: JSON.stringify(this.state.listAssignUser),
        classroom: this.props.currentClassroom,
        context: this.props.context
      }
    }, (result) => {
      if (result.isSuccess) {
        $("#user-list-modal").removeClass("in");
        $('#user-list-modal').modal('hide');
        $(".modal-backdrop").remove();

        this.setState({
          users: [],
          listAssignUser: [],
        });

        this.props.recallUser();
      }
    }, err => {
      console.log(err);
    })
  }

  handleCheckbox(e) {
    const val = e.currentTarget.value;

    if (e.currentTarget.checked) {
      if (this.state.listAssignUser.findIndex(elm => elm === val) < 0)
        this.state.listAssignUser.push(val);
    } else {
      const index = this.state.listAssignUser.indexOf(val);
      if (index > -1) this.state.listAssignUser.splice(index, 1);
    }
  }

  render() {
    return (
      <div
        className="modal fade"
        id="user-list-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="user-list-modal"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg elib-modal" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title" id="exampleModalVerticalLabel"> Tambahkan {this.props.context === 'students' ? 'Mahasiswa' : 'Dosen'} </h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            <div className="modal-body">
              <div className="content padding-1">
                <SearchBox
                  setState={this.setState.bind(this)}
                  search={this.search.bind(this)}
                  searchValue={this.state.searchValue}
                  context={this.props.context}
                />


                <form>

                  {this.state.users.length > 0 &&

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
                  }

                  {
                    this.state.users.map((user, i) =>

                      <div className="d-flex flex-row mx-0 px-0 align-items-center white-bg border-bottom" key={user.username + i}>
                        <div className="col-1 px-2 py-4">
                          <input type="checkbox" value={user.id} onChange={this.handleCheckbox.bind(this)} />
                        </div>
                        <div className="col-6 px-2 py-4">
                          <div className="d-block"> {user.name} / <span className="opacity-half"> {user.username} </span> </div>
                        </div>

                        <div className="col px-2 py-4">
                          {user.categorizable ? user.categorizable.category.name : ''}
                        </div>
                      </div>

                    )
                  }



                  {
                    this.state.isProcessSearch && <Loader />
                  }


                  <div className="grey-bg text-right">
                    <a className="link third-link padding-half" data-dismiss="modal" aria-label="Close">
                      Tutup
                    </a>
                    <button type="button" className="btn btn-primary" onClick={this.save.bind(this)}> Simpan </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default UserListModal;