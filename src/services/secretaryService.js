import request from '../api/request';

/**
 * Secretary Service
 * خدمات السكرتيرة - إدارة المواعيد والبحث عن المرضى
 */
export const secretaryService = {
  // Search for patients
  // GET /secretary/patients?q=searchTerm
  searchPatients: async (searchTerm = '') => {
    return await request(`/secretary/patients?q=${searchTerm}`, 'GET');
  },

  // Get all appointments with pagination
  // GET /secretary/appointments?page=1&perPage=10
  getAllAppointments: async (page = 1, perPage = 10) => {
    return await request(`/secretary/appointments?page=${page}&perPage=${perPage}`, 'GET');
  },

  // Create appointment for a patient
  // POST /secretary/appointments
  createAppointment: async (appointmentData) => {
    // appointmentData: { patientId, doctorId, startTime, endTime, reason }
    return await request('/secretary/appointments', 'POST', appointmentData);
  }
};
