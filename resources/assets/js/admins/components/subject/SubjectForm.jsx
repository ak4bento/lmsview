import React, { Component } from "react";
import {
  Redirect,
  Link
} from "react-router-dom";
import {
  FormInput,
  FormSelect,
  TextEditor
} from "../../../components/Form";

import subjectApi from '../../api/subject';
import categoriesApi from '../../api/catgories';

class SubjectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "" ,
      code: "" ,
      description: "" ,
      faculties: {0: '--Pilih--'} ,
      faculty: "" ,
      majors: {0: '--Pilih--'} ,
      major: "" ,
      onProgressMajor: false ,
      onSubmitProcess: false
    }

    this._descriptionEditor = null;
  }

  handleChangeFaculty(e) {
    this.setState({ onProgressMajor: true });
    if (e.currentTarget.value) {
      this.callMajor(e.currentTarget.value);
    }

    this.setState({
      faculty: e.currentTarget.value
    })
  }

  save(e) {
    this.setState({
      onSubmitProcess: true
    });

    const { title, code, description, major } = this.state;
    const { id } = this.props.match.params;
    const form = {
      title ,
      code ,
      description ,
      major
    }
    if ( id ) {
      subjectApi.update({
        id ,
        form
      }, (res, err) => {
        this.setState({
          onSubmitProcess: false ,
          isSubmitSuccess: err ? false : res.subject ? true : false
        });
      });
    } else {
      subjectApi.store({
        form
      }, (res, err) => {
        this.setState({
          onSubmitProcess: false ,
          isSubmitSuccess: err ? false : res.subject ? true : false
        });
      });
    }
    
    e.preventDefault();
  }

  callFauclties() {
    categoriesApi.index(
      { params: { context: 'parent' } } ,
      (faculties, err) => {
        if (!err) {
          const facultiesObj = {0: '--Pilih--'};
          faculties.map(faculty => {
            facultiesObj[faculty.id] = faculty.name;
          });
          this.setState({faculties: facultiesObj});
        }
      }
    );
  }

  callMajor(faculty) {
    categoriesApi.index(
      { params: { context: 'child' , parent_id: faculty } } ,
      ( majors, err) => {
        if (!err) {
          const majorObj = {0: '--Pilih--'};
          majors.map(major => {
            majorObj[major.id] = major.name;
          });
          this.setState({majors: majorObj, onProgressMajor: false});
        }
      }
    );
  }

  callSubject(id) {
    subjectApi.view({id: id}, (result, err) => {
      if (!err) {
        const { title, code, description, category } = result;
        this._descriptionEditor.setIntitialState(description);
        this.setState({
          title ,
          code ,
          description ,
          major: category.id ,
          faculty: category.parent_id
        }, _ => {
          this.callMajor(category.parent_id);
        });
      }
    });
  }

  componentWillMount() {
    this.callFauclties();
    const { id } = this.props.match.params;
    if (id) {
      this.callSubject(id);
    }
  }

  render() {
    if (this.state.isSubmitSuccess) {
      return <Redirect to='/subject' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/subject" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">
          <form onSubmit={this.save.bind(this)}>
            <div className="border-bottom">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Informasi
              </p>

              <FormInput
                label="Judul Mata Kuliah"
                placeholder="Masukkan Judul Mata Kuliah"
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.currentTarget.value })}
              />

              <FormInput
                label="Kode Mata Kuliah"
                value={this.state.code}
                onChange={(e) => this.setState({ code: e.currentTarget.value })}
              />

              <FormSelect
                label="Fakultas"
                options={this.state.faculties}
                value={this.state.faculty}
                onChange={this.handleChangeFaculty.bind(this)}
              />

              <FormSelect
                label="Jurusan"
                disabled={this.state.onProgressMajor}
                options={this.state.majors}
                value={this.state.major}
                onChange={(e) => this.setState({ major: e.currentTarget.value })}
              />
            </div>
            <div className="border-bottom">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Deskripsi
              </p>

               <TextEditor
                  onChange={value => this.setState({description: value})}
                  ref={child => { this._descriptionEditor = child; }}
              />
            </div>

            <div className="grey-bg text-right padding-tb-1">
              <Link to="student" className="link third-link padding-half" disabled={this.state.onSubmitProcess}>
                Batal
              </Link>

              <button type="submit" className="btn btn-primary" disabled={this.state.onSubmitProcess}>
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default SubjectForm;
