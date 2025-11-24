import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { Calendar, Clock, User, XCircle, Plus, Edit2, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Reschedule Form State
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch slots when date changes in Reschedule Modal
  useEffect(() => {
    if (selectedAppointment && rescheduleDate) {
      const fetchSlots = async () => {
        setLoadingSlots(true);
        setAvailableSlots([]);
        try {
          const response = await patientService.getAvailableSlots(selectedAppointment.doctor.id, rescheduleDate);
          const slots = response.data?.availableSlots || [];
          setAvailableSlots(slots);
        } catch (err) {
          console.error(err);
        } finally {
          setLoadingSlots(false);
        }
      };
      fetchSlots();
    }
  }, [rescheduleDate, selectedAppointment]);

  const fetchAppointments = async () => {
    try {
      const response = await patientService.getMyAppointments();
      setAppointments(response.data || []);
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

  // --- Handlers ---

  const openCancelModal = (appt) => {
    setSelectedAppointment(appt);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedAppointment) return;
    try {
      await patientService.cancelAppointment(selectedAppointment.id);
      showNotification('success', 'Appointment cancelled successfully.');
      fetchAppointments();
      setShowCancelModal(false);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to cancel appointment.');
    }
  };

  const openRescheduleModal = (appt) => {
    setSelectedAppointment(appt);
    setRescheduleDate(''); // Reset date
    setAvailableSlots([]);
    setSelectedSlot(null);
    setShowRescheduleModal(true);
  };

  const handleRescheduleConfirm = async () => {
    if (!selectedAppointment || !selectedSlot) return;
    try {
      await patientService.updateAppointment(selectedAppointment.id, {
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        reason: selectedAppointment.reason // Keep original reason or allow edit
      });
      showNotification('success', 'Appointment rescheduled successfully.');
      fetchAppointments();
      setShowRescheduleModal(false);
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to reschedule appointment.');
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-slideIn">
          <Alert
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ show: false, type: '', message: '' })}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Calendar className="text-blue-600" /> My Appointments
        </h2>
        <Link
          to="/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          New Appointment
        </Link>
      </div>

      {/* Appointments List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length === 0 ? (
          <div className="col-span-3 bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
            <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 text-lg">No appointments found.</p>
            <Link to="/appointments/new" className="text-blue-600 hover:underline mt-2 inline-block">
              Book your first appointment
            </Link>
          </div>
        ) : (
          appointments.map((appt) => (
            <div key={appt.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 relative overflow-hidden group">
              <div className={`absolute top-0 left-0 w-1 h-full ${appt.status === 'scheduled' ? 'bg-blue-500' :
                  appt.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                }`}></div>

              <div className="flex justify-between items-start mb-4 pl-2">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Dr. {appt.doctor?.fullName || 'Unknown'}</h3>
                    <p className="text-sm text-gray-500">{appt.doctor?.specialization || 'General'}</p>
                  </div>
                </div>
                <Badge variant={appt.status === 'completed' ? 'success' : appt.status === 'cancelled' ? 'error' : 'primary'} size="sm">
                  {appt.status}
                </Badge>
              </div>

              <div className="space-y-3 text-sm text-gray-600 mb-4 pl-2">
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <Calendar size={16} className="text-gray-400" />
                  <span className="font-medium">{new Date(appt.startTime).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-50 p-2 rounded">
                  <Clock size={16} className="text-gray-400" />
                  <span className="font-medium">
                    {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                    {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {appt.reason && (
                  <div className="text-xs text-gray-500 italic mt-2">
                    Reason: "{appt.reason}"
                  </div>
                )}
              </div>

              {/* Actions */}
              {appt.status === 'scheduled' && (
                <div className="pt-4 border-t border-gray-100 flex justify-end gap-2 pl-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openRescheduleModal(appt)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1.5 rounded transition-colors"
                  >
                    <Edit2 size={16} /> Reschedule
                  </button>
                  <button
                    onClick={() => openCancelModal(appt)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium flex items-center gap-1 hover:bg-red-50 px-3 py-1.5 rounded transition-colors"
                  >
                    <XCircle size={16} /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Modal */}
      <Modal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        title="Cancel Appointment"
        size="sm"
      >
        <div className="text-center">
          <div className="bg-red-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Are you sure?</h3>
          <p className="text-gray-500 mb-6">
            Do you really want to cancel your appointment with <strong>Dr. {selectedAppointment?.doctor?.fullName}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setShowCancelModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Keep Appointment
            </button>
            <button
              onClick={handleCancelConfirm}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-sm"
            >
              Yes, Cancel It
            </button>
          </div>
        </div>
      </Modal>

      {/* Reschedule Modal */}
      <Modal
        isOpen={showRescheduleModal}
        onClose={() => setShowRescheduleModal(false)}
        title="Reschedule Appointment"
        size="md"
      >
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <p className="text-sm text-blue-800">
              Rescheduling appointment with <strong>Dr. {selectedAppointment?.doctor?.fullName}</strong>
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select New Date</label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={rescheduleDate}
              onChange={(e) => setRescheduleDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {rescheduleDate && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available Slots</label>
              {loadingSlots ? (
                <div className="text-center py-4 text-gray-500">Checking availability...</div>
              ) : availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {availableSlots.map((slot, index) => {
                    const startTime = new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const isSelected = selectedSlot === slot;
                    return (
                      <button
                        key={index}
                        onClick={() => setSelectedSlot(slot)}
                        className={`py-2 px-3 rounded-md text-sm font-medium transition-colors border ${isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        {startTime}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm">
                  No slots available for this date.
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={() => setShowRescheduleModal(false)}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRescheduleConfirm}
              disabled={!selectedSlot}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              Confirm Reschedule
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyAppointments;