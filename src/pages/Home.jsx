/**
 * WeatherGlass Dashboard - Home Page
 * Main weather dashboard with current weather and forecast
 */

import React from 'react';
import SearchBar from '../components/weather/SearchBar';
import CurrentWeather from '../components/weather/CurrentWeather';
import HourlyForecast from '../components/weather/HourlyForecast';
import ForecastCard from '../components/weather/ForecastCard';
import AdvancedMetrics from '../components/weather/AdvancedMetrics';
import TemperatureChart from '../components/charts/TemperatureChart';
import RainChart from '../components/charts/RainChart';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import { useWeather } from '../context/WeatherContext';
import { groupForecastByDay, getDayTemperatureRange, getDayCommonCondition } from '../utils/helpers';

const Home = () => {
  const { loading, error, weather, forecast, refreshWeather } = useWeather();

  // Get daily forecast from 5-day forecast data
  const getDailyForecast = () => {
    if (!forecast?.list) return [];
    
    const grouped = groupForecastByDay(forecast.list);
    const dailyData = Object.entries(grouped).slice(1, 6); // Skip today, get next 5 days
    
    return dailyData.map(([date, data]) => ({
      date,
      ...getDayTemperatureRange(data),
      ...getDayCommonCondition(data),
      pop: data.reduce((sum, item) => sum + (item.pop || 0), 0) / data.length,
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
      {loading && <Loader type="spinner" message="Fetching weather data..." />}

      {/* Main Content */}
      {!loading && !error && weather && (
        <div className="space-y-6 animate-fade-in">
          {/* Current Weather */}
          <CurrentWeather />

          {/* Hourly Forecast */}
          <HourlyForecast />

          {/* 5-Day Forecast */}
          {dailyForecast.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-xl font-heading font-semibold text-white mb-4">
                5-Day Forecast
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
                {dailyForecast.map((day, index) => (
                  <ForecastCard 
                    key={index} 
                    day={{
                      dt: new Date(day.date).getTime() / 1000,
                      main: { temp_max: day.max, temp_min: day.min },
                      weather: [{ icon: day.icon, description: day.description }],
                      pop: day.pop
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TemperatureChart />
            <RainChart />
          </div>

          {/* Advanced Metrics */}
          <AdvancedMetrics />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !weather && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">🌤️</div>
          <h2 className="text-2xl font-heading font-semibold text-white mb-2">
            Welcome to WeatherGlass
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Search for a city to get started, or use your current location to see local weather.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
