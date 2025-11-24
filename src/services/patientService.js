import request from '../api/request';

export const patientService = {
  // Fetch the patient's full medical record (history, visits, prescriptions)
  // GET /patient/record/me
  getMyRecord: async () => {
    return await request('/patient/record/me', 'GET');
  },

  // Fetch the patient's notifications
  // GET /patient/notifications/me
  getNotifications: async () => {
    return await request('/patient/notifications/me', 'GET');
  },

  // Get my appointments
  // GET /patient/appointments
  getMyAppointments: async () => {
    return await request('/patient/appointments', 'GET');
  },

  // Get available time slots for booking
  // GET /patient/appointments/available?doctorId=X&date=YYYY-MM-DD
  getAvailableSlots: async (doctorId, date) => {
    return await request(`/patient/appointments/available?doctorId=${doctorId}&date=${date}`, 'GET');
  },

  // Create a new appointment
  // POST /patient/appointments
  createAppointment: async (data) => {
    // data: { doctorId, startTime, endTime, reason }
    return await request('/patient/appointments', 'POST', data);
  },

  // Cancel an appointment
  cancelAppointment: async (appointmentId) => {
    return await request(`/patient/appointments/${appointmentId}/cancel`, 'PATCH');
  },

  // Update/Reschedule an appointment
  // PUT /patient/appointments/:id
  updateAppointment: async (id, data) => {
    // data: { startTime, endTime, reason }
    return await request(`/patient/appointments/${id}`, 'PUT', data);
  },

  // Get my prescriptions
  // GET /patient/prescriptions
  getMyPrescriptions: async () => {
    return await request('/patient/prescriptions', 'GET');
  }
};
