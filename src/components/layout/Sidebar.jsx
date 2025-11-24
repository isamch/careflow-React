import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
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
  const navigate = useNavigate();

  const getRoleName = () => {
    if (!user?.role) return '';
    if (typeof user.role === 'string') return user.role;
    if (typeof user.role === 'object') return user.role.name || 'User';
    return 'User';
  };

  const roleName = getRoleName();

  const roleLinks = {
    Admin: [
      { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { path: '/users', label: 'Manage Users', icon: Users },
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
    ]
  };

  const links = roleLinks[roleName] || [];
  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    console.log('Profile button clicked!');
    navigate('/profile');
  };

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 shadow-xl z-50">
      <div className="p-6 border-b border-slate-800 flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Activity size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-wide">CareFlow</span>
      </div>

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

      <div className="p-4 border-t border-slate-800 bg-slate-950">
        <button
          type="button"
          onClick={handleProfileClick}
          className="w-full flex items-center gap-3 mb-4 hover:bg-slate-800 p-2 rounded-lg transition-colors text-left border-0 bg-transparent"
        >
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate text-white">{user?.fullName}</p>
            <p className="text-xs text-slate-400 truncate">{roleName}</p>
          </div>
        </button>

        <button
          type="button"
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