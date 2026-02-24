/**
 * WeatherGlass Dashboard - Weather API Service
 * Using Open-Meteo API (free, no API key required)
 * From https://github.com/public-apis/public-apis
 */

import axios from 'axios';
import { METEO_BASE_URL, METEO_GEOCODING_URL, ENDPOINTS } from '../utils/constants';

const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const cache = new Map();

const getCachedData = (key) => {
  return null;
};

const setCachedData = (key, data) => {
  return;
};

export const searchCities = async (query) => {
  if (!query || query.length < 2) return [];

  try {
    const url = `${METEO_GEOCODING_URL}${ENDPOINTS.GEOCODING}`;
    console.log('Geocoding URL:', url);
    
    const response = await api.get(url, {
      params: {
        name: query,
        count: 5,
        language: 'en',
      },
    });
    
    console.log('Search cities response:', response.data);
    
    if (!response.data || !response.data.results) {
      console.log('No results found');
      return [];
    }
    
    const results = response.data.results || [];
    const mapped = results.map((city) => ({
      name: city.name,
      state: city.admin1 || '',
      country: city.country_code,
      lat: city.latitude,
      lon: city.longitude,
    }));
    
    console.log('Mapped cities:', mapped);
    return mapped;
  } catch (error) {
    console.error('City search failed:', error.response?.data || error.message || error);
    return [];
  }
};

export const getCurrentWeather = async (city, units = 'metric') => {
  const cacheKey = `weather_${city.toLowerCase()}_${units}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const cities = await searchCities(city);
    console.log('Search result cities:', cities);
    
    if (!cities || cities.length === 0) {
      throw new Error('City not found. Please check the city name.');
    }

    const { lat, lon } = cities[0];
    console.log('Fetching weather for:', cities[0].name, 'lat:', lat, 'lon:', lon);
    
    const isImperial = units === 'imperial';
    const tempUnit = isImperial ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = isImperial ? 'mph' : 'kmh';
    
    const url = `${METEO_BASE_URL}${ENDPOINTS.CURRENT_WEATHER}`;
    console.log('Weather API URL:', url);
    
    const params = {
      latitude: lat,
      longitude: lon,
      current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m',
      hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,wind_speed_10m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max,wind_speed_10m_max',
      timezone: 'auto',
      forecast_days: 7,
      temperature_unit: tempUnit,
      wind_speed_unit: windSpeedUnit,
    };
    console.log('Weather API params:', params);
    
    const response = await api.get(url, { params });

    const transformedData = transformWeatherData(response.data, cities[0]);
    setCachedData(cacheKey, transformedData);
    return transformedData;
  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    if (error.response?.status === 404) {
      throw new Error('City not found. Please check the city name.');
    }
    throw new Error(error.response?.data?.error || error.message || 'Failed to fetch weather data');
  }
};

export const getForecast = async (city, units = 'metric') => {
  const data = await getCurrentWeather(city, units);
  return data.forecast;
};

export const getHistoricalWeather = async (lat, lon, timestamp, units = 'metric') => {
  const date = new Date(timestamp * 1000);
  const dateStr = date.toISOString().split('T')[0];
  
  const cacheKey = `historical_${lat}_${lon}_${dateStr}_${units}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const isImperial = units === 'imperial';
    const tempUnit = isImperial ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = isImperial ? 'mph' : 'kmh';

    const response = await api.get(`${METEO_BASE_URL}/archive`, {
      params: {
        latitude: lat,
        longitude: lon,
        start_date: dateStr,
        end_date: dateStr,
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,wind_speed_10m_max',
        timezone: 'auto',
        temperature_unit: tempUnit,
        wind_speed_unit: windSpeedUnit,
      },
    });

    const transformedData = transformHistoricalData(response.data);
    setCachedData(cacheKey, transformedData);
    return transformedData;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch historical data');
  }
};

// Helper to safely get array values
const safeGet = (arr, index, defaultVal = 0) => {
  if (!arr || !Array.isArray(arr)) return defaultVal;
  return arr[index] !== undefined ? arr[index] : defaultVal;
};

