import { get, post } from "axios";

export const getSignedJWPlayerLinks = ({ playerId, videoId, cb, err, cancelToken = null }) =>
  get( '/rest/jw-player/signed-links',
    {
      params: { playerId, videoId },
      cancelToken
    } )
    .then( response => cb( response.data ) )
    .catch( e => err( e ) );

export const getJWPlayerVideos = ({ term, cb, err, cancelToken }) =>
  get( '/rest/jw-player/videos',
    {
      params: { term },
      cancelToken
    } )
    .then( response => cb( response.data ) )
    .catch( e => err( e ) );

export const logout = ({ cb, err }) =>
  post( '/logout' )
    .then( response => cb( response.data ) )
    .catch( e => err( e ) );