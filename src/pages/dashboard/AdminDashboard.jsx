import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/dashboard/StatCard';
import { Users, UserCheck, Activity, ShieldAlert, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    doctors: 0,
    patients: 0,
    nurses: 0,
    admins: 0,
    secretaries: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch users data
      const res = await adminService.getAllUsers(1, 100);
      const users = res.data?.users || [];

      // Calculate stats by role
      const doctors = users.filter(u => {
        const role = typeof u.role === 'object' ? u.role?.name : u.role;
        return role === 'Doctor';
      }).length;

      const patients = users.filter(u => {
        const role = typeof u.role === 'object' ? u.role?.name : u.role;
        return role === 'Patient';
      }).length;

      const nurses = users.filter(u => {
        const role = typeof u.role === 'object' ? u.role?.name : u.role;
        return role === 'Nurse';
      }).length;

      const admins = users.filter(u => {
        const role = typeof u.role === 'object' ? u.role?.name : u.role;
        return role === 'Admin';
      }).length;

      const secretaries = users.filter(u => {
        const role = typeof u.role === 'object' ? u.role?.name : u.role;
        return role === 'Secretary';
      }).length;

      setStats({
        total: res.data?.total || users.length,
        doctors,
        patients,
        nurses,
        admins,
        secretaries
      });

      // Get recent users (last 5)
      const sortedUsers = [...users].sort((a, b) =>
        new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5);
      setRecentUsers(sortedUsers);

    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-800",
      Doctor: "bg-blue-100 text-blue-800",
      Patient: "bg-green-100 text-green-800",
      Nurse: "bg-yellow-100 text-yellow-800",
      Secretary: "bg-pink-100 text-pink-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">System Overview</h2>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening in your system.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          color="blue"
          link="/users"
        />
        <StatCard
          title="Doctors"
          value={stats.doctors}
          icon={Activity}
          color="purple"
        />
        <StatCard
          title="Patients"
          value={stats.patients}
          icon={UserCheck}
          color="green"
        />
        <StatCard
          title="Nurses"
          value={stats.nurses}
          icon={Activity}
          color="yellow"
        />
        <StatCard
          title="Secretaries"
          value={stats.secretaries}
          icon={Calendar}
          color="pink"
        />
        <StatCard
          title="Admins"
          value={stats.admins}
          icon={ShieldAlert}
          color="orange"
        />
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="text-blue-600" size={20} />
              Recent Users
            </h3>
            <Link to="/users" className="text-sm text-blue-600 hover:underline">
              View All
            </Link>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No users yet</p>
          ) : (
            <div className="space-y-3">
              {recentUsers.map((user) => {
                const roleName = typeof user.role === 'object' ? user.role?.name : user.role;
                return (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                        {user.fullName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{user.fullName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadge(roleName)}`}>
                      {roleName}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link
              to="/users"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Users className="text-blue-600" size={20} />
                </div>
                <div>
                  <span className="font-bold block text-gray-900 group-hover:text-blue-600">Manage Users</span>
                  <span className="text-sm text-gray-500">Add, edit or remove system users</span>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/roles"
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <ShieldAlert className="text-purple-600" size={20} />
                </div>
                <div>
                  <span className="font-bold block text-gray-900 group-hover:text-purple-600">Roles & Permissions</span>
                  <span className="text-sm text-gray-500">View and manage user roles</span>
                </div>
              </div>
            </Link>

            <button
              className="w-full p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Activity className="text-green-600" size={20} />
                </div>
                <div>
                  <span className="font-bold block text-gray-900 group-hover:text-green-600">System Logs</span>
                  <span className="text-sm text-gray-500">Check system activity logs</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">System Status</h3>
            <p className="text-blue-100">All systems operational</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="font-semibold">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;