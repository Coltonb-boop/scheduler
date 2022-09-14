import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });
  
  const setDay = day => setState(prev => ({ ...prev, day }));

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data
      }));
    })
    .catch(e => console.log(e.message));
  }, []);

  const updateSpots = (ids, appointments) => {
    let spots = 0;

    for (const id of ids) {
      if (appointments[id].interview) {
        spots++;
      }
    }
    
    return ids.length - spots;
  }

  const bookInterview = (id, interview) => {
      
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const dayData = state.days.filter(res => res.name === state.day)[0];
    const spots = updateSpots(dayData.appointments, appointments);

    const days = state.days.map(day => {
      if (day.name === state.day) {
        return {
          ...day,
          spots
        }
      }
      return day;
    })
    
    return axios.put(`/api/appointments/${id}`, { interview })
    .then(res => {
      setState({ ...state, appointments, days });
      });
    
  };

  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    }

    const appointments = {
      ...state.appointments,
      [id]: appointment
    }

    const dayData = state.days.filter(res => res.name === state.day)[0];
    const spots = updateSpots(dayData.appointments, appointments);

    const days = state.days.map(day => {
      if (day.name === state.day) {
        return {
          ...day,
          spots
        }
      }
      return day;
    })
    
    return axios.delete(`/api/appointments/${id}`)
    .then(res => {
      setState({ ...state, appointments, days })
    });
    
  }

  return { state, setDay, bookInterview, cancelInterview };

}