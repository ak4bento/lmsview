import React, { Component } from 'react';
import { Link } from "react-router-dom";

import ClassroomList from "./ClassroomList";
import Loader from '../../../components/Loader';
import Helper from '../../modules/helpers';
import SearchBox from '../SearchBox';

import classroomApi from "../../api/classroom";

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: null ,
      classrooms: [] ,
      url: false ,
      hasMore: true ,
      processInitClassroom: true ,
      processCall: false ,
      onSearch: false ,
      loadMore: false ,
      searchValue: null
    }
  }

  callSearch() {
    this.setState ({
      onSearch: true,
      onClick: true,
    }, () => this.callClassroom())
  }

  callNextPage() {
    if (this.state.hasMore && !this.state.processCall){
      this.setState({
        loadMore: true
      }, () => this.callClassroom())
    } 
  }

  callClassroom() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        processCall: true,
      });

      const params = {
        q: this.state.searchValue || null ,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      classroomApi.index(
        { params }, 
        response => {        
          const data = response ? response.data : [];       
          this.setState({
            classrooms: this.state.onSearch ? data : this.state.classrooms.concat(data) ,
            url: response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitClassroom: false,
            processCall: false ,
            onSearch: false ,
            loadMore: false
          });
        }, err => this.setState({processInitClassroom: false})
      );
    }
  }

  searchClassroom() {    
    this.setState({
      onSearch: true
    }, () => this.callClassroom());
  }

  handleChangeSearch(e) {
    this.setState({searchValue: e.currentTarget.value}) ;   
    
    if (!e.currentTarget.value) {
      this.searchClassroom();
    }
  }

  nextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({loadMore: true}, () =>  this.callClassroom());
    }              
  }

  componentWillMount() {
    this.callClassroom(); 
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <a href="#" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </a>

        <SearchBox 
          label="Cari Kelas"
          placeholder="Contoh: Etika Kedokteran "
          onChange={this.handleChangeSearch.bind(this)}
          onSubmit={this.searchClassroom.bind(this)}
          value={this.state.searchValue}
        /> 

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <Link to="/classroom/new" className="c-btn c-default-btn primary-btn align-self-end small-text" >
              <i className="fa fa-plus"> </i> Kelas
            </Link>
          </div>

          {
            this.state.processInitClassroom ? <Loader /> : (
              <ClassroomList 
                classrooms={this.state.classrooms} 
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
