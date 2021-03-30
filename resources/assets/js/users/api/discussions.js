import BasicApi from "./basic";

export default class DiscussionsApi extends BasicApi {

  constructor() {
    super( '/rest/discussions' );
  }

}