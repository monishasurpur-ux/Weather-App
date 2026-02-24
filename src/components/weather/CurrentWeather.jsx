/**
 * WeatherGlass Dashboard - CurrentWeather Component
 * Displays current weather with detailed metrics
 */

import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Gauge, 
  Eye, 
  Sunrise, 
  Sunset,
  Star,
  MapPin,
  RefreshCw
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon, getWindDirection } from '../../utils/helpers';

// Weather icon component using Lucide
const WeatherIcon = ({ icon, size = 'lg' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-32 h-32'
  };

  const iconMap = {
    sun: '☀️',
    moon: '🌙',
    cloud: '☁️',
    clouds: '☁️',
    'cloud-sun': '⛅',
    'cloud-moon': '☁️',
    'cloud-rain': '🌧️',
    'cloud-drizzle': '🌦️',
    'cloud-lightning': '⛈️',
    snowflake: '❄️',
    wind: '💨'
  };

  return (
    <span className={`${sizeClasses[size]} flex items-center justify-center text-4xl`}>
      {iconMap[icon] || '☁️'}
    </span>
  );
};

const CurrentWeather = () => {
  const { 
    weather, 
    temperatureUnit, 
    loading, 
    refreshWeather,
    isFavorite,
    addFavorite,
    removeFavorite
  } = useWeather();

  if (!weather || loading) {
    return null;
  }

  const { main, weather: weatherData, wind, visibility, sys, name } = weather;
  const condition = weatherData[0];
  const icon = getWeatherIcon(condition.icon);
  const windDir = getWindDirection(wind.deg);
  
  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
  const speedUnit = temperatureUnit === 'metric' ? 'm/s' : 'mph';

  const handleFavoriteToggle = () => {
    if (isFavorite(name)) {
      removeFavorite(name);
    } else {
      addFavorite({ name, country: sys.country });
    }
  };

  // Format sunrise/sunset
  const formatTime = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-6xl md:text-8xl weather-icon">
            <WeatherIcon icon={icon} size="xl" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-white">
                {name}
              </h1>
              <span className="text-lg text-white/60">{sys.country}</span>
            </div>
            <p className="text-lg text-white/70 capitalize mt-1">
              {condition.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={refreshWeather}
            className="glass-btn p-2"
            title="Refresh weather"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleFavoriteToggle}
            className={`glass-btn p-2 ${isFavorite(name) ? 'text-yellow-400' : ''}`}
            title={isFavorite(name) ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Star className={`w-5 h-5 ${isFavorite(name) ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Temperature */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="temp-large">
            {Math.round(main.temp)}
            <span className="text-4xl ml-1">{unitSymbol}</span>
          </div>
          <p className="text-white/60 mt-2 flex items-center gap-2">
            <Thermometer className="w-4 h-4" />
            Feels like {Math.round(main.feels_like)}{unitSymbol}
          </p>
        </div>

        <div className="text-right">
          <p className="text-2xl font-heading font-semibold">
            H: {Math.round(main.temp_max)}{unitSymbol}
          </p>
          <p className="text-lg text-white/60">
            L: {Math.round(main.temp_min)}{unitSymbol}
          </p>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          icon={<Droplets className="w-5 h-5 text-cyan-400" />}
          label="Humidity"
          value={`${main.humidity}%`}
        />
        <MetricCard 
          icon={<Wind className="w-5 h-5 text-cyan-400" />}
          label="Wind"
          value={`${Math.round(wind.speed)} ${speedUnit} ${windDir}`}
        />
        <MetricCard 
          icon={<Gauge className="w-5 h-5 text-cyan-400" />}
          label="Pressure"
          value={`${main.pressure} hPa`}
        />
        <MetricCard 
          icon={<Eye className="w-5 h-5 text-cyan-400" />}
          label="Visibility"
          value={`${(visibility / 1000).toFixed(1)} km`}
        />
        <MetricCard 
          icon={<Sunrise className="w-5 h-5 text-yellow-400" />}
          label="Sunrise"
          value={formatTime(sys.sunrise)}
        />
        <MetricCard 
          icon={<Sunset className="w-5 h-5 text-orange-400" />}
          label="Sunset"
          value={formatTime(sys.sunset)}
        />
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value }) => (
  <div className="glass-card p-4 flex items-center gap-3 hover:bg-white/10 transition-colors">
    <div className="flex-shrink-0">
      {icon}
    </div>
    <div>
      <p className="text-xs text-white/50 uppercase tracking-wide">{label}</p>
      <p className="text-lg font-semibold text-white">{value}</p>
    </div>
  </div>
);

export default CurrentWeather;
