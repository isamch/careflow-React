import request from '../api/request';

export const doctorService = {
  // Fetch appointments for the logged-in doctor
  // GET /doctor/appointments/me?page=1&limit=10
  getMyAppointments: async (page = 1, limit = 10) => {
    return await request(`/doctor/appointments/me?page=${page}&limit=${limit}`, 'GET');
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
  },

  // --- Prescriptions ---

  // Get all prescriptions issued by the doctor
  // GET /doctor/prescriptions
  getPrescriptions: async (page = 1, limit = 10) => {
    return await request(`/doctor/prescriptions?page=${page}&limit=${limit}`, 'GET');
  },

  // Create a new prescription
  // POST /doctor/prescriptions/send-to-pharmacy
  createPrescription: async (prescriptionData) => {
    return await request('/doctor/prescriptions/send-to-pharmacy', 'POST', prescriptionData);
  },

  // Get a single prescription by ID
  // GET /doctor/prescriptions/:id
  getPrescriptionById: async (id) => {
    return await request(`/doctor/prescriptions/${id}`, 'GET');
  },

  // --- Medications ---

  // Get all available medications
  // GET /doctor/medications
  getMedications: async () => {
    return await request('/doctor/medications/available', 'GET');
  }
};
