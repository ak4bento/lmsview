import React, { Component } from 'react';
import { Link } from "react-router-dom";

import UserList from "./UserList";
import UserListModal from "./UserListModal";
import Loader from '../../../components/Loader';
import SearchBox from '../SearchBox';
import Helper from '../../modules/helpers';

import classRoomApi from "../../api/classroom";

class Users extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
      url: false,
      hasMore: true,
      processInitUsers: true,
      processCall: false,
      onSearch: false,
      loadMore: false,
      searchValue: null
    }
  }

  callUser() {
    if ((this.state.hasMore || this.state.onSearch) && !this.state.processCall) {
      this.setState({
        processCall: true
      });

      const { slug, context } = this.props.match.params;

      const params = {
        q: this.state.searchValue || null,
        page: this.state.loadMore ? Helper.getQueryString('page', this.state.url) : 1
      };

      classRoomApi.index({
        url: `/${slug}/${context}`,
        params
      }, (response, err) => {
        const data = response ? response.data : [];

        if (!err) {
          this.setState({
            users: this.state.onSearch ? data : this.state.users.concat(data),
            url: response ? response.next_page_url : null,
            hasMore: response ? response.next_page_url ? true : false : false,
            processInitUsers: false,
            processCall: false,
            onSearch: false,
            loadMore: false
          });
        } else {
          this.setState({ processInitUsers: false });
        }
      });
    }
  }

  recallUser() {
    this.setState({
      users: [],
      url: null,
      processInitUsers: true,
      hasMore: true
    }, () => {
      this.callUser();
    });
  }

  searchUser() {
    this.setState({
      onSearch: true
    }, () => this.callUser());
  }

  handleChangeSearch(e) {
    this.setState({ searchValue: e.currentTarget.value });

    if (!e.currentTarget.value) {
      this.searchClassroom();
    }
  }

  nextPage() {
    if (this.state.hasMore && !this.state.processCall) {
      this.setState({ loadMore: true }, () => this.callUser());
    }
  }

  componentWillMount() {
    this.callUser();
  }

  render() {
    return (
      <div className="d-block padding-2 text-left">
        <Link to="/classroom" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <SearchBox
          label={`Cari ${this.props.match.params.context === 'students' ? 'Mahasiswa' : 'Dosen'}`}
          placeholder="Contoh: Andi Mardinus "
          onChange={this.handleChangeSearch.bind(this)}
          onSubmit={this.searchUser.bind(this)}
          value={this.state.searchValue}
        />

        <div className="padding-tb-1">
          <div className="padding-tb-1 d-block text-right">
            <a href="#"
              className="button primary-button"
              data-toggle="modal"
              data-target="#user-list-modal"
              onClick={() => {
                $('#user-list-modal').modal('show');
                return;
              }}
            >
              <i className="fa fa-plus"> </i> Tambahkan {this.props.match.params.context === 'students' ? 'Mahasiswa' : 'Dosen'}
            </a>
          </div>

          {
            this.state.processInitUsers ? <Loader /> : (
              <UserList
                users={this.state.users}
                recallUser={this.recallUser.bind(this)}
                hasMore={this.state.hasMore}
                currentClassroom={this.props.match.params.slug}
                nextPage={this.nextPage.bind(this)}
              />
            )
          }
        </div>

        <UserListModal
          currentClassroom={this.props.match.params.slug}
          context={this.props.match.params.context}
          recallUser={this.recallUser.bind(this)}
        />
      </div>
    );
  }
}

export default Users;
