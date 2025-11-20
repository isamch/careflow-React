import request from '../api/request';

export const appointmentService = {
  // --- PATIENT ENDPOINTS ---
  
  // Get all appointments for the logged-in patient
  // GET /patient/appointments
  getMyAppointments: async () => {
    return await request('/patient/appointments', 'GET');
  },

  // Get available slots for a specific doctor on a specific date
  // GET /patient/appointments/available?doctorId=...&date=...
  getAvailableSlots: async (doctorId, date) => {
    return await request(`/patient/appointments/available?doctorId=${doctorId}&date=${date}`, 'GET');
  },

  // Create a new appointment
  // POST /patient/appointments
  createAppointment: async (appointmentData) => {
    // appointmentData: { doctorId, startTime, endTime, reason }
    return await request('/patient/appointments', 'POST', appointmentData);
  },

  // Cancel an appointment
  // PATCH /patient/appointments/:id/cancel
  cancelAppointment: async (id) => {
    return await request(`/patient/appointments/${id}/cancel`, 'PATCH', {});
  },

  // --- DOCTOR ENDPOINTS ---

  // Get doctor's schedule
  // GET /doctor/appointments/me
  getDoctorAppointments: async () => {
    return await request('/doctor/appointments/me', 'GET');
  },

  // Update appointment status (e.g., completed, no-show)
  // PATCH /doctor/appointments/:id/status
  updateStatus: async (id, status) => {
    return await request(`/doctor/appointments/${id}/status`, 'PATCH', { status });
  }
};