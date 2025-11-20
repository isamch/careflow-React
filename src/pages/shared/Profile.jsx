import useAuth from '../../hooks/useAuth';
import { User, Mail, Shield, Phone, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Profile</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
        
        <div className="px-8 pb-8 relative">
          {/* Avatar */}
          <div className="-mt-12 mb-6">
            <div className="h-24 w-24 rounded-full bg-white p-1 shadow-lg inline-block">
               <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
               </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div>
               <h3 className="text-xl font-bold text-gray-900">{user.fullName}</h3>
               <p className="text-gray-500 flex items-center gap-1 mt-1">
                 <Shield size={16} className="text-blue-600"/> {user.role}
               </p>
               
               <div className="mt-6 space-y-4">
                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded">
                       <Mail size={18}/>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500">Email Address</p>
                       <p className="font-medium">{user.email}</p>
                    </div>
                 </div>

                 <div className="flex items-center gap-3 text-gray-700">
                    <div className="bg-gray-100 p-2 rounded">
                       <Calendar size={18}/>
                    </div>
                    <div>
                       <p className="text-xs text-gray-500">Joined Date</p>
                       {/* If createdAt exists, show it, else show current date as placeholder */}
                       <p className="font-medium">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                    </div>
                 </div>
               </div>
            </div>

            {/* Role Specific Data */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
               <h4 className="font-bold text-gray-800 mb-4">Account Details</h4>
               
               {user.role === 'Doctor' && (
                 <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Specialization</span>
                      <span className="font-medium">{user.profile?.specialization || 'General Medicine'}</span>
                    </div>
                    <div>
                      <span className="text-xs text-gray-500 block">License Number</span>
                      <span className="font-medium">DOC-{user.id?.substring(0,6).toUpperCase()}</span>
                    </div>
                 </div>
               )}

               {user.role === 'Patient' && (
                 <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 block">Patient ID</span>
                      <span className="font-medium font-mono bg-white px-2 py-1 rounded border">
                        {user.id}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 italic mt-4">
                       "Please contact the secretary to update your medical information or insurance details."
                    </div>
                 </div>
               )}
               
               {user.role === 'Admin' && (
                  <p className="text-sm text-gray-600">You have full access to system configurations and user management.</p>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;