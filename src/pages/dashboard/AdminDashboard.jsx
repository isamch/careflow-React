import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import StatCard from '../../components/dashboard/StatCard';
import { Users, UserCheck, Activity, ShieldAlert } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ total: 0, doctors: 0, patients: 0, admins: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch first page of users (Simulating stats since we don't have a stats endpoint)
        // In a real app, we should have an endpoint like GET /admin/stats
        const res = await adminService.getAllUsers(1, 100); 
        const users = res.data?.users || [];
        
        // Calculate local stats from the list
        const doctors = users.filter(u => u.role === 'Doctor' || u.roleName === 'Doctor').length;
        const patients = users.filter(u => u.role === 'Patient' || u.roleName === 'Patient').length;
        const admins = users.filter(u => u.role === 'Admin' || u.roleName === 'Admin').length;

        setStats({
          total: res.data?.total || users.length, // Use total from pagination if available
          doctors,
          patients,
          admins
        });

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8">Loading system stats...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">System Overview</h2>
      
      <div className="grid md:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats.total} icon={Users} color="blue" link="/users" />
        <StatCard title="Doctors" value={stats.doctors} icon={Activity} color="purple" />
        <StatCard title="Patients" value={stats.patients} icon={UserCheck} color="green" />
        <StatCard title="Admins" value={stats.admins} icon={ShieldAlert} color="orange" />
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid md:grid-cols-3 gap-4">
           <button onClick={() => window.location.href='/users'} className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <span className="font-bold block text-blue-600">Manage Users</span>
              <span className="text-sm text-gray-500">Add, edit or remove system users</span>
           </button>
           <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <span className="font-bold block text-blue-600">System Settings</span>
              <span className="text-sm text-gray-500">Configure global variables</span>
           </button>
           <button className="p-4 border rounded-lg hover:bg-gray-50 text-left">
              <span className="font-bold block text-blue-600">View Logs</span>
              <span className="text-sm text-gray-500">Check system activity logs</span>
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;