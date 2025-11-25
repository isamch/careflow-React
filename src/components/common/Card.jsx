/**
 * Reusable Card Component
 * A simple container with shadow and rounded corners
 */
const Card = ({
  children,
  title,
  className = '',
  padding = true,
  hover = false
}) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-card border border-gray-100 ${hover ? 'hover:shadow-lg transition-shadow duration-300' : ''
        } ${className}`}
    >
      {/* Card Header */}
      {title && (
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-primary-900">{title}</h3>
        </div>
      )}

      {/* Card Body */}
      <div className={padding ? 'p-6' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;
