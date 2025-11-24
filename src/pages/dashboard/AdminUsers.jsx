import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { UserPlus, Users, Mail, ChevronLeft, ChevronRight, Eye, X } from 'lucide-react';
import Alert from '../../components/common/Alert';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    limit: 10
  });

  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: 'Password123!',
    roleName: 'Doctor',
    specialization: ''
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    fetchUsers(pagination.currentPage);
  }, [pagination.currentPage]);

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers(page, pagination.limit);
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
    setTimeout(() => {
      setNotification({ show: false, type: '', message: '' });
    }, 5000);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: newPage }));
    }
  };

  const handleViewProfile = (user) => {
    setSelectedUser(user);
    setShowProfileModal(true);
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
      fetchUsers(pagination.currentPage);
      showNotification('success', `User "${formData.fullName}" created successfully!`);
    } catch (err) {
      showNotification('error', err.message || 'Failed to create user. Please try again.');
    }
  };

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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => handleViewProfile(u)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye size={16} /> View Profile
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-500 hidden sm:block">
                Showing page <span className="font-medium">{pagination.currentPage}</span> of <span className="font-medium">{pagination.totalPages}</span>
              </div>

              <div className="flex items-center gap-1 mx-auto sm:mx-0">
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="p-2 border rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Enhanced Profile View Modal */}
      {showProfileModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Gradient Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-10 relative">
              <button
                onClick={() => setShowProfileModal(false)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full bg-white shadow-xl flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-white/30">
                  {selectedUser.fullName?.charAt(0)}
                </div>
                <div className="text-white flex-1">
                  <h3 className="text-3xl font-bold mb-2">{selectedUser.fullName}</h3>
                  <p className="text-blue-100 flex items-center gap-2 text-lg mb-3">
                    <Mail size={18} />
                    {selectedUser.email}
                  </p>
                  <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                    {typeof selectedUser.role === 'object' ? selectedUser.role?.name : selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-250px)]">
              <div className="space-y-6">
                {/* Account Info */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                    Account Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-5 border border-gray-200">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">User ID</label>
                      <p className="text-gray-900 font-mono text-sm break-all">{selectedUser.id}</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
                      <label className="text-xs font-bold text-green-600 uppercase tracking-wider block mb-2">Status</label>
                      <p className="text-green-700 font-bold text-xl flex items-center gap-2">
                        <span className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></span>
                        Active
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200">
                      <label className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-2">Joined Date</label>
                      <p className="text-gray-900 font-semibold text-lg">
                        {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
                      <label className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-2">Last Updated</label>
                      <p className="text-gray-900 font-semibold text-lg">
                        {new Date(selectedUser.updatedAt || selectedUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                {selectedUser.profileData && Object.keys(selectedUser.profileData).length > 0 ? (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-purple-600"></div>
                      Additional Information
                    </h4>
                    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 rounded-xl p-6 border border-gray-200">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(selectedUser.profileData).map(([key, value]) => (
                          <div key={key} className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </span>
                            <span className="text-gray-900 font-semibold text-lg">
                              {value || 'N/A'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-dashed border-gray-300">
                    <p className="text-gray-500 font-medium">No additional profile information available</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 bg-gradient-to-r from-gray-50 to-blue-50 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Create New User</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
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
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-2 bg-white focus:ring-2 focus:ring-blue-500"
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
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500"
                    value={formData.specialization}
                    onChange={e => setFormData({ ...formData, specialization: e.target.value })}
                  />
                </div>
              )}

              <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
                Default password: <strong>Password123!</strong>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
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