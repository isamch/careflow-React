import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1. Show loading spinner while AuthContext checks the token
  if (loading) {
    return <LoadingSpinner />;
  }

  // 2. If not authenticated, redirect to login page
  // We save the current location to redirect them back after login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role-based access control (RBAC)
  // If roles are specified for this route, check if user has one of them
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // User is logged in but doesn't have permission (e.g., Patient trying to access Admin)
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. If all checks pass, render the child components (The protected page)
  return <Outlet />;
};

export default ProtectedRoute;