import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import { User, Mail, Shield, Calendar, Lock, Save, Edit2 } from 'lucide-react';
import Alert from '../../components/common/Alert';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });

  const [formData, setFormData] = useState({
    fullName: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || ''
      });
    }
  }, [user]);

  if (!user) return <div className="p-8 text-center">Loading profile...</div>;

  const getRoleName = () => {
    if (typeof user.role === 'string') return user.role;
    if (user.role && typeof user.role === 'object') return user.role.name || 'User';
    return 'User';
  };

  const roleName = getRoleName();

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.updateProfile(formData);
      showNotification('success', 'Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      showNotification('error', err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showNotification('error', 'New passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      showNotification('success', 'Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      console.error(err);
      showNotification('error', err.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {notification.show && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert type={notification.type} message={notification.message} onClose={() => setNotification({ ...notification, show: false })} />
        </div>
      )}

      <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-8 pb-8 relative">
          <div className="-mt-12 mb-6 flex justify-between items-end">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg">
              <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-3xl font-bold border border-gray-200">
                {user.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="mb-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg transition-colors"
            >
              {isEditing ? <><User size={18} /> View Mode</> : <><Edit2 size={18} /> Edit Profile</>}
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{user.fullName}</h3>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${roleName === 'Admin' ? 'bg-purple-100 text-purple-700' :
                    roleName === 'Doctor' ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                  }`}>
                  {roleName}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${user.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                  {user.status || 'Active'}
                </span>
                {user.isEmailVerified && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-gray-400" />
                  <span>Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-gray-400" />
                  <span>{user.email}</span>
                </div>
              </div>
            </div>

            {user.role?.permissions && user.role.permissions.length > 0 && (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  Permissions
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.role.permissions.map((permission, index) => (
                    <span key={index} className="text-xs bg-white px-2 py-1 rounded border border-gray-200 text-gray-700">
                      {permission.replace(/[_:]/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'overview' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            Account Overview
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 py-4 text-sm font-medium text-center transition-colors ${activeTab === 'security' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
          >
            Security & Password
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'overview' && (
            <form onSubmit={handleUpdateProfile}>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      disabled={!isEditing}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-50 disabled:text-gray-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      disabled
                      value={roleName}
                      className="w-full pl-10 p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="mt-8 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70"
                  >
                    {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === 'security' && (
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Lock className="text-blue-600" /> Change Password
              </h3>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 font-medium transition-colors disabled:opacity-70"
                  >
                    {loading ? 'Updating Password...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;