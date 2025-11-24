import { useEffect, useState, useMemo } from 'react';
import { doctorService } from '../../services/doctorService';
import { Calendar, Users, Clock, CheckCircle, ChevronLeft, ChevronRight, User, Search, Check, X, Eye } from 'lucide-react';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [stats, setStats] = useState({
    today: 0,
    pending: 0,
    completed: 0,
    scheduled: 0,
    total: 0
  });

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAppointments(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await doctorService.getMyAppointments(page, pagination.limit);
      const { appointments, total, limit } = response.data;

      setAppointments(appointments || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / (limit || 10)),
        limit: limit || 10
      }));

      calculateStats(appointments || [], total);
    } catch (err) {
      setError("Failed to load appointments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data, total) => {
    if (!Array.isArray(data)) {
      console.error('calculateStats received non-array data:', data);
      return;
    }

    const today = new Date().toISOString().split('T')[0];

    setStats({
      today: data.filter(a => a.startTime?.startsWith(today)).length,
      pending: data.filter(a => a.status === 'pending').length,
      completed: data.filter(a => a.status === 'completed').length,
      scheduled: data.filter(a => a.status === 'scheduled').length,
      total: total || data.length
    });
  };

  // Filtered appointments based on search and status
  const filteredAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      const matchesSearch =
        appointment.patient?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.patient?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, searchTerm, filterStatus]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      await doctorService.updateAppointmentStatus(appointmentId, newStatus);

      // Update local state
      const updatedAppointments = appointments.map(app =>
        app.id === appointmentId ? { ...app, status: newStatus } : app
      );
      setAppointments(updatedAppointments);
      calculateStats(updatedAppointments, pagination.total);

      showNotification('success', `Appointment ${newStatus} successfully!`);
    } catch (err) {
      showNotification('error', err.message || 'Failed to update appointment status');
    }
  };

  const handleViewPatient = (patientId) => {
    navigate(`/doctor/patients/${patientId}`);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      scheduled: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return variants[status.toLowerCase()] || 'default';
  };

  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  if (loading && appointments.length === 0) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ show: false, type: '', message: '' })}
          />
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Doctor Dashboard</h1>
        <p className="text-gray-500 mt-1">Manage your appointments and patients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Today's Appointments"
          value={stats.today}
          icon={<Calendar className="text-blue-600" />}
          bg="bg-blue-50"
          color="text-blue-600"
        />
        <StatCard
          title="Scheduled"
          value={stats.scheduled}
          icon={<Clock className="text-indigo-600" />}
          bg="bg-indigo-50"
          color="text-indigo-600"
        />
        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<CheckCircle className="text-green-600" />}
          bg="bg-green-50"
          color="text-green-600"
        />
        <StatCard
          title="Total Appointments"
          value={stats.total}
          icon={<Users className="text-purple-600" />}
          bg="bg-purple-50"
          color="text-purple-600"
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient ID or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        {(searchTerm || filterStatus !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('all');
            }}
            className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">My Appointments</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm || filterStatus !== 'all' ? 'No appointments match your filters.' : 'No appointments found.'}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Patient ID: {appointment.patient?.id?.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              User: {appointment.patient?.userId?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(appointment.startTime)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {appointment.reason || 'No reason provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(appointment.status)} size="sm">
                          {appointment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'scheduled')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Accept"
                              >
                                <Check size={18} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <X size={18} />
                              </button>
                            </>
                          )}
                          {appointment.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleViewPatient(appointment.patient?.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View Patient"
                          >
                            <Eye size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing <span className="font-medium">{filteredAppointments.length}</span> of{' '}
                <span className="font-medium">{pagination.total}</span> appointments
              </div>

              <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${page === pagination.currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : page === '...'
                          ? 'bg-transparent border-transparent text-gray-500 cursor-default'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, bg, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={`p-3 rounded-full ${bg}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  </div>
);

export default DoctorDashboard;