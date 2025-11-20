/**
 * Role constants - must match backend roles exactly
 */
export const ROLES = {
  ADMIN: 'Admin',
  DOCTOR: 'Doctor',
  PATIENT: 'Patient',
  NURSE: 'Nurse',
  SECRETARY: 'Secretary'
};

/**
 * Check if user is an Admin
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isAdmin = (user) => {
  return user?.role === ROLES.ADMIN;
};

/**
 * Check if user is a Doctor
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isDoctor = (user) => {
  return user?.role === ROLES.DOCTOR;
};

/**
 * Check if user is a Patient
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isPatient = (user) => {
  return user?.role === ROLES.PATIENT;
};

/**
 * Check if user is a Nurse
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isNurse = (user) => {
  return user?.role === ROLES.NURSE;
};

/**
 * Check if user is a Secretary
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isSecretary = (user) => {
  return user?.role === ROLES.SECRETARY;
};

/**
 * Check if user has medical staff role (Doctor or Nurse)
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const isMedicalStaff = (user) => {
  return isDoctor(user) || isNurse(user);
};

/**
 * Check if user has admin or medical staff role
 * @param {Object} user - User object with role property
 * @returns {boolean}
 */
export const canAccessPatientRecords = (user) => {
  return isAdmin(user) || isMedicalStaff(user);
};

/**
 * Get user role display name
 * @param {Object} user - User object with role property
 * @returns {string}
 */
export const getRoleDisplayName = (user) => {
  if (!user?.role) return 'Unknown';
  return user.role;
};

/**
 * Get role badge color for UI
 * @param {string} role - Role name
 * @returns {string} Tailwind color class
 */
export const getRoleBadgeColor = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return 'bg-purple-100 text-purple-800';
    case ROLES.DOCTOR:
      return 'bg-blue-100 text-blue-800';
    case ROLES.NURSE:
      return 'bg-green-100 text-green-800';
    case ROLES.PATIENT:
      return 'bg-gray-100 text-gray-800';
    case ROLES.SECRETARY:
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
