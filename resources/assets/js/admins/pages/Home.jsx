import React, { Component } from 'react';
// import { bindActionCreators } from 'redux';
// import { connect } from 'react-redux';
// import * as actions from "../actions";
import DashboardApi from "../api/dashboard";

import AdminStats from '../components/AdminStats.jsx';
import AdminList from '../components/AdminList.jsx';
import AdminListQuiz from '../components/AdminListQuiz.jsx';
import AdminAlerts from '../components/AdminAlerts.jsx';
import AdminBars from '../components/AdminBars.jsx';

import Loader from '../../components/Loader.jsx'

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classrooms: [],
      quizzes: [],
      statsTeacher: '',
      statsStudent: '',
      statsClassroom: '',
      statsSubject: '',
      alertEnroll: '',
      alertMaterial: '',
      statusClass: '',
      classComplete: '',
      classProgress: '',
      studentStart: '',
      studentProgress: '',
      highScore: [],
      leastScore: [],
      stats: '',
      isLoading: true

    }
  }

  callDashboard() {
    DashboardApi.index(
      { params: { context: 'admin' } },
      (response, err) => {
        console.log(err);

        if (response) {
          this.setState({
            classrooms: this.state.classrooms.concat(response.listClassrooms),
            quizzes: this.state.quizzes.concat(response.listQuizzes),

            statsClassroom: response.classroom,
            statsStudent: response.student,
            statsTeacher: response.teacher,
            statsSubject: response.subject,

            alertEnroll: response.alertClassroomEnroll,
            alertMaterial: response.alertClassroomMaterial,
            classProgress: response.classroomProgress,

            statusClass: response.classroomStatus,
            classComplete: response.classroomComplete,

            studentStart: response.studentStatusNotStart,
            studentProgress: response.studentProgress,
            highScore: response.studentHighScore,
            leastScore: response.studentLeastScore,

            isLoading: false
          });
        }
      });
  }

  componentDidMount() {
    this.callDashboard();
  }

  render() {

    const labelUser = [
      { label: 'Dosen', icon: 'fa fa-graduation-cap', iconClass: 'text-primary', link: '/teacher', stats: this.state.statsTeacher },
      { label: 'Mahasiswa', icon: 'fa fa-users', iconClass: 'text-secondary', link: '/student', stats: this.state.statsStudent },
      { label: 'Kelas', icon: 'fa fa-building', iconClass: 'text-warning', link: '/classroom', stats: this.state.statsClassroom },
      { label: 'Mata Kuliah', icon: 'fa fa-bookmark', iconClass: 'text-danger', link: '/subject', stats: this.state.statsSubject },
    ]

    const labelAlert = [
      { label: 'Kelas Kosong ', alert: this.state.alertEnroll, statstype: 'danger' },
      { label: 'Kelas tanpa materi ajar', alert: this.state.alertMaterial, statstype: 'danger' },
      { label: 'Kelas tanpa progress', alert: this.state.classProgress, statstype: 'danger' }
    ]

    const labelProgress = [
      { label: 'ACTIVE', progress: this.state.statusClass, type: "bg-success" },
      { label: 'STUDENT NOT YET STARTED', progress: this.state.studentStart, type: "bg-danger" },
      { label: 'IN PROGRESS', progress: this.state.studentProgress, type: "bg-info" },
      // { label: 'STUDENT WHO COMPLETED', progress: this.state. }
    ]

    return (
      <div className="col-md-9 col-lg-10 padding-tb-1 ">
        <div className="d-block padding-2 text-left">

          <div className="row">
            <div className="col-lg-8 row mx-0 px-0 py-4 py-lg-0">

              {
                labelUser.map(data =>

                  <AdminStats
                    label={data.label}
                    icon={data.icon}
                    iconClass={data.iconClass}
                    link={data.link}
                    stats={data.stats}
                    isLoading={this.state.isLoading}
                  />

                )
              }

            </div>

            <div className="col-lg-4 py-4 py-lg-0">
              <div className="d-block px-4">
                <p className="h5 strong text-upper"> Alerts </p>

                {!this.state.isLoading ?

                  labelAlert.map(data =>
                    <AdminAlerts
                      label={data.label}
                      alert={data.alert}
                      statstype={data.statstype}
                    />
                  )

                  :
                  <Loader />
                }



              </div>
            </div>
          </div>

        </div>

        <div className="row mx-0 p-4 ">
          <div className="col-lg-6 mx-0 ">

            <p className="h5 strong text-upper"> Upcoming Classrooms </p>

            <AdminList
              classrooms={this.state.classrooms}
              callDashboard={this.callDashboard.bind(this)}
              isLoading={this.state.isLoading}
            />

          </div>

          <div className="col-lg-6 mx-0 py-4 py-lg-0 ">
            <p className="h5 strong text-upper pb-2"> Progress </p>

            {!this.state.isLoading ?

              labelProgress.map((data, i) =>
                <AdminBars
                  labelBar={data.label}
                  progress={data.progress}
                  type={data.type}
                  key={i}
                />
              )

              :
              <Loader />
            }


          </div>
        </div>

        <div className="row mx-0 p-4">
          <div className="d-block w-100 p-4">
            <p className="h5 strong text-uppercase"> Quiz  </p>

            {!this.state.isLoading ?

              <AdminListQuiz
                quizzes={this.state.quizzes}
                callDashboard={this.callDashboard.bind(this)}
              />

              :
              <Loader />
            }


          </div>
        </div>

      </div>
    )
  }
}

// export default connect(
//   state => ({  }),
//   dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
// )( Home );
export default Home;
