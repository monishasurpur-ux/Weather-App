/**
 * WeatherGlass Dashboard - Formatters
 * Utility functions for formatting values
 */

/**
 * Format temperature with unit
 * @param {number} temp - Temperature value
 * @param {string} unit - Unit (metric/imperial)
 * @param {boolean} includeUnit - Include unit symbol
 * @returns {string} Formatted temperature
 */
export const formatTemperature = (temp, unit = 'metric', includeUnit = true) => {
  if (temp === undefined || temp === null) return 'N/A';
  const symbol = unit === 'metric' ? '°C' : '°F';
  return includeUnit ? `${Math.round(temp)}${symbol}` : `${Math.round(temp)}`;
};

/**
 * Format percentage
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return 'N/A';
  return `${Math.round(value)}%`;
};

/**
 * Format wind speed
 * @param {number} speed - Wind speed
 * @param {string} unit - Unit (metric/imperial)
 * @returns {string} Formatted wind speed
 */
export const formatWindSpeed = (speed, unit = 'metric') => {
  if (speed === undefined || speed === null) return 'N/A';
  const unitLabel = unit === 'metric' ? 'm/s' : 'mph';
  return `${Math.round(speed)} ${unitLabel}`;
};

/**
 * Format pressure
 * @param {number} pressure - Pressure in hPa
 * @returns {string} Formatted pressure
 */
export const formatPressure = (pressure) => {
  if (pressure === undefined || pressure === null) return 'N/A';
  return `${pressure} hPa`;
};

/**
 * Format visibility
 * @param {number} visibility - Visibility in meters
 * @returns {string} Formatted visibility
 */
export const formatVisibility = (visibility) => {
  if (visibility === undefined || visibility === null) return 'N/A';
  return `${(visibility / 1000).toFixed(1)} km`;
};

/**
 * Format date
 * @param {number|Date} date - Date to format
 * @param {string} format - Format type
 * @returns {string} Formatted date
 */
export const formatDate = (date, format = 'short') => {
  const d = new Date(date);
  
  const formats = {
    short: { month: 'short', day: 'numeric' },
    medium: { month: 'short', day: 'numeric', year: 'numeric' },
    full: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    day: { weekday: 'short' },
    time: { hour: 'numeric', minute: '2-digit', hour12: true },
  };
  
  return d.toLocaleDateString('en-US', formats[format] || formats.short);
};

/**
 * Format time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time
 */
export const formatTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format timestamp to relative time
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const date = new Date(timestamp * 1000);
  const diff = now - date.getTime();
  
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
};

/**
 * Format coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Formatted coordinates
 */
export const formatCoordinates = (lat, lon) => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lon).toFixed(2)}°${lonDir}`;
};

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Truncate string
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
};
