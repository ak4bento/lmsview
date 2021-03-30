import { post } from 'axios';
import BasicApi from "./basic";

export default class TeachableUsersApi extends BasicApi {

  constructor() {
    super( '/rest/teachable-users' );
  }

  update({ id, data, cb, err, cancelToken = null, progress = null }) {
    data.append( '_method', 'PATCH' );
    return post( '/rest/teachable-users/' + id, data, {
      cancelToken,
      onUploadProgress: event => progress ? progress( event ) : true,
    } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

}