import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const Login = () => {
  // State for form inputs and UI status
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks for navigation and auth
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the page the user was trying to access before being redirected to login
  const from = location.state?.from?.pathname || '/dashboard';

  // Client-side validation
  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the login function from AuthContext
      await login(email, password);

      // If successful, navigate to the intended page (or dashboard)
      navigate(from, { replace: true });

    } catch (error) {
      // Handle errors (e.g., Invalid credentials)
      console.error('Login error:', error);

      // Extract error message
      let errorMessage = 'Invalid email or password. Please check your credentials and try again.';

      if (error.message) {
        errorMessage = error.message;
      }

      console.log('Setting error message:', errorMessage);
      setFormError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-card border border-gray-100">

        {/* Header Section */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 shadow-sm">
            <LogIn className="text-primary-600" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-primary-900 tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-text-muted">
            Sign in to access your CareFlow account
          </p>
        </div>

        {/* Error Message Display */}
        {formError && (
          <Alert
            type="error"
            message={formError}
            onClose={() => setFormError('')}
          />
        )}

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Input */}
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="your.email@example.com"
              error={errors.email}
              required
            />

            {/* Password Input */}
            <div>
              <Input
                label="Password"
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                placeholder="Enter your password"
                error={errors.password}
                required
              />
              <div className="flex justify-end mt-1">
                <Link to="/forgot-password" class="text-xs font-medium text-primary hover:text-primary-700 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-text-muted">
              Remember me
            </label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 text-base shadow-lg shadow-primary/20 hover:shadow-primary/30"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-primary hover:text-primary-700 transition-colors">
              Register here
            </Link>
          </p>
        </div>

        {/* Demo Credentials (Optional - for development) */}
        <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-100">
          <p className="text-xs text-primary-700 font-bold uppercase tracking-wider mb-3">Demo Credentials</p>
          <div className="grid grid-cols-1 gap-2 text-xs text-text-muted font-mono">
            <div className="flex justify-between">
              <span>Admin:</span>
              <span className="text-gray-900">admin@careflow.local / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Doctor:</span>
              <span className="text-gray-900">doctor1@careflow.local / Staff123!</span>
            </div>
            <div className="flex justify-between">
              <span>Patient:</span>
              <span className="text-gray-900">patient1@careflow.local / Patient123!</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;