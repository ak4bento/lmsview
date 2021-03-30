import { combineReducers } from 'redux';

import profile from "./profile";
import classrooms from "./classrooms";

export default combineReducers({
  profile, classrooms
});
