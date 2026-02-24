/**
 * WeatherGlass Dashboard - ForecastCard Component
 * Displays daily forecast information
 */

import React from 'react';
import { getWeatherIcon, isToday, getDayOfWeek } from '../../utils/helpers';
import { useWeather } from '../../context/WeatherContext';

const ForecastCard = ({ day, unit = 'day' }) => {
  const { temperatureUnit } = useWeather();
  
  if (!day) return null;

  const { dt, main, weather, pop } = day;
  const icon = getWeatherIcon(weather[0].icon);
  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';
  const dayName = isToday(dt) ? 'Today' : getDayOfWeek(dt);

  return (
    <div className="glass-card p-4 flex flex-col items-center min-w-[120px] hover:bg-white/10 transition-all hover:scale-105">
      <p className="text-sm font-medium text-white/70 mb-2">
        {dayName}
      </p>
      
      <div className="text-4xl mb-2 weather-icon">
        {icon === 'sun' ? '☀️' : 
         icon === 'cloud' ? '☁️' : 
         icon === 'cloud-rain' ? '🌧️' : 
         icon === 'cloud-sun' ? '⛅' : 
         icon === 'cloud-lightning' ? '⛈️' : 
         icon === 'snowflake' ? '❄️' : '☁️'}
      </div>
      
      <p className="text-lg font-semibold text-white mb-1">
        {Math.round(main.temp_max)}{unitSymbol}
      </p>
      
      <p className="text-sm text-white/50 mb-2">
        {Math.round(main.temp_min)}{unitSymbol}
      </p>
      
      {pop !== undefined && (
        <div className="w-full mt-2">
          <div className="flex items-center gap-1 text-xs text-cyan-400">
            <span>💧</span>
            <span>{Math.round(pop * 100)}%</span>
          </div>
        </div>
      )}
      
      <p className="text-xs text-white/50 capitalize mt-1 text-center truncate w-full">
        {weather[0].description}
      </p>
    </div>
  );
};

export default ForecastCard;
