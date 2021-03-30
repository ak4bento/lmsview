import Moment from "moment";
import { CLASSROOMS } from "../actions/types";

export default (
  state = {
    data:           [],
    error:          false,
    cache:          {
      classroom:    {
        data:       null,
        filter:     null,
        timestamp:  null,
      },
      discussions:  {
        data:       null,
        classroom:  null,
        timestamp:  null,
      },
      files:        {
        data:       null,
        classroom:  null,
        timestamp:  null,
      },
      participants: {
        data:       null,
        classroom:  null,
        timestamp:  null,
      },
    },
    fetching:       false,
    cacheTimestamp: null,
  },
  action
) => {

  let newState = Object.assign({}, state);

  switch (action.type) {

    case CLASSROOMS.POPULATE:
      newState.data = action.data.slice(0);
      newState.fetching = false;
      newState.cacheTimestamp = Moment();
      return newState;

    case CLASSROOMS.SET_ERROR:
      newState.fetching = false;
      newState.error = Object.assign( {}, action.response );
      return newState;

    case CLASSROOMS.SET_FETCHING:
      newState.fetching = true;
      newState.error = false;
      return newState;

    case CLASSROOMS.CACHE_SINGLE:
      newState.cache.classroom.data = Object.assign( {}, action.classroom );
      newState.cache.classroom.filter = null;
      newState.cache.classroom.timestamp = Moment();
      return newState;

    case CLASSROOMS.CACHE_SINGLE_CLEAR:
      newState.cache = {
        classroom:    {
          data:       null,
          filter:     null,
          timestamp:  null,
        },
        discussions:  {
          data:       null,
          classroom:  null,
          timestamp:  null,
        },
        files: {
          data:       null,
          classroom:  null,
          timestamp:  null,
        },
        participants: {
          data:       null,
          classroom:  null,
          timestamp:  null,
        },
      };
      return newState;

    case CLASSROOMS.CACHE_DISCUSSIONS:
      newState.cache.discussions.data = action.discussions.slice(0);
      newState.cache.discussions.classroom = action.classroom;
      newState.cache.discussions.timestamp = Moment();
      return newState;

    case CLASSROOMS.CACHE_FILES:
      newState.cache.files.data = action.files.slice(0);
      newState.cache.files.classroom = action.classroom;
      newState.cache.files.timestamp = Moment();
      return newState;

    case CLASSROOMS.CACHE_PARTICIPANTS:
      newState.cache.participants.data = action.participants.slice(0);
      newState.cache.participants.classroom = action.classroom;
      newState.cache.participants.timestamp = Moment();
      return newState;

    case CLASSROOMS.CACHE_SINGLE_TEACHABLES_FILTER:
      newState.cache.classroom.filter = action.filter;
      return newState;

    default: return newState;
  }

}
