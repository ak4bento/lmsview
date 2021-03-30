import React, { Component } from 'react';

class QuizAttemptBooleanQuestion extends Component {

  constructor(props) {
    super(props);
  }

  select( choice ) {
    return this.props.onAnswer({
      questionId: this.props.question.id,
      answerId: choice.id,
    });
  }

  render() {
    return (
      <div className="row justify-content-center">
        {
          this.props.question.choiceItems.data.sort( ( a ) => a.choiceText === 'False' ? 1 : -1 ).map( choice => {
            let isSelected = this.props.answer && this.props.answer.answerId === choice.id;
            return (
              <div className="col-4" key={ choice.id }>
                <div
                  className="d-flex flex-column align-items-center rounded shadowed p-4 bg-white"
                  onClick={ () => this.select( choice ) }>

                  <div className={ "mb-3 display-2" + ( isSelected ? ' text-primary' : ' text-light' ) }>
                    <i className={ isSelected ? 'fas fa-check-circle' : 'fas fa-dot-circle' }></i>
                  </div>
                  <div className="h4 m-0">{ choice.choiceText }</div>

                </div>
              </div>
            );
          } )
        }
      </div>
    );
  }

}

export default QuizAttemptBooleanQuestion;