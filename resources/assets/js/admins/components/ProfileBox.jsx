import React, { Component } from 'react';

class ProfileBox extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-sm-6 col-md-6">
            <div className="row">
              <div className="col-sm-6 col-md-4">
                <img src="http://placehold.it/100x110" alt="" className="img-rounded img-responsive" />
              </div>
              <div className="col-sm-6 col-md-8">
                <h4>{user.name}</h4>
                {/* <h4> Universitas Hasanuddin </h4>   */}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default ProfileBox;