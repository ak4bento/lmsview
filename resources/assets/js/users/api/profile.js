import { post } from "axios";
import BasicApi from "./basic";

export default class ProfileApi extends BasicApi {

  constructor() {
    super( '/rest/profile' );
  }

  storeAvatar({ file, cb, err, cancelToken = null }) {
    let data = new FormData();
    data.append( 'avatar', file );
    return post( this.requestURL, data, { cancelToken } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

}