import request from '../api/request';

export const publicService = {
  // Fetch a list of all doctors
  // GET /home/doctors
  getAllDoctors: async () => {
    return await request('/home/doctors', 'GET', null, false);
  },

  // Fetch details of a specific doctor (optional for future use)
  getDoctorById: async (id) => {
    return await request(`/home/doctors/${id}`, 'GET', null, false);
  },

  // Get doctor availability for a specific date
  // GET /home/doctors/:doctorId/availability?date=YYYY-MM-DD
  getDoctorAvailability: async (doctorId, date) => {
    return await request(`/home/doctors/${doctorId}/availability?date=${date}`, 'GET', null, false);
  }
};
