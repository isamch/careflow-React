/**
 * Reusable Input Component
 * Supports different types and includes label and error display
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {/* Label */}
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-text-muted mb-1.5 ml-1">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}

      {/* Input Field */}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-200 ${error
            ? 'border-danger focus:border-danger focus:ring-red-100'
            : 'border-gray-200 focus:border-primary focus:ring-primary-100'
          } ${disabled
            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
            : 'bg-white text-text placeholder-gray-400'
          } ${className}`}
        {...props}
      />

      {/* Error Message */}
      {error && (
        <p className="mt-1.5 ml-1 text-sm text-danger animate-fadeIn">{error}</p>
      )}
    </div>
  );
};

export default Input;
