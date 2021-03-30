import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../modules/helpers';

import StudentList from "./StudentList";
import Loader from '../../../components/Loader';
import SearchBox from '../SearchBox';

import userApi from "../../api/user";

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      students: [] ,
      url: false , 
      hasMore: true ,
      processInitStudent: true ,
      processCall: false ,
      searchValue: null ,
      onSearch: false ,
      searchValue: null
    }
  }

  callStudent() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const params = {
        context: 'student' ,
        q: this.state.searchValue || null ,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      userApi.index(
        { params }, 
        response => {
          const data = response ? response.data : [];           
          this.setState({
            students: this.state.onSearch ? data : this.state.students.concat(data),
            url:  response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitStudent: false ,
            processCall: false ,
            onSearch: false ,
            loadMore: false
          });
        }
      );
    }
  }

  searchStudent() {
    this.setState({
      onSearch: true
    }, () => this.callStudent());
  }

  handleChangeSearch(e) {
    this.setState({searchValue: e.currentTarget.value}) ;   
    
    if (!e.currentTarget.value) {
      this.searchStudent();
    }
  }

  nextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({loadMore: true}, () =>  this.callStudent());
    }              
  }

  componentWillMount() {
    this.callStudent();
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <SearchBox 
          label="Cari Mahasiswa" 
          onChange={this.handleChangeSearch.bind(this)} 
          onSubmit={this.searchStudent.bind(this)} 
          value={this.state.searchValue}
        />

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <Link to="/student/new" className="c-btn c-default-btn primary-btn align-self-end small-text" >
              <i className="fa fa-plus"> </i> Tambah Akun Baru
            </Link>
          </div>

          {
            this.state.processInitStudent ? <Loader /> : (
              <StudentList 
                students={this.state.students} 
                nextPage={this.nextPage.bind(this)} 
                hasMore={this.state.hasMore}
              />
            )
          }
        </div>
      </div>
    );
  }
}

export default Main;
