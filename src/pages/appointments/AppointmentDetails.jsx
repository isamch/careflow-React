import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Calendar, Clock, User, FileText, ArrowLeft } from 'lucide-react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import { formatDate, formatTime } from '../../utils/formatDate';

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch appointment details from API
    // Simulating API call with dummy data
    setTimeout(() => {
      setAppointment({
        id: id,
        appointmentDate: '2025-01-25T10:00:00',
        status: 'Confirmed',
        reason: 'Regular checkup and consultation',
        doctor: {
          fullName: 'John Smith',
          email: 'dr.smith@careflow.com',
          profile: {
            specialization: 'Cardiology',
            phone: '+1 234 567 8900',
          },
        },
        patient: {
          fullName: 'Jane Doe',
          email: 'jane.doe@email.com',
        },
        notes: 'Patient reports occasional chest pain. Recommend ECG test.',
      });
      setLoading(false);
    }, 500);
  }, [id]);

  const getStatusBadge = (status) => {
    const statusMap = {
      Pending: 'warning',
      Confirmed: 'primary',
      Completed: 'success',
      Cancelled: 'danger',
    };
    return statusMap[status] || 'default';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Appointment not found</p>
        <Button onClick={() => navigate(-1)} className="mt-4">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
          <p className="text-gray-600">Appointment ID: #{appointment.id}</p>
        </div>
        <Badge variant={getStatusBadge(appointment.status)} size="lg">
          {appointment.status}
        </Badge>
      </div>

      {/* Appointment Info */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Date & Time */}
        <Card title="Date & Time">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-semibold">{formatDate(appointment.appointmentDate)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                <p className="font-semibold">{formatTime(appointment.appointmentDate)}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Doctor Info */}
        <Card title="Doctor Information">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="text-blue-600" size={20} />
              <p className="font-semibold">Dr. {appointment.doctor.fullName}</p>
            </div>
            <p className="text-sm text-gray-600">{appointment.doctor.profile.specialization}</p>
            <p className="text-sm text-gray-600">{appointment.doctor.email}</p>
            <p className="text-sm text-gray-600">{appointment.doctor.profile.phone}</p>
          </div>
        </Card>
      </div>

      {/* Reason */}
      <Card title="Reason for Visit">
        <p className="text-gray-700">{appointment.reason}</p>
      </Card>

      {/* Notes */}
      {appointment.notes && (
        <Card title="Doctor's Notes">
          <div className="flex items-start gap-3">
            <FileText className="text-blue-600 flex-shrink-0" size={20} />
            <p className="text-gray-700">{appointment.notes}</p>
          </div>
        </Card>
      )}

      {/* Actions */}
      <div className="flex gap-4">
        <Button variant="primary">Reschedule</Button>
        <Button variant="danger">Cancel Appointment</Button>
      </div>
    </div>
  );
};

export default AppointmentDetails;
