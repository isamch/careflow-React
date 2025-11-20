import { useEffect, useState } from 'react';
import { Users, Calendar, Search } from 'lucide-react';
import { secretaryService } from '../../services/secretaryService';
import AppointmentTable from '../../components/features/AppointmentTable';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

/**
 * Secretary Dashboard
 * لوحة تحكم السكرتيرة - إدارة المواعيد والبحث عن المرضى
 */
const SecretaryDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchAppointments();
  }, [currentPage]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await secretaryService.getAllAppointments(currentPage, 10);
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    try {
      setLoading(true);
      const response = await secretaryService.searchPatients(searchTerm);
      setPatients(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to search patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading && appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Secretary Dashboard</h2>
        <p className="text-gray-600">Manage appointments and search for patients</p>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {/* Patient Search */}
      <Card title="Search Patients">
        <div className="flex gap-3">
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button onClick={handleSearch} variant="primary">
            <Search size={18} className="mr-2" />
            Search
          </Button>
        </div>

        {/* Search Results */}
        {patients.length > 0 && (
          <div className="mt-4 space-y-2">
            <h4 className="font-semibold text-gray-700">Search Results:</h4>
            {patients.map((patient) => (
              <div key={patient.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{patient.user?.fullName || patient.fullName}</p>
                  <p className="text-sm text-gray-600">{patient.user?.email || patient.email}</p>
                </div>
                <Button size="sm" variant="outline">
                  Book Appointment
                </Button>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* All Appointments */}
      <Card title="All Appointments">
        <AppointmentTable
          appointments={appointments}
          userRole="Secretary"
        />

        {/* Pagination */}
        <div className="mt-4 flex justify-center gap-2">
          <Button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            size="sm"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {currentPage}
          </span>
          <Button
            onClick={() => setCurrentPage(p => p + 1)}
            size="sm"
          >
            Next
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SecretaryDashboard;
