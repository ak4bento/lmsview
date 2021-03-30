import React, { Component } from 'react';
import Loader from '../../../components/Loader';

import classroomApi from '../../api/classroom';
import userApi from '../../api/user';

const SearchBox = (props) => (
  <div className="border-bottom margin-tb-1 padding-1 row justify-content-center padding-reset margin-reset">
    <label className="col-6 margin-reset padding-reset">
      <span className="text secondary-text"> Cari Kelas </span>
      <div className="margin-reset padding-reset d-flex flex-column">
        <input 
          type="text" 
          className="form-control border-radius" 
          placeholder="Masukkan Judul Kelas"
          onChange={(e) => props.setState({
            searchValue: e.currentTarget.value
          })}
          value={props.searchValue}
        />
        <div className="padding-tb-1 d-block text-right">
          <button className="c-btn c-default-btn primary-btn align-self-end small-text" onClick={props.onSearch}>
            <i className="fa fa-search"> </i> Cari
          </button>
        </div>
      </div>
    </label>
  </div>
);

class ClassroomListModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        searchValue: '',
        classrooms: [],
        isProcessSearch: false,
        listAssignClassroom: []
      }
    }

    onSearch() {
      this.setState({
        isProcessSearch: true, 
      })

      classroomApi.index({
        params: {
          context: 'studentsHasClassrooms',
          id: this.props.currentIdStudent,
          q: this.state.searchValue ,
        }
      }, (result, err) => {              
        this.setState({
          isProcessSearch: false ,
          classrooms: result
        });
      });
    }

    save() {
      userApi.store({
        form: {
          assignClassroom: JSON.stringify(this.state.listAssignClassroom) ,
          user: this.props.currentIdStudent ,
          context: 'students'
        }
      }, (result, err) => {
        if (result.isSuccess) {
          $("#classroom-list-modal").removeClass("in");
          $('#classroom-list-modal').modal('hide');
          $(".modal-backdrop").remove();
          
          this.setState({
            classrooms: [] ,
            listAssignClassroom: [] ,
          });
  
          this.props.callClassroom();
        }
      })
    }

    handleCheckbox(e) {
      const val = e.currentTarget.value;
  
      if (e.currentTarget.checked) {
        if(this.state.listAssignClassroom.findIndex(elm => elm === val) < 0) 
        this.state.listAssignClassroom.push(val);
      } else {
        const index = this.state.listAssignClassroom.indexOf(val);
        if (index > -1) this.state.listAssignClassroom.splice(index, 1);
      }
    }
    
    render() {
      return (
        <div 
          className="modal fade" 
          id="classroom-list-modal" 
          tabIndex="-1" 
          role="dialog" 
          aria-labelledby="classroom-list-modal" 
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg elib-modal" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title" id="exampleModalVerticalLabel"> Tambahkan Kelas </h4>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
              </div>
  
              <div className="modal-body">
                <div className="content padding-1">
                <SearchBox 
                  setState={this.setState.bind(this)} 
                  onSearch={this.onSearch.bind(this)}
                  searchValue={this.state.searchValue}  
                />
  
                  <form>
                    <div className="border-bottom">
                      <table className="gk-table" key="child">
                      <tbody>
                        <tr>
                          <th className="text-center"> No </th>
                          <th>  </th>
                          <th> Judul </th>
                          <th className="text-center"> Kode </th>
                          <th className="text-center"> Mahasiswa </th> 
                          <th> Tahun Ajar </th>
                        </tr>
                        {
                           this.state.classrooms.map((classroom, i) =>
                           <tr key={classroom.id + i}>
                             <td className="text-center">{i + 1}</td>
                             <td>
                              <input 
                                type="checkbox" 
                                value={classroom.id} 
                                onChange={this.handleCheckbox.bind(this)}
                              />
                            </td>
                             <td>{classroom.title}</td>
                             <td className="text-center">{classroom.code}</td>
                             <td className="text-center">{classroom.students_count}</td>
                             <td>{classroom.teaching_period ? classroom.teaching_period.name : ''}</td>
                           </tr>
                          )
                        }
                        </tbody>
                      </table>
                      {
                        this.state.isProcessSearch && <Loader />
                      }
                    </div>
  
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

export default ClassroomListModal;