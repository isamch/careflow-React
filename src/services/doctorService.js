import request from '../api/request';

export const doctorService = {
  // Fetch appointments for the logged-in doctor
  // GET /doctor/appointments/me
  getMyAppointments: async () => {
    return await request('/doctor/appointments/me', 'GET');
  },

  // Update the status of an appointment (completed, cancelled, etc.)
  // PATCH /doctor/appointments/:id/status
  updateAppointmentStatus: async (appointmentId, status) => {
    return await request(`/doctor/appointments/${appointmentId}/status`, 'PATCH', { status });
  },

  // Fetch a patient's medical record (for future use)
  // GET /doctor/patients/:id/record
  getPatientRecord: async (patientId) => {
    return await request(`/doctor/patients/${patientId}/record`, 'GET');
  },

  // Add a medical visit (diagnosis and treatment)
  // POST /doctor/patients/:id/visits
  addVisit: async (patientId, visitData) => {
    return await request(`/doctor/patients/${patientId}/visits`, 'POST', visitData);
  }
};
