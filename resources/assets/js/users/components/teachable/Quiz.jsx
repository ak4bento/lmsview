import React, { Component, Fragment } from 'react';
import { CancelToken } from "axios";
import { Link } from "react-router-dom";

import QuizAttemptsApi from "../../api/quizAttempts";
import ActivityIndicator from '../ActivityIndicator';
import TimeRemaining from './TimeRemaining';
import QuizAttemptsList from './QuizAttemptsList';

class TeachableQuiz extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      attempts: [],
      fetching: false,
    };
    this.cancelRequestHandler = CancelToken.source();
    this.api = new QuizAttemptsApi;
  }

  componentDidMount() {
    this.load();
  }

  componentWillUnmount() {
    this.cancelRequestHandler.cancel();
  }

  attempt() {
    if (this.state.fetching || this.state.attempting)
      return;
    return this.setState({ attempting: true });
  }

  load() {
    if (this.state.fetching) return;

    this.setState({ fetching: true, error: false });
    return this.api.index({
      params: {
        context: 'teachableUser',
        teachableUser: this.props.teachableUser.id
      },
      cancelToken: this.cancelRequestHandler.token,
      cb: data => this.validate(data.data),
      err: () => this.setState({ error: true, fetching: false })
    });
  }

  validate(attempts) {    
    this.setState({ attempts, fetching: false });
  }

  render() {
    let unfinishedAttempts = this.state.attempts.filter(attempt => attempt.completedAt === null).slice(0);

    return (
      <div>
        <TimeRemaining expiresAt={this.props.teachableUser.teachable.data.expiresAt} />
        <div className="bg-white border rounded-bottom d-flex flex-column justify-content-center align-items-center p-5" style={{ minHeight: 300 }}>

          {this.state.fetching && <div className="w-100"><ActivityIndicator /></div>}
          {
            !this.state.fetching &&
            (
              <Fragment>
                {
                  (
                    unfinishedAttempts.length > 0 ||
                    this.props.teachableUser.teachable.data.maxAttempts > this.state.attempts.length ||
                    this.props.teachableUser.teachable.data.maxAttempts === 0
                  ) ?
                    (
                      <Fragment>
                        <div className="display-2 mb-4 text-muted"><i className="fas fa-edit"></i></div>
                        <div className="h3">
                          {unfinishedAttempts.length > 0 ? 'Lanjutkan quiz' : 'Mulai quiz'}
                        </div>
                        <div className="text-muted mb-4 text-center">
                          <div>
                            {
                              unfinishedAttempts.length > 0 ?
                                'Finish your attempt made ' + unfinishedAttempts[0].createdAtForHumans + '.' :
                                'Mulai quiz Anda dan selesaikan sebelum batas akhir waktu.'
                            }
                          </div>
                          {
                            this.props.teachableUser.teachable.data.maxAttempts > 0 &&
                            <div>
                              Anda memiliki sisa {this.props.teachableUser.teachable.data.maxAttempts - this.state.attempts.length} kali dari total {this.props.teachableUser.teachable.data.maxAttempts} percobaan Quiz.
                          </div>
                          }
                        </div>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <div className="text-muted display-1 mb-2"><i className="fas fa-marker"></i></div>
                        <div className="text-muted h3-md h5">No more submitting!</div>
                        <div className="text-muted mb-4 text-center">
                          Anda tidak bisa mengikuti Quiz lagi.
                      </div>
                      </Fragment>
                    )
                }
                {
                  (
                    unfinishedAttempts.length > 0 ||
                    this.props.teachableUser.teachable.data.maxAttempts > this.state.attempts.length ||
                    this.props.teachableUser.teachable.data.maxAttempts === 0
                  ) &&
                  (
                    <div>
                      <Link to={'/classroom/' + this.props.match.params.classroom + '/teachable/' + this.props.match.params.id + '/attempt'} className="btn btn-primary btn-lg">
                        {unfinishedAttempts.length > 0 ? 'Lanjutkan Quiz' : 'Mulai Quiz'}
                      </Link>
                    </div>
                  )
                }
                {this.state.attempts.length > 0 && <QuizAttemptsList attempts={this.state.attempts} />}
              </Fragment>
            )
          }

        </div>
      </div>
    );
  }

}

export default TeachableQuiz;