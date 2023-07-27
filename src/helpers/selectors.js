/**
 * @param {String} day
 * @param {Object} state
 * @return the appointments data object for the provided day
 */

export function getAppointmentsForDay(state, day) {
  const appointmentIds = state.days
    .filter((dayObj) => dayObj.name === day)
    .map((obj) => obj.appointments);

  if (appointmentIds.length === 0) {
    return [];
  }

  const appointmentForDay = appointmentIds[0].map((id) => {
    return state.appointments[id];
  });

  return appointmentForDay;
}

/**
 * @param {String} day
 * @param {Object} state
 * @return the interviewers data object for the provided day
 */

export function getInterviewersForDay(state, day) {
  const interviewersIds = state.days
    .filter((dayObj) => dayObj.name === day)
    .map((obj) => obj.interviewers);

  if (interviewersIds.length === 0) {
    return [];
  }

  const interviewersForDay = interviewersIds[0].map((id) => {
    return state.interviewers[id];
  });

  return interviewersForDay;
}

/**
 * @param {Object} interview
 * @param {Object} state
 * @return the interview data object if the function is passed an object that contains an interviewer
 */

export function getInterview(state, interview) {
  // if intreview object is null, return null
  if (!interview) {
    return null;
  }

  return {
    ...interview,
    interviewer: state.interviewers[interview.interviewer],
  };
}
