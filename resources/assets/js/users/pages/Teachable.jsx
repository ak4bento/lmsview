import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from "lodash";

import TeachablesApi from "../api/teachables";
import ServiceAccessor from '../components/ServiceAccessor';
import * as actions from "../actions";
import TeachableTeacher from './TeachableTeacher';
import TeachableStudent from './TeachableStudent';
import { ActivityIndicator } from '../components';

class Teachable extends Component {
  constructor(props) {
    super(props);
    this.state = { teachable: {} };
  }
  render() {
    return (
      <ServiceAccessor
        api={ TeachablesApi }
        call={{ type: 'show', id: this.props.match.params.id }}
        dataType="item"
        hasData={ !isEmpty( this.state.teachable ) }
        onValidate={ teachable => this.setState({ teachable }) }
        fetchingRender={ <ActivityIndicator padded /> }>

        {
          !isEmpty( this.state.teachable ) &&
          (
            this.state.teachable.classroom.data.self.data.role === 'teacher' ?
            <TeachableTeacher { ...this.props } { ...this.state } /> :
            <TeachableStudent { ...this.props } { ...this.state } />
          )
        }

      </ServiceAccessor>
    );
  }
}

export default connect(
  state => ({ classrooms: state.classrooms }),
  dispatch => ({ actions: bindActionCreators( actions, dispatch )} )
)( Teachable );