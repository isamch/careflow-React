/**
 * Reusable Button Component
 * Supports different variants and sizes
 */
const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  // Base styles: Added shadow-sm, rounded-xl (from config), and active scale effect
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md active:scale-95';

  // Variant styles using new semantic colors
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 border border-transparent',
    secondary: 'bg-white text-text border border-gray-200 hover:bg-gray-50 hover:border-gray-300 focus:ring-gray-200',
    accent: 'bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 border border-transparent', // New Accent (Teal)
    danger: 'bg-danger text-white hover:bg-red-600 focus:ring-red-500 border border-transparent',
    success: 'bg-success text-white hover:bg-green-600 focus:ring-green-500 border border-transparent',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'bg-transparent text-primary hover:bg-primary-50 focus:ring-primary-500 shadow-none hover:shadow-none', // New Ghost variant
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm', // Slightly larger padding for modern look
    lg: 'px-6 py-3 text-base',
  };

  const buttonClasses = `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size]} ${className}`;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
