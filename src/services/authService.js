import request from '../api/request';

// These methods match exactly the API endpoints defined in your Postman collection
export const authService = {

  // Login user
  // POST /auth/login
  login: async (email, password) => {
    // "false" because login does NOT require a token
    return await request('/auth/login', 'POST', { email, password }, false);
  },

  // Register new patient account
  // POST /auth/register
  register: async (fullName, email, password) => {
    // "false" because registration does NOT require a token
    return await request('/auth/register', 'POST', { fullName, email, password }, false);
  },

  // Refresh access token
  // POST /auth/refresh
  refreshToken: async () => {
    // We keep isAuthRequest = true because server needs the old token in headers
    return await request('/auth/refresh', 'POST', {});
  },

  // Logout user
  // POST /auth/logout
  logout: async () => {
    try {
      // Try sending logout request to server
      await request('/auth/logout', 'POST', {});
    } finally {
      // Always remove tokens from localStorage even if request fails
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    }
  },

  // Fetch the currently authenticated user
  // GET /user/me
  getCurrentUser: async () => {
    // Requires valid token, so isAuthRequest = true (default)
    return await request('/user/me', 'GET');
  }
};