const transformWeatherData = (data, cityInfo) => {
  // Add defensive checks for all API response data
  if (!data) {
    throw new Error('Invalid API response - no data received');
  }
  
  const current = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};
  
  console.log('Transforming weather data - daily:', daily);
  
  // Safely find today's index with fallback to 0
  let todayIndex = 0;
  if (daily.time && daily.time.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    const foundIndex = daily.time.findIndex(t => t && t.startsWith(today));
    todayIndex = foundIndex >= 0 ? foundIndex : 0;
  }
  
  return {
    name: cityInfo.name,
    sys: {
      country: cityInfo.country,
      sunrise: safeGet(daily.sunrise, todayIndex, new Date().toISOString()),
      sunset: safeGet(daily.sunset, todayIndex, new Date().toISOString()),
    },
    main: {
      temp: current.temperature_2m ?? 0,
      feels_like: current.apparent_temperature ?? 0,
      humidity: current.relative_humidity_2m ?? 0,
      pressure: current.pressure_msl ?? current.surface_pressure ?? 0,
      temp_min: safeGet(daily.temperature_2m_min, todayIndex),
      temp_max: safeGet(daily.temperature_2m_max, todayIndex),
    },
    weather: [{
      id: current.weather_code ?? 0,
      main: getWeatherMain(current.weather_code ?? 0),
      description: getWeatherDescription(current.weather_code ?? 0),
      icon: getWeatherIcon(current.weather_code ?? 0),
    }],
    wind: {
      speed: current.wind_speed_10m ?? 0,
      deg: current.wind_direction_10m ?? 0,
    },
    clouds: {
      all: current.cloud_cover ?? 0,
    },
    visibility: 10000,
    pop: safeGet(hourly.precipitation_probability, new Date().getHours()),
    dt: Date.now() / 1000,
    coord: {
      lat: cityInfo.lat,
      lon: cityInfo.lon,
    },
    forecast: {
      list: (hourly.time || []).map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        main: {
          temp: safeGet(hourly.temperature_2m, i),
          feels_like: safeGet(hourly.apparent_temperature, i),
          humidity: safeGet(hourly.relative_humidity_2m, i),
          temp_min: safeGet(daily.temperature_2m_min, Math.floor(i / 24)),
          temp_max: safeGet(daily.temperature_2m_max, Math.floor(i / 24)),
        },
        weather: [{
          id: safeGet(hourly.weather_code, i),
          main: getWeatherMain(safeGet(hourly.weather_code, i)),
          description: getWeatherDescription(safeGet(hourly.weather_code, i)),
          icon: getWeatherIcon(safeGet(hourly.weather_code, i)),
        }],
        wind: {
          speed: safeGet(hourly.wind_speed_10m, i),
          deg: safeGet(hourly.wind_direction_10m, i),
        },
        pop: safeGet(hourly.precipitation_probability, i),
        clouds: {
          all: safeGet(hourly.cloud_cover, i),
        },
      })).slice(0, 40),
      daily: (daily.time || []).map((t, i) => ({
        dt: new Date(t).getTime() / 1000,
        temp: {
          day: safeGet(daily.temperature_2m_max, i),
          night: safeGet(daily.temperature_2m_min, i),
          min: safeGet(daily.temperature_2m_min, i),
          max: safeGet(daily.temperature_2m_max, i),
        },
        weather: [{
          id: safeGet(daily.weather_code, i),
          main: getWeatherMain(safeGet(daily.weather_code, i)),
          description: getWeatherDescription(safeGet(daily.weather_code, i)),
          icon: getWeatherIcon(safeGet(daily.weather_code, i)),
        }],
        pop: safeGet(daily.precipitation_probability_max, i),
        sunrise: safeGet(daily.sunrise, i),
        sunset: safeGet(daily.sunset, i),
      })),
    },
    extra: {
      uvIndex: 0,
      visibility: 10000,
      dewPoint: (current.temperature_2m ?? 0) - ((100 - (current.relative_humidity_2m ?? 0)) / 5),
      isDay: current.is_day === 1,
    },
  };
};

