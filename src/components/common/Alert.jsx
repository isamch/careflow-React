import { AlertCircle, CheckCircle, Info, XCircle, X } from 'lucide-react';

/**
 * Reusable Alert Component
 * Displays notifications and messages with different types
 */
const Alert = ({
  type = 'info',
  message,
  onClose,
  className = ''
}) => {
  // Type configurations using semantic colors
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
    warning: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-800',
      icon: AlertCircle,
      iconColor: 'text-orange-600',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-600',
    },
  };

  const config = types[type] || types.info;
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-sm ${config.bg} ${config.border} ${className}`}
      role="alert"
    >
      <Icon className={`flex-shrink-0 mt-0.5 ${config.iconColor}`} size={20} />
      <div className={`flex-1 text-sm font-medium ${config.text}`}>
        {message}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 -mr-1 -mt-1 p-1 rounded-lg hover:bg-white/20 transition-colors ${config.text}`}
          aria-label="Close alert"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
