import { PROFILE } from "../actions/types";

export default (
  state = {
    data:     {},
    error:    false,
    fetching: false,
  },
  action
) => {

  let newState = Object.assign({}, state);

  switch (action.type) {

    case PROFILE.VALIDATE:
      newState.data = Object.assign( {}, action.data );
      newState.fetching = false;
      return newState;

    case PROFILE.SET_FETCHING:
      newState.fetching = true;
      newState.error = false;
      return newState;

    case PROFILE.SET_ERROR:
      newState.fetching = false;
      newState.error = true;
      return newState;

    default: return newState;
  }

}
