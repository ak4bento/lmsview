import React, { Component, Fragment } from 'react';
import Teachable from '../../api/teachables';
import User from '../../api/user';
import Modal from 'react-responsive-modal';

import StudentList from './AssignmentStudent';
import Form from './AssignmentFormReview';

class AssignmentReview extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.api = new Teachable();
    this.apiUser = new User();
    this.state = {
      done: 0 ,
      undone: 0 ,
      openModal: false ,
      activeStudent: false ,
      students: []
    }
  }

  callStudents() {
    this.apiUser.index({
      params: {context: 'studentAssignment', teachable: this.props.teachable.id} ,
      cb: result => this.setState({students: result.data}) ,
      err: err => console.log(err)
    });
  }

  recallStudents() {
    this.setState({
      students: []
    }, () => {
      this.callStudents();
    });
  }

  componentWillMount() {
    this.recallStudents();
  }

  componentDidMount() {
    this.api.show({
      id: this.props.teachable.id ,
      params: {context: 'statistik'} ,
      cb: result => this.setState({done: result.done, undone: result.undone}) ,
      err: err => console.log(err)
    });

    this.callStudents();
  }

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center align-items-center text-muted mb-4" style={{minHeight: "200px"}}>
          <div className="bg-white border w-100">
            <div className="mx-4 my-5">
              <p>
                <a style={{color: 'green'}}>{this.state.done}</a> Siswa Telah Menyelesaikan tugas
                { 
                  this.state.undone > 0 ? 
                    <span>, <a style={{color: 'red'}}>{this.state.undone}</a> Siswa Belum mengerjakan</span> : null
                }
              </p>
              <button className="btn btn-primary" onClick={() =>this.setState({openModal: true})}>
                Periksa<i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        </div>

        <Modal 
          open={this.state.openModal} 
          onClose={() => this.setState({openModal: false})} 
          center
          >
          <div className="bg-white" style={{minWidth: "700px", maxHeight: "400px", overflow: "auto"}}>
            <div className="h3 mb-4" style={{marginTop: "20px"}}>Student Assignment</div>
            {
              this.state.activeStudent ? (
                <Form 
                /** push single data within form */
                  {...this.props} 
                  students={this.state.students} 
                  activeStudent={this.state.activeStudent} 
                  setState={this.setState.bind(this)}
                  callStudents={this.callStudents.bind(this)}
                />
              ) : (
                <StudentList 
                /** push index data */
                  {...this.props} 
                  students={this.state.students}
                  setState={this.setState.bind(this)}
                />
              )
            }
          </div>
        </Modal>
      </div>
    );
  }
}

export default AssignmentReview;