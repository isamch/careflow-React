import { User, Mail, Phone, MapPin } from 'lucide-react';
import { getRoleBadgeColor } from '../../utils/roleHelpers';
import Badge from '../common/Badge';

/**
 * DoctorCard Component
 * Displays doctor information in a card format
 */
const DoctorCard = ({ doctor, onSelect }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Doctor Avatar */}
        <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl flex-shrink-0">
          {doctor.fullName?.charAt(0) || 'D'}
        </div>

        {/* Doctor Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Dr. {doctor.fullName}
            </h3>
            <Badge variant="primary" size="sm">Doctor</Badge>
          </div>

          {/* Contact Info */}
          <div className="space-y-1 text-sm text-gray-600">
            {doctor.email && (
              <div className="flex items-center gap-2">
                <Mail size={14} />
                <span>{doctor.email}</span>
              </div>
            )}
            {doctor.profile?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={14} />
                <span>{doctor.profile.phone}</span>
              </div>
            )}
            {doctor.profile?.specialization && (
              <div className="flex items-center gap-2">
                <User size={14} />
                <span className="font-medium text-blue-600">
                  {doctor.profile.specialization}
                </span>
              </div>
            )}
          </div>

          {/* Action Button */}
          {onSelect && (
            <button
              onClick={() => onSelect(doctor)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Select Doctor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
