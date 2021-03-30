import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Helper from '../../modules/helpers';

import ClassroomList from "./ClassroomList";
import ClassroomListModal from "./ClassroomListModal";
import Loader from '../../../components/Loader';

import UserApi from "../../api/user";
import MiniSearchBox from '../MiniSearchBox';
import ProfileBox from '../ProfileBox';

class Classrooms extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: [],
      classrooms: [],
      hasMore: true,
      processCall: false,
      processInitClassrooms: true,

      loadMore: false,
      searchValue: null,
    }
  }

  nextPage() {
    this.callClassroom(false);
  }

  callClassroom(reload = true) {
    console.log('call');
    
    if (!this.state.processCall && (reload || (this.state.hasMore && !this.state.processCall))) {
      this.setState({
        processCall: true
      });

      const { id, context } = this.props.match.params;
      const { searchValue, loadMore, url , classrooms, nextPageURL } = this.state;

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
            classrooms: onSearch ? data : classrooms.concat(data) ,
            url: nextPageURL !== null ? response.next_page_url : false ,
            hasMore: response.next_page_url ? true : false ,
            processInitClassrooms: false ,
            processCall: false,
            loadMore: false,
          });
        }
      }); 
    }
  }

  callUser(id) {
    UserApi.view({id: id}, result => {
      this.setState({
        user: this.state.user.concat(result.data),
      });
    });
  }

  componentDidMount() {
    if(this.props.match.params.id) {
      this.callUser(this.props.match.params.id);
    }
  }

  componentWillMount() {
    this.callClassroom();
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

          <div className="row mx-0 p-2">
            <div className="col-6 padding-tb-1 d-inline-block">
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

            <div className="col-6 text-right">
              <MiniSearchBox
                placeholder="Cari Kelas"
                onChange={searchValue => this.setState({ searchValue })}
                value={this.state.searchValue}
                onSearch={this.callClassroom.bind(this)}
              />
            </div>
          </div>

          {
            this.state.processInitClassrooms ? <Loader /> : (
              <ClassroomList
                classrooms={ this.state.classrooms } 
                currentIdStudent={ this.props.match.params.id }
                nextPage={ this.nextPage.bind(this) }
                hasMore={ this.state.hasMore }
                callClassroom={ this.callClassroom.bind(this) }
              />
            )
          }
        </div>

        <ClassroomListModal
          currentIdTeacher={this.props.match.params.id}
          callClassroom={ this.callClassroom.bind(this) }
        />
      </div>
    );
  }

}

export default Classrooms;