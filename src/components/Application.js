import React, { useState, useEffect } from "react";

import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment";
import axios from "axios";
import { getAppointmentsForDay, getInterviewersForDay, getInterview } from "helpers/selectors";

export default function Application() {
  // conbined state of the application
  const [state, setState] = useState({
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
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // appointments for a specific day that is currently in our state
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // interviewers for a specific day that is currently in our state
  const interviewersForDay = getInterviewersForDay(state, state.day);

  // function to set the state of `day`
  const setDay = (day) => setState((prevState) => ({ ...prevState, day }));

  /**
   * function to book an interview for an appointment time slot
   * @param {number} id
   * @param {object} interview
   * @returns {promise} book the interview
   */

  const bookInterview = (id, interview) => {
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
    return axios.put(`/api/appointments/${id}`, { interview }).then((response) => {
      //update the application state to have the new appointment
      setState((prev) => ({ ...prev, appointments }));
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
    return axios.delete(`/api/appointments/${id}`, null).then((response) => {
      //update the application state with the deleted the appointment
      setState((prev) => ({ ...prev, appointments }));
    });
  };

  // list of Appointment components created based on the dailyAppointments
  const appointmentList = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        interview={interview}
        interviewers={interviewersForDay}
        time={appointment.time}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  // last Appointment of the day that cannot be booked
  appointmentList.push(<Appointment key="last" time="5pm" />);

  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler" />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">{appointmentList}</section>
    </main>
  );
}
