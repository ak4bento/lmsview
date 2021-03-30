import React, { Component } from 'react';

import helpers from "../../modules/helpers";
import StudentListItem from './StudentListItem';
import TeacherListItem from './TeacherListItem';
import ErrorHandler from '../ErrorHandler';
import ActivityIndicator from '../ActivityIndicator';
import TeachingPeriodApi from "../../api/teachingPeriod";
class List extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeSemester: { key: null, label: 'Lihat Semua' } ,
      semester: [{ key: null, label: 'Lihat Semua' }]
    };

    this.apiTeachingPeriod = new TeachingPeriodApi;
  }

  setActiveSemester(semester  = { key: null, label: 'Lihat Semua' }) {
    this.setState({
      activeSemester: semester
    }, () => {
      this.props.onGetClassrooms(true, this.state.activeSemester.key);
    })
  }

  populateSemester(semester) {
    const allSemester = [{ key: null, label: 'Lihat Semua' }];
    semester.map((data, i) => {
      allSemester.push({key: data.name, label: `Semester ${i + 1}`});
    })

    return allSemester;
  }

  componentDidMount() {
    this.apiTeachingPeriod.index({
      params : { context: 'semester' } ,
      cb: data => { this.setState({ semester: this.populateSemester(data.data) }) },
      err: e => { console.log(e) },
    });
    this.props.onGetClassrooms(false, this.state.activeSemester.key);
  }

  render() {
    let
      valid = !this.props.fetching && !this.props.error,
      // studentClasses = this.props.data.filter( classroom => classroom.self.data.role === 'student' ).slice(0).sort( (a, b) => helpers.sortByDate( a.self.data.lastAccessedAt, b.self.data.lastAccessedAt ) ).reverse(),
      studentClasses = this.props.data.filter(classroom => classroom.self.data.role === 'student').slice(0),
      // teacherClasses = this.props.data.filter( classroom => classroom.self.data.role === 'teacher' ).slice(0).sort( (a, b) => helpers.sortByDate( a.self.data.lastAccessedAt, b.self.data.lastAccessedAt ) ).reverse(),
      teacherClasses = this.props.data.filter(classroom => classroom.self.data.role === 'teacher').slice(0),
      learningEnabled = studentClasses.length > 0,
      teachingEnabled = teacherClasses.length > 0,
      emptyData = !learningEnabled && !teachingEnabled && valid;

    const { activeSemester } = this.state;
    return (
      <div>

        {
          config.role == 'student' && (
            <div className="h3 mb-4 pb-3 border-bottom">
              { activeSemester.key === null ? "Semester" : activeSemester.label}
            </div>
          )
        }

        {
          config.role == 'student' && (
            <nav className="nav nav-pills mb-4">
              {
                this.state.semester.map((semester, index) =>
                  <a
                    key={semester.key}
                    href="#"
                    onClick={e => { e.preventDefault(); this.setActiveSemester(semester); }}
                    className={'nav-item nav-link px-2 py-1'
                      // + (this.state.filter.key === filter.key ? ' active' : '')
                    }>
                    {semester.label}
                  </a>
                )
              }    
            </nav>
          )
        }

        {emptyData &&
          <div className="row mx-0 px-0 align-items-center justify-content-center">
            <img src="/images/search-icon.png" width="80px" height="80px" className="d-inline-block px-2 py-2" />
            <div className="d-inline-block text-center text-md-left">
              <h6 className="mx-0 px-0 my-0 py-0"> Tidak ada kelas yang Anda ikuti.</h6>
              <p className="strong"> Silahkan menghubungi Admin. </p>
            </div>
          </div>

        }

        {
          this.props.fetching &&
          studentClasses.length === 0 &&
          teacherClasses.length === 0 &&
          <ActivityIndicator />
        }

        {
          this.props.error &&
          <ErrorHandler message="Failed to fetch classes." retryAction={() => this.props.onGetClassrooms()} />
        }

        <div className={"fade" + (learningEnabled ? ' show' : '')}>
          {
            learningEnabled &&
            (
              <div className="mb-5">
                <h6 className="text-uppercase">
                  <span> Yang sedang diikuti </span>
                  <span className="badge badge-pill badge-secondary ml-2">{studentClasses.length}</span>
                </h6>

                <ul className="list-group">
                  {
                    studentClasses.map((classroom, index) => (
                      <StudentListItem key={classroom.slug} featured={index === 0} {...classroom} />
                    ))
                  }
                </ul>
              </div>
            )
          }
        </div>

        <div className={"fade" + (teachingEnabled ? ' show' : '')}>
          {
            teachingEnabled &&
            <div>
              <h6 className="text-uppercase">
                <span> Kelas Ajar </span>
                <span className="badge badge-pill badge-secondary ml-2">{teacherClasses.length}</span>
              </h6>

              <ul className="list-group rounded shadowed">
                {
                  teacherClasses.map(classroom => (
                    <TeacherListItem key={classroom.slug} {...classroom} />
                  ))
                }
              </ul>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default List;