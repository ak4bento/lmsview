import BasicApi from "./basic";

export default class ThreadsApi extends BasicApi {

  constructor() {
    super( '/rest/threads' );
  }

}