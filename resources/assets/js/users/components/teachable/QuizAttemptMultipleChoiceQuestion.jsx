import React, { Component } from 'react';

import QuizAttemptMultipleChoiceQuestionChoiceItem from './QuizAttemptMultipleChoiceQuestionChoiceItem';

class QuizAttemptMultipleChoiceQuestion extends Component {

  constructor(props) {
    super(props);
  }

  select(choice) {

    let answer = {
      questionId: this.props.question.id,
    };
    switch (this.props.question.type) {
      case 'MultipleChoice':
        answer = Object.assign(answer, {
          answerId: choice.id,
        });
        break;
      case 'MultipleResponse':
        let answers = this.props.answer.answers ? this.props.answer.answers.slice(0) : [];
        if (answers.filter(answer => answer === choice.id).length > 0)
          answers.splice(answers.indexOf(choice.id), 1);
        else
          answers.push(choice.id);
        answer = Object.assign(answer, { answers });
        break;
    }
    return this.props.onAnswer(answer);
  }

  render() {
    // console.log('props-multiplechoice', this.props);

    return (
      <div className="list-group shadowed rounded">

        {
          this.props.question.choiceItems.data.map((choice) => {

            let selected = false;

            if (this.props.question.type === 'MultipleChoice')
              selected = this.props.answer && this.props.answer.answerId === choice.id;
            if (this.props.question.type === 'MultipleResponse' && this.props.answer && this.props.answer.answers)
              selected = this.props.answer.answers.filter(answer => answer === choice.id).length > 0

            return (
              <QuizAttemptMultipleChoiceQuestionChoiceItem
                {...choice}
                key={choice.id}
                selected={selected}
                onSelect={() => this.select(choice)} />
            )
          })
        }
      </div>
    );
  }
}

export default QuizAttemptMultipleChoiceQuestion;