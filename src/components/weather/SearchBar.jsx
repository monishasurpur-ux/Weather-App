/**
 * WeatherGlass Dashboard - SearchBar Component
 * City search with autocomplete and geolocation
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Clock, Navigation } from 'lucide-react';
import { searchCities, getWeatherByCoords, getCityFromCoords } from '../../services/weatherApi';
import { useWeather } from '../../context/WeatherContext';
import { debounce } from '../../utils/helpers';
import useGeolocation from '../../hooks/useGeolocation';

const SearchBar = () => {
  const { setCity, recentSearches } = useWeather();
  const { getLocation, loading: locationLoading, error: locationError } = useGeolocation();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  // Debounced search
  const debouncedSearch = useRef(
    debounce(async (searchQuery) => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const results = await searchCities(searchQuery);
        setSuggestions(results);
        setError(null);
      } catch (err) {
        setError('Failed to search cities');
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
    setShowSuggestions(true);
  };

  // Handle city selection
  const handleSelectCity = (city) => {
    setQuery(city.name);
    setCity(city.name);
    setShowSuggestions(false);
    setSuggestions([]);
    inputRef.current?.blur();
  };

  // Handle recent search selection
  const handleSelectRecent = (search) => {
    setQuery(search.name);
    setCity(search.name);
    setShowSuggestions(false);
    inputRef.current?.blur();
  };

  // Handle geolocation
  const handleGeolocation = async () => {
    try {
      const coords = await getLocation();
      const cityData = await getCityFromCoords(coords.lat, coords.lon);
      setQuery(cityData.name);
      setCity(cityData.name);
    } catch (err) {
      console.error('Geolocation error:', err);
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setCity(query.trim());
      setShowSuggestions(false);
      inputRef.current?.blur();
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search
  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          {/* Search Icon */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin" />
            ) : (
              <Search className="w-5 h-5 text-white/50" />
            )}
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search for a city..."
            className="w-full glass-input pl-12 pr-24 py-4 text-lg"
            autoComplete="off"
          />

          {/* Right Actions */}
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {query && (
              <button
                type="button"
                onClick={handleClear}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/50" />
              </button>
            )}
            
            <button
              type="button"
              onClick={handleGeolocation}
              disabled={locationLoading}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50"
              title="Use my location"
            >
              {locationLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-cyan-400 rounded-full animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-cyan-400" />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (suggestions.length > 0 || recentSearches.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-card overflow-hidden z-50">
          {/* Search Results */}
          {suggestions.length > 0 && (
            <div className="py-2">
              {suggestions.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCity(city)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span className="text-white">
                    {city.name}
                    {city.state && <span className="text-white/50">, {city.state}</span>}
                    <span className="text-white/50">, {city.country}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {suggestions.length === 0 && recentSearches.length > 0 && (
            <div className="py-2 border-t border-white/10">
              <div className="px-4 py-2 text-xs text-white/50 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectRecent(search)}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                >
                  <Clock className="w-4 h-4 text-white/50 flex-shrink-0" />
                  <span className="text-white">
                    {search.name}
                    <span className="text-white/50">, {search.country}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
