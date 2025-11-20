import { useEffect, useState } from 'react';
import { Calendar } from 'lucide-react';
import { nurseService } from '../../services/nurseService';
import AppointmentTable from '../../components/features/AppointmentTable';
import Card from '../../components/common/Card';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

/**
 * Nurse Dashboard
 * لوحة تحكم الممرضة - عرض المواعيد المخصصة
 */
const NurseDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await nurseService.getMyAppointments();
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="text-blue-600" size={32} />
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Appointments</h2>
          <p className="text-gray-600">Manage your assigned patient appointments</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      <Card>
        <AppointmentTable
          appointments={appointments}
          userRole="Nurse"
        />
      </Card>
    </div>
  );
};

export default NurseDashboard;
