/**
 * Format a date string to a readable format
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Format a date to show time only
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted time string (e.g., "2:30 PM")
 */
export const formatTime = (date) => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Time';

  return dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Format a date to show both date and time
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted datetime string
 */
export const formatDateTime = (date) => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid DateTime';

  return dateObj.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param {string|Date} date - The date to compare
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return 'N/A';

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const now = new Date();
  const diffMs = dateObj - now;
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (Math.abs(diffMins) < 60) {
    return diffMins === 0 ? 'Just now' :
      diffMins > 0 ? `In ${diffMins} minutes` : `${Math.abs(diffMins)} minutes ago`;
  } else if (Math.abs(diffHours) < 24) {
    return diffHours > 0 ? `In ${diffHours} hours` : `${Math.abs(diffHours)} hours ago`;
  } else {
    return diffDays > 0 ? `In ${diffDays} days` : `${Math.abs(diffDays)} days ago`;
  }
};
