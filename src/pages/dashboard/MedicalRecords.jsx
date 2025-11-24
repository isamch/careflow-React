import { useEffect, useState } from 'react';
import { patientService } from '../../services/patientService';
import { FileText, Calendar, Activity, User, Stethoscope, MapPin, Droplet, Clock } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';

const MedicalRecords = () => {
  const [records, setRecords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await patientService.getMyRecord();
        // Based on provided JSON, response.data contains the record directly
        setRecords(response.data || {});
      } catch (err) {
        console.error(err);
        setError("Failed to load medical records.");
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <Alert type="error" message={error} />;

  const visits = records?.visits || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Activity className="text-blue-600" /> Medical Records
        </h2>
      </div>

      {/* Patient Info Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg text-white p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Patient Record</h3>
              <p className="text-blue-100 text-sm opacity-90">Last Updated: {formatDate(records?.lastUpdated || new Date())}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-200 text-xs uppercase font-bold mb-1">
                <Droplet size={14} /> Blood Type
              </div>
              <p className="text-xl font-bold">{records?.bloodType || 'N/A'}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
              <div className="flex items-center gap-2 text-blue-200 text-xs uppercase font-bold mb-1">
                <Calendar size={14} /> DOB
              </div>
              <p className="text-lg font-medium">{records?.dateOfBirth ? new Date(records.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
            </div>
            <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm col-span-2">
              <div className="flex items-center gap-2 text-blue-200 text-xs uppercase font-bold mb-1">
                <MapPin size={14} /> Address
              </div>
              <p className="text-sm font-medium leading-tight">{records?.address || 'No address recorded'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Visit History Timeline */}
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FileText size={20} /> Visit History
        </h3>

        {visits.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
            <Activity className="mx-auto text-gray-400 mb-3" size={48} />
            <p className="text-gray-500 text-lg">No medical history found.</p>
          </div>
        ) : (
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            {visits.map((visit, index) => (
              <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                {/* Icon */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-100 text-blue-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Stethoscope size={18} />
                </div>

                {/* Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 border-b pb-3 gap-2">
                    <div>
                      <time className="font-caveat font-bold text-blue-600 flex items-center gap-1">
                        <Calendar size={14} /> {formatDate(visit.date)}
                      </time>
                      <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <Clock size={12} /> {new Date(visit.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {visit.diagnosis?.[0] || 'Checkup'}
                    </Badge>
                  </div>

                  {/* Doctor & Nurse Info */}
                  <div className="flex items-center gap-3 mb-4 bg-gray-50 p-3 rounded-lg">
                    <div className="bg-white p-2 rounded-full shadow-sm text-blue-600">
                      <User size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{visit.doctorId?.userId?.fullName || 'Unknown Doctor'}</h4>
                      <p className="text-xs text-gray-500">{visit.doctorId?.specialization || 'General'}</p>
                      {visit.nurseId?.userId?.fullName && (
                        <p className="text-xs text-gray-400 mt-0.5">Nurse: {visit.nurseId.userId.fullName}</p>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-3">
                    {/* Symptoms */}
                    {visit.symptoms && visit.symptoms.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Symptoms</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {visit.symptoms.map((sym, i) => (
                            <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-100">
                              {sym}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Diagnosis */}
                    {visit.diagnosis && visit.diagnosis.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Diagnosis</span>
                        <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                          {visit.diagnosis.map((diag, i) => (
                            <li key={i}>{diag}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Treatments */}
                    {visit.treatments && visit.treatments.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mb-2">
                          <Activity size={12} /> Treatments
                        </span>
                        <div className="space-y-2">
                          {visit.treatments.map((t, i) => (
                            <div key={i} className="flex justify-between items-center bg-blue-50 p-2 rounded text-sm border border-blue-100">
                              <span className="font-medium text-blue-900">{t.name}</span>
                              <div className="text-xs text-blue-700">
                                <span className="font-semibold">{t.dosage}</span> • {t.duration}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {visit.notes && (
                      <div className="mt-3 text-xs text-gray-500 italic bg-gray-50 p-2 rounded">
                        Note: {visit.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalRecords;
