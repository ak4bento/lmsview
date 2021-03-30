import React from 'react';
// import { relativeTimeRounding } from 'moment';
import Parser from 'html-react-parser';

export const getMultipleChoiceAnswer = (question, answers) => {
  let selectedAnswer = {};
  const questionAnswer = question.choiceItems.data.filter(choiceItem =>
    choiceItem.id === answers.data.filter(answer => {
      if (answer.questionId === question.id && ( answer.score != null || answer.score != '')) {
        selectedAnswer = { score: answer.score };
      }

      return answer.questionId === question.id;
    }
    )[0].answerId
  )[0];
    
  return Object.assign(selectedAnswer, questionAnswer);
}

export const getFillInAnswer = (question, answers) => {
  return answers.data.filter(answer =>
    answer.questionId === question.id
  )[0];
}

export const getEssayAnswer = (question, answers) => {
  return answers.data.filter(answer =>
    answer.questionId === question.id
  )[0];
}

export const getMultipleResponseAnswer = (question, answers) => {
  let responses = [];
  let score = null;
  try {
    answers.data.filter(answer => {
      if(answer.questionId === question.id) {
        score = answer.score;        
      }
      
      return answer.questionId === question.id;
    }
    )[0].answers.map(responseChoice => {
      responses.push(
        question.choiceItems.data.filter(choiceItem =>
          choiceItem.id === responseChoice
        )[0]
      );
    });
  } catch (error) {
    responses = [];
  }

  return { answers: responses, score };
}

export const displayAnswerReview = (answer, question) => {
  switch (question.type) {
    case 'MultipleChoice':
    case 'Boolean':
      return answer.choiceText;
    case 'Essay':
      return answer.content ? Parser(answer.content) : '';
    case 'MultipleResponse':
      return (
        <ul>
          {answer.answers.map((response) => <li key={response.id}>{response.choiceText}</li>)}
        </ul>
      );
      break;
    case 'FillIn':
      return answer.answers && (
        <ol>
          {answer.answers.map((response, index) => <li key={index}>{response}</li>)}
        </ol>
      );
      break;
  }
}

export const displayFormScoring = ( { questionId, gradingMethod , answer = false, weight=0  , currentScore = 0} , onChange ) => {
  switch ( gradingMethod ) {
    case 'standard':
    case 'weighted':
      return (
        <div>
          <input 
            type="checkbox" 
            value={true} 
            defaultChecked={answer && answer.score && answer.score > 0} 
            onChange={(e) => onChange(
              questionId, 
              e.currentTarget.checked ? gradingMethod === 'weighted' ? weight : 1 : 0
            )}
          />&nbsp;
          Centang jika jawaban benar
        </div>
      );
    case 'manual':
      return <input 
        type="number" 
        onChange={(e) => onChange(questionId, e.currentTarget.value)} 
        value={currentScore || 0}
      />;
  }

  return null;
}

export const displayScore = ({gradingMethod, score, questionLength}) => 
  gradingMethod === 'standard' ? Math.round((score / questionLength) * 100) : score ; 


export const grading = ({gradingMethod = 'standard', questions, answers}) => {
  const totalScore = answers.reduce((accumulator, currentValue) => accumulator + (currentValue.score || 0), 0);
  
  return gradingMethod === 'standard' ? Math.round((totalScore / questions.length) * 100) : totalScore ; 
}