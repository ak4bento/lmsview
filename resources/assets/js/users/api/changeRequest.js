import { post } from "axios";

export default class ChangeRequestApi {

  static store({ context, data, cb, err, cancelToken = null }) {
    return post( '/rest/change-request', {
      context,
      [context]: data
    }, { cancelToken } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

}