import React, { Component, Fragment } from 'react';
import { CancelToken, isCancel } from "axios";

import TeachablesApi from "../../api/teachables";
import CreateTeachable from './CreateTeachable';
import Teachables from './Teachables';
import Progress from './Progress';
import FilesWidget from './FilesWidget';
import ActivityIndicator from '../ActivityIndicator';

class Overview extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      filter: props.cache.classroom.filter || filters.filter(filter => !filter.key)[0],
      fetching: false,
      teachables: []
    };
    this.api = new TeachablesApi;
    this.cancelRequestHandler = CancelToken.source();
  }

  componentDidMount() {
    this.props.cache.classroom.data
      && this.props.cache.classroom.data.slug === this.props.match.params.slug
      && this.props.cache.classroom.data.teachables
      && this.validate(this.props.cache.classroom.data.teachables);
    return this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  filter(filter) {
    this.setState({ filter });
    this.props.actions.cacheClassroomTeachablesFilter(filter);
  }

  load() {
    if (this.state.fetching) return;

    this.setState({ fetching: true, error: false });
    return this.api.index({
      params: {
        classroom: this.props.classroom.slug,
        context: 'teachableStudent'
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => {
        this.validate(data.data.slice(0));
        this.props.actions.cacheClassroom(Object.assign(this.props.cache.classroom.data, { teachables: data.data.slice(0) }));
      },
      err: e => !isCancel(e) && this.setState({ fetching: false, error: true }),
    })
  }

  validate(teachables) {
    this.setState({ teachables, fetching: false });
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-8">
          <nav className="nav nav-pills mb-4">
            {
              filters.map(filter =>
                (!filter.showOnTeacher && this.props.classroom.self.data.role === 'teacher') ?
                  null :
                  (
                    <a
                      key={filter.key}
                      href="#"
                      onClick={e => { e.preventDefault(); this.filter(filter); }}
                      className={'nav-item nav-link px-2 py-1' + (this.state.filter.key === filter.key ? ' active' : '')}>
                      {filter.label}
                    </a>
                  )
              )
            }



          </nav>

          {this.props.classroom.self.data.role === 'teacher' && <CreateTeachable classroom={this.props.classroom.slug} />}

          {this.state.fetching && this.state.teachables.length === 0 && <ActivityIndicator padded />}

          <Teachables
            fetching={this.state.fetching}
            teachables={this.state.teachables}
            filter={this.state.filter}
            role={this.props.classroom.self.data.role}
          />


        </div>

        <div className="col-lg-4 pt-4">
          {
            this.props.classroom.self.data.role === 'student' &&
            (
              <Fragment>
                <div className="mb-5">
                  <Progress teachables={this.state.teachables} fetching={this.state.fetching} />
                </div>
                <div className="mb-5">
                  <FilesWidget classroom={this.props.classroom.slug} cache={this.props.cache.files} onCache={files => this.props.actions.cacheClassroomFiles({ classroom: this.props.classroom.slug, files })} />
                </div>
              </Fragment>
            )
          }
        </div>
      </div>
    );
  }
}

const filters = [
  { key: null, label: 'Lihat Semua', byType: false, showOnTeacher: true },
  { key: 'not-done', label: 'Belum Selesai', byType: false, showOnTeacher: false },
  { key: 'resource', label: 'Bahan Ajar', byType: true, showOnTeacher: true },
  { key: 'assignment', label: 'Tugas', byType: true, showOnTeacher: true },
  { key: 'quiz', label: 'Quiz', byType: true, showOnTeacher: true },
];

export default Overview;