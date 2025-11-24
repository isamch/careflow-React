import request from '../api/request';

export const adminService = {
  // Fetch all users (with pagination support)
  // GET /admin/users?page=1&limit=10
  getAllUsers: async (page = 1, limit = 10) => {
    return await request(`/admin/users?page=${page}&limit=${limit}`, 'GET');
  },

  // Create a new user
  // POST /admin/users
  createUser: async (userData) => {
    // userData: { fullName, email, roleName, profileData: {...} }
    return await request('/admin/users', 'POST', userData);
  },

  // Fetch available roles (for populating dropdowns)
  // GET /admin/roles
  getRoles: async () => {
    return await request('/admin/roles', 'GET');
  },

  // Create a new role
  // POST /admin/roles
  createRole: async (roleData) => {
    // roleData: { name, description, permissions: [] }
    return await request('/admin/roles', 'POST', roleData);
  },

  // Get all appointments in the system (Admin overview)
  // GET /admin/appointments?page=1&limit=20
  getAllAppointments: async (page = 1, limit = 20) => {
    return await request(`/admin/appointments?page=${page}&limit=${limit}`, 'GET');
  }
};
