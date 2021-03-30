import React, { Component } from 'react';
import DatetimePicker from "react-datetime";

class QuizFillIn extends Component {

  constructor(props) {
    super(props);
    this.state = {
      choices: ['']

    }
  }

  addIndex() {
    const newAnswer = this.state.choices;
    newAnswer.push('');

    this.setState({
      choices: newAnswer
    })
  }

  componentDidMount() {

    if (this.props.answer) {
      this.setState({
        choices: this.props.answer
      })
    }
  }

  handleEditorChange(event) {
    const choices = this.state.choices;

    choices[event.currentTarget.dataset.i] = event.currentTarget.value;

    this.setState({
      choices
    });

    this.props.onChange(JSON.stringify(choices));
  }

  render() {

    return (
      <div className="form-group px-4 py-4">
        <label className="d-block"> Fill In Answers <small>(required)</small> </label>

        {this.state.choices.map((data, i) => (
          <div className="form-group row no-gutters align-items-center" key={(i + 1) + '_key'}>
            <div className="d-inline-block text-primary p-2"> <strong> {i + 1} </strong></div>
            <div className="col-md"> <input
              type="text"
              className="form-control"
              value={data}
              data-i={i}
              onChange={this.handleEditorChange.bind(this)}
            /> </div>
          </div>
        ))}

        <div className="d-block text-right p-4">
          <a href="#" onClick={() => this.addIndex()}>  <i className="fa fa-plus"> </i> Add options </a>
        </div>


      </div>

    );
  }
}

export default QuizFillIn;