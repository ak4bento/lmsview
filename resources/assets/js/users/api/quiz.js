import BasicApi from "./basic";

export default class QuizApi extends BasicApi {

  constructor() {
    super('/api/quiz');
  }

}