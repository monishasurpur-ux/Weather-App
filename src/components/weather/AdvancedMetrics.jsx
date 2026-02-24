/**
 * WeatherGlass Dashboard - AdvancedMetrics Component
 * Displays advanced weather data like UV index, cloud coverage, etc.
 */

import React from 'react';
import { 
  Sun, 
  Cloud, 
  Droplets, 
  Wind, 
  Eye,
  Compass
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';
import { getUVCategory, getWindDirection } from '../../utils/helpers';

const AdvancedMetrics = () => {
  const { oneCallData, weather, loading } = useWeather();

  if (!weather || loading) {
    return null;
  }

  const { main, wind, visibility, clouds, name } = weather;
  
  // Use oneCallData if available, otherwise use basic data
  const uvIndex = oneCallData?.current?.uvi || 0;
  const uvCategory = getUVCategory(uvIndex);
  const dewPoint = main.temp - ((100 - main.humidity) / 5); // Approximate dew point
  const windDir = wind.deg ? getWindDirection(wind.deg) : 'N/A';

  const unitSymbol = '°C';
  const speedUnit = 'm/s';

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-xl font-heading font-semibold text-white mb-4">
        Advanced Metrics
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* UV Index */}
        <MetricCard
          icon={<Sun className="w-5 h-5 text-yellow-400" />}
          label="UV Index"
          value={uvIndex.toFixed(1)}
          subValue={uvCategory.label}
          colorClass={uvCategory.color}
        />
        
        {/* Cloud Coverage */}
        <MetricCard
          icon={<Cloud className="w-5 h-5 text-gray-400" />}
          label="Cloud Coverage"
          value={`${clouds?.all || 0}%`}
        />
        
        {/* Dew Point */}
        <MetricCard
          icon={<Droplets className="w-5 h-5 text-cyan-400" />}
          label="Dew Point"
          value={`${Math.round(dewPoint)}${unitSymbol}`}
        />
        
        {/* Wind Direction */}
        <MetricCard
          icon={<Compass className="w-5 h-5 text-cyan-400" />}
          label="Wind Direction"
          value={windDir}
          subValue={wind.deg ? `${wind.deg}°` : ''}
        />
        
        {/* Visibility */}
        <MetricCard
          icon={<Eye className="w-5 h-5 text-white/70" />}
          label="Visibility"
          value={`${(visibility / 1000).toFixed(1)} km`}
        />
        
        {/* Ground Level Pressure */}
        <MetricCard
          icon={<Wind className="w-5 h-5 text-cyan-400" />}
          label="Sea Level"
          value={`${main.sea_level || main.pressure} hPa`}
        />
      </div>

      {/* UV Index Bar */}
      <div className="mt-6 p-4 bg-white/5 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white/60">UV Index Scale</span>
          <span className="text-xs text-white/40">0 - 11+</span>
        </div>
        <div className="h-3 rounded-full overflow-hidden flex">
          <div className="flex-1 bg-gradient-to-r from-green-400 to-green-500"></div>
          <div className="flex-1 bg-gradient-to-r from-green-500 to-yellow-400"></div>
          <div className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400"></div>
          <div className="flex-1 bg-gradient-to-r from-orange-400 to-red-400"></div>
          <div className="flex-1 bg-gradient-to-r from-red-400 to-purple-500"></div>
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-green-400">Low</span>
          <span className="text-xs text-yellow-400">Moderate</span>
          <span className="text-xs text-orange-400">High</span>
          <span className="text-xs text-red-400">Very High</span>
          <span className="text-xs text-purple-400">Extreme</span>
        </div>
      </div>
    </div>
  );
};

// Metric Card Component
const MetricCard = ({ icon, label, value, subValue, colorClass }) => (
  <div className="bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      {icon}
      <span className="text-xs text-white/50 uppercase tracking-wide">{label}</span>
    </div>
    <div className="flex items-baseline gap-2">
      <span className="text-2xl font-semibold text-white">{value}</span>
      {subValue && (
        <span className={`text-sm ${colorClass ? `${colorClass} px-2 py-0.5 rounded-full` : 'text-white/60'}`}>
          {subValue}
        </span>
      )}
    </div>
  </div>
);

export default AdvancedMetrics;
