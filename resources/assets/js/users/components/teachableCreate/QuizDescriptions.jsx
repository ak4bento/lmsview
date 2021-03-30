import React, { Component } from 'react';
import Parser from 'html-react-parser';

class QuizDescriptions extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="p-relative">
        <div className="py-2">
          <div className="h6 text-uppercase mb-0">
            Judul
                </div>
          <div>
            {this.props.data.title}
          </div>
        </div>
        <div className="py-2">
          <div className="h6 text-uppercase mb-0">
            Deskripsi
                </div>
          <div>
            {Parser(this.props.data.description)}
          </div>
        </div>
      </div>
    );
  }
}

export default QuizDescriptions;