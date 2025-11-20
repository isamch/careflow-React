import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import StatCard from '../../components/dashboard/StatCard';
import { Calendar, Clock, PlusCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert';

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nextAppt, setNextAppt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch patient appointments using patientService
        const res = await patientService.getMyAppointments();
        const data = res.data || [];
        setAppointments(data);

        // Logic to find the Next Upcoming Appointment
        const upcoming = data
          .filter(a => a.status === 'scheduled' && new Date(a.startTime) > new Date())
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setNextAppt(upcoming[0] || null);

      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
        <Link to="/appointments/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
          <PlusCircle size={18} /> Book Appointment
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          title="Upcoming Appointments"
          value={appointments.filter(a => a.status === 'scheduled').length}
          icon={Calendar}
          color="blue"
          link="/my-appointments"
        />
        <StatCard
          title="Completed Visits"
          value={appointments.filter(a => a.status === 'completed').length}
          icon={FileText}
          color="green"
          link="/medical-records"
        />
        <StatCard
          title="Total Appointments"
          value={appointments.length}
          icon={Clock}
          color="purple"
        />
      </div>

      {/* Next Appointment Highlight */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="text-blue-600" size={20} /> Next Scheduled Visit
          </h3>

          {nextAppt ? (
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-blue-600 font-semibold mb-1">
                    {new Date(nextAppt.startTime).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">
                    Dr. {nextAppt.doctor?.fullName}
                  </h4>
                  <p className="text-gray-600 text-sm">{nextAppt.doctor?.specialization || 'General Medicine'}</p>
                </div>
                <div className="bg-white px-3 py-1 rounded text-blue-800 font-bold text-lg shadow-sm">
                  {new Date(nextAppt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-200 flex justify-between items-center">
                <span className="text-sm text-blue-700">Reason: {nextAppt.reason}</span>
                <Link to="/my-appointments" className="text-sm font-medium text-blue-700 hover:underline">Manage</Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
              <p>No upcoming appointments scheduled.</p>
              <Link to="/appointments/new" className="text-blue-600 hover:underline mt-2 block">Book one now</Link>
            </div>
          )}
        </div>

        {/* Quick Tips / Notifications Section */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl text-white shadow-lg">
          <h3 className="text-lg font-bold mb-2">Health Tip of the Day</h3>
          <p className="opacity-90 leading-relaxed">
            "Staying hydrated is key to maintaining energy levels. Aim for at least 8 glasses of water a day to keep your body functioning at its best."
          </p>
          <div className="mt-6">
            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors">
              Read More Tips
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;