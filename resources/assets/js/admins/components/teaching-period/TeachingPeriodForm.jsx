import React, { Component } from "react";
import moment from 'moment';
import {
  Redirect,
  Link
} from "react-router-dom";
import {
  FormInput ,
  FormDate 
} from "../../../components/Form";

import teachingPeriodApi from '../../api/teachingPeriod';

class StudentForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '' ,
      startDate: moment() ,
      endDate: moment() ,
      onProgressMajor: false ,
      onSubmitProcess: false
    }
  }

  save(e) {
    e.preventDefault();

    this.setState({
      onSubmitProcess: true
    });

    const form = {
      name: this.state.name ,
      startDate: this.state.startDate.format("YYYY-MM-DD") + " 00:00:00" ,
      endDate: this.state.endDate.format("YYYY-MM-DD") + " 00:00:00"
    };
    const updateStatus = (status) => {
      this.setState({
        onSubmitProcess: false ,
        isSubmitSuccess: status
      });
    }
    
    if(this.props.match.params.id) {
      teachingPeriodApi.update(
        { form , id: this.props.match.params.id } ,
        (res, err) => {
          updateStatus(!err ? true : false );
        }
      )
    } else {
      teachingPeriodApi.store(
        { form }, 
        (res, err) => {
          updateStatus(!err ? res.teachingPeriod ? true : false : false);
        }
      )
    }
  }

  componentWillMount() {
    if (this.props.match.params.id) {
      teachingPeriodApi.view({id: this.props.match.params.id}, (res, err) => {        
        if(!err) {
          this.setState({
            name: res.data.name ,
            startDate: moment(res.data.starts_at) ,
            endDate: moment(res.data.ends_at)
          });
        }
        
      })
    }
  }

  render() {
    if(this.state.isSubmitSuccess) {      
      return <Redirect to='/teaching-period' push />
    }

    return (
      <div className="d-block padding-2 text-left">
        <Link to="/teaching-period" className="link primary-link">
          <i className="fa fa-angle-left"> </i> Kembali
        </Link>

        <div className="white-bg padding-1 border-radius box-shadow">
          <form onSubmit={this.save.bind(this)}>
            <div className="border-bottom">
              <p className="text primary-text text-upper small-text padding-tb-half">
                Informasi
              </p>

              <FormInput 
                label="Label Tahun Ajar" 
                placeholder="Contoh: 2018-ganjil" 
                onChange={(e) => this.setState({name: e.currentTarget.value})}
                value={ this.state.name }
              />
            </div>

            <div className="padding-tb-1">
              <p className="text primary-text text-upper small-text padding-tb-half">  
                Periode
              </p>

              <div className="form-group">
                <FormDate
                  label="Tanggal Dimulai"
                  startDate={this.state.startDate}
                  onChange={(dateValue) => this.setState({startDate: dateValue})}
                />

                <FormDate
                  label="Tanggal Berakhir"
                  startDate={this.state.endDate}
                  onChange={(dateValue) => this.setState({endDate: dateValue})}
                />
              </div>
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

export default StudentForm;
