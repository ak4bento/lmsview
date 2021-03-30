import React, { Component } from 'react';
import { Link } from "react-router-dom";

import CategoryList from "./CategoryList";
import Loader from '../../../components/Loader';
import SearchBox from '../SearchBox';
import Helper from '../../modules/helpers';

import categoriesApi from "../../api/catgories";

class Main extends Component {

    constructor(props) {
      super(props);
      this.state = {
        searchValue: null,
        categories: [],
        url: false,
        hasMore: true,
        processInitCategory: true,
        processCall: false,

        onSearch: false,
        loadMore: false,
        onClick:false,
      }
    }

    callSearch() {
      this.setState({
        onSearch: true,
        onClick: true,
      }, () => this.callCategory())
    }

    callNextPage() {
      if (this.state.hasMore && !this.state.processCall) {
        this.setState({
            loadMore: true,
        }, () => this.callCategory())
      }
    }

    callCategory() {
      if (( this.state.onSearch || this.state.hasMore ) && !this.state.processCall) {
        this.setState({
          processCall: true
        });

        const params = {
            q: this.state.searchValue,
            context: 'all',
            page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
        };

        categoriesApi.index({
          params
        }, (response, err) => {
          const data = response ? response.data : [];
          this.setState({
            categories: this.state.onSearch ? data : this.state.categories.concat(data),
            url: response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitCategory: false,
            processCall: false, 
            onSearch: false, 
            loadMore: false, 
          });
        });
      }
    }

    componentWillMount() {
        this.callCategory();
    }

    render() {
      return (
        <div className="d-block padding-2 text-left">
          <a href="#" className="link primary-link">
            <i className="fa fa-angle-left"> </i> Kembali 
          </a>

          <SearchBox
            label="Cari Jurusan"
            placeholder="Contoh: Biomedik"
            onSubmit={this.callSearch.bind(this)}
            onChange={e => this.setState({searchValue: e.currentTarget.value})}
            value={this.state.searchValue}
            onClick={this.callSearch.bind(this)}
          />

          <div className="padding-tb-1">
            <div className="padding-tb-1 d-block text-right">
              <Link to="/category/new" className="c-btn c-default-btn primary-btn align-self-end small-text" >
                <i className="fa fa-plus"> </i> Jurusan
              </Link>
           </div>

            {
                this.state.processInitSubject ? <Loader /> : (
                <CategoryList 
                    categories={this.state.categories} 
                    callCategory={this.callNextPage.bind(this)} 
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