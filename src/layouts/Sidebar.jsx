import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  Settings,
  LogOut,
  Pill
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Define navigation links based on roles
  const roleLinks = {
    Admin: [
      { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/users', label: 'Manage Users', icon: Users },
      { path: '/admin/roles', label: 'Roles & Permissions', icon: Settings },
      { path: '/admin/settings', label: 'Settings', icon: Settings },
    ],
    Doctor: [
      { path: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/appointments/me', label: 'My Appointments', icon: Calendar },
      { path: '/patients', label: 'My Patients', icon: Users },
      { path: '/doctor/prescriptions', label: 'Prescriptions', icon: FileText },
      { path: '/doctor/medications/available', label: 'Medications Inventory', icon: Pill },
    ],
    Patient: [
      { path: '/dashboard', label: 'Home', icon: LayoutDashboard },
      { path: '/my-appointments', label: 'Appointments', icon: Calendar },
      { path: '/prescriptions', label: 'Prescriptions', icon: FileText },
      { path: '/medical-records', label: 'Medical Records', icon: Activity },
    ],
    Nurse: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/nurse/appointments/me', label: 'Appointments', icon: Calendar },
    ],
    Secretary: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/secretary/appointments', label: 'All Appointments', icon: Calendar },
      { path: '/secretary/patients', label: 'Search Patients', icon: Users },
    ]
  };

  // Get links for current user role, fallback to empty array
  const userRole = typeof user?.role === 'object' ? user?.role?.name : user?.role;
  const links = roleLinks[userRole] || [];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="h-screen w-64 bg-white border-r border-gray-100 flex flex-col fixed left-0 top-0 shadow-soft z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="bg-primary-50 p-2.5 rounded-xl">
          <Activity size={24} className="text-primary" />
        </div>
        <span className="text-xl font-bold tracking-tight text-primary-900">CareFlow</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${active
                  ? 'bg-primary-50 text-primary-700 font-semibold shadow-sm'
                  : 'text-text-muted hover:bg-gray-50 hover:text-primary-600'
                }`}
            >
              <Icon
                size={20}
                className={`transition-colors duration-200 ${active ? 'text-primary-600' : 'text-gray-400 group-hover:text-primary-500'
                  }`}
              />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout (Bottom Section) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-3 mb-4 p-2 rounded-xl hover:bg-white transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold border-2 border-white shadow-sm">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
            <p className="text-xs text-text-muted truncate">
              {typeof user?.role === 'object' ? user?.role?.name : user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-2.5 text-sm font-medium text-danger hover:bg-red-50 rounded-xl transition-all duration-200"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
