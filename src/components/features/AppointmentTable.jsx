import { Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import Badge from '../common/Badge';

/**
 * AppointmentTable Component
 * Displays appointments in a table format
 */
const AppointmentTable = ({ appointments, onViewDetails, userRole = 'Patient' }) => {
  // Get badge variant based on status
  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: 'warning',
      Confirmed: 'primary',
      Completed: 'success',
      Cancelled: 'danger',
    };
    return statusMap[status] || 'default';
  };

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="mx-auto mb-4 text-gray-400" size={48} />
        <p>No appointments found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date & Time
            </th>
            {userRole === 'Patient' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor
              </th>
            )}
            {userRole === 'Doctor' && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Reason
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {formatDate(appointment.appointmentDate)}
                    </div>
                    <div className="text-gray-500 flex items-center gap-1">
                      <Clock size={12} />
                      {formatTime(appointment.appointmentDate)}
                    </div>
                  </div>
                </div>
              </td>

              {userRole === 'Patient' && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      Dr. {appointment.doctor?.fullName || 'Unknown'}
                    </span>
                  </div>
                </td>
              )}

              {userRole === 'Doctor' && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-900">
                      {appointment.patient?.fullName || 'Unknown'}
                    </span>
                  </div>
                </td>
              )}

              <td className="px-6 py-4">
                <p className="text-sm text-gray-600 max-w-xs truncate">
                  {appointment.reason || 'No reason provided'}
                </p>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <Badge variant={getStatusBadge(appointment.status)}>
                  {appointment.status}
                </Badge>
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {onViewDetails && (
                  <button
                    onClick={() => onViewDetails(appointment)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AppointmentTable;
