import BasicApi from "./basic";
import { post } from "axios";

export default class MediaApi extends BasicApi {

  constructor() {
    super( path );
  }

  store({ data, params = {}, cb, err, cancelToken = null, progress = null }) {
    return post( path, data, {
      params,
      cancelToken,
      onUploadProgress: event => progress ? progress( event ) : true,
    } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

}

const path = '/rest/media';