/**
 * WeatherGlass Dashboard - Helper Functions
 * Utility functions for weather data processing
 */

/**
 * Get UV Index category
 * @param {number} uvi - UV Index value
 * @returns {object} UV category object
 */
export const getUVCategory = (uvi) => {
  if (uvi <= 2) return { label: "Low", color: "uv-low", description: "Safe for outdoor activities" };
  if (uvi <= 5) return { label: "Moderate", color: "uv-moderate", description: "Wear sunscreen" };
  if (uvi <= 7) return { label: "High", color: "uv-high", description: "Reduce sun exposure" };
  if (uvi <= 10) return { label: "Very High", color: "uv-very-high", description: "Extra protection needed" };
  return { label: "Extreme", color: "uv-extreme", description: "Avoid sun exposure" };
};

/**
 * Get wind direction label from degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {string} Wind direction label
 */
export const getWindDirection = (degrees) => {
  const directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
};

/**
 * Get weather icon name from code
 * @param {string} iconCode - OpenWeatherMap icon code
 * @returns {string} Icon name
 */
export const getWeatherIcon = (iconCode) => {
  const iconMap = {
    "01d": "sun",
    "01n": "moon",
    "02d": "cloud-sun",
    "02n": "cloud-moon",
    "03d": "cloud",
    "03n": "cloud",
    "04d": "cloud",
    "04n": "cloud",
    "09d": "cloud-drizzle",
    "09n": "cloud-drizzle",
    "10d": "cloud-rain",
    "10n": "cloud-rain",
    "11d": "cloud-lightning",
    "11n": "cloud-lightning",
    "13d": "snowflake",
    "13n": "snowflake",
    "50d": "wind",
    "50n": "wind",
  };
  return iconMap[iconCode] || "cloud";
};

/**
 * Get background gradient based on weather condition
 * @param {string} condition - Weather condition
 * @returns {string} CSS gradient class
 */
export const getWeatherGradient = (condition) => {
  const gradients = {
    clear: "from-amber-500 via-orange-400 to-yellow-300",
    clouds: "from-gray-600 via-gray-500 to-gray-400",
    rain: "from-blue-700 via-blue-500 to-blue-400",
    drizzle: "from-blue-400 via-blue-300 to-blue-200",
    thunderstorm: "from-purple-800 via-purple-600 to-purple-400",
    snow: "from-blue-200 via-white to-blue-100",
    mist: "from-gray-400 via-gray-300 to-gray-200",
    fog: "from-gray-400 via-gray-300 to-gray-200",
  };
  
  const conditionLower = condition?.toLowerCase() || "";
  for (const [key, value] of Object.entries(gradients)) {
    if (conditionLower.includes(key)) return value;
  }
  return "from-blue-500 via-blue-400 to-blue-300";
};

/**
 * Calculate feels like temperature
 * @param {number} temp - Actual temperature
 * @param {number} humidity - Humidity percentage
 * @param {number} windSpeed - Wind speed
 * @returns {number} Feels like temperature
 */
export const calculateFeelsLike = (temp, humidity, windSpeed) => {
  // Simplified heat index calculation
  const heatIndex = temp + 0.5555 * (6.112 * Math.pow(10, (temp - 273.15) / 17.67) * (humidity / 100) - 10);
  return heatIndex;
};

/**
 * Convert timestamp to time string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted time
 */
export const timestampToTime = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });
};

/**
 * Convert timestamp to date string
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Formatted date
 */
export const timestampToDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

/**
 * Get day of week from timestamp
 * @param {number} timestamp - Unix timestamp
 * @returns {string} Day name
 */
export const getDayOfWeek = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", { weekday: "long" });
};

/**
 * Check if date is today
 * @param {number} timestamp - Unix timestamp
 * @returns {boolean} True if today
 */
export const isToday = (timestamp) => {
  const date = new Date(timestamp * 1000);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/**
 * Format number with units
 * @param {number} value - Value to format
 * @param {string} unit - Unit string
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
export const formatWithUnit = (value, unit, decimals = 0) => {
  if (value === undefined || value === null) return "N/A";
  return `${value.toFixed(decimals)} ${unit}`;
};

/**
 * Get compass rotation degrees
 * @param {number} degrees - Wind direction in degrees
 * @returns {number} Rotation degrees
 */
export const getCompassRotation = (degrees) => {
  return degrees;
};

/**
 * Group forecast by day
 * @param {array} forecastData - Array of forecast items
 * @returns {object} Grouped forecast
 */
export const groupForecastByDay = (forecastData) => {
  const grouped = {};
  
  forecastData.forEach((item) => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(item);
  });
  
  return grouped;
};

/**
 * Get average temperature for a day
 * @param {array} dayData - Array of forecast items for a day
 * @returns {object} Min and max temperatures
 */
export const getDayTemperatureRange = (dayData) => {
  if (!dayData || dayData.length === 0) return { min: 0, max: 0 };
  
  const temps = dayData.map((item) => item.main.temp);
  return {
    min: Math.min(...temps),
    max: Math.max(...temps),
  };
};

/**
 * Get most common weather condition for a day
 * @param {array} dayData - Array of forecast items for a day
 * @returns {object} Most common condition and icon
 */
export const getDayCommonCondition = (dayData) => {
  if (!dayData || dayData.length === 0) return { condition: "Unknown", icon: "01d" };
  
  const conditions = {};
  dayData.forEach((item) => {
    const main = item.weather[0].main;
    conditions[main] = (conditions[main] || 0) + 1;
  });
  
  const mostCommon = Object.entries(conditions).sort((a, b) => b[1] - a[1])[0];
  const sampleItem = dayData.find((item) => item.weather[0].main === mostCommon[0]);
  
  return {
    condition: mostCommon[0],
    icon: sampleItem.weather[0].icon,
    description: sampleItem.weather[0].description,
  };
};

/**
 * Calculate rain probability percentage
 * @param {array} dayData - Array of forecast items
 * @returns {number} Average rain probability
 */
export const getAverageRainProbability = (dayData) => {
  if (!dayData || dayData.length === 0) return 0;
  
  const pop = dayData.map((item) => (item.pop || 0) * 100);
  return Math.round(pop.reduce((a, b) => a + b, 0) / pop.length);
};

/**
 * Debounce function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttle function
 * @param {function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {function} Throttled function
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
