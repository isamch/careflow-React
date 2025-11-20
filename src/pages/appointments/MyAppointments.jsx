import { useEffect, useState } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { Calendar, Clock, User, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await appointmentService.getMyAppointments();
      // Postman returns: { success: true, data: [...] }
      setAppointments(response.data || []);
    } catch (err) {
      setError('Failed to load appointments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Cancel Action
  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    try {
      await appointmentService.cancelAppointment(id);
      // Refresh the list after cancellation
      fetchAppointments();
    } catch (err) {
      console.log(err);
      setError("Failed to cancel appointment");
    }
  };

  // Helper to get status color
  const getStatusBadge = (status) => {
    const styles = {
      scheduled: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || 'bg-gray-100'}`}>
        {status}
      </span>
    );
  };

  if (loading) return <div className="p-8 text-center">Loading appointments...</div>;

  return (
    <div className="space-y-6">
      {/* Header with "New Appointment" Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>

        <Link to="/appointments/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg ...">
          <Calendar size={18} />
          New Appointment
        </Link>

      </div>

      {/* Error Message */}
      {error && <div className="text-red-500 bg-red-50 p-3 rounded">{error}</div>}

      {/* Appointments List (Cards) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center py-10">No appointments found.</p>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. {appt.doctor?.fullName || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500">{appt.doctor?.specialization || 'General'}</p>
                  </div>
                </div>
                {getStatusBadge(appt.status)}
              </div>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <span>{new Date(appt.startTime).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <span>
                    {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {appt.status === 'scheduled' && (
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyAppointments;