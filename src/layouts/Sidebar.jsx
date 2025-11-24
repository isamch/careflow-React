import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Activity,
  Settings,
  LogOut
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
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/doctor/appointments/me', label: 'My Appointments', icon: Calendar },
      { path: '/patients', label: 'My Patients', icon: Users },
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
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      {/* Logo Area */}
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-wide">CareFlow</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive(link.path)
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
            >
              <Icon size={20} />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Logout (Bottom Section) */}
      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.fullName}</p>
            <p className="text-xs text-slate-500 truncate">
              {typeof user?.role === 'object' ? user?.role?.name : user?.role}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 p-2 text-sm text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
