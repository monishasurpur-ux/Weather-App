/**
 * WeatherGlass Dashboard - Favorites Page
 * Saved favorite cities
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Trash2, Plus, MapPin, Cloud } from 'lucide-react';
import SearchBar from '../components/weather/SearchBar';
import { useWeather } from '../context/WeatherContext';

const Favorites = () => {
  const { favorites, removeFavorite, setCity, weather } = useWeather();

  const handleCityClick = (cityName) => {
    setCity(cityName);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="pt-4">
        <SearchBar />
      </div>

      {/* Page Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <Star className="w-6 h-6 text-yellow-400 fill-current" />
          <h1 className="text-2xl font-heading font-bold text-white">
            Favorite Cities
          </h1>
        </div>
        <p className="text-white/60">
          Your saved cities for quick access to weather information.
        </p>
      </div>

      {/* Favorites Grid */}
      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((city, index) => (
            <FavoriteCard 
              key={index} 
              city={city} 
              onRemove={removeFavorite}
              onClick={handleCityClick}
              isActive={weather?.name === city.name}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Current Weather for Active City */}
      {weather && favorites.some(f => f.name === weather.name) && (
        <div className="glass-card p-6 mt-6">
          <h3 className="text-lg font-heading font-semibold text-white mb-4">
            Current Weather - {weather.name}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-white/50 uppercase">Temperature</p>
              <p className="text-2xl font-semibold text-white">
                {Math.round(weather.main.temp)}°C
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-white/50 uppercase">Humidity</p>
              <p className="text-2xl font-semibold text-white">
                {weather.main.humidity}%
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-white/50 uppercase">Wind</p>
              <p className="text-2xl font-semibold text-white">
                {Math.round(weather.wind.speed)} m/s
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-4">
              <p className="text-xs text-white/50 uppercase">Condition</p>
              <p className="text-lg font-semibold text-white capitalize">
                {weather.weather[0].description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Favorite Card Component
const FavoriteCard = ({ city, onRemove, onClick, isActive }) => {
  return (
    <div className={`glass-card p-6 transition-all hover:scale-[1.02] ${isActive ? 'ring-2 ring-cyan-400' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <button 
          onClick={() => onClick(city.name)}
          className="flex items-center gap-2 text-left group"
        >
          <MapPin className="w-5 h-5 text-cyan-400" />
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-cyan-400 transition-colors">
              {city.name}
            </h3>
            <p className="text-sm text-white/50">{city.country}</p>
          </div>
        </button>
        
        <button
          onClick={() => onRemove(city.name)}
          className="p-2 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
          title="Remove from favorites"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={() => onClick(city.name)}
        className="w-full glass-btn text-sm"
      >
        View Weather
      </button>
    </div>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="glass-card p-12 text-center">
    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
      <Star className="w-10 h-10 text-white/30" />
    </div>
    <h2 className="text-xl font-heading font-semibold text-white mb-2">
      No Favorite Cities
    </h2>
    <p className="text-white/60 max-w-md mx-auto mb-6">
      Add cities to your favorites by clicking the star icon on any weather card. 
      This allows you to quickly access weather information for your favorite locations.
    </p>
    <Link to="/" className="glass-btn primary inline-flex items-center gap-2">
      <Plus className="w-4 h-4" />
      Search for a City
    </Link>
  </div>
);

export default Favorites;
