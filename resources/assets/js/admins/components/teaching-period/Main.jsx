import React, { Component } from 'react';
import { Link } from "react-router-dom";

import TeachingPeriodList from "./TeachingPeriodList";
import Loader from '../../../components/Loader';
import Helper from '../../modules/helpers';
import SearchBox from '../SearchBox';

import teachingPeriodApi from "../../api/teachingPeriod";

function getQueryString( field, url ) {
  var href = url ? url : window.location.href;
  var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
  var string = reg.exec(href);
  return string ? string[1] : null;
}

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: null,
      teachingPeriods: [] ,
      url: false , 
      hasMore: true ,
      processInitTeachingPeriod: true ,
      processCall: false ,
      onSearch: false ,
      loadMore: false ,
      searchValue: null
    }
  }

  callTteachingPeriod() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        loadMore: true,
      }, () => this.callTteachingPeriod())
    }
  }

  callTteachingPeriod() {
    if ((this.state.onSearch || this.state.hasMore) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const params = {
        q: this.state.searchValue || null ,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      teachingPeriodApi.index(
        { params }, 
        response => {
          const data = response ? response.data : [];          
          this.setState({
            teachingPeriods: this.state.onSearch ? data : this.state.teachingPeriods.concat(data),
            url: response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitTeachingPeriod: false,
            processCall: false ,
            onSearch: false ,
            loadMore: false
          });
        }
      );
    }
  }

  searchTeachingPeriod() {
    this.setState({
      onSearch: true
    }, () => this.callTteachingPeriod());
  }

  handleChangeSearch(e) {
    this.setState({searchValue: e.currentTarget.value}) ;   
    
    if (!e.currentTarget.value) {
      this.searchTeachingPeriod();
    }
  }

  nextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({loadMore: true}, () =>  this.callTteachingPeriod());
    }              
  }

  componentWillMount() {
    this.callTteachingPeriod();
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <a href="#" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </a>

        <SearchBox 
          label="Cari Tahun Ajar"
          placeholder = "Contoh: 2018-ganjil"
          onChange={this.handleChangeSearch.bind(this)}
          onSubmit={this.searchTeachingPeriod.bind(this)}
          value={this.state.searchValue}
        /> 

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <Link to="/teaching-period/new" className="c-btn c-default-btn primary-btn align-self-end small-text" >
              <i className="fa fa-plus"> </i> Tambah Tahun Ajar
            </Link>
          </div>

          {
            this.state.processInitTeachingPeriod ? <Loader /> : (
              <TeachingPeriodList 
                teachingPeriods={this.state.teachingPeriods} 
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
