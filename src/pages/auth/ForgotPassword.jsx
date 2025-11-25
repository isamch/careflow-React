import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Alert from '../../components/common/Alert';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = () => {
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateEmail()) {
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement forgot password API call
      // await authService.forgotPassword(email);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-card border border-gray-100">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 animate-bounce">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-primary-900 mb-2">Check Your Email</h2>
            <p className="text-text-muted mb-4">
              We've sent password reset instructions to:
            </p>
            <p className="font-semibold text-primary-600 mb-6 bg-primary-50 py-2 px-4 rounded-lg inline-block">{email}</p>
            <p className="text-sm text-text-muted mb-6">
              Please check your inbox and follow the instructions to reset your password.
              If you don't see the email, check your spam folder.
            </p>
            <Link to="/login">
              <Button variant="primary" className="w-full">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-card border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-50 rounded-2xl mb-4 shadow-sm">
            <Mail className="text-primary-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-primary-900 mb-2">Forgot Password?</h2>
          <p className="text-text-muted">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
            className="mb-6"
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
            }}
            placeholder="your.email@example.com"
            error={emailError}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full py-3 shadow-lg shadow-primary/20 hover:shadow-primary/30"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </Button>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm text-primary hover:text-primary-800 transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </form>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs text-primary-800 font-semibold mb-2">Need help?</p>
          <p className="text-xs text-text-muted">
            If you're having trouble resetting your password, please contact our support team at{' '}
            <a href="mailto:support@careflow.com" className="text-primary hover:underline font-medium">
              support@careflow.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
