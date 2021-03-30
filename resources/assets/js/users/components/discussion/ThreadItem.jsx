import React, { Component } from 'react';
import renderHTML from "react-render-html";
import Moment from "moment";

import UserBadge from '../UserBadge';
import ThreadReplyItem from './ThreadReplyItem';
import ReplyForm from './ReplyForm';
import helpers from '../../modules/helpers';

class ThreadItem extends Component {

  constructor(props) {
    super(props);
    this.state = { hovering: false };
  }

  render() {
    let replyingToThis = this.state.hovering && this.props.replyingTo != this.props.id;

    return (
      <div className={"pb-4" + (!this.props.isFirst ? ' pt-4 border-top' : '')}>
        <div
          onMouseEnter={() => this.setState({ hovering: true })}
          onMouseLeave={() => this.setState({ hovering: false })}>
          <div className="mb-3">{renderHTML(this.props.message)}</div>

          <div className="d-flex align-items-center">
            <UserBadge {...this.props.user.data} accent="white" />
            <div>
              <div className="mr-3 text-muted d-inline">
                <i className="fas fa-clock"></i> {Moment(this.props.createdAt).format(Moment(this.props.createdAt).isSame(Moment(), 'day') ? 'H:mm' : 'D MMM Y')}
              </div>
              {
                !Moment(this.props.createdAt).isSame(Moment(this.props.updatedAt)) &&
                (
                  <div className="mr-3 text-muted d-inline">
                    <i className="fas fa-edit"></i> {Moment(this.props.updatedAt).format('D MMM Y')}
                  </div>
                )
              }
              <div className={"d-inline fade" + (replyingToThis ? ' show' : '')}>
                {
                  replyingToThis &&
                  (
                    <a href="#" className="text-link" onClick={e => { e.preventDefault(); return this.props.onStartReply(this.props.id); }}>
                      <i className="fas fa-reply"></i> Balas
                    </a>
                  )
                }
              </div>
            </div>
          </div>

          <div className={"mt-3 fade" + (this.props.replyingTo === this.props.id ? ' show' : '')}>
            {
              this.props.replyingTo === this.props.id &&
              <ReplyForm
                onSaved={this.props.onSaved}
                context={this.props.context}
                replyTo={this.props.id}
                onCancel={this.props.onCancelReply}
                contextData={this.props.contextData} />
            }
          </div>
        </div>

        {
          this.props.replies && this.props.replies.data.length > 0 &&
          (
            <div className="my-4 ml-5">
              <div className="text-uppercase text-muted h6 mb-3">Replies <span className="badge badge-secondary badge-pill">{this.props.replies.data.length}</span></div>
              {this.props.replies.data.sort((a, b) => helpers.sortByDate(a.createdAt, b.createdAt)).reverse().map((reply, index) => (
                <ThreadReplyItem key={index} {...reply} />
              ))}
            </div>
          )
        }
      </div>
    );
  }
}

export default ThreadItem;