/**
 * WeatherGlass Dashboard - HourlyForecast Component
 * Displays hourly forecast with horizontal scroll
 */

import React from 'react';
import { useWeather } from '../../context/WeatherContext';
import { getWeatherIcon, timestampToTime } from '../../utils/helpers';

const HourlyForecast = () => {
  const { forecast, temperatureUnit, loading } = useWeather();

  if (!forecast || loading) {
    return null;
  }

  // Get next 24 hours (8 items * 3 hours each)
  const hourlyData = forecast.list.slice(0, 8);
  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-xl font-heading font-semibold text-white mb-4">
        Hourly Forecast
      </h3>
      
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {hourlyData.map((item, index) => {
          const icon = getWeatherIcon(item.weather[0].icon);
          return (
            <div 
              key={index}
              className="flex-shrink-0 bg-white/5 rounded-xl p-4 min-w-[80px] text-center hover:bg-white/10 transition-colors"
            >
              <p className="text-sm text-white/60 mb-2">
                {timestampToTime(item.dt)}
              </p>
              
              <div className="text-3xl mb-2 weather-icon">
                {icon === 'sun' ? '☀️' : 
                 icon === 'cloud' ? '☁️' : 
                 icon === 'cloud-rain' ? '🌧️' : 
                 icon === 'cloud-sun' ? '⛅' : 
                 icon === 'cloud-lightning' ? '⛈️' : 
                 icon === 'snowflake' ? '❄️' : '☁️'}
              </div>
              
              <p className="text-lg font-semibold text-white">
                {Math.round(item.main.temp)}{unitSymbol}
              </p>
              
              {item.pop > 0 && (
                <div className="mt-2 flex items-center justify-center gap-1 text-xs text-cyan-400">
                  <span>💧</span>
                  <span>{Math.round(item.pop * 100)}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HourlyForecast;
