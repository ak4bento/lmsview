import BasicApi from "./basic";

export default class TeachablesApi extends BasicApi {

  constructor() {
    super( '/rest/teachables' );
  }

}