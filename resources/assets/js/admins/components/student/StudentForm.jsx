import React, { Component } from "react";
import moment from 'moment';
import {
  Redirect,
  Link
} from "react-router-dom";

import StudentFormAccountInformation from './StudentFormAccountInformation';
import StudentFormEmailComponent from "./StudentFormEmail";

import userApi from '../../api/user';

class StudentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      faculties: { 0: '--Pilih--' },
      faculty: '',
      majors: { 0: '--Pilih--' },
      teachingPeriods: { 0: '--Pilih--' },
      teachingPeriod: '',
      major: '',
      nim: '',
      birthdate: moment(),
      email: '',
      password: '',
      onProgressMajor: false,
      onProgressTeachingPeriod: false,
      onSubmitProcess: false
    }

    this.child = React.createRef();
  }

  saveStudent(e) {
    this.setState({
      onSubmitProcess: true
    });

    const form = {
      name: this.state.name,
      nim: this.state.nim,
      birthdate: this.state.birthdate ? this.state.birthdate.format("YYYY-MM-DD") : this.state.birthdate,
      major: this.state.major,
      password: this.state.password,
      teachingPeriod: this.state.teachingPeriod,
      context: 'student'
    };

    if (this.state.email) {
      form.email = this.state.email;
    }

    if (this.props.match.params.id) {
      //update student
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
      //create new student
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

  callStudent(id) {
    userApi.view({ id }, (res, err) => {
      if (!err) {
        const detail = res.data.detail ? JSON.parse(res.data.detail) : {};
        const { category } = res.data;
        this.setState({
          name: res.data.name,
          nim: detail.nim,
          email: res.data.email,
          faculty: category.data.parent.data.id,
          major: category.data.id,
          teachingPeriod: detail.teachingPeriod ? detail.teachingPeriod : '',
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
      this.callStudent(this.props.match.params.id);
    }
  }

  render() {
    if (this.state.isSubmitSuccess) {
      return <Redirect to='/student' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/student" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">

          {
            !this.state.isSubmitSuccess ? (
              <form onSubmit={this.saveStudent.bind(this)}>
                <StudentFormAccountInformation ref={this.child} {...this.state} setState={this.setState.bind(this)} />
                <StudentFormEmailComponent email={this.state.email} setState={this.setState.bind(this)} />

                <div className="text-right padding-tb-1">
                  <Link to="student" className="link third-link padding-half" disabled={this.state.onSubmitProcess}>
                    Batal
                  </Link>

                  <button type="submit" className="btn btn-primary" disabled={this.state.onSubmitProcess}>
                    Simpan
                  </button>
                </div>
              </form> 
            ) : (
              <div className="alert alert-primary" role="alert">
                Mohon cek email user untuk memulai pembuatan
                password dan penggunaan LMS
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default StudentForm;
