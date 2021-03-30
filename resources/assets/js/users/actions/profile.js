import { PROFILE } from "./types";
import ProfileApi from "../api/profile";

export const getProfile = () =>
  ( dispatch, getState ) => {
    if ( getState().profile.fetching )
      return;

    dispatch( setProfileFetching() );
    const api = new ProfileApi;
    return api.index({
      params: {},
      cb: data => dispatch( validateProfile( data.data ) ),
      err: e => dispatch( setProfileError( e.response ) ),
    });
  }

export const setProfileFetching = () => ({
  type: PROFILE.SET_FETCHING
})

export const setProfileError = response => ({
  type: PROFILE.SET_ERROR, response
})

export const validateProfile = data => ({
  type: PROFILE.VALIDATE, data
})