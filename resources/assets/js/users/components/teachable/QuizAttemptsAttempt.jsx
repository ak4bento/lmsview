import React from 'react';
import renderHTML from "react-render-html";
import Moment from "moment";
import * as quizHelper from "../../modules/quiz";

import Parser from 'html-react-parser';

const QuizAttemptsAttempt = props => {  
  let previousAnswer = null;
  return (
    <div>
      <div><a href="#" onClick={e => { e.preventDefault(); props.onClose(); }}>Back to Attempts List</a></div>
      {/* <div className="h3 mb-4">Attempt #{ props.attempt.index + 1 } by { props.classroomUser.user.data.name }</div> */}
      <div className="h3 py-4 col mx-0 px-0 text-right">
        Nilai: {props.attempt.gradePreview ? props.attempt.gradePreview.grade : 'Belum dinilai '}
      </div>

      <div className="d-flex py-4 mb-4 border-bottom">
        <div style={{ width: 60 }} />
        <div className="pr-4 col-md">
          <div className="h4 m-0 ">Pertanyaan</div>
        </div>
        <div className="col-md d-none d-md-flex">
          <div className="h4 m-0">Jawaban</div>
        </div>
        <div className="col-2 d-none d-md-flex">
          <div className="h4 m-0">Nilai</div>
        </div>
      </div>
      {
        props.attempt.questions.data.map((question, index) => {
          let answer = null;
          switch (question.type) {
            case 'MultipleChoice':
            case 'Boolean':
              answer = quizHelper.getMultipleChoiceAnswer(question, props.attempt.answers); break;
            case 'MultipleResponse':
              answer = quizHelper.getMultipleResponseAnswer(question, props.attempt.answers); break;
            case 'FillIn':
              answer = quizHelper.getFillInAnswer(question, props.attempt.answers); break;
            case 'Essay':
              answer = quizHelper.getEssayAnswer(question, props.attempt.answers); break;
          }
          let previous = previousAnswer;
          previousAnswer = answer;
          
          return (
            <div key={question.id} className="d-flex mb-3">
              <div style={{ width: 60 }} className="text-center">
                <div className="h4 m-0">{index + 1}</div>
              </div>


              {/* <div style={{ flex: 1 }} className="pr-4">
                <div className="text-muted"><i className="fas fa-list mr-2"></i>{question.typeLabel}</div>
                {Parser(question.content)}
              </div>
              <div style={{ flex: 1 }}>
                <div className="text-muted">
                  <i className="fas fa-clock mr-2"></i>
                  {
                    Moment.duration(
                      new Moment(answer.answeredAt).diff(new Moment(previous ? previous.answeredAt : props.createdAt))
                    ).humanize()
                  }
                </div>
                {quizHelper.displayAnswerReview(answer, question)}

              </div> */}



              <div className={"d-flex col-md mx-0 px-0 " + (question.typeLabel == 'Essay' ? "flex-column" : "flex-md-row flex-column")} >
                <div className={"px-2 mx-0 q-img " + (question.typeLabel !== 'Essay' ? "col-md" : "d-block")}>
                  <div className="text-muted"><i className="fas fa-list mr-2"></i>{question.typeLabel == 'Boolean' ? 'True or False' : question.typeLabel}</div>
                  {Parser(question.content)}
                </div>
                <div className={"px-2 mx-0 my-4 mt-md-0 mb-md-4 " + (question.typeLabel !== 'Essay' ? "col-md" : "d-block")}>
                  <div className="text-muted">
                    <span className="d-inline-block pr-2"> <strong> Answers </strong> </span>
                    <div className="d-md-inline-block d-flex align-items-center">
                      <i className="fas fa-clock mr-2"></i>
                      {
                        Moment.duration(
                          new Moment(answer.answeredAt).diff(new Moment(previous ? previous.answeredAt : props.createdAt))
                        ).locale('id').humanize() + ' yang lalu'
                      }
                    </div>
                  </div>
                  {quizHelper.displayAnswerReview(answer, question)}
                </div>
                <div className="px-2 mx-0 my-4 mt-md-0 mb-md-4 col-2">
                  <div className="d-block d-md-none strong"> <strong> Nilai </strong> </div>
                  {
                    answer.score !== '' && answer.score !== null && answer.score !== undefined ?
                      quizHelper.displayScore({
                        gradingMethod: props.attempt.grading_method,
                        score: answer.score ,
                        questionLength: props.attempt.questions.data.length
                      }) : 'Belum diperiksa'
                  }
                </div>

              </div>

            </div>
          )
        })
      }
    </div>
  );
}

export default QuizAttemptsAttempt;