import { useEffect, useState } from 'react';
import { patientService } from './../../services/patientService';
import { Pill, Calendar, Download, User, FileText } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Badge from '../../components/common/Badge';

const MyPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await patientService.getMyPrescriptions();
        // Assuming response structure: { data: [...] } or just [...]
        const data = res.data || res || [];
        setPrescriptions(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load prescriptions", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handlePrint = (prescription) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Prescription #${prescription.prescriptionId || prescription.id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .doctor-info { float: right; }
            .patient-info { margin-bottom: 30px; }
            .medications { width: 100%; border-collapse: collapse; margin-bottom: 40px; }
            .medications th, .medications td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .medications th { background-color: #f9f9f9; }
            .footer { margin-top: 50px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medical Prescription</h1>
            <p>CareFlow Clinic Management System</p>
          </div>
          
          <div class="patient-info">
            <p><strong>Date:</strong> ${formatDate(prescription.createdAt)}</p>
            <p><strong>Doctor:</strong> ${prescription.doctorName || 'Dr. Unknown'}</p>
            <p><strong>Prescription ID:</strong> ${prescription.prescriptionId || prescription.id}</p>
          </div>

          <table class="medications">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Duration</th>
                <th>Instructions</th>
              </tr>
            </thead>
            <tbody>
              ${prescription.medications?.map(med => `
                <tr>
                  <td>${med.medicationName || med.name}</td>
                  <td>${med.dosage}</td>
                  <td>${med.duration}</td>
                  <td>${med.instructions || '-'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="footer">
            <p>_______________________</p>
            <p>Doctor Signature</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Pill className="text-blue-600" /> My Prescriptions
        </h2>
      </div>

      {prescriptions.length === 0 ? (
        <div className="bg-gray-50 rounded-xl p-12 text-center border border-dashed border-gray-300">
          <FileText className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500 text-lg">No prescriptions found.</p>
          <p className="text-sm text-gray-400">Prescriptions issued by your doctor will appear here.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {prescriptions.map((prescription, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between md:items-center border-b pb-4 mb-4 gap-4">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 p-3 rounded-full text-blue-600">
                    <FileText size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} /> {formatDate(prescription.createdAt)}
                    </p>
                    <h3 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      {prescription.doctorName || 'Dr. Unknown'}
                      <Badge variant={prescription.status === 'completed' ? 'success' : 'warning'} size="sm">
                        {prescription.status || 'Pending'}
                      </Badge>
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">ID: #{prescription.prescriptionId ? prescription.prescriptionId.slice(-8) : prescription.id.slice(-6)}</p>
                  </div>
                </div>
                <button
                  onClick={() => handlePrint(prescription)}
                  className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors border border-blue-200"
                >
                  <Download size={16} /> Download / Print
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                  <Pill size={14} /> Medications ({prescription.medications?.length || 0})
                </h4>
                <div className="grid gap-3 md:grid-cols-2">
                  {prescription.medications?.map((drug, i) => (
                    <div key={i} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-gray-800">{drug.medicationName || drug.name}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{drug.quantity}x</span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600 space-y-1">
                        <p><span className="font-medium text-gray-500">Dosage:</span> {drug.dosage}</p>
                        <p><span className="font-medium text-gray-500">Frequency:</span> {drug.frequency}</p>
                        <p><span className="font-medium text-gray-500">Duration:</span> {drug.duration}</p>
                        {drug.instructions && <p className="text-xs text-gray-500 italic mt-1">"{drug.instructions}"</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div className="mt-4 text-sm text-gray-600 bg-yellow-50 p-3 rounded border border-yellow-100">
                  <span className="font-semibold text-yellow-800">Doctor's Notes:</span> {prescription.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPrescriptions;