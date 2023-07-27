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

  // appointments for a specific day that is currently in our state
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // interviewers for a specific day that is currently in our state
  const interviewersForDay = getInterviewersForDay(state, state.day);

  // function to set the state of `day`
  const setDay = (day) => setState({ ...state, day });

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
