/**
 * WeatherGlass Dashboard - HistoricalWeather Component
 * Displays historical weather data for selected date
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getHistoricalWeather } from '../../services/weatherApi';
import { useWeather } from '../../context/WeatherContext';
import DatePicker from './DatePicker';
import Loader from '../common/Loader';
import ErrorState from '../common/ErrorState';

const HistoricalWeather = () => {
  const { weather, temperatureUnit, currentCity } = useWeather();
  const [selectedDate, setSelectedDate] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';

  useEffect(() => {
    if (selectedDate && weather?.coord) {
      fetchHistoricalData();
    }
  }, [selectedDate, weather?.coord]);

  const fetchHistoricalData = async () => {
    if (!weather?.coord || !selectedDate) return;

    setLoading(true);
    setError(null);

    try {
      const timestamp = Math.floor(new Date(selectedDate).getTime() / 1000);
      const data = await getHistoricalWeather(
        weather.coord.lat,
        weather.coord.lon,
        timestamp,
        temperatureUnit
      );
      setHistoricalData(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch historical data');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  if (!weather) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-white/60">Search for a city to view historical weather</p>
      </div>
    );
  }

  // Prepare chart data
  const chartData = historicalData?.hourly?.map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }),
    temp: Math.round(item.temp),
    humidity: item.humidity,
    wind_speed: Math.round(item.wind_speed),
  })) || [];

  return (
    <div className="space-y-6">
      <DatePicker onDateSelect={handleDateSelect} />

      {loading && <Loader message="Fetching historical data..." />}

      {error && <ErrorState message={error} onRetry={fetchHistoricalData} />}

      {historicalData && !loading && (
        <>
          {/* Historical Stats */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-heading font-semibold text-white mb-4">
              Historical Weather - {selectedDate}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard 
                label="Avg Temperature" 
                value={`${Math.round(historicalData.hourly?.reduce((a, b) => a + b.temp, 0) / (historicalData.hourly?.length || 1))}${unitSymbol}`} 
              />
              <StatCard 
                label="Avg Humidity" 
                value={`${Math.round(historicalData.hourly?.reduce((a, b) => a + b.humidity, 0) / (historicalData.hourly?.length || 1))}%`} 
              />
              <StatCard 
                label="Max Temperature" 
                value={`${Math.round(Math.max(...(historicalData.hourly?.map(h => h.temp) || [0])))}${unitSymbol}`} 
              />
              <StatCard 
                label="Min Temperature" 
                value={`${Math.round(Math.min(...(historicalData.hourly?.map(h => h.temp) || [0])))}${unitSymbol}`} 
              />
            </div>
          </div>

          {/* Temperature Chart */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-heading font-semibold text-white mb-4">
              Temperature History
            </h3>
            
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
                    tickLine={false}
                    interval={3}
                  />
                  <YAxis 
                    stroke="rgba(255,255,255,0.5)" 
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'rgba(255,255,255,0.1)', 
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '12px'
                    }}
                    labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="temp" 
                    stroke="#00d4ff" 
                    strokeWidth={3}
                    dot={false}
                    activeDot={{ r: 6, fill: '#00d4ff', stroke: '#fff', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-white/5 rounded-xl p-4">
    <p className="text-xs text-white/50 uppercase tracking-wide mb-1">{label}</p>
    <p className="text-2xl font-semibold text-white">{value}</p>
  </div>
);

export default HistoricalWeather;
