import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import AppointmentTable from '../../components/features/AppointmentTable';
import { Calendar, Users, Clock, CheckCircle } from 'lucide-react';
import Alert from '../../components/common/Alert';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    total: 0
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorService.getMyAppointments();
      // Assuming response.data is the array of appointments
      const data = response.data || [];
      setAppointments(data);
      calculateStats(data);
    } catch (err) {
      setError("Failed to load appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const today = new Date().toISOString().split('T')[0];

    setStats({
      today: data.filter(a => a.date.startsWith(today)).length,
      pending: data.filter(a => a.status === 'PENDING').length,
      completed: data.filter(a => a.status === 'COMPLETED').length,
      total: data.length
    });
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await doctorService.updateAppointmentStatus(id, newStatus);
      // Optimistic update
      const updatedAppointments = appointments.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      );
      setAppointments(updatedAppointments);
      calculateStats(updatedAppointments);
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Doctor Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={stats.today}
          icon={<Calendar className="text-blue-600" />}
          bg="bg-blue-50"
        />
        <StatCard
          title="Pending Requests"
          value={stats.pending}
          icon={<Clock className="text-yellow-600" />}
          bg="bg-yellow-50"
        />
        <StatCard
          title="Completed Visits"
          value={stats.completed}
          icon={<CheckCircle className="text-green-600" />}
          bg="bg-green-50"
        />
        <StatCard
          title="Total Patients"
          value={stats.total}
          icon={<Users className="text-purple-600" />}
          bg="bg-purple-50"
        />
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Upcoming Appointments</h2>
        </div>
        <AppointmentTable
          appointments={appointments}
          userRole="Doctor"
          onStatusUpdate={handleStatusUpdate}
        />
      </div>
    </div>
  );
};

// Simple Stat Card Component
const StatCard = ({ title, value, icon, bg }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4">
    <div className={`p-3 rounded-full ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

export default DoctorDashboard;