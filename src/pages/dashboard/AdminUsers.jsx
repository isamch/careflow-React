import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserPlus, Users, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import Alert from '../../components/common/Alert';

const AdminUsers = () => {
  // Data State
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  // Notification State
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Password123!',
    roleName: 'Doctor',
    specialization: ''
  });

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(page, pagination.limit);
      // Assuming response structure: { data: { users: [], total: 50, totalPages: 5, currentPage: 1 } }
      // Adjust based on actual API response if needed
      const { users, total, totalPages } = response.data || {};

      setUsers(users || []);
      setPagination(prev => ({
        ...prev,
        currentPage: page,
        totalUsers: total || 0,
        totalPages: totalPages || Math.ceil((total || 0) / prev.limit) || 1
      }));
    } catch (err) {
      console.error("Failed to load users", err);
      showNotification('error', 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        roleName: formData.roleName,
        profileData: {}
      };

      if (formData.roleName === 'Doctor') {
        payload.profileData.specialization = formData.specialization;
      }

      await adminService.createUser(payload);

      setShowModal(false);
      setFormData({ fullName: '', email: '', password: 'Password123!', roleName: 'Doctor', specialization: '' });
      fetchUsers(pagination.currentPage); // Refresh current page
      showNotification('success', `User "${formData.fullName}" created successfully!`);
    } catch (err) {
      showNotification('error', err.message || 'Failed to create user. Please try again.');
    }
  };

  // Helper: Role Badge Color
  const getRoleBadge = (role) => {
    const colors = {
      Admin: "bg-purple-100 text-purple-800",
      Doctor: "bg-blue-100 text-blue-800",
      Patient: "bg-green-100 text-green-800",
      Nurse: "bg-yellow-100 text-yellow-800",
      Secretary: "bg-pink-100 text-pink-800"
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  // Helper: Generate Page Numbers
  const getPageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
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

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="text-blue-600" /> User Management
        </h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No users found. Create your first user!
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((u) => {
                  const roleName = typeof u.role === 'object' ? u.role?.name : (u.roleName || u.role);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                            {u.fullName?.charAt(0)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{u.fullName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <Mail size={10} /> {u.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(roleName)}`}>
                          {roleName}
                        </span>
                        {u.profileData?.specialization && (
                          <div className="text-xs text-gray-500 mt-1">{u.profileData.specialization}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Previous"
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers().map((page, index) => (
                  <button
                    key={index}
                    onClick={() => typeof page === 'number' && handlePageChange(page)}
                    disabled={page === '...'}
                    className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${page === pagination.currentPage
                      ? 'bg-blue-600 text-white border-blue-600'
                      : page === '...'
                        ? 'bg-transparent border-transparent text-gray-500 cursor-default'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Next"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-slideUp">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New User</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg shadow-sm p-2 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={formData.roleName}
                  onChange={e => setFormData({ ...formData, roleName: e.target.value })}
                >
                  <option value="Doctor">Doctor</option>
                  <option value="Nurse">Nurse</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {formData.roleName === 'Doctor' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiology"
                    className="w-full border border-gray-300 rounded-lg shadow-sm p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                Default password for new users is: <strong>Password123!</strong>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;