import React, { Component } from 'react';
import { Link, withRouter } from "react-router-dom";
import { upperFirst } from "lodash";
import Moment from "moment";

import TeachableItemPrerequisites from './TeachableItemPrerequisites';
import { hasPending } from "../../modules/prerequisites";
import UserBadge from '../UserBadge';

import Parser from 'html-react-parser';
import { format } from 'util';
import { language } from '../../../modules/language';

class TeachableItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }


  }

  render() {

    const filterStudent =
      this.props.role === 'student' && !this.props.isOpen;
      // (
      //   // hasPending(this.props.prerequisites.data, this.props.teachables) ||
      //   Moment().isBefore(this.props.availableAt)
      // );

    return (

      <Link
        to={
          filterStudent ? '#' : ('/classroom/' + this.props.match.params.slug + '/teachable/' + this.props.id)
        }
        className="rounded shadowed mb-3 bg-white border mt-2 list-group-item list-group-item-action"
        style={{ opacity: filterStudent ? 0.5 : 1 }}
        disabled={filterStudent}
      >

        <div className="mt-3 mx-3">
          {
            this.props.role === 'student'
            && this.props.teachableSelf
            && this.props.teachableSelf.data.completedAt !== null &&
            (
              <div className="border border-success text-success rounded px-3 py-2 mb-3">
                <i className="fas fa-check mr-2"></i> Anda telah menyelesaikan {language[this.props.type.toLowerCase()]} ini
              </div>
            )
          }

          {
            this.props.role === 'student'
            && this.props.prerequisites.data.length > 0
            && (!this.props.teachableSelf || this.props.teachableSelf.data.completedAt === null) &&
            <TeachableItemPrerequisites
              {...this.props.prerequisites}
              classroom={this.props.match.params.slug}
              teachables={this.props.teachables} />
          }

          <div className="mb-4 mt-1 row no-gutters">
            <div className="col">
              {this.props.teachableItem.data.title && <div className="h4">{this.props.teachableItem.data.title}</div>}
              <div> {Parser(this.props.teachableItem.data.description)}
              </div>
            </div>

            <div className="col-2 text-right">

              {this.props.role === 'student' ?
                (this.props.type === 'quiz' || this.props.type === 'assignment') ?
                  filterStudent ?
                    <i className="fa fa-lock-alt p-2 text-muted"> </i>
                    : <i className="fa fa-unlock p-2 text-muted"> </i>
                  : ''
                : ''
              }

              {
                (this.props.teachableSelf && this.props.teachableSelf.data.completedAt !== null) && (
                  <div className="text-success text-right">
                    <i className="fa fa-check p-2"> </i> <span className="d-none d-md-inline-block"> Completed </span>
                  </div>
                )
              }

            </div>

          </div>
        </div>

        <div className="mx-3 mb-3">
          <div className="d-flex flex-md-row flex-column align-items-start align-md-items-center mb-3">
            <div className="text-muted p-2">
              <i className="fas fa-clock"></i>&nbsp;
              { this.props.createdAtForHumans }
            </div>


            {
              (!this.props.filter.key || !this.props.filter.byType) &&
              (
                <div className="p-2">
                  <span className={"badge badge-" + teachableTypeColors[this.props.type].accent + " text-" + teachableTypeColors[this.props.type].content}>
                    {upperFirst(this.props.type)}
                  </span>
                </div>
              )
            }

            {
              this.props.type !== 'resource' &&
              !(this.props.teachableSelf && this.props.teachableSelf.data.completedAt !== null) &&
              (
                Moment(this.props.expiresAt).isAfter() ?
                  (
                    <div className="text-warning p-2">
                      <i className="fas fa-clock"></i> Selesai {this.props.expiresAtForHumans}
                    </div>
                  ) : (
                    (Moment.duration(Moment(this.props.expiresAt).locale('id').diff()).humanize() !== 'Invalid date') && (
                      <div className="text-danger p-2">
                        Deadline {this.props.expiresAtForHumans}
                      </div>
                    )
                  )
              )
            }

          </div>
          <div className="d-flex justify-content-between align-items-end">
            <UserBadge {...this.props.createdBy.data} />

            {
              filterStudent ?

                <span className="text-muted"><i className="fas fa-lock"></i> Terkunci </span> :

                (
                  <Link to={'/classroom/' + this.props.match.params.slug + '/teachable/' + this.props.id} className="text-link">
                    Buka <i className="fas fa-chevron-right"></i>
                  </Link>
                )
            }
          </div>
        </div>

      </ Link>
    );
  }
}

export const teachableTypeColors = {
  'assignment': { accent: 'info', content: 'light' },
  'resource': { accent: 'success', content: 'light' },
  'quiz': { accent: 'warning', content: 'light' },
};

export default withRouter(TeachableItem);