import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { ArrowLeft, User, Calendar, FileText, Activity, Plus, Droplet, MapPin, Cake } from 'lucide-react';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import { formatDate, formatDateTime } from '../../utils/formatDate';

const DoctorPatientDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();

  const [medicalRecord, setMedicalRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Add Visit Modal
  const [showAddVisitModal, setShowAddVisitModal] = useState(false);
  const [visitForm, setVisitForm] = useState({
    diagnosis: '',
    symptoms: '',
    treatment: '',
    dosage: '',
    duration: '',
    notes: ''
  });

  useEffect(() => {
    fetchPatientDetails();
  }, [patientId]);

  const fetchPatientDetails = async () => {
    setLoading(true);
    try {
      const response = await doctorService.getPatientRecord(patientId);
      setMedicalRecord(response.data || null);
    } catch (err) {
      setError('Failed to load patient details');
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

  const handleAddVisit = async (e) => {
    e.preventDefault();
    try {
      const visitData = {
        diagnosis: visitForm.diagnosis.split(',').map(d => d.trim()),
        symptoms: visitForm.symptoms.split(',').map(s => s.trim()),
        treatments: [{
          name: visitForm.treatment,
          dosage: visitForm.dosage,
          duration: visitForm.duration
        }],
        notes: visitForm.notes
      };

      await doctorService.addVisit(patientId, visitData);

      setShowAddVisitModal(false);
      setVisitForm({ diagnosis: '', symptoms: '', treatment: '', dosage: '', duration: '', notes: '' });
      fetchPatientDetails();
      showNotification('success', 'Medical visit added successfully!');
    } catch (err) {
      showNotification('error', err.message || 'Failed to add medical visit');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert type="error" message={error} />
        <button
          onClick={() => navigate('/doctor/dashboard')}
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </button>
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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/doctor/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Medical Record</h1>
            <p className="text-gray-500 mt-1">View patient information and medical history</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddVisitModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          Add Visit
        </button>
      </div>

      {/* Patient Info Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-4xl font-bold">
              <User size={48} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Patient Record ID: {medicalRecord?.id?.slice(-12)}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Droplet className="text-red-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Blood Type</p>
                    <p className="font-semibold text-gray-900">{medicalRecord?.bloodType || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Cake className="text-purple-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Date of Birth</p>
                    <p className="font-semibold text-gray-900">
                      {medicalRecord?.dateOfBirth ? formatDate(medicalRecord.dateOfBirth) : 'N/A'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="text-green-500" size={20} />
                  <div>
                    <p className="text-xs text-gray-500">Address</p>
                    <p className="font-semibold text-gray-900">{medicalRecord?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
            <Badge variant="success" size="lg">Active</Badge>
          </div>
        </div>
      </Card>

      {/* Medical Visits */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Activity className="text-green-600" size={20} />
            Medical Visits ({medicalRecord?.visits?.length || 0})
          </h3>
        </div>
        <div className="p-6">
          {medicalRecord?.visits && medicalRecord.visits.length > 0 ? (
            <div className="space-y-4">
              {medicalRecord.visits.map((visit) => (
                <div key={visit._id || visit.visitId} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow bg-gradient-to-br from-white to-gray-50">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <Calendar size={16} className="text-blue-600" />
                        {formatDateTime(visit.date || visit.createdAt)}
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        <span>Doctor: {visit.doctorId?.slice(-8)}</span>
                        {visit.nurseId && <span>• Nurse: {visit.nurseId?.slice(-8)}</span>}
                      </div>
                    </div>
                    <Badge variant="info" size="sm">Visit #{visit.visitId?.slice(-6)}</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Diagnosis */}
                    <div className="bg-white rounded-lg p-4 border border-blue-100">
                      <p className="text-xs font-bold text-blue-600 uppercase mb-2 flex items-center gap-1">
                        <FileText size={14} />
                        Diagnosis
                      </p>
                      {visit.diagnosis && visit.diagnosis.length > 0 ? (
                        <ul className="space-y-1">
                          {visit.diagnosis.map((diag, idx) => (
                            <li key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{diag}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No diagnosis recorded</p>
                      )}
                    </div>

                    {/* Symptoms */}
                    <div className="bg-white rounded-lg p-4 border border-yellow-100">
                      <p className="text-xs font-bold text-yellow-600 uppercase mb-2 flex items-center gap-1">
                        <Activity size={14} />
                        Symptoms
                      </p>
                      {visit.symptoms && visit.symptoms.length > 0 ? (
                        <ul className="space-y-1">
                          {visit.symptoms.map((symptom, idx) => (
                            <li key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                              <span className="text-yellow-600 mt-1">•</span>
                              <span>{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500">No symptoms recorded</p>
                      )}
                    </div>
                  </div>

                  {/* Treatments */}
                  {visit.treatments && visit.treatments.length > 0 && (
                    <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
                      <p className="text-xs font-bold text-green-700 uppercase mb-3">💊 Treatments</p>
                      <div className="space-y-2">
                        {visit.treatments.map((treatment, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3 border border-green-100">
                            <p className="font-semibold text-gray-900">{treatment.name}</p>
                            <div className="flex gap-4 mt-1 text-xs text-gray-600">
                              <span>Dosage: <strong>{treatment.dosage}</strong></span>
                              <span>Duration: <strong>{treatment.duration}</strong></span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Notes */}
                  {visit.notes && (
                    <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="text-xs font-bold text-gray-600 uppercase mb-2">📝 Notes</p>
                      <p className="text-sm text-gray-900">{visit.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
              <Activity className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-500 font-medium">No medical visits recorded</p>
              <p className="text-sm text-gray-400 mt-1">Add the first visit using the button above</p>
            </div>
          )}
        </div>
      </Card>

      {/* Add Visit Modal */}
      {showAddVisitModal && (
        <Modal
          isOpen={showAddVisitModal}
          onClose={() => setShowAddVisitModal(false)}
          title="Add Medical Visit"
        >
          <form onSubmit={handleAddVisit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={visitForm.diagnosis}
                onChange={(e) => setVisitForm({ ...visitForm, diagnosis: e.target.value })}
                placeholder="e.g., Common Cold, Fever (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple diagnoses with commas</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Symptoms <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={visitForm.symptoms}
                onChange={(e) => setVisitForm({ ...visitForm, symptoms: e.target.value })}
                placeholder="e.g., Headache, Cough (comma separated)"
              />
              <p className="text-xs text-gray-500 mt-1">Separate multiple symptoms with commas</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Treatment <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={visitForm.treatment}
                  onChange={(e) => setVisitForm({ ...visitForm, treatment: e.target.value })}
                  placeholder="Medicine name"
                />
              </div>

              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosage <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={visitForm.dosage}
                  onChange={(e) => setVisitForm({ ...visitForm, dosage: e.target.value })}
                  placeholder="e.g., 500mg"
                />
              </div>

              <div className="col-span-3 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={visitForm.duration}
                  onChange={(e) => setVisitForm({ ...visitForm, duration: e.target.value })}
                  placeholder="e.g., 7 days"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={visitForm.notes}
                onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                placeholder="Additional notes..."
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddVisitModal(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Add Visit
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DoctorPatientDetails;
