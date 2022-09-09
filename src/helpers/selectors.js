export function getAppointmentsForDay(state, day) {
  let result = [];
  
  const filteredDays = state.days.filter(res => res.name === day);
  if (filteredDays.length > 0) {
    for (const filteredDay of filteredDays[0].appointments) {
      result.push(state.appointments[filteredDay])
    }
  }
  
  return result;
}

export function getInterview(state, interview) {
  if (interview) {
    return { ...interview, interviewer: state.interviewers[interview.interviewer] };
  }

  return null;
}