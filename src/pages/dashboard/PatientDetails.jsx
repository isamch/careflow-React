import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doctorService } from '../../services/doctorService';
import { User, Activity, Pill, FileText, Plus, Save, X } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

const PatientDetails = () => {
  const { id } = useParams(); // Get patient ID from URL

  // Data State
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Notification State
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Form State (For adding a new visit)
  const [showVisitForm, setShowVisitForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields matches Postman body structure
  const [diagnosis, setDiagnosis] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');
  const [treatments, setTreatments] = useState([{ name: '', dosage: '', duration: '' }]);

  // --- Fetch Data ---
  useEffect(() => {
    fetchRecord();
  }, [id]);

  const fetchRecord = async () => {
    try {
      const response = await doctorService.getPatientRecord(id);
      // Postman: { data: { patient: {...}, history: [...] } }
      setRecord(response.data);
    } catch (err) {
      setError("Failed to load patient record.");
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

  // --- Form Handlers ---

  // Handle dynamic treatments inputs
  const handleTreatmentChange = (index, field, value) => {
    const newTreatments = [...treatments];
    newTreatments[index][field] = value;
    setTreatments(newTreatments);
  };

  const addTreatmentField = () => {
    setTreatments([...treatments, { name: '', dosage: '', duration: '' }]);
  };

  const removeTreatmentField = (index) => {
    const newTreatments = treatments.filter((_, i) => i !== index);
    setTreatments(newTreatments);
  };

  // Submit New Visit
  const handleSubmitVisit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare data according to API requirements
      const visitData = {
        diagnosis: diagnosis.split(',').map(d => d.trim()), // Convert comma string to array
        symptoms: symptoms.split(',').map(s => s.trim()),
        notes,
        treatments: treatments.filter(t => t.name.trim() !== '') // Remove empty rows
      };

      await doctorService.addVisit(id, visitData);

      // Reset form and reload data
      setShowVisitForm(false);
      setDiagnosis('');
      setSymptoms('');
      setNotes('');
      setTreatments([{ name: '', dosage: '', duration: '' }]);
      fetchRecord(); // Refresh the history list
      showNotification('success', 'Medical visit saved successfully!');

    } catch (err) {
      showNotification('error', "Failed to save visit: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!record) return <div className="p-8">Patient not found.</div>;

  const { patient, history } = record;

  return (
    <div className="max-w-6xl mx-auto space-y-6">

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

      {/* --- Header Profile Card --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
        <div className="flex gap-4">
          <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <User size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient?.fullName}</h1>
            <p className="text-gray-500">{patient?.email}</p>
            <div className="flex gap-3 mt-2 text-sm text-gray-600">
              <span className="bg-gray-100 px-2 py-1 rounded">ID: {patient?.id?.substring(0, 8)}</span>
              {/* Add more fields if available in profileData */}
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowVisitForm(!showVisitForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          {showVisitForm ? <X size={18} /> : <Plus size={18} />}
          {showVisitForm ? 'Cancel' : 'Add New Visit'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* --- Left Column: Medical History Timeline --- */}
        <div className={`space-y-6 transition-all ${showVisitForm ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Activity className="text-blue-600" /> Medical History
          </h2>

          {history && history.length > 0 ? (
            <div className="space-y-4">
              {history.map((visit, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start border-b border-gray-100 pb-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Date of Visit</p>
                      <p className="font-semibold">{new Date(visit.date || visit.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-full">
                        Completed
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-1">Diagnosis & Symptoms</h4>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {visit.diagnosis?.map((d, i) => (
                          <span key={i} className="bg-red-50 text-red-700 px-2 py-0.5 rounded text-xs border border-red-100">{d}</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600">{visit.symptoms?.join(', ')}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-gray-700 mb-1">Prescriptions</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {visit.treatments?.map((t, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Pill size={14} className="text-blue-400" />
                            {t.name} <span className="text-gray-400">({t.dosage} - {t.duration})</span>
                          </li>
                        ))}
                        {(!visit.treatments || visit.treatments.length === 0) && <li>No medication prescribed.</li>}
                      </ul>
                    </div>
                  </div>

                  {visit.notes && (
                    <div className="mt-4 bg-gray-50 p-3 rounded-lg text-sm text-gray-700 italic">
                      <FileText size={14} className="inline mr-1 text-gray-400" />
                      "{visit.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
              No medical history found for this patient.
            </div>
          )}
        </div>

        {/* --- Right Column: Add Visit Form (Conditional) --- */}
        {showVisitForm && (
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-lg h-fit sticky top-24 animate-fade-in">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">New Consultation</h3>
            <form onSubmit={handleSubmitVisit} className="space-y-4">

              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis (comma separated)</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="e.g. Flu, Migraine"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  required
                />
              </div>

              {/* Symptoms */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Symptoms</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="e.g. Fever, Headache"
                  value={symptoms}
                  onChange={e => setSymptoms(e.target.value)}
                />
              </div>

              {/* Treatments (Dynamic List) */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Prescriptions</label>
                  <button type="button" onClick={addTreatmentField} className="text-xs text-blue-600 hover:underline">+ Add Drug</button>
                </div>
                <div className="space-y-2">
                  {treatments.map((t, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <input
                          placeholder="Drug Name"
                          className="w-full text-xs border p-1.5 rounded"
                          value={t.name}
                          onChange={(e) => handleTreatmentChange(index, 'name', e.target.value)}
                        />
                        <div className="flex gap-1">
                          <input
                            placeholder="Dosage"
                            className="w-1/2 text-xs border p-1.5 rounded"
                            value={t.dosage}
                            onChange={(e) => handleTreatmentChange(index, 'dosage', e.target.value)}
                          />
                          <input
                            placeholder="Duration"
                            className="w-1/2 text-xs border p-1.5 rounded"
                            value={t.duration}
                            onChange={(e) => handleTreatmentChange(index, 'duration', e.target.value)}
                          />
                        </div>
                      </div>
                      {index > 0 && (
                        <button type="button" onClick={() => removeTreatmentField(index)} className="text-red-500 mt-1">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Doctor Notes</label>
                <textarea
                  rows="3"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                  placeholder="Advice..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : <><Save size={16} /> Save Record</>}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientDetails;