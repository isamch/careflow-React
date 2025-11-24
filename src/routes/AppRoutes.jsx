import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts & Guards
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/guards/ProtectedRoute';
import useAuth from '../hooks/useAuth';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import ForgotPassword from '../pages/auth/ForgotPassword';

// Dashboard Pages
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import DoctorDashboard from '../pages/dashboard/DoctorDashboard';
import PatientDashboard from '../pages/dashboard/PatientDashboard';
import NurseDashboard from '../pages/dashboard/NurseDashboard';
import SecretaryDashboard from '../pages/dashboard/SecretaryDashboard';

// Shared Pages
import Unauthorized from '../pages/shared/Unauthorized';
import Profile from '../pages/shared/Profile';


// Appointments & Prescriptions pages
import MyAppointments from '../pages/appointments/MyAppointments';
import NewAppointment from '../pages/appointments/NewAppointment';
import DoctorAppointments from '../pages/dashboard/DoctorAppointments';
import PatientDetails from '../pages/dashboard/PatientDetails';
import MyPrescriptions from '../pages/appointments/MyPrescriptions';
import PatientsList from '../pages/dashboard/PatientsList';

// Admin Pages
import AdminUsers from '../pages/dashboard/AdminUsers';
import AdminRoles from '../pages/dashboard/AdminRoles';





// Roles Constants (Must match Backend)
const ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  NURSE: 'Nurse',
  SECRETARY: 'Secretary'
};

// ⚡ Move DashboardRedirect outside of AppRoutes
const DashboardRedirect = () => {
  const { user, role } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  switch (role) {
    case ROLES.ADMIN:
      return <AdminDashboard />;
    case ROLES.DOCTOR:
      return <DoctorDashboard />;
    case ROLES.PATIENT:
      return <PatientDashboard />;
    case ROLES.NURSE:
      return <NurseDashboard />;
    case ROLES.SECRETARY:
      return <SecretaryDashboard />;
    default:
      return <PatientDashboard />;
  }
};

const AppRoutes = () => {
  const { user, role } = useAuth();

  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ================= PROTECTED ROUTES ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Default Redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/profile" element={<Profile />} />

          {/* --- Role Based Routes --- */}
          {role === ROLES.ADMIN && (
            <>
              <Route path="/users" element={<AdminUsers />} />
              <Route path="/admin/roles" element={<AdminRoles />} />
              <Route path="/admin/settings" element={<div className="p-4">Settings</div>} />
            </>
          )}

          {role === ROLES.DOCTOR && (
            <>
              <Route path="/doctor/appointments/me" element={<DoctorAppointments />} />
              <Route path="/patients/:id" element={<PatientDetails />} />
              <Route path="/patients" element={<PatientsList />} />
            </>
          )}

          {role === ROLES.PATIENT && (
            <>
              <Route path="/my-appointments" element={<MyAppointments />} />
              <Route path="/appointments/new" element={<NewAppointment />} />
              <Route path="/prescriptions" element={<MyPrescriptions />} />
            </>
          )}

          {role === ROLES.NURSE && (
            <>
              <Route path="/nurse/appointments/me" element={<NurseDashboard />} />
            </>
          )}

          {role === ROLES.SECRETARY && (
            <>
              <Route path="/secretary/appointments" element={<SecretaryDashboard />} />
              <Route path="/secretary/patients" element={<SecretaryDashboard />} />
            </>
          )}
        </Route>
      </Route>

      {/* ================= 404 NOT FOUND ================= */}
      <Route path="*" element={<div className="p-10 text-center">404 - Page Not Found</div>} />
    </Routes>
  );
};

export default AppRoutes;
