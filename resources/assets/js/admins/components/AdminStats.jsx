import React, { Component } from 'react';
import {
  Link
} from "react-router-dom";

import Loader from '../../components/Loader.jsx';

class AdminStats extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="col-md-3 col-6 text-center py-2 py-md-0">
        <div className="circle-tile shadowed border-box white-bg rounded p-2 p-relative">

          {!this.props.isLoading ?

            <div>

              <div className={this.props.iconClass}>
                <i className={this.props.icon}></i>
              </div>

              <div className="dark-blue">

                <div className="text-strong h4">
                  {this.props.stats}
                </div>

                <div className="text-faded">
                  {this.props.label}
                </div>

                <Link to={this.props.link} className="text-secondary text-small">
                  Lebih lanjut <i className="fa fa-chevron-circle-right"></i>
                </Link>

              </div>
            </div> :

            <Loader />

          }

        </div>


      </div>
    )
  }
}

export default AdminStats;