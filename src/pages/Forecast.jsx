/**
 * WeatherGlass Dashboard - Forecast Page
 * Detailed forecast view with charts
 */

import React from 'react';
import SearchBar from '../components/weather/SearchBar';
import ForecastCard from '../components/weather/ForecastCard';
import HourlyForecast from '../components/weather/HourlyForecast';
import TemperatureChart from '../components/charts/TemperatureChart';
import RainChart from '../components/charts/RainChart';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import { useWeather } from '../context/WeatherContext';
import { groupForecastByDay, getDayTemperatureRange, getDayCommonCondition, getAverageRainProbability } from '../utils/helpers';

const Forecast = () => {
  const { loading, error, weather, forecast, refreshWeather } = useWeather();

  // Get daily forecast
  const getDailyForecast = () => {
    if (!forecast?.list) return [];
    
    const grouped = groupForecastByDay(forecast.list);
    const dailyData = Object.entries(grouped);
    
    return dailyData.map(([date, data]) => ({
      date,
      dt: new Date(date).getTime() / 1000,
      ...getDayTemperatureRange(data),
      ...getDayCommonCondition(data),
      pop: getAverageRainProbability(data),
      humidity: Math.round(data.reduce((sum, item) => sum + item.main.humidity, 0) / data.length),
      pressure: Math.round(data.reduce((sum, item) => sum + item.main.pressure, 0) / data.length),
    }));
  };

  const dailyForecast = getDailyForecast();

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="pt-4">
        <SearchBar />
      </div>

      {/* Error State */}
      {error && (
        <ErrorState 
          message={error} 
          onRetry={refreshWeather} 
        />
      )}

      {/* Loading State */}
      {loading && <Loader />}

      {/* Main Content */}
      {!loading && !error && weather && (
        <div className="space-y-6 animate-fade-in">
          {/* Hourly Forecast */}
          <HourlyForecast />

          {/* Temperature Chart */}
          <TemperatureChart />

          {/* Rain Chart */}
          <RainChart />

          {/* Daily Forecast */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-heading font-semibold text-white mb-4">
              Daily Forecast
            </h3>
            
            <div className="space-y-3">
              {dailyForecast.map((day, index) => (
                <DailyForecastRow key={index} day={day} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !weather && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-heading font-semibold text-white mb-2">
            5-Day Forecast
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Search for a city to view detailed forecast information.
          </p>
        </div>
      )}
    </div>
  );
};

// Daily Forecast Row Component
const DailyForecastRow = ({ day }) => {
  const { temperatureUnit } = useWeather();
  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';

  const dayName = new Date(day.date).toLocaleDateString('en-US', { 
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  const iconMap = {
    sun: '☀️',
    cloud: '☁️',
    'cloud-rain': '🌧️',
    'cloud-sun': '⛅',
    'cloud-lightning': '⛈️',
    snowflake: '❄️',
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
      <div className="flex-1">
        <p className="text-white font-medium">{dayName}</p>
        <p className="text-sm text-white/50 capitalize">{day.description}</p>
      </div>
      
      <div className="text-3xl">
        {iconMap[day.icon] || '☁️'}
      </div>
      
      <div className="flex items-center gap-3 min-w-[120px]">
        <div className="flex items-center gap-1 text-cyan-400">
          <span className="text-lg">{Math.round(day.pop * 100)}%</span>
          <span className="text-xs">💧</span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 min-w-[100px] justify-end">
        <span className="text-white font-semibold">
          {Math.round(day.max)}{unitSymbol}
        </span>
        <span className="text-white/50">
          {Math.round(day.min)}{unitSymbol}
        </span>
      </div>
    </div>
  );
};

export default Forecast;
