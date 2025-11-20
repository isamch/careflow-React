import request from '../api/request';

/**
 * Nurse Service
 * خدمات الممرضة - عرض المواعيد المخصصة
 */
export const nurseService = {
  // Fetch appointments assigned to the logged-in nurse
  // GET /nurse/appointments/me
  getMyAppointments: async () => {
    return await request('/nurse/appointments/me', 'GET');
  }
};
