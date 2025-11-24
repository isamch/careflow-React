import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { Calendar, Clock, User, CheckCircle, XCircle, Eye, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { formatDate, formatTime } from '../../utils/formatDate';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';

const DoctorAppointments = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  useEffect(() => {
    loadAppointments(pagination.currentPage);
  }, [pagination.currentPage]);

  const loadAppointments = async (page = 1) => {
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
    } catch (err) {
      showNotification('error', 'Failed to load appointments.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      // Optimistic UI Update
      const updatedAppointments = appointments.map(app =>
        app.id === id ? { ...app, status: newStatus } : app
      );
      setAppointments(updatedAppointments);

      await doctorService.updateAppointmentStatus(id, newStatus);
      showNotification('success', `Appointment ${newStatus} successfully!`);
    } catch (err) {
      showNotification('error', 'Failed to update status');
      loadAppointments(pagination.currentPage); // Revert on error
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

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'warning',
      scheduled: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return variants[status.toLowerCase()] || 'default';
  };

  // Filter appointments
  const filteredAppointments = appointments.filter(appt => {
    const matchesSearch =
      appt.patient?.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.patient?.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appt.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === 'all' || appt.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  if (loading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="text-blue-600" /> My Appointments
          </h2>
          <p className="text-gray-500 mt-1">Manage your appointments and patient visits</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-lg border shadow-sm">
          <span className="font-semibold text-gray-700">Total: </span>
          <span className="text-blue-600 font-bold">{pagination.total}</span>
        </div>
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
                  {filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50 transition-colors">
                      {/* Patient Column */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Patient ID: {appt.patient?.id?.slice(-8)}
                            </div>
                            <div className="text-xs text-gray-500">
                              User: {appt.patient?.userId?.slice(-8)}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <Clock size={16} className="mr-2 text-gray-400" />
                          {formatDate(appt.startTime)}
                        </div>
                        <div className="text-xs text-gray-500 ml-6">
                          {formatTime(appt.startTime)} - {formatTime(appt.endTime)}
                        </div>
                      </td>

                      {/* Reason Column */}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {appt.reason || 'No reason provided'}
                        </div>
                      </td>

                      {/* Status Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(appt.status)} size="sm">
                          {appt.status}
                        </Badge>
                      </td>

                      {/* Actions Column */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {appt.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(appt.id, 'scheduled')}
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                title="Accept"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button
                                onClick={() => handleStatusUpdate(appt.id, 'cancelled')}
                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Reject"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                          {appt.status === 'scheduled' && (
                            <button
                              onClick={() => handleStatusUpdate(appt.id, 'completed')}
                              className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                              Mark Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleViewPatient(appt.patient?.id)}
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

export default DoctorAppointments;