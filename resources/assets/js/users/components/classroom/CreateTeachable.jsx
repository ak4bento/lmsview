import React, { Component } from 'react';
import { Link } from "react-router-dom";

class CreateTeachable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };
  }

  render() {
    return (
      <div className="mb-3">
        <button
          type="button"
          onClick={() => this.setState({ expanded: !this.state.expanded })}
          className={"btn btn-lg btn-block" + (this.state.expanded ? ' btn-muted text-grey' : ' btn-primary')}>
          <i className="fas fa-plus-circle"></i> Buat bahan ajar baru
        </button>
        {
          this.state.expanded &&
          (
            <div className="p-4">
              <div className="row">
                {
                  teachableTypes.map(teachableType => (
                    <div className="col-4" key={teachableType.key}>
                      <Link to={'/classroom/' + this.props.classroom + '/teachable/create/' + teachableType.key} className="d-flex flex-column align-items-center p-3 text-link">
                        <div className="display-3 text-primary mb-3"><i className={"fas fa-" + teachableType.icon}></i></div>
                        <div className="h5 text-uppercase mb-2">{teachableType.label}</div>
                        <div className="text-muted small text-center">{teachableType.helpText}</div>
                      </Link>
                    </div>
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
    );
  }
}

const teachableTypes = [
  { key: 'resource', icon: 'copy', label: 'Resource', helpText: 'Media or documents for students to watch, listen and read' },
  { key: 'assignment', icon: 'pen-alt', label: 'Assignment', helpText: 'Gradeable task with a predefined submission date' },
  { key: 'quiz', icon: 'tasks', label: 'Quiz', helpText: 'Graded set of questions with a predefined completion date' },
];

export default CreateTeachable;