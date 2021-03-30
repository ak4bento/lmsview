import React, { Component } from 'react';
import { Link } from "react-router-dom";

import { getPending } from "../../modules/prerequisites";
import { language } from '../../../modules/language';

class TeachableItemPrerequisites extends Component {

  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      pendingPrerequisites: [],
    };
  }

  componentDidMount() {
    this.validate(this.props.data, this.props.teachables);
  }

  componentWillReceiveProps(nextProps) {
    this.validate(nextProps.data, nextProps.teachables);
  }

  validate(prereqs, teachables) {
    this.setState({ pendingPrerequisites: getPending(prereqs, teachables) });
  }

  render() {
    if (this.state.pendingPrerequisites.length === 0)
      return null;

    return (
      <div className="border border-info text-info rounded px-3 py-2 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <i className="fas fa-exclamation-triangle mr-2"></i> Anda perlu menyelesaikan item lain sebelum melanjutkan
          </div>
          <div>
            <a href="#" className="text-info text-link" onClick={e => { e.preventDefault(); this.setState({ expanded: !this.state.expanded }) }}>
              {this.state.expanded ? 'Sembunyikan' : 'Perlihatkan'} detail <i className={"fas fa-chevron-" + (this.state.expanded ? 'up' : 'down')}></i>
            </a>
          </div>
        </div>

        <div className={!this.state.expanded ? 'd-none' : 'mt-3'}>
          <div className="text-info">Selesaikan item-item ini terlebih dahulu:</div>
          <ul>
            {
              this.state.pendingPrerequisites.map(prerequisite => (
                <li key={prerequisite.id}>
                  <Link to={'/classroom/' + this.props.classroom + '/teachable/' + prerequisite.requirable.data.id} className="text-link text-info">
                    [{language[prerequisite.requirable.data.type]}] {prerequisite.requirable.data.teachableItem.data.title || 'No title'}
                  </Link>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    );
  }
}

export default TeachableItemPrerequisites;