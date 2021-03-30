import BasicApi from "./basic";

export default class UserApi extends BasicApi {

  constructor() {
    super( '/rest/users' );
  }

}