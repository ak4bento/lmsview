import React, { Component, Fragment } from 'react';
import { Redirect, Route, Switch, Link } from "react-router-dom";
import { CancelToken } from "axios";
import { upperFirst } from "lodash";
import moment from 'moment-timezone';
import renderHTML from "react-render-html";

import TeachablesApi from "../api/teachables";
import Breadcrumb from '../components/Breadcrumb';
import ServiceAccessor from '../components/ServiceAccessor';

import Parser from 'html-react-parser';

import DeleteComponent from '../components/teachableCreate/DeleteComponent.jsx';

import {
  UserBadge,
  MediaWidget,
  Discussions,
  TeachableQuizTeacher,
  ActivityIndicator,
  TeachableResourceTeacher,
  TeachableAssignment,
} from '../components';

class TeachableTeacher extends Component {

  constructor(props) {
    super(props);
    this.state = {
      teachable: {},
      isProcess: false,
      alert: false,
      delete: false,
      isDelete: false
    };
    this.api = new TeachablesApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  updateTeachable() {
    this.setState({ isProcess: true });

    const currentTime = moment().tz("Asia/Jakarta").format("YYYY-MM-DD hh:mm:ss");

    this.api.update({
      id: this.state.teachable.id,
      data: {
        expiresAt: this.state.teachable.isOpen ? currentTime : null,
        availableAt: this.state.teachable.isOpen ? null : currentTime
      },
      params: {},
      cb: teachable => this.setState({ teachable: teachable.data, isProcess: false, alert: true }),
      err: err => this.setState({ isProcess: false })
    })
  }

  delete(id) {
    return this.api.destroy({
      id: id,
      params: {
        context: 'teacher'
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.setState({ isDelete: true }),
          window.location.reload();
      },
      err: e => !isCancel(e) && this.setState({ error: e.response ? e.response.data : true, saving: false })
    });
  }

  render() {

    if (this.state.isDelete == true)
      return <Redirect to={'/classroom/' + this.props.match.params.classroom} />


    return (
      <ServiceAccessor
        api={TeachablesApi}
        call={{ type: 'show', id: this.props.match.params.id }}
        dataType="item"
        hasData={this.state.teachable.id !== undefined}
        onValidate={teachable => this.setState({ teachable })}
        fetchingRender={<ActivityIndicator padded />}>
        <div className="container py-5">

          {
            <Breadcrumb items={[
              { link: '/classroom/' + this.props.match.params.classroom, label: 'Classroom' },
              { label: this.props.teachable.type ? upperFirst(this.props.teachable.type) : 'Loading..' }
            ]} />
          }

          <div className={"fade" + (this.props.teachable.teachableItem ? ' show' : '')}>
            {
              this.state.teachable.classroom &&
              (
                <Switch>
                  <Route exact path="/classroom/:classroom/teachable/:id" render={route => {
                    let teachableItemView = null;

                    if (this.state.teachable.id) {
                      switch (this.state.teachable.type) {
                        case 'resource':
                          teachableItemView = <TeachableResourceTeacher teachable={this.state.teachable} onUpdate={data => this.validate(data)} />;
                          break;
                        case 'quiz':
                          teachableItemView = <TeachableQuizTeacher teachable={this.state.teachable} {...route} />;
                          break;
                        case 'assignment':
                          teachableItemView = <TeachableAssignment teachable={this.state.teachable} onUpdate={data => this.validate(data)} />;
                          break;
                      }
                    }

                    return (
                      <Fragment>
                        <div className="d-block text-right py-4">
                          <Link to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/edit'} > Edit </Link>
                          <a href="#" data-toggle="modal" data-target={'#' + this.state.teachable.id} className="pl-4 text-danger"> <i className="fa fa-trash"> </i> Delete </a>
                        </div>

                        {
                          this.state.teachable.id &&
                          this.state.teachable.type === 'quiz' &&
                          (
                            <div className="bg-white border rounded py-5 px-4 mb-4">
                              {
                                this.state.isProcess ?
                                  <ActivityIndicator /> :
                                  (
                                    this.state.teachable.isOpen ?
                                      <div>
                                        {this.state.alert === true ?
                                          <div class="alert alert-success" role="alert">
                                            Kuis berhasil dimulai
                                          </div> : ''
                                        }
                                        <p> Klik tombol untuk menghentikan kuis </p>
                                        <a href="#" className="btn btn-danger" onClick={this.updateTeachable.bind(this)}>
                                          <i className="fa fa-stop"> </i> Hentikan Kuis
                                          </a>
                                      </div> :
                                      <div>
                                        {this.state.alert === true ?
                                          <div class="alert alert-success" role="alert">
                                            Kuis telah dihentikan
                                          </div> : ''
                                        }
                                        <p> Klik tombol untuk memulai kuis </p>
                                        <a href="#" className="btn btn-primary " onClick={this.updateTeachable.bind(this)}>
                                          <i className="fa fa-play"> </i> Mulai Kuis
                                        </a>
                                      </div>
                                  )
                              }
                            </div>
                          )
                        }
                        {teachableItemView && <div className="mb-5">{teachableItemView}</div>}

                        {
                          this.state.teachable.teachableItem.data &&
                          (
                            <div className="row">
                              <div className="col-8">
                                <div className="mb-5">
                                  {this.state.teachable.teachableItem.data.title && <div className="h3">{this.state.teachable.teachableItem.data.title}</div>}
                                  <div className="mb-4">{Parser(this.state.teachable.teachableItem.data.description)}</div>

                                  <div className="d-flex align-items-center">
                                    <UserBadge accent="white" {...this.state.teachable.createdBy.data} />
                                    <div className="text-muted">
                                      <i className="fas fa-clock"></i> {this.state.teachable.createdAtForHumans}
                                    </div>
                                  </div>
                                </div>

                                <div id="discussions">
                                  <Discussions context="teachable" contextData={this.props.match.params.id} showHeader />
                                </div>
                              </div>

                              <div className="col-4">

                                {
                                  this.state.teachable.teachableItem.data.type !== 'documents' &&
                                  this.state.teachable.teachableItem.data.media &&
                                  this.state.teachable.teachableItem.data.media.data.length > 0 &&
                                  (
                                    <div className="mb-5">
                                      <MediaWidget data={this.state.teachable.teachableItem.data.media.data} />
                                    </div>
                                  )
                                }
                              </div>
                            </div>
                          )
                        }

                        <DeleteComponent delete={this.delete.bind(this)} id={this.state.teachable.id} />

                      </Fragment>
                    );
                  }} />
                </Switch>
              )
            }

            {/* <Discussions showHeader={ true } context="teachable" contextData={ this.props.match.params.id } /> */}

          </div>
        </div>
      </ServiceAccessor>
    );

  }
}

export default TeachableTeacher;