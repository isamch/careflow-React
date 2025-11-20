import { useState } from 'react';
import { FileText, Download, Upload, Trash2, Eye } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Alert from '../../components/common/Alert';
import Modal from '../../components/common/Modal';
import { formatDate } from '../../utils/formatDate';

const Documents = () => {
  // Sample documents data (in real app, fetch from API)
  const [documents] = useState([
    {
      id: 1,
      name: 'Medical Report - Jan 2025.pdf',
      type: 'Medical Report',
      uploadDate: '2025-01-15',
      size: '2.4 MB',
    },
    {
      id: 2,
      name: 'Lab Results - Blood Test.pdf',
      type: 'Lab Results',
      uploadDate: '2025-01-10',
      size: '1.2 MB',
    },
    {
      id: 3,
      name: 'Prescription - Dr. Smith.pdf',
      type: 'Prescription',
      uploadDate: '2025-01-05',
      size: '856 KB',
    },
  ]);

  // Notification State
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, doc: null });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 3000);
  };

  const handleUpload = () => {
    showNotification('info', 'Upload functionality coming soon!');
  };

  const handleDownload = (doc) => {
    showNotification('success', `Downloading: ${doc.name}`);
  };

  const handleDeleteClick = (doc) => {
    setDeleteModal({ show: true, doc });
  };

  const confirmDelete = () => {
    showNotification('info', `Delete functionality coming soon for ${deleteModal.doc?.name}!`);
    setDeleteModal({ show: false, doc: null });
  };

  const getDocumentIcon = (type) => {
    return <FileText className="text-blue-600" size={24} />;
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, doc: null })}
        title="Delete Document"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{deleteModal.doc?.name}</strong>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteModal({ show: false, doc: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">My Documents</h2>
        <Button onClick={handleUpload} variant="primary">
          <Upload size={18} className="mr-2" />
          Upload Document
        </Button>
      </div>

      {documents.length === 0 ? (
        <Card>
          <div className="text-center py-12 text-gray-500">
            <FileText className="mx-auto mb-4 text-gray-400" size={48} />
            <p>No documents uploaded yet</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => (
            <Card key={doc.id} padding={false} hover>
              <div className="p-6 flex items-center gap-4">
                {/* Document Icon */}
                <div className="flex-shrink-0">
                  {getDocumentIcon(doc.type)}
                </div>

                {/* Document Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {doc.name}
                  </h3>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>{formatDate(doc.uploadDate)}</span>
                  </div>
                  <div className="mt-2">
                    <Badge variant="primary" size="sm">{doc.type}</Badge>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(doc)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => showNotification('info', 'Preview coming soon!')}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Preview"
                  >
                    <Eye size={20} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(doc)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Documents;
