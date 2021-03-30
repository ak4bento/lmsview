import React, { Component } from 'react';

import QuizAttemptsApi from "../../api/quizAttempts";
import ErrorHandler from "../ErrorHandler";
import ActivityIndicator from "../ActivityIndicator";
import QuizAttemptQuestion from './QuizAttemptQuestion';
import QuizAttemptReview from './QuizAttemptReview';

import { default as Pagination, withinPage } from '../Pagination';

class QuizAttempt extends Component {

  constructor(props) {
    super(props);
    this.state = {
      error: false,
      attempt: false,
      fetching: false,
      page: 0,
      finished: false
    };

    this.perPage = 1;

    this.api = new QuizAttemptsApi;
  }

  componentDidMount() {
    return this.load();
  }

  load() {
    if (this.state.fetching) return;

    this.setState({ fetching: true, error: false });
    return this.api.store({
      data: { teachable: this.props.match.params.id },
      cb: data => {
        // console.log(data);
        // this.setState(() => ({
        //   fetching: false,
        //   attempt: Object.assign({}, data.data),
        //   onQuestion: data.data.length || 0
        // }));
        this.setState({
          fetching: false,
          attempt: data.data,
          page: 0
        });
        // this.next();

        // console.log(data)
      },
      err: e => this.setState({ error: true, fetching: false })
    });
  }

  onAnswer(attempt, onNext) {
    this.setState(() => ({ attempt }));
    (this.state.page + 1 !== this.state.attempt.questions.data.length) && onNext && this.next();
  };

  onFinished(status) {
    this.load();
    this.setState({
      finished: status
    })
  }

  next() {
    return this.setState({
      page:
        (this.state.page !== null < this.state.attempt.questions.data.length && this.state.attempt.questions) ?
          this.state.page + 1 : this.state.page
    });
  }

  render() {
    // console.log('answer', this.state.attempt);
    // console.log('page', this.state.page);


    return (
      <div>
        {this.state.fetching && <ActivityIndicator />}
        {this.state.error && <ErrorHandler retryAction={() => this.load()} message="Failed to load quiz from server." />}

        <div className={'fade' + (!this.state.finished ? ' show' : ' d-none')}>
          <div className="d-flex justify-content-end">
            <Pagination
              showStatus
              data={this.state.attempt ? this.state.attempt.questions.data : []}
              onNavigate={page => this.setState({ page })}
              perPage={this.perPage}
              page={this.state.page}
              users="questions"
            />
          </div>

          {/* {console.log('state-quizattempt', this.state)} */}

          {
            this.state.attempt.questions &&
            this.state.page < this.state.attempt.questions.data.length
            && this.state.attempt.questions.data.filter((user, index) => withinPage({ index, page: this.state.page, perPage: 1 }))
              .map(props =>

                <div key={props.id}>
                  <div className="mb-4">
                    <div className="h2 m-0">Question {this.state.page + 1} of {this.state.attempt.questions.data.length}</div>
                    <div className="text-muted">{props.typelabel}</div>
                  </div>
                  <QuizAttemptQuestion
                    attempt={this.state.attempt}
                    onAnswer={this.onAnswer.bind(this)}
                    onFinished={this.onFinished.bind(this)}
                    question={props}
                    answer={this.state.attempt.answers.data[this.state.page]}
                    page={this.state.page}
                  />
                </div>
              )
          }



        </div>

        <div className={'fade ' + (this.state.finished ? ' show' : '')}>
          {
            this.state.attempt.questions && this.state.finished &&
            <QuizAttemptReview {...this.state.attempt} />
          }
        </div>

      </div>
    );
  }

}

export default QuizAttempt;