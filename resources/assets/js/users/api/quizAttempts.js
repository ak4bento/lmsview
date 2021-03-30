import BasicApi from "./basic";

export default class QuizAttemptsApi extends BasicApi {

  constructor() {
    super( '/rest/quiz-attempts' );
  }

}