import { useEffect, useReducer } from "react";
import axios from "axios";

const SET_DAY = "SET_DAY";
const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
const SET_INTERVIEW = "SET_INTERVIEW";
const SET_SPOTS_REMAINING = "SET_SPOTS_REMAINING";

function reducer(state, action) {
  switch (action.type) {
    case SET_DAY: {
      return { ...state, day: action.payload };
    }
    case SET_APPLICATION_DATA:
      return {
        ...state,
        days: action.payload.days,
        appointments: action.payload.appointments,
        interviewers: action.payload.interviewers,
      };
    case SET_INTERVIEW: {
      return {
        ...state,
        appointments: action.payload,
      };
    }
    case SET_SPOTS_REMAINING: {
      return {
        ...state,
        days: action.payload,
      };
    }
    default:
      throw new Error(`Tried to reduce with unsupported action type: ${action.type}`);
  }
}

export default function useApplicationData() {
  // conbined state of the application
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  // API calls to get the days and appointments & update the state after both have returned
  useEffect(() => {
    Promise.all([
      axios.get(`/api/days`),
      axios.get(`/api/appointments`),
      axios.get(`/api/interviewers`),
    ]).then((all) => {
      const data = {
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      };
      dispatch({ type: SET_APPLICATION_DATA, payload: data });
    });
  }, []);

  // function to set the state of `day`
  const setDay = (day) => dispatch({ type: SET_DAY, payload: day });

  /**
   *  function to update the spots remaining
   * @param {number} id appointment id
   * @param {number} change add or substract 1
   */
  const setSpotsRemaining = (id, change = 0) => {
    // create a new days state with the updated spots for a matching day
    const days = state.days.map((day) => {
      if (day.appointments.includes(id)) {
        return { ...day, spots: day.spots + change };
      }
      return day;
    });

    dispatch({ type: SET_SPOTS_REMAINING, payload: days });
  };

  /**
   * function to book an interview for an appointment time slot
   * @param {number} id appointment id
   * @param {object} interview interview data for the appointment
   * @param {boolean} isCreate true if mode is CREATE
   * @returns {promise} Promise to book the interview
   */

  const bookInterview = (id, interview, isCreate) => {
    // create appointment object based on the current state of the appointment and add the new values of the interview to it.
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    //create a new obj of the current appointments state with the new appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //API call to update the appointment with the new interview in DB
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        //update the application state to have the new appointment
        dispatch({ type: SET_INTERVIEW, payload: appointments });
      })
      .then((response) => {
        if (isCreate) {
          setSpotsRemaining(id, -1);
        }
      });
  };

  /**
   * cancel an existing interview based on provided id
   * @param {number} id
   * @returns {promise} cancel the interview
   */

  const cancelInterview = (id) => {
    //create a new Obj of the appointment that needs to be deleted
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    //create a new obj of the current appointments state with the deleted appointment
    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    //API call to delete the interview from DB
    return axios
      .delete(`/api/appointments/${id}`, null)
      .then((response) => {
        //update the application state with the deleted the appointment
        dispatch({ type: SET_INTERVIEW, payload: appointments });
      })
      .then((response) => {
        setSpotsRemaining(id, +1);
      });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
