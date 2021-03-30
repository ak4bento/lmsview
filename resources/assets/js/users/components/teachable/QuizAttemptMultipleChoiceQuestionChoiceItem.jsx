import React from 'react';

const QuizAttemptMultipleChoiceQuestionChoiceItem = props => (
  <div
    className="list-group-item list-group-item-action px-4 py-4 d-flex align-items-center"
    onClick={ () => props.onSelect() }
    style={{ cursor: 'pointer' }}>
    <div className="mr-3">
      <div className={ 'h3 m-0' + ( props.selected ? ' text-primary' : ' text-light' ) }>
        <i className={ props.selected ? 'fas fa-check-circle' : 'fas fa-dot-circle' }></i>
      </div>
    </div>
    <div className="h5 m-0">{ props.choiceText }</div>
  </div>
);

export default QuizAttemptMultipleChoiceQuestionChoiceItem;