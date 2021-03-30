import React, { Component } from 'react';
import { Link } from "react-router-dom";

import SubjectList from "./SubjectList";
import Loader from '../../../components/Loader';
import SearchBox from '../SearchBox';
import Helper from '../../modules/helpers';

import subjectApi from "../../api/subject";

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      subjects: [] ,
      url: false , 
      hasMore: true ,
      processInitSubject: true ,
      processCall: false,

      onSearch: false,
      loadMore: false,
      onClick: false,
    }
  }

  callSearch() {
    this.setState({
      onSearch: true,
      onClick: true,
    }, () => this.callSubject())
  }

  callNextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({
        loadMore: true,
      }, () => this.callSubject())
    }
  }

  callSubject() {
    if (( this.state.onSearch || this.state.hasMore ) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const params = {
        q: this.state.searchValue || null ,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      subjectApi.index({
        params
      }, (response, err) => {   
        const data = response ? response.data : [];
        this.setState({
          subjects: this.state.onSearch ? data : this.state.subjects.concat(data) ,
          url: response ? response.next_page_url : null,
          hasMore: response ? response.next_page_url ? true : false : false,
          processInitSubject: false ,
          processCall: false,
          onSearch: false,
          loadMore: false,
        });
      });
    }
  }

  componentWillMount() {
    this.callSubject();
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <a href="#" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali 
        </a>

        <SearchBox
          label="Cari Mata Kuliah"
          placeholder="Contoh: Pancasila"
          onSubmit={this.callSearch.bind(this)}
          onChange={e => this.setState({searchValue: e.currentTarget.value})}
          value={this.state.searchValue}
          onClick={this.callSearch.bind(this)}
        />

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <Link to="/subject/new" className="c-btn c-default-btn primary-btn align-self-end small-text" >
              <i className="fa fa-plus"> </i> Mata Kuliah
            </Link>
          </div>

          {
            this.state.processInitSubject ? <Loader /> : (
              <SubjectList 
                subjects={this.state.subjects} 
                callSubject={this.callNextPage.bind(this)} 
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
