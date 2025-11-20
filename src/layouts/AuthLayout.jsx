import { Outlet } from 'react-router-dom';
import { Heart } from 'lucide-react';

/**
 * AuthLayout - Layout for authentication pages (Login, Register, Forgot Password)
 * Features a centered card design with branding
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">CareFlow</h1>
          <p className="text-gray-600 mt-2">Healthcare Management System</p>
        </div>

        {/* Auth Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © 2025 CareFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
