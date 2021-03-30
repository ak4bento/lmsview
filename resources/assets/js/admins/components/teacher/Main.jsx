import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../modules/helpers';

import TeacherList from './TeacherList';
import Loader from '../../../components/Loader';
import SearchBox from '../SearchBox';

import userApi from "../../api/user";

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teachers: [] ,
      url: false ,
      hasMore: true ,
      processInitTeacher: true ,
      processCall: false ,
      onSearch: false ,
      loadMore: false ,
      searchValue: null
    }
  }

  callTeacher() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const params = {
        context: 'teacher' ,
        q: this.state.searchValue || null ,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      userApi.index(
        { params }, 
        response => { 
          const data = response ? response.data : [];          
          this.setState({
            teachers: this.state.onSearch ? data : this.state.teachers.concat(data),
            url: response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitTeacher: false,
            processCall: false ,
            onSearch: false ,
            loadMore: false
          }); 
        }
      );
    }
  }

  searchTeacher() {
    this.setState({
      onSearch: true
    }, () => this.callTeacher());
  }

  handleChangeSearch(e) {
    this.setState({searchValue: e.currentTarget.value}) ;   
    
    if (!e.currentTarget.value) {
      this.searchTeacher();
    }
  }

  nextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({loadMore: true}, () =>  this.callTeacher());
    }              
  }

  componentWillMount() {
    this.callTeacher();
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <a href="#" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali 
        </a>

        <SearchBox 
          label="Cari Dosen"
          onChange={this.handleChangeSearch.bind(this)}
          onSubmit={this.searchTeacher.bind(this)}
          value={this.state.searchValue}
        /> 

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <Link to="/teacher/new" className="c-btn c-default-btn primary-btn align-self-end small-text">
              <i className="fa fa-plus"></i>
              Tambah Akun Baru
            </Link>
          </div>

          {
            !this.state.processInitTeacher ? (
              <TeacherList
                teachers={this.state.teachers}
                nextPage={this.nextPage.bind(this)}
                hasMore={this.state.hasMore}
              />
            ) : <Loader /> 
          }
        </div>
      </div>
    );
  }
}
export default Main;


