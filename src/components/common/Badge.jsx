/**
 * Reusable Badge Component
 * Small colored labels for status, roles, etc.
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}) => {
  // Variant styles using semantic colors
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-50 text-primary-700 border border-primary-100',
    secondary: 'bg-secondary-50 text-secondary-700 border border-secondary-100',
    success: 'bg-green-50 text-green-700 border border-green-100',
    warning: 'bg-orange-50 text-orange-700 border border-orange-100',
    danger: 'bg-red-50 text-red-700 border border-red-100',
    purple: 'bg-purple-50 text-purple-700 border border-purple-100',
    info: 'bg-blue-50 text-blue-700 border border-blue-100',
  };

  // Size styles
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
