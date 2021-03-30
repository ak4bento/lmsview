import Moment from "moment";

import { CLASSROOMS } from "./types";
import ClassroomsApi from "../api/classrooms";

export const getClassrooms = (force = false, teachingPeriod = null ) =>
  ( dispatch, getState ) => {
    if ( getState().classrooms.fetching )
      return;

    if (
      getState().classrooms.cacheTimestamp &&
      getState().classrooms.cacheTimestamp > Moment().subtract(1, 'hours') &&
      !force
    )
      return;

    dispatch( setClassroomsFetching() );
    const api = new ClassroomsApi;
    const params = {};
    if (teachingPeriod ) params.teaching_period = teachingPeriod;

    return api.index({
      params ,
      cb: data => dispatch( populateClassrooms( data.data ) ),
      err: e => dispatch( setClassroomsError( e.response ) ),
    });
  }

export const setClassroomsFetching = () => ({
  type: CLASSROOMS.SET_FETCHING
})

export const setClassroomsError = response => ({
  type: CLASSROOMS.SET_ERROR, response
})

export const populateClassrooms = data => ({
  type: CLASSROOMS.POPULATE, data
})

export const cacheClassroom = classroom => ({
  type: CLASSROOMS.CACHE_SINGLE, classroom
})

export const clearClassroomCache = () => ({
  type: CLASSROOMS.CACHE_SINGLE_CLEAR
})

export const cacheClassroomTeachablesFilter = filter => ({
  type: CLASSROOMS.CACHE_SINGLE_TEACHABLES_FILTER, filter
})

export const cacheClassroomDiscussions = ({ classroom, discussions }) => ({
  type: CLASSROOMS.CACHE_DISCUSSIONS, classroom, discussions
})

export const cacheClassroomFiles = ({ classroom, files }) => ({
  type: CLASSROOMS.CACHE_FILES, classroom, files
})

export const cacheClassroomParticipants = ({ classroom, participants }) => ({
  type: CLASSROOMS.CACHE_PARTICIPANTS, classroom, participants
})