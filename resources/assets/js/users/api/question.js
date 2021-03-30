import BasicApi from "./basic";

export default class QuestionApi extends BasicApi {

    constructor() {
        super('/api/question');
    }

}