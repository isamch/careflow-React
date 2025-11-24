import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Calendar, Filter, ChevronLeft, ChevronRight, User, Stethoscope, Clock } from 'lucide-react';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalAppointments: 0,
    limit: 20
  });
  const [filters, setFilters] = useState({
    status: 'all',
    date: ''
  });

  useEffect(() => {
    fetchAppointments(pagination.currentPage);
  }, [pagination.currentPage, filters]);

  const fetchAppointments = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminService.getAllAppointments(page, pagination.limit);
      // Assuming response structure: { data: { appointments: [], total: 100, totalPages: 5 } }
      const { appointments, total, totalPages } = response.data || {};

      setAppointments(appointments || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalAppointments: total || 0,
        totalPages: totalPages || Math.ceil((total || 0) / prev.limit) || 1
      }));
    } catch (err) {
      console.error("Failed to load appointments", err);
      setError("Failed to load appointments. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // Helper: Get status badge variant
  const getStatusVariant = (status) => {
    const variants = {
      PENDING: 'warning',
      CONFIRMED: 'info',
      COMPLETED: 'success',
      CANCELLED: 'danger'
    };
    return variants[status] || 'default';
  };

  // Helper: Generate Page Numbers
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

  return (
    <div className="space-y-6">
      {error && <Alert type="error" message={error} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" /> Appointments Overview
        </h2>
        <div className="text-sm text-gray-500">
          Total: <span className="font-medium">{pagination.totalAppointments}</span> appointments
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex gap-4 items-center">
        <Filter size={18} className="text-gray-400" />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <input
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        {(filters.status !== 'all' || filters.date) && (
          <button
            onClick={() => setFilters({ status: 'all', date: '' })}
            className="text-sm text-blue-600 hover:underline"
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
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {formatDate(appointment.date || appointment.startTime)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {formatTime(appointment.startTime)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                            {appointment.patient?.fullName?.charAt(0) || 'P'}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {appointment.patient?.fullName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appointment.patient?.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope size={16} className="text-blue-500" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              Dr. {appointment.doctor?.fullName || 'N/A'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appointment.doctor?.profileData?.specialization || 'General'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {appointment.reason || 'No reason provided'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={getStatusVariant(appointment.status)} size="sm">
                          {appointment.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
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
                  title="Next"
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

export default AdminAppointments;
