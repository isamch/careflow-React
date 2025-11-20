import { User, Mail, Phone, Calendar } from 'lucide-react';
import { formatDate } from '../../utils/formatDate';
import Badge from '../common/Badge';

/**
 * PatientCard Component
 * Displays patient information in a card format
 */
const PatientCard = ({ patient, onSelect, showDetails = true }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Patient Avatar */}
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-xl flex-shrink-0">
          {patient.fullName?.charAt(0) || 'P'}
        </div>

        {/* Patient Info */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              {patient.fullName}
            </h3>
            <Badge variant="success" size="sm">Patient</Badge>
          </div>

          {showDetails && (
            <div className="space-y-1 text-sm text-gray-600">
              {patient.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} />
                  <span>{patient.email}</span>
                </div>
              )}
              {patient.profile?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} />
                  <span>{patient.profile.phone}</span>
                </div>
              )}
              {patient.profile?.dateOfBirth && (
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>DOB: {formatDate(patient.profile.dateOfBirth)}</span>
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          {onSelect && (
            <button
              onClick={() => onSelect(patient)}
              className="mt-4 px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              View Details
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientCard;
