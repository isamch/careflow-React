import { useEffect, useState } from 'react';
import { doctorService } from '../../services/doctorService';
import { FileText, Plus, Search, Printer, Eye, Calendar, User, Trash2, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Alert from '../../components/common/Alert';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import useAuth from '../../hooks/useAuth';

const DoctorPrescriptions = () => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [medications, setMedications] = useState([]); // For autocomplete in modal
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  // Form Data for Create Modal
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    notes: '',
    medications: []
  });

  // Pagination
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });

  useEffect(() => {
    loadPrescriptions(pagination.currentPage);
    loadMedications(); // Load medications for autocomplete
  }, [pagination.currentPage]);

  const loadPrescriptions = async (page = 1) => {
    setLoading(true);
    try {
      const response = await doctorService.getPrescriptions(page, pagination.limit);

      // Handle new response structure
      // request() returns the parsed JSON body directly
      const prescriptionsList = response.data || [];
      const paginationData = response.pagination || {};

      setPrescriptions(prescriptionsList);
      setPagination(prev => ({
        ...prev,
        currentPage: paginationData.page || page,
        total: paginationData.total || 0,
        totalPages: paginationData.totalPages || 1,
        limit: paginationData.perPage || prev.limit
      }));
    } catch (err) {
      console.error(err);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  const loadMedications = async () => {
    try {
      const response = await doctorService.getMedications();
      setMedications(response.data?.data || []);
    } catch (err) {
      console.error("Failed to load medications:", err);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  // --- Create Form Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        { medicationName: '', quantity: 1, dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    }));
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.medications.length === 0) {
      showNotification('error', 'Please add at least one medication.');
      return;
    }

    const payload = {
      patientName: formData.patientName,
      patientEmail: formData.patientEmail,
      doctorName: user?.fullName || 'Dr. Unknown',
      clinicName: 'CareFlow Clinic',
      clinicCode: 'CLINIC_001',
      medications: formData.medications,
      notes: formData.notes
    };

    try {
      await doctorService.createPrescription(payload);
      showNotification('success', 'Prescription sent to pharmacy successfully!');
      setShowCreateModal(false);
      setFormData({ patientName: '', patientEmail: '', notes: '', medications: [] });
      loadPrescriptions(pagination.currentPage); // Reload list
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to send prescription.');
    }
  };

  // --- View & Print Handlers ---

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowViewModal(true);
  };

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
            <p><strong>Patient Name:</strong> ${prescription.patientName || 'Unknown'}</p>
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="text-blue-600" /> Prescriptions History
          </h2>
          <p className="text-gray-500 mt-1">Manage and issue medical prescriptions</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus size={18} />
          New Prescription
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by patient name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading prescriptions...</p>
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <FileText className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-lg font-medium">No prescriptions found</p>
            <p className="text-sm">Create a new prescription to get started.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medications</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescriptions.map((script) => (
                    <tr key={script.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        #{script.prescriptionId ? script.prescriptionId.slice(-8) : script.id.slice(-6)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                            <User size={16} />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{script.patientName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(script.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {script.medications?.length || 0} items
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={script.status === 'completed' ? 'success' : 'warning'} size="sm">
                          {script.status || 'pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleViewPrescription(script)}
                            className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handlePrint(script)}
                            className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-100 rounded"
                            title="Print"
                          >
                            <Printer size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing page <span className="font-medium">{pagination.currentPage}</span> of{' '}
                <span className="font-medium">{pagination.totalPages}</span> ({pagination.total} total)
              </div>

              <div className="flex items-center gap-2 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  Page {pagination.currentPage}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create Prescription Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Prescription"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Patient Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patient Email</label>
              <input
                type="email"
                name="patientEmail"
                value={formData.patientEmail}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Medications List */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">Medications</label>
              <button
                type="button"
                onClick={handleAddMedication}
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <Plus size={16} /> Add Medication
              </button>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
              {formData.medications.map((med, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Medication Name</label>
                      <input
                        type="text"
                        value={med.medicationName}
                        onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. Aspirin"
                        list="medications-list"
                      />
                      <datalist id="medications-list">
                        {medications.map(m => <option key={m.id} value={m.name} />)}
                      </datalist>
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Dosage</label>
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. 500mg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Quantity</label>
                      <input
                        type="number"
                        min="1"
                        value={med.quantity}
                        onChange={(e) => handleMedicationChange(index, 'quantity', parseInt(e.target.value))}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Frequency</label>
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. Twice daily"
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Duration</label>
                      <input
                        type="text"
                        value={med.duration}
                        onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. 7 days"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs text-gray-500 mb-1">Instructions</label>
                      <input
                        type="text"
                        value={med.instructions}
                        onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="e.g. Take after meals"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.medications.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm bg-gray-50 rounded-lg border border-dashed">
                  No medications added yet.
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes for the patient or pharmacist..."
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
            >
              <Send size={18} />
              Send to Pharmacy
            </button>
          </div>
        </form>
      </Modal>

      {/* View Prescription Modal */}
      {showViewModal && selectedPrescription && (
        <Modal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`Prescription #${selectedPrescription.id.slice(-6)}`}
        >
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p><strong>Patient:</strong> {selectedPrescription.patientName}</p>
              <p><strong>Date:</strong> {formatDate(selectedPrescription.createdAt)}</p>
              <p><strong>Status:</strong> <Badge variant={selectedPrescription.status === 'completed' ? 'success' : 'warning'} size="sm">{selectedPrescription.status}</Badge></p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Medications:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {selectedPrescription.medications?.map((med, idx) => (
                  <li key={idx} className="text-sm">
                    <span className="font-medium">{med.medicationName || med.name}</span> - {med.dosage}, {med.frequency} ({med.duration})
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => handlePrint(selectedPrescription)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
              >
                <Printer size={16} /> Print
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorPrescriptions;
