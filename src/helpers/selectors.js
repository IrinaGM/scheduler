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
