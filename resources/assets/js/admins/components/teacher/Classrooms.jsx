import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../modules/helpers';

import ClassroomList from "./ClassroomList";
import ClassroomListModal from "./ClassroomListModal";
import Loader from '../../../components/Loader';

import UserApi from "../../api/user";
import MiniSearchBox from '../MiniSearchBox';
import ProfileBox from '../ProfileBox';

class Classrooms extends  Component {
  
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      classrooms: [] ,
      hasMore: true ,
      processCall: false ,
      processInitClassrooms: true ,
      onSearch: false ,
      
      loadMore: false,
      onSearch:false,
      searchValue: null,
    }
  }

  handleChangeSearch(searchValue) {
    this.setState({
      searchValue
    });

    if (!searchValue) {
      this.searchClassroom();
    }
  }

  callClassroom() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const { id, context } = this.props.match.params;
      const { searchValue, loadMore, url , classrooms } = this.state;

      UserApi.index({
        url: `/${id}/${context}` , 
        params: {
          'q': searchValue,
          page: loadMore ? Helper.getQueryString('page', url) : 1
        }
      }, (response, err) => {
        if (err) {
          this.setState({ 
            processInitClassrooms: false ,
            processInitClassrooms: false ,
            processCall: false,
            loadMore: false
          });
          return; 
        } else {          
          const data = response ? response.data : [];
          
          this.setState({
            classrooms: this.state.onSearch ? data : classrooms.concat(data) ,
            url: response !== null ? response.next_page_url : null ,
            hasMore: response ? response.next_page_url ? true : false : false ,
            processInitClassrooms: false ,
            processCall: false,
            onSearch: false ,
            loadMore: false,
          });
        }
      });
    }
  }

  nextPage() {
    if(this.state.hasMore && !this.state.processCall) {
      this.setState(
        {loadMore: true},
        () => this.callClassroom()
      );
    }
  }

  componentWillMount() {
    this.callClassroom();
  }

  callUser(id) {
    UserApi.view({id: id}, result => {
      this.setState({
        user: result.data,
      });
    });
  }

  searchClassroom() {
    this.setState({
      onSearch: true
    }, () => this.callClassroom());
  }

  componentDidMount() {
    if(this.props.match.params.id) {
      this.callUser(this.props.match.params.id);
    }
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <Link to="/student" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali 
        </Link>

        <div className="border-bottom margin-tb-1 padding-1 row justify-content-center padding-reset margin-reset">
          <ProfileBox 
            user={this.state.user}
            callUser={this.callUser.bind(this)}
          />
        </div>

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <a href="#" 
                className="button primary-button" 
                data-toggle="modal" 
                data-target="#classroom-list-modal"
                onClick={() => {
                  $('#classroom-list-modal').modal('show');
                  return;
                }}
              >
                <i className="fa fa-plus"> </i> Tambahkan Kelas 
              </a>
          </div>
          
          <MiniSearchBox 
            placeholder="Cari Kelas"
            onChange={this.handleChangeSearch.bind(this)}
            value={this.state.searchValue}
            onSearch={this.searchClassroom.bind(this)}
          />

          {
            this.state.processInitClassrooms ? <Loader /> : (
              <ClassroomList 
                classrooms={ this.state.classrooms } 
                currentIdTeacher={ this.props.match.params.id }
                nextPage={ this.nextPage.bind(this) }
                hasMore={ this.state.hasMore }
                callClassroom={ this.callClassroom.bind(this) }
                searchClassroom={ this.searchClassroom.bind(this) }
              />
            )
          }
        </div>

        <ClassroomListModal
          currentIdTeacher={this.props.match.params.id}
          callClassroom={ this.searchClassroom.bind(this) }
        />

      </div>
    );
  }

}

export default Classrooms;