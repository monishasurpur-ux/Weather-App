/**
 * WeatherGlass Dashboard - Weather Context
 * Global state management for weather data
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getCurrentWeather, getForecast } from '../services/weatherApi';
import { DEFAULT_CITY, STORAGE_KEYS } from '../utils/constants';

// Initial state
const initialState = {
  currentCity: '', // Start empty - no weather until user searches
  weather: null,
  forecast: null,
  oneCallData: null,
  favorites: [],
  recentSearches: [],
  temperatureUnit: 'metric', // 'metric' or 'imperial'
  loading: false, // Start with false - no loading until user searches
  error: null,
  locationLoading: false,
};

// Action types
const ActionTypes = {
  SET_CITY: 'SET_CITY',
  SET_WEATHER: 'SET_WEATHER',
  SET_FORECAST: 'SET_FORECAST',
  SET_ONECALL_DATA: 'SET_ONECALL_DATA',
  SET_FAVORITES: 'SET_FAVORITES',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  SET_RECENT_SEARCHES: 'SET_RECENT_SEARCHES',
  ADD_RECENT_SEARCH: 'ADD_RECENT_SEARCH',
  SET_TEMPERATURE_UNIT: 'SET_TEMPERATURE_UNIT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_LOCATION_LOADING: 'SET_LOCATION_LOADING',
};

// Reducer function
const weatherReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CITY:
      return { ...state, currentCity: action.payload };
    
    case ActionTypes.SET_WEATHER:
      return { ...state, weather: action.payload, error: null };
    
    case ActionTypes.SET_FORECAST:
      return { ...state, forecast: action.payload };
    
    case ActionTypes.SET_ONECALL_DATA:
      return { ...state, oneCallData: action.payload };
    
    case ActionTypes.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    
    case ActionTypes.ADD_FAVORITE:
      if (state.favorites.find(f => f.name === action.payload.name)) {
        return state;
      }
      return { 
        ...state, 
        favorites: [...state.favorites, action.payload].slice(0, 10) 
      };
    
    case ActionTypes.REMOVE_FAVORITE:
      return { 
        ...state, 
        favorites: state.favorites.filter(f => f.name !== action.payload) 
      };
    
    case ActionTypes.SET_RECENT_SEARCHES:
      return { ...state, recentSearches: action.payload };
    
    case ActionTypes.ADD_RECENT_SEARCH:
      const filtered = state.recentSearches.filter(s => s.name !== action.payload.name);
      return { 
        ...state, 
        recentSearches: [action.payload, ...filtered].slice(0, 5) 
      };
    
    case ActionTypes.SET_TEMPERATURE_UNIT:
      return { ...state, temperatureUnit: action.payload };
    
    case ActionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ActionTypes.SET_LOCATION_LOADING:
      return { ...state, locationLoading: action.payload };
    
    default:
      return state;
  }
};

// Create context
const WeatherContext = createContext();

// Provider component
export const WeatherProvider = ({ children }) => {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Load data from localStorage on mount (except city - wait for user to search)
  useEffect(() => {
    const loadStoredData = () => {
      try {
        const favorites = JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITES)) || [];
        const recentSearches = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES)) || [];
        const tempUnit = localStorage.getItem(STORAGE_KEYS.TEMP_UNIT) || 'metric';

        dispatch({ type: ActionTypes.SET_FAVORITES, payload: favorites });
        dispatch({ type: ActionTypes.SET_RECENT_SEARCHES, payload: recentSearches });
        dispatch({ type: ActionTypes.SET_TEMPERATURE_UNIT, payload: tempUnit });
        // NOTE: We don't auto-load last city - wait for user to search
      } catch (error) {
        console.error('Error loading stored data:', error);
      }
    };

    loadStoredData();
  }, []);

  // Save favorites to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
  }, [state.favorites]);

  // Save recent searches to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(state.recentSearches));
  }, [state.recentSearches]);

  // Save temperature unit to localStorage when changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TEMP_UNIT, state.temperatureUnit);
  }, [state.temperatureUnit]);

  // Save last city to localStorage when changed (only if not empty)
  useEffect(() => {
    if (state.currentCity) {
      localStorage.setItem(STORAGE_KEYS.LAST_CITY, state.currentCity);
    }
  }, [state.currentCity]);

  // Fetch weather data function
  const fetchWeatherData = async (city, units) => {
    console.log('Fetching weather for:', city, 'with units:', units);
    dispatch({ type: ActionTypes.SET_LOADING, payload: true });
    dispatch({ type: ActionTypes.SET_ERROR, payload: null });

    try {
      const weatherData = await getCurrentWeather(city, units);
      console.log('Weather data received:', weatherData);
      dispatch({ type: ActionTypes.SET_WEATHER, payload: weatherData });

      // Add to recent searches
      dispatch({ 
        type: ActionTypes.ADD_RECENT_SEARCH, 
        payload: { name: weatherData.name, country: weatherData.sys.country } 
      });

      // Fetch forecast
      const forecastData = await getForecast(city, units);
      dispatch({ type: ActionTypes.SET_FORECAST, payload: forecastData });

      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      console.error('Error fetching weather:', error);
      dispatch({ type: ActionTypes.SET_ERROR, payload: error.message });
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  // Fetch weather data when city changes (but not on initial empty state)
  useEffect(() => {
    if (state.currentCity && state.currentCity.trim() !== '') {
      fetchWeatherData(state.currentCity, state.temperatureUnit);
    }
  }, [state.currentCity, state.temperatureUnit]);

  // Action functions
  const setCity = (city) => {
    dispatch({ type: ActionTypes.SET_CITY, payload: city });
  };

  const addFavorite = (city) => {
    dispatch({ type: ActionTypes.ADD_FAVORITE, payload: city });
  };

  const removeFavorite = (cityName) => {
    dispatch({ type: ActionTypes.REMOVE_FAVORITE, payload: cityName });
  };

  const toggleTemperatureUnit = () => {
    const newUnit = state.temperatureUnit === 'metric' ? 'imperial' : 'metric';
    dispatch({ type: ActionTypes.SET_TEMPERATURE_UNIT, payload: newUnit });
  };

  const refreshWeather = () => {
    if (state.currentCity) {
      fetchWeatherData(state.currentCity);
    }
  };

  const isFavorite = (cityName) => {
    return state.favorites.some(f => f.name === cityName);
  };

  // Value object
  const value = {
    ...state,
    setCity,
    addFavorite,
    removeFavorite,
    toggleTemperatureUnit,
    refreshWeather,
    fetchWeatherData,
    isFavorite,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
};

// Custom hook to use weather context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherContext;
