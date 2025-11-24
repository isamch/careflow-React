import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { Search, User, Calendar, ArrowRight, Activity, ChevronLeft, ChevronRight } from 'lucide-react';

const PatientsList = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 6, // Number of patients to show per page
    apiLimit: 30 // Fetch more appointments to ensure enough unique patients
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      // Fetch more appointments to ensure we have enough unique patients
      const response = await doctorService.getMyAppointments(1, pagination.apiLimit);
      const { appointments, total } = response.data;

      setAppointments(appointments || []);
      setPagination(prev => ({
        ...prev,
        total: total || 0
      }));
    } catch (err) {
      console.error("Failed to load appointments", err);
    } finally {
      setLoading(false);
    }
  };

  // Extract ALL unique patients from appointments
  const allPatients = useMemo(() => {
    const uniquePatientsMap = new Map();

    appointments.forEach(appt => {
      const patientId = appt.patient?.id;
      if (patientId) {
        if (!uniquePatientsMap.has(patientId)) {
          uniquePatientsMap.set(patientId, {
            id: patientId,
            userId: appt.patient.userId,
            patientRecord: appt.patient.patientRecord,
            lastVisit: appt.startTime,
            totalVisits: 1,
            lastStatus: appt.status
          });
        } else {
          const p = uniquePatientsMap.get(patientId);
          p.totalVisits += 1;
          if (new Date(appt.startTime) > new Date(p.lastVisit)) {
            p.lastVisit = appt.startTime;
            p.lastStatus = appt.status;
          }
        }
      }
    });

    return Array.from(uniquePatientsMap.values());
  }, [appointments]);

  // Filter patients based on search
  const filteredPatients = useMemo(() => {
    return allPatients.filter(p =>
      p.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.userId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allPatients]);

  // Paginate the filtered patients (client-side pagination)
  const paginatedPatients = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const totalPages = Math.ceil(filteredPatients.length / pagination.limit);

    // Update total pages
    if (pagination.totalPages !== totalPages) {
      setPagination(prev => ({
        ...prev,
        totalPages: totalPages || 1
      }));
    }

    return filteredPatients.slice(startIndex, endIndex);
  }, [filteredPatients, pagination.currentPage, pagination.limit]);

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

  const getStatusBadge = (status) => {
    const badges = {
      completed: 'bg-green-100 text-green-800',
      scheduled: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return badges[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <User className="text-blue-600" /> My Patients
          </h2>
          <p className="text-gray-500 mt-1">
            {allPatients.length} unique patient{allPatients.length !== 1 ? 's' : ''} from {pagination.total} appointments
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient ID or user ID..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Patients Grid */}
      {paginatedPatients.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <User className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 font-medium">
            {searchTerm ? 'No patients found matching your search.' : 'No patients found.'}
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedPatients.map((patient) => (
              <div
                key={patient.id}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all hover:border-blue-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-xl">
                      <User size={28} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        Patient ID
                      </h3>
                      <p className="text-xs text-gray-500 font-mono">...{patient.id.slice(-8)}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(patient.lastStatus)}`}>
                    {patient.lastStatus}
                  </span>
                </div>

                <div className="space-y-3 mb-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <User size={14} />
                      User ID
                    </span>
                    <span className="font-medium font-mono text-xs">...{patient.userId?.slice(-8)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Activity size={14} />
                      Total Visits
                    </span>
                    <span className="font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">{patient.totalVisits}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Calendar size={14} />
                      Last Visit
                    </span>
                    <span className="font-medium text-gray-900">
                      {new Date(patient.lastVisit).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => navigate(`/doctor/patients/${patient.id}`)}
                  className="block w-full py-2.5 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
                >
                  View Medical Record <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing <span className="font-medium">{paginatedPatients.length}</span> of{' '}
                <span className="font-medium">{filteredPatients.length}</span> patients
              </div>

              <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientsList;