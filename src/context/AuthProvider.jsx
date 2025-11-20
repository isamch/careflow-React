import { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);               // Store authenticated user data
  const [loading, setLoading] = useState(true);         // Loading state when app starts
  const [error, setError] = useState(null);             // Store login/register errors

  // Fetch current logged-in user using stored accessToken
  const fetchCurrentUser = async () => {
    try {
      const response = await authService.getCurrentUser();

      if (response && response.data) {
        const userData = {
          ...response.data.user,
          profile: response.data.profile,
        };
        setUser(userData);
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(email, password);

      if (response.data && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        await fetchCurrentUser();
        return true;
      }
    } catch (err) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem('accessToken');
    setUser(null);
    window.location.href = '/login';
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    role: user?.role,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
