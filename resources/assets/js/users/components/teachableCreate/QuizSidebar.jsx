import React, { Component } from 'react';
import DatetimePicker from "react-datetime";
import Moment from 'moment';

class QuizSidebar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: {
        maxAttempts: false,
        threshold: false,
        availableSet: false
      },
      isEdit: {
        maxAttempts: false,
        threshold: false,
        availableSet: false
      }
    }
  }

  // onSave(param, value) {

  //   this.props.setState(
  //     {
  //       data: {
  //         sidebar: {
  //           [param]: value,
  //         }
  //       }
  //     }
  //   );

  //   if (param === 'threshold' && value > 100)
  //     return this.setState({
  //       error: {
  //         threshold: true
  //       }
  //     });
  //   else
  //     return this.setState({
  //       error: {
  //         threshold: false
  //       }
  //     });
  // }

  // save(param) {

  //   if (param === 'threshold' && this.props.data.sidebar.threshold > 100)
  //     this.setState({
  //       error: {
  //         threshold: true
  //       }
  //     })

  //   else
  //     this.setState({
  //       isEdit: {
  //         [param]: false
  //       }
  //     })

  // }

  // edit(param) {
  //   this.setState({
  //     isEdit: {
  //       [param]: true
  //     }
  //   })
  // }

  render() {
    const { sidebar } = this.props.data;

    return (
      <div className="p-relative px-0 px-md-4 py-3">
        <div className="form-group">
          <label className="d-block"> <strong> Percobaan Maksimal </strong> <small className="text-danger">*</small> </label>

          {this.props.edit ?
            <div className="form-inline">
              <select className="form-control"
                value={sidebar.maxAttempts ? sidebar.maxAttempts : 1}
                onChange={(e) => {
                  const data = this.props.data;
                  data.sidebar.maxAttempts = e.currentTarget.value;
                  this.props.setState({ data })
                }}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>

            </div>

            :

            <p> {sidebar.maxAttempts} </p>
          }


        </div>

        <div className="form-group">
          <label className="d-block mb-0"> <strong> Nilai Batas Minimum </strong> <small className="text-danger">*</small> </label>
          <small className="mb-0"> Tentukan nilai batas minimum Mahasiswa untuk melewati kuis ini </small>
          {this.props.edit ?
            <div>
              <div className="form-inline">
                <input type="number" value={sidebar.threshold} className="d-block form-control w-50" onChange={(e) => {
                  const data = this.props.data;
                  data.sidebar.threshold = e.currentTarget.value;
                  this.props.setState({ data })
                }} /> <span className="d-inline-block mx-2"> / 100 </span>

              </div>

              {this.state.error.threshold == true && <p className="small text-danger"> Batas Minimum tidak boleh lebih dari 100 </p>}
            </div>
            :
            <p> {sidebar.threshold} </p>
          }


        </div>

        <div className="form-group">
          <label className="d-block row no-gutters"> <strong> Tentukan Waktu Mulai/Selesai Quiz </strong> <small className="text-danger">*</small>

          </label>
          {this.props.edit ?
            <div className="form-row">
              <div className="col">
                <div className="form-group">
                  <label>Mulai</label>
                  <DatetimePicker value={sidebar.availableAt} selected={sidebar.availableAt} onChange={(e) => { const data = this.props.data; data.sidebar.availableAt = e.format('YYYY-MM-DD HH:mm:ss'); this.props.setState({ data }) }} todayButton={"Hari ini"} selectsStart
                    startDate={sidebar.availableAt}
                    endDate={sidebar.expiresAt} />
                  <small>(leave empty if always available)</small>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label>Selesai</label>
                  <DatetimePicker value={sidebar.expiresAt} selected={sidebar.expiresAt} onChange={(e) => { const data = this.props.data; data.sidebar.expiresAt = e.format('YYYY-MM-DD HH:mm:ss'); this.props.setState({ data }) }} selectsEnd
                    startDate={sidebar.availableAt}
                    endDate={sidebar.expiresAt} />
                </div>
              </div>
            </div>

            :

            <div>
              <p className="mb-0"> Mulai </p>
              <p>  <strong> {sidebar.availableAt ? Moment(sidebar.availableAt).locale('id').format("dddd, Do MMMM YYYY, h:mm a") : 'Belum ditentukan'} </strong> </p>

              <p className="mb-0"> Selesai </p>
              <p> <strong> {sidebar.expiresAt ? Moment(sidebar.expiresAt).locale('id').format("dddd, Do MMMM  YYYY, h:mm a") : 'Belum ditentukan'} </strong> </p>
              {Moment(sidebar.expiresAt).isBefore(sidebar.availableAt) && <small className="text-danger"> Tanggal & Waktu lebih sebelum waktu mulai </small>}
            </div>
          }
        </div>


      </div>

    );
  }
}

export default QuizSidebar;