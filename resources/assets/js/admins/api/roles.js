import Axios from "axios";
import Api from "./api";

export default class RolesApi extends Api {

  static index({ cb, err, params }) {
    return Axios.get( config.baseUrl + '/rest/classrooms', { params } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

  static show({ slug, cb, err, params }) {
    return Axios.get( config.baseUrl + '/rest/classrooms/' + slug, { params } )
      .then( response => cb( response.data ) )
      .catch( e => err( e ) );
  }

}