import { Outlet } from 'react-router-dom';
import { Activity } from 'lucide-react';

/**
 * AuthLayout - Layout for authentication pages (Login, Register, Forgot Password)
 * Features a centered card design with branding
 */
const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 font-sans text-text antialiased">
      <div className="w-full max-w-md animate-fadeIn">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 shadow-sm">
            <Activity className="text-primary-600" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-primary-900 tracking-tight">CareFlow</h1>
          <p className="text-text-muted mt-2 font-medium">Healthcare Management System</p>
        </div>

        {/* Auth Form Card - Note: The pages themselves (Login, Register) also have cards. 
            If this layout wraps them, we might have double cards. 
            However, keeping it simple here allows pages to just render their form content if needed, 
            OR if pages are standalone, this layout might be bypassed or used as a wrapper.
            Given the previous edits to Login/Register where they have their own full page structure,
            this layout might be redundant or needs to be simple. 
            I will make it a simple wrapper for now to avoid conflict if pages are used inside it.
        */}
        <Outlet />

        {/* Footer */}
        <p className="text-center text-text-muted text-sm mt-8 font-medium">
          © 2025 CareFlow. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default AuthLayout;
