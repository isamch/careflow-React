import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  // Normalize role to string (handle both string and object formats)
  const normalizedContext = {
    ...context,
    role: typeof context.user?.role === 'object' ? context.user?.role?.name : context.user?.role
  };

  return normalizedContext;
};

export default useAuth;