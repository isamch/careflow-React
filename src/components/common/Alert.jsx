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
  // Type configurations
  const types = {
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: CheckCircle,
      iconColor: 'text-green-500',
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: XCircle,
      iconColor: 'text-red-500',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: AlertCircle,
      iconColor: 'text-yellow-500',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: Info,
      iconColor: 'text-blue-500',
    },
  };

  const config = types[type];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.bg} ${config.border} ${className}`}
    >
      <Icon className={`flex-shrink-0 ${config.iconColor}`} size={20} />
      <p className={`flex-1 text-sm font-medium ${config.text}`}>{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className={`flex-shrink-0 ${config.text} hover:opacity-70 transition-opacity`}
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default Alert;
