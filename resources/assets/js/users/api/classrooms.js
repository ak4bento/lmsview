import BasicApi from "./basic";

export default class ClassroomsApi extends BasicApi {

  constructor() {
    super( '/rest/classrooms' );
  }

}