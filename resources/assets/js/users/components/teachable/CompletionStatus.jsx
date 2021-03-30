import React, { Fragment } from 'react';

const CompletionStatus = props => {

  let helpText = helpTexts.filter( helpText => helpText.type === props.teachableType && helpText.itemType === props.teachableItemType )[0];

  return (
    <Fragment>
      <div className="h6 mb-2 text-uppercase">Your Completion Status</div>
      <div className="mb-3">
        {
          props.complete ?
          <div className="text-success h3 m-0"><i className="fas fa-check-circle"></i> Completed</div> :
          <div className="h3 m-0">Not completed</div>
        }
      </div>

      {
        helpText && !props.complete &&
        (
          <div className="border border-info rounded">
            <div className="bg-info px-3 py-2 text-light"><i className="fas fa-info-circle mr-2"></i> How do I complete this task?</div>
            <div className="px-3 py-2">
              <div><strong>{ helpText.label }</strong></div>
              <div>{ helpText.text }</div>
            </div>
          </div>
        )
      }
    </Fragment>
  );

}

export default CompletionStatus;

const helpTexts = [
  { type: 'resource', itemType: 'url', label: 'External Resource', text: 'Follow the link inside the box above to the external site.' },
  { type: 'resource', itemType: 'jwvideo', label: 'Video Resource', text: 'Play and watch the video until the end.' },
  { type: 'resource', itemType: 'youtubevideo', label: 'Video Resource', text: 'Play and watch the video until the end.' },
  { type: 'resource', itemType: 'audio', label: 'Audio Resource', text: 'Play and listen to the audio recording until the end.' },
  { type: 'assignment', itemType: undefined, label: 'Assignment', text: 'Upload your assignment before the submission deadline.' },
];