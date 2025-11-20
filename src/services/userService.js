import request from '../api/request';

/**
 * User Service
 * خدمات مشتركة لجميع المستخدمين
 */
export const userService = {
  // Get current user information
  // GET /user/me
  getCurrentUser: async () => {
    return await request('/user/me', 'GET');
  },

  // Get my notifications
  // GET /user/me/notifications
  getMyNotifications: async () => {
    return await request('/user/me/notifications', 'GET');
  }
};
