import React, { Component } from 'react';

import ServiceAccessor from "../ServiceAccessor";
import MediaApi from "../../api/media";
import Media from '../media/Main';
import Uploader from '../media/Uploader';

class Files extends Component {

  constructor(props) {
    super(props);
    this.state = {
      media: [],
    };
    this.api = new MediaApi;
  }

  render() {
    return (
      <div>
        {
          this.props.self.data.role === 'teacher' &&
          <Uploader
            context="classroom"
            contextData={ this.props.match.params.classroom }
            onSuccess={ media => {
              this.setState({ media });
              this.props.actions.cacheClassroomFiles({ classroom: this.props.match.params.classroom, files: media })
            } } />
        }

        <ServiceAccessor
          api={ MediaApi }
          hasData={ this.state.media.length > 0 }
          cache={ this.props.cache.classroom && this.props.cache.classroom === this.props.match.params.classroom && this.props.cache }
          call={{ type: 'index', params: { collection: 'files', context: 'classroom', classroom: this.props.match.params.classroom } }}
          onValidate={ media => this.setState({ media }) }
          onCache={ files => this.props.actions.cacheClassroomFiles({ classroom: this.props.match.params.classroom, files }) }>

          <Media { ...this.state } grouping={ mediaGrouping } groupingField="model.data.id" />

        </ServiceAccessor>
      </div>
    );
  }
}

export default Files;

const mediaGrouping = {
  classroom: { isGroup: false },
  assignment: { isGroup: true, label: 'Assignment', titleField: 'title' },
  resource: { isGroup: true, label: 'Resource', titleField: 'title' },
};