import { useEffect, useState } from 'react';
import { patientService } from './../../services/patientService';
import { Pill, Calendar, Download } from 'lucide-react';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // We get the full record which contains history -> visits -> treatments
        const res = await patientService.getMyRecord(); // GET /patient/record/me

        // Extract visits from the response
        // Assuming response structure: { data: { history: [...] } }
        const history = res.data?.history || [];

        // Flatten the list: Create a list of prescriptions from all visits
        const allPrescriptions = history.filter(visit => visit.treatments && visit.treatments.length > 0)
          .map(visit => ({
            date: visit.date || visit.createdAt,
            doctorName: 'Dr. Assigned', // The API might not return doctor name inside history directly, depends on backend population
            treatments: visit.treatments
          }));

        setPrescriptions(allPrescriptions);
      } catch (err) {
        console.error("Failed to load prescriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading prescriptions...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Pill className="text-blue-600" /> My Prescriptions
      </h2>

      {prescriptions.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-10 text-center border border-dashed border-gray-300">
          <p className="text-gray-500">No prescriptions found in your medical history.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} /> Prescribed on
                  </p>
                  <p className="font-bold text-gray-900">
                    {new Date(prescription.date).toLocaleDateString()}
                  </p>
                </div>
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors">
                  <Download size={16} /> Download PDF
                </button>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-bold text-blue-800 mb-3 uppercase tracking-wide">Medications</h4>
                <ul className="space-y-3">
                  {prescription.treatments.map((drug, i) => (
                    <li key={i} className="flex justify-between items-center bg-white p-3 rounded border border-blue-100">
                      <span className="font-medium text-gray-800">{drug.name}</span>
                      <div className="text-sm text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs mr-2">Dosage: {drug.dosage}</span>
                        <span className="bg-gray-100 px-2 py-1 rounded text-xs">Duration: {drug.duration}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;