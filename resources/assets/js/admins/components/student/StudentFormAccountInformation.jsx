import React, { Component } from 'react';
import {
  FormInput,
  FormSelect,
  FormDate
} from "../../../components/Form";

import categoriesApi from '../../api/catgories';
import teachingPeriodApi from '../../api/teachingPeriod';

class AccountInformationComponent extends Component {
  constructor(props) {
    super(props);
  }

  handleChangeFaculty(e) {
    this.props.setState({ onProgressMajor: true });
    if (e.currentTarget.value) {
      this.callMajor(e.currentTarget.value);
    }

    this.props.setState({
      faculty: e.currentTarget.value
    })
  };

  callMajor(faculty) {
    categoriesApi.index(
      { params: { context: 'child', parent_id: faculty } },
      (majors, err) => {
        if (!err) {
          const majorObj = { 0: '--Pilih--' };
          majors.map(major => {
            majorObj[major.id] = major.name;
          });
          this.props.setState({ majors: majorObj, onProgressMajor: false });
        }
      }
    );
  }

  callFaculty() {
    categoriesApi.index(
      { params: { context: 'parent' } },
      (faculties, err) => {
        if (!err) {
          const facultiesObj = { 0: '--Pilih--' };
          faculties.map(faculty => {
            facultiesObj[faculty.id] = faculty.name;
          });
          this.props.setState({ faculties: facultiesObj });
        }
      }
    );
  }

  callTeachingPeriod() {
    this.props.setState({ onProgressTeachingPeriod: true });
    teachingPeriodApi.index(
      { params: { page: 'all'} },
      (teachingPeriods, err) => {
        if (!err) {
          const teachingPeriodObj = { 0: '--Pilih--' };
          teachingPeriods.data.map(teachingPeriod => {
            teachingPeriodObj[teachingPeriod.id] = teachingPeriod.name;
          });
          this.props.setState({ teachingPeriods: teachingPeriodObj, onProgressTeachingPeriod: false });
        }
      }
    );
  }

  componentWillMount() {
    this.callFaculty();
    this.callTeachingPeriod();
  }

  render() {
    const { faculties, majors, birthdate, onProgressMajor, teachingPeriods, onProgressTeachingPeriod } = this.props;
    return (
      <div className="pb-4">
        <p className="text primary-text text-upper small-text padding-tb-half">
          Informasi Umum
        </p>
        <FormInput
          label="Nama"
          placeholder="Masukkan Nama Mahasiswa"
          onChange={(e) => this.props.setState({ name: e.currentTarget.value })}
          value={this.props.name}
        />

        <FormInput
          type="password"
          label="Password"
          placeholder="Masukkan password"
          onChange={e => this.props.setState({ password: e.currentTarget.value })}
          value={this.props.password}
        />

        <FormSelect
          label="Fakultas"
          options={faculties}
          onChange={this.handleChangeFaculty.bind(this)}
          value={this.props.faculty}
        />

        <FormSelect
          label="Jurusan"
          disabled={onProgressMajor}
          options={majors}
          onChange={e => this.props.setState({ major: e.currentTarget.value })}
          value={this.props.major}
        />

        <FormSelect
          label="Tahun Ajaran Masuk"
          disabled={onProgressTeachingPeriod}
          options={teachingPeriods}
          onChange={e => this.props.setState({ teachingPeriod: e.currentTarget.value })}
          value={this.props.teachingPeriod}
        />

        <FormInput
          label="Nim"
          placeholder="Masukkan Nomor Induk Mahasiswa"
          onChange={(e) => this.props.setState({ nim: e.currentTarget.value })}
          value={this.props.nim}
        />

        <FormDate
          label="Tanggal Lahir"
          placeholder="Tanggal Lahir"
          startDate={birthdate}
          onChange={(dateValue) => this.props.setState({ birthdate: dateValue })}
          value={this.props.brithdate}
        />
      </div>
    )
  }
}

export default AccountInformationComponent;