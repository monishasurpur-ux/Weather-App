/**
 * WeatherGlass Dashboard - Constants
 * Using Open-Meteo API (free, no API key required)
 * From https://github.com/public-apis/public-apis
 */

// Open-Meteo API Base URL (free, no API key needed)
export const METEO_BASE_URL = "https://api.open-meteo.com/v1";
export const METEO_GEOCODING_URL = "https://geocoding-api.open-meteo.com/v1";

// API Endpoints
export const ENDPOINTS = {
  CURRENT_WEATHER: "/forecast",
  FORECAST: "/forecast",
  HISTORICAL: "/archive",
  GEOCODING: "/search",
};

// Default city
export const DEFAULT_CITY = "London";

// Local storage keys
export const STORAGE_KEYS = {
  FAVORITES: "weather_favorites",
  RECENT_SEARCHES: "weather_recent_searches",
  TEMP_UNIT: "weather_temp_unit",
  LAST_CITY: "weather_last_city",
};

// Maximum items
export const MAX_RECENT_SEARCHES = 5;
export const MAX_FAVORITES = 10;

// Cache duration (in milliseconds)
export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Animation durations
export const ANIMATION = {
  DEBOUNCE_DELAY: 300,
  FADE_IN: 300,
  SLIDE_UP: 500,
  SKELETON_SHIMMER: 1500,
};

// Temperature units
export const UNITS = {
  METRIC: "metric",
  IMPERIAL: "imperial",
};

// Weather code to icon mapping (Open-Meteo codes)
export const WEATHER_CODES = {
  0: { icon: "sun", description: "Clear sky" },
  1: { icon: "sun", description: "Mainly clear" },
  2: { icon: "cloud-sun", description: "Partly cloudy" },
  3: { icon: "cloud", description: "Overcast" },
  45: { icon: "cloud-fog", description: "Fog" },
  48: { icon: "cloud-fog", description: "Depositing rime fog" },
  51: { icon: "cloud-drizzle", description: "Light drizzle" },
  53: { icon: "cloud-drizzle", description: "Moderate drizzle" },
  55: { icon: "cloud-drizzle", description: "Dense drizzle" },
  56: { icon: "cloud-drizzle", description: "Light freezing drizzle" },
  57: { icon: "cloud-drizzle", description: "Dense freezing drizzle" },
  61: { icon: "cloud-rain", description: "Slight rain" },
  63: { icon: "cloud-rain", description: "Moderate rain" },
  65: { icon: "cloud-rain", description: "Heavy rain" },
  66: { icon: "cloud-rain", description: "Light freezing rain" },
  67: { icon: "cloud-rain", description: "Heavy freezing rain" },
  71: { icon: "snowflake", description: "Slight snow" },
  73: { icon: "snowflake", description: "Moderate snow" },
  75: { icon: "snowflake", description: "Heavy snow" },
  77: { icon: "snowflake", description: "Snow grains" },
  80: { icon: "cloud-rain", description: "Slight rain showers" },
  81: { icon: "cloud-rain", description: "Moderate rain showers" },
  82: { icon: "cloud-rain", description: "Violent rain showers" },
  85: { icon: "snowflake", description: "Slight snow showers" },
  86: { icon: "snowflake", description: "Heavy snow showers" },
  95: { icon: "cloud-lightning", description: "Thunderstorm" },
  96: { icon: "cloud-lightning", description: "Thunderstorm with slight hail" },
  99: { icon: "cloud-lightning", description: "Thunderstorm with heavy hail" },
};

// Wind direction labels
export const WIND_DIRECTIONS = [
  "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
  "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
];

// Date formats
export const DATE_FORMATS = {
  FULL: "EEEE, MMMM d, yyyy",
  SHORT: "MMM d",
  TIME: "h:mm a",
  DAY: "EEEE",
  HOUR: "ha",
};
