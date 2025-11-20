import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, link, linkText }) => {
  const Icon = icon;
  // Color styles map
  const colorStyles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
  };

  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${style}`}>
          <Icon size={24} />
        </div>
      </div>
      
      {link && (
        <div className="border-t border-gray-50 pt-4 mt-2">
          <Link to={link} className="text-sm font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors">
            {linkText || "View Details"} <ArrowRight size={14} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default StatCard;