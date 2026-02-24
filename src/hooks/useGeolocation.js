/**
 * WeatherGlass Dashboard - useGeolocation Hook
 * Custom hook for handling geolocation
 */

import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const err = new Error('Geolocation is not supported by your browser');
        setError(err.message);
        reject(err);
        return;
      }

      setLoading(true);
      setError(null);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          setLoading(false);
          resolve({ lat: latitude, lon: longitude });
        },
        (err) => {
          let errorMessage = 'Unable to retrieve your location';
          if (err.code === err.PERMISSION_DENIED) {
            errorMessage = 'Location permission denied. Please enable location access.';
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            errorMessage = 'Location information is unavailable.';
          } else if (err.code === err.TIMEOUT) {
            errorMessage = 'Location request timed out.';
          }
          setError(errorMessage);
          setLoading(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    });
  }, []);

  const clearLocation = useCallback(() => {
    setLocation(null);
    setError(null);
  }, []);

  return {
    location,
    error,
    loading,
    getLocation,
    clearLocation,
  };
};

export default useGeolocation;
