import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const response = await doctorService.getMyAppointments();
      // Postman returns: { success: true, data: [...] }
      setAppointments(response.data || []);
    } catch (err) {
      setError('Failed to load schedule.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle Status Update
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Optimistic UI Update (Update list immediately before server responds)
      setAppointments(prev => prev.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      ));

      await doctorService.updateAppointmentStatus(id, newStatus);
    } catch (err) {
      console.log(err);
      setError("Failed to update status");
      loadAppointments(); // Revert on error
    }
  };

  // Helper: Status Badge Color
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) return <div className="p-8 text-center">Loading schedule...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Today's Schedule</h2>
          <p className="text-gray-500">Manage your appointments and patient visits</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <span className="font-semibold text-gray-700">Date: </span>
          {new Date().toLocaleDateString()}
        </div>
      </div>

      {error && <div className="text-red-600 bg-red-50 p-3 rounded border border-red-100">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                  No appointments found for today.
                </td>
              </tr>
            ) : (
              appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                  {/* Time Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 font-medium">
                      <Clock size={16} className="mr-2 text-gray-400" />
                      {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-500 ml-6">
                      {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Patient Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 ...">
                        {appt.patient?.fullName?.charAt(0) || 'P'}
                      </div>
                      <div>
                        {/* 2. Make Name Clickable */}
                        <Link
                          to={`/patients/${appt.patientId}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {appt.patient?.fullName || 'Unknown'}
                        </Link>
                        <div className="text-xs text-gray-500">ID: #{appt.patientId?.substring(0, 6)}</div>
                      </div>
                    </div>
                  </td>

                  {/* Reason Column */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{appt.reason || 'Routine Checkup'}</div>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(appt.status)}`}>
                      {appt.status}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {appt.status === 'scheduled' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleStatusUpdate(appt.id, 'completed')}
                          title="Mark as Completed"
                          className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                          title="Cancel Appointment"
                          className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">No actions</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;