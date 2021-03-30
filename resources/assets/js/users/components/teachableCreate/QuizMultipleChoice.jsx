import React, { Component } from 'react';
import DatetimePicker from "react-datetime";

class QuizMultipleChoice extends Component {

  constructor(props) {
    super(props);
    this.state = {
      choices: [
        { choice_text: '', is_correct: 0 }
      ],
      selected: ''
    }
  }

  addIndex(e) {
    e.preventDefault();
    const newAnswer = this.state.choices;
    newAnswer.push({
      choice_text: '', is_correct: 0
    });

    this.setState({
      choices: newAnswer
    })
  }

  handleChange(event) {
    const choices = this.state.choices;
    const index = parseInt(event.currentTarget.dataset.i);
    let newChoices;

    newChoices = choices.map((choice, i) => {
      const is_correct = i === index ? 1 : (this.props.type == 'MultipleResponse' ? choice.is_correct : 0);
      return Object.assign(choice, { is_correct })
    });

    this.setState({
      choices: newChoices
    });

    return this.props.onChange(newChoices);
  }

  handleEditorChange(event) {
    const choices = this.state.choices;

    choices[event.currentTarget.dataset.i].choice_text = event.currentTarget.value;

    this.setState({
      choices
    })
  }

  componentDidMount() {
    if (this.props.update) {
      return this.setState({
        choices: this.props.answer
      })
    } else if (this.props.type == 'Boolean') {
      return this.setState({
        choices: [
          { choice_text: 'True', is_correct: 0 },
          { choice_text: 'False', is_correct: 0 }
        ]
      })
    }
  }


  render() {
    // console.log("get index data choices",this.state.choices);
    return (
      <div className="form-group px-4 py-4">
        <label className="d-block"> {this.props.type} Answers <small>(required)</small> </label>

        {this.state.choices.map((data, i) => (

          <div
            className="list-group-item list-group-item-action px-4 py-4 d-flex align-items-center"
            style={{ cursor: 'pointer' }} key={i}>

            <div className="mr-3">
              <div className={'h3 m-0' + (data.is_correct ? ' text-primary' : ' text-light')}>
                {/* <input type={this.props.type == 'MultipleChoice' ? 'radio' : 'checkbox'} name="multiplechoice" value={i}
                  // style={{ opacity: 0 }}
                   style={{opacity: 0;}} /> */}
                <label htmlFor={i} data-i={i} onClick={this.handleChange.bind(this)}> <i className={data.is_correct ? 'fas fa-check-circle' : 'fas fa-dot-circle'}></i> </label>

              </div>
            </div>

            <div className="d-inline-block text-primary p-2"> <strong> {String.fromCharCode('A'.charCodeAt() + i)} </strong></div>

            <div className="col-md">
              <input
                type="text"
                className="form-control"
                value={data.choice_text}
                data-i={i}
                onChange={this.handleEditorChange.bind(this)}
              />
            </div>
          </div>
        ))}

        <div className="d-block text-right p-4">
          <a href="#" onClick={ this.addIndex.bind(this) }>  <i className="fa fa-plus"> </i> Add options </a>
        </div>

      </div>

    );
  }
}

export default QuizMultipleChoice;