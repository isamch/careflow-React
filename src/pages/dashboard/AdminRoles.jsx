import { useEffect, useState } from 'react';
import { adminService } from '../../services/adminService';
import { Shield, Lock, Users, CheckCircle, XCircle } from 'lucide-react';
import Alert from '../../components/common/Alert';
import Card from '../../components/common/Card';

const AdminRoles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await adminService.getRoles();
      // Assuming response.data is an array of roles
      setRoles(response.data || []);
    } catch (err) {
      console.error("Failed to load roles", err);
      setError("Failed to load roles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Get role color
  const getRoleColor = (roleName) => {
    const colors = {
      Admin: "from-purple-500 to-purple-700",
      Doctor: "from-blue-500 to-blue-700",
      Patient: "from-green-500 to-green-700",
      Nurse: "from-yellow-500 to-yellow-700",
      Secretary: "from-pink-500 to-pink-700"
    };
    return colors[roleName] || "from-gray-500 to-gray-700";
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return <Alert type="error" message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Shield className="text-blue-600" /> Roles & Permissions
        </h2>
        <div className="text-sm text-gray-500">
          Total Roles: <span className="font-medium">{roles.length}</span>
        </div>
      </div>

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} padding={false} hover>
            <div className={`h-2 bg-gradient-to-r ${getRoleColor(role.name)}`}></div>

            <div className="p-6">
              {/* Role Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${getRoleColor(role.name)} text-white`}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.description || 'No description'}</p>
                  </div>
                </div>
              </div>

              {/* Users Count */}
              <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <Users size={16} className="text-gray-400" />
                <span className="text-sm text-gray-600">
                  {role.userCount || 0} users with this role
                </span>
              </div>

              {/* Permissions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Lock size={14} className="text-gray-400" />
                  <h4 className="text-sm font-semibold text-gray-700">Permissions</h4>
                </div>

                {role.permissions && role.permissions.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                        <span className="text-gray-600">{permission}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <XCircle size={14} />
                    <span>No permissions defined</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {roles.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <Shield className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-500">No roles found in the system.</p>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