const transformHistoricalData = (data) => {
  const hourly = data.hourly || {};
  const daily = data.daily || {};
  
  return {
    hourly: (hourly.time || []).map((t, i) => ({
      dt: new Date(t).getTime() / 1000,
      temp: safeGet(hourly.temperature_2m, i),
      humidity: safeGet(hourly.relative_humidity_2m, i),
      wind_speed: safeGet(hourly.wind_speed_10m, i),
      wind_deg: safeGet(hourly.wind_direction_10m, i),
      precipitation: safeGet(hourly.precipitation, i),
      clouds: safeGet(hourly.cloud_cover, i),
      weather_code: safeGet(hourly.weather_code, i),
    })),
    daily: daily.time?.[0] ? {
      temp_max: safeGet(daily.temperature_2m_max, 0),
      temp_min: safeGet(daily.temperature_2m_min, 0),
      weather_code: safeGet(daily.weather_code, 0),
      precipitation: safeGet(daily.precipitation_sum, 0),
      wind_max: safeGet(daily.wind_speed_10m_max, 0),
      sunrise: safeGet(daily.sunrise, 0),
      sunset: safeGet(daily.sunset, 0),
    } : null,
  };
};

const getWeatherMain = (code) => {
  const conditions = {
    0: 'Clear', 1: 'Clear', 2: 'Clouds', 3: 'Clouds',
    45: 'Fog', 48: 'Fog',
    51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
    56: 'Drizzle', 57: 'Drizzle',
    61: 'Rain', 63: 'Rain', 65: 'Rain',
    66: 'Rain', 67: 'Rain',
    71: 'Snow', 73: 'Snow', 75: 'Snow', 77: 'Snow',
    80: 'Rain', 81: 'Rain', 82: 'Rain',
    85: 'Snow', 86: 'Snow',
    95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm',
  };
  return conditions[code] || 'Clear';
};

const getWeatherDescription = (code) => {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    56: 'Light freezing drizzle', 57: 'Dense freezing drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snow', 73: 'Moderate snow', 75: 'Heavy snow', 77: 'Snow grains',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail',
  };
  return descriptions[code] || 'Clear';
};

const getWeatherIcon = (code) => {
  const icons = {
    0: '01d', 1: '01d', 2: '02d', 3: '03d',
    45: '50d', 48: '50d',
    51: '09d', 53: '09d', 55: '09d', 56: '09d', 57: '09d',
    61: '10d', 63: '10d', 65: '10d', 66: '10d', 67: '10d',
    71: '13d', 73: '13d', 75: '13d', 77: '13d',
    80: '09d', 81: '09d', 82: '09d', 85: '13d', 86: '13d',
    95: '11d', 96: '11d', 99: '11d',
  };
  return icons[code] || '01d';
};

export const getWeatherByCoords = async (lat, lon, units = 'metric') => {
  const cacheKey = `coords_${lat}_${lon}_${units}`;
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  try {
    const isImperial = units === 'imperial';
    const tempUnit = isImperial ? 'fahrenheit' : 'celsius';
    const windSpeedUnit = isImperial ? 'mph' : 'kmh';

    const response = await api.get(`${METEO_BASE_URL}${ENDPOINTS.CURRENT_WEATHER}`, {
      params: {
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m',
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,weather_code,cloud_cover,wind_speed_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: 7,
        temperature_unit: tempUnit,
        wind_speed_unit: windSpeedUnit,
      },
    });

    let cityName = 'Current Location';
    try {
      const geoResponse = await api.get(`${METEO_GEOCODING_URL}/search`, {
        params: {
          name: `${lat},${lon}`,
          count: 1,
          language: 'en',
        },
      });
      if (geoResponse.data.results?.[0]) {
        cityName = geoResponse.data.results[0].name;
      }
    } catch (e) {
      console.warn('Could not get city name:', e);
    }

    const transformedData = transformWeatherData(response.data, { 
      name: cityName, 
      country: '',
      lat, 
      lon 
    });
    setCachedData(cacheKey, transformedData);
    return transformedData;
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch weather data');
  }
};

export const getCityFromCoords = async (lat, lon) => {
  try {
    const response = await api.get(`${METEO_GEOCODING_URL}/search`, {
      params: {
        name: `${lat},${lon}`,
        count: 1,
        language: 'en',
      },
    });
    
    if (response.data.results && response.data.results.length > 0) {
      const city = response.data.results[0];
      return {
        name: city.name,
        country: city.country_code,
        lat: city.latitude,
        lon: city.longitude,
      };
    }
    
    return { name: 'Unknown Location', country: '' };
  } catch (error) {
    console.error('Reverse geocoding failed:', error);
    return { name: 'Unknown Location', country: '' };
  }
};

export default {
  getCurrentWeather,
  getForecast,
  getHistoricalWeather,
  searchCities,
  getWeatherByCoords,
  getCityFromCoords,
};
