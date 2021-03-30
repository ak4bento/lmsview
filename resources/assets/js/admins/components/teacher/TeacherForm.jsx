import React, { Component } from "react";
import moment from 'moment';
import {
  Redirect,
  Link
} from "react-router-dom";

import TeacherFormAccountInformation from './TeacherFormAccountInformation';
import TeacherFormEmail from './TeacherFormEmail';

import userApi from '../../api/user';

class TeacherForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      faculties: { 0: '--Pilih--' },
      password: '',
      faculty: '',
      majors: { 0: '--Pilih--' },
      major: '',
      nip: '',
      birthdate: moment(),
      email: '',
      onProgressMajor: false,
      onSubmitProcess: false
    }

    this.child = React.createRef();
  }

  save(e) {
    this.setState({
      onSubmitProcess: true
    });

    const form = {
      name: this.state.name,
      nip: this.state.nip,
      birthdate: this.state.birthdate ? this.state.birthdate.format("YYYY-MM-DD") : this.state.birthdate,
      password: this.state.password,
      major: this.state.major,
      context: 'teacher'
    };

    if (this.state.email) {
      form.email = this.state.email;
    }

    if (this.props.match.params.id) {
      //update teacher
      userApi.update(
        { form, id: this.props.match.params.id },
        (res, err) => {
          this.setState({
            onSubmitProcess: false,
            isSubmitSuccess: (!err && res.user) ? true : false
          });

        }
      )
    } else {
      //create new teacher
      userApi.store(
        { form },
        (res, err) => {
          this.setState({
            onSubmitProcess: false,
            isSubmitSuccess: (!err && res.user) ? true : false
          });

        }
      )
    }

    e.preventDefault();
  }

  callTeacher(id) {
    userApi.view({ id }, (res, err) => {
      if (!err) {
        const detail = res.data.detail ? JSON.parse(res.data.detail) : {};
        const { category } = res.data;

        this.setState({
          name: res.data.name,
          nip: detail.nip ? detail.nip : '',
          email: res.data.email,
          faculty: category ? category.data.parent.data.id : null,
          major: category ? category.data.id : null,
          birthdate: moment(detail.birthdate, 'YYYY-MM-DD')
        }, () => {
          //execute callMajor function inside studdentFormAccountInformation.jsx to get list major based on faculty
          this.child.current.callMajor(this.state.faculty);
        });
      }
    });
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      this.callTeacher(this.props.match.params.id);
    }
  }

  render() {
    if (this.state.isSubmitSuccess) {
      return <Redirect to='/teacher' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/teacher" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">

          {this.state.isSubmitSuccess ?

            <div className="alert alert-primary" role="alert">
              Mohon cek email user untuk memulai pembuatan
              password dan penggunaan LMS
            </div>

            :

            <form onSubmit={this.save.bind(this)}>
              <TeacherFormAccountInformation ref={this.child} {...this.state} setState={this.setState.bind(this)} />
              <TeacherFormEmail email={this.state.email} setState={this.setState.bind(this)} />

              <div className=" text-right padding-tb-1">
                <Link to="teacher" className="link third-link padding-half" disabled={this.state.onSubmitProcess}>
                  Batal
              </Link>

                <button type="submit" className="btn btn-primary" disabled={this.state.onSubmitProcess}>
                  Simpan
              </button>
              </div>
            </form>

          }

        </div>
      </div>
    );
  }
}

export default TeacherForm;
