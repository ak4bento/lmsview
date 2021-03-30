import BasicApi from "./basic";

export default class GradeApi extends BasicApi {

  constructor() {
    super( '/rest/grades' );
  }

}