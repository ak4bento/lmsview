import BasicApi from "./basic";

export default class ClassroomUsersApi extends BasicApi {

  constructor() {
    super( '/rest/classroom-users' );
  }

}