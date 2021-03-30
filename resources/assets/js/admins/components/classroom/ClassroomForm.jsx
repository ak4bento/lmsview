import React, { Component } from "react";
import {
  Redirect,
  Link
} from "react-router-dom";
import moment from 'moment';

import {
  FormInput,
  FormSelect,
  FormDateTime,
  TextEditor
} from "../../../components/Form";

import teachingPeriodApi from '../../api/teachingPeriod';
import subjectApi from '../../api/subject';
import classroomApi from '../../api/classroom';
import categoriesApi from '../../api/catgories';

class ClassroomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      teachingPeriods: { 0: '--Pilih--' },
      teachingPeriod: '',
      subjects: { 0: '--Pilih--' },
      subject: '',
      code: '',
      faculties: { 0: '--Pilih--' },
      faculty: '',
      majors: { 0: '--Pilih--' },
      major: '',
      isSubmitSuccess: false,
      onSubmitProcess: false,
      starttime: moment(),
      endtime: moment(),
    }

    this._descriptionEditor = null;
  }

  save(e) {
    this.setState({
      onSubmitProcess: true
    });

    const form = {
      title: this.state.title,
      description: this.state.description,
      subject: this.state.subject,
      code: this.state.code,
      teachingPeriod: this.state.teachingPeriod,
      major: this.state.major,
      starttime: this.state.starttime.format("YYYY-MM-DD HH:MM"),
      endtime: this.state.endtime.format("YYYY-MM-DD HH:MM")
    }

    if (this.props.match.params.slug) {
      classroomApi.update(
        { form, id: this.props.match.params.slug },
        (res, err) => {
          this.setState({
            onSubmitProcess: false,
            isSubmitSuccess: !err ? res.isSuccess ? true : false : false
          })
        }
      )
    } else {
      classroomApi.store({
        form
      }, (res, err) => {
        this.setState({
          onSubmitProcess: false,
          isSubmitSuccess: !err ? res.classroom ? true : false : false
        });
      });
    }

    e.preventDefault();
  }

  callSubject() {
    subjectApi.index(
      { params: { all: true } },
      subjects => {
        const subjectObj = { 0: '--Pilih--' };
        subjects.map(subject => {
          subjectObj[subject.id] = subject.title;
        });
        this.setState({ subjects: subjectObj });
      }
    );
  }

  callTeachingPeriod() {
    teachingPeriodApi.index(
      { all: true },
      result => {
        const teachingPeriodObj = { 0: '--Pilih--' };
        result.data.map(teachingPeriod => {
          teachingPeriodObj[teachingPeriod.id] = teachingPeriod.name;
        });
        this.setState({ teachingPeriods: teachingPeriodObj });
      }
    );
  }

  callFauclties() {
    categoriesApi.index(
      { params: { context: 'parent' } },
      faculties => {
        const facultiesObj = { 0: '--Pilih--' };
        faculties.map(faculty => {
          facultiesObj[faculty.id] = faculty.name;
        });
        this.setState({ faculties: facultiesObj });
      }
    );
  }

  callClassroom(slug) {
    classroomApi.view(
      { id: slug },
      (result, err) => {
        if (!err) {
          this.setState({
            title: result.data.title,
            code: result.data.code,
            description: result.data.description,
            subject: result.data.subject_id,
            teachingPeriod: result.data.teaching_period_id,
            major: result.data.major,
            faculty: result.data.faculty,
            starttime: moment(result.data.start_at),
            endtime: moment(result.data.end_at)
          }, () => this.callMajor(result.data.faculty));

          this._descriptionEditor.setIntitialState(result.data.description);
        }
      }
    );
  }

  handleChangeFaculty(e) {
    if (e.currentTarget.value) {
      this.callMajor(e.currentTarget.value);
    }

    this.setState({
      faculty: e.currentTarget.value
    })
  }

  callMajor(faculty) {
    this.setState({ onProgressMajor: true });
    categoriesApi.index(
      { params: { context: 'child', parent_id: faculty } },
      majors => {
        const majorObj = { 0: '--Pilih--' };
        majors.map(major => {
          majorObj[major.id] = major.name;
        });
        this.setState({ majors: majorObj, onProgressMajor: false });
      }
    );
  }

  componentWillMount() {
    this.callSubject();
    this.callTeachingPeriod();
    this.callFauclties();

    if (this.props.match.params.slug) {
      this.callClassroom(this.props.match.params.slug);
    }
  }

  render() {
    if (this.state.isSubmitSuccess) {
      return <Redirect to='/classroom' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/classroom" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">
          <form onSubmit={this.save.bind(this)}>
            <div className="border-bottom">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Informasi
              </p>

              <FormInput
                label="Judul"
                placeholder="Contoh: Kewarganegaraan Kelas A"
                value={this.state.title}
                onChange={(e) => this.setState({ title: e.currentTarget.value })}
              />

              <FormInput
                label="Kode Kelas"
                value={this.state.code}
                onChange={(e) => this.setState({ code: e.currentTarget.value })}
              />

              <FormSelect
                label="Mata Kuliah"
                options={this.state.subjects}
                value={this.state.subject}
                onChange={(e) => this.setState({ subject: e.currentTarget.value })}
              />

              <FormSelect
                label="Tahun Ajar"
                options={this.state.teachingPeriods}
                value={this.state.teachingPeriod}
                onChange={(e) => this.setState({ teachingPeriod: e.currentTarget.value })}
              />

              <FormSelect
                label="Fakultas"
                options={this.state.faculties}
                value={this.state.faculty || ""}
                onChange={this.handleChangeFaculty.bind(this)}
              />

              <FormSelect
                label="Jurusan"
                disabled={this.state.onProgressMajor}
                options={this.state.majors}
                value={this.state.major || ""}
                onChange={(e) => this.setState({ major: e.currentTarget.value })}
              />

              <div className="form-group">
                <FormDateTime
                  label="Kelas Mulai"
                  startDate={this.state.starttime}
                  onChange={(dateValue) => this.setState({ starttime: dateValue })}
                />

                <FormDateTime
                  label="Kelas Selesai"
                  startDate={this.state.endtime}
                  onChange={(dateValue) => this.setState({ endtime: dateValue })}
                />
              </div>
            </div>

            <div className="p-4">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Deskripsi
              </p>

              <TextEditor
                initialState={this.state.description}
                onChange={(value) => this.setState({ description: value })}
                ref={(child) => { this._descriptionEditor = child; }}
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

export default ClassroomForm;
