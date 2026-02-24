/**
 * WeatherGlass Dashboard - History Page
 * Historical weather data view
 */

import React from 'react';
import SearchBar from '../components/weather/SearchBar';
import HistoricalWeather from '../components/history/HistoricalWeather';
import Loader from '../components/common/Loader';
import ErrorState from '../components/common/ErrorState';
import { useWeather } from '../context/WeatherContext';

const History = () => {
  const { loading, error, weather, refreshWeather } = useWeather();

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
      {!loading && !error && (
        <div className="animate-fade-in">
          <HistoricalWeather />
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !weather && (
        <div className="glass-card p-12 text-center">
          <div className="text-6xl mb-4">📜</div>
          <h2 className="text-2xl font-heading font-semibold text-white mb-2">
            Historical Weather
          </h2>
          <p className="text-white/60 max-w-md mx-auto">
            Search for a city to view historical weather data for the past 5 days.
          </p>
        </div>
      )}
    </div>
  );
};

export default History;
