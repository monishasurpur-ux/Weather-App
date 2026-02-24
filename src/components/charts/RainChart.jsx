/**
 * WeatherGlass Dashboard - RainChart Component
 * Bar chart showing rain probability
 */

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useWeather } from '../../context/WeatherContext';

const RainChart = () => {
  const { forecast, temperatureUnit, loading } = useWeather();

  if (!forecast || loading) {
    return null;
  }

  // Prepare data for chart
  const chartData = forecast.list.slice(0, 12).map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }),
    pop: Math.round(item.pop * 100), // Probability of precipitation
    humidity: item.main.humidity,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-white/70 text-sm mb-1">{label}</p>
          <p className="text-cyan-400 font-semibold">
            Rain: {payload[0].value}%
          </p>
          {payload[1] && (
            <p className="text-blue-300 text-sm">
              Humidity: {payload[1].value}%
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 animate-slide-up">
      <h3 className="text-xl font-heading font-semibold text-white mb-4">
        Rain & Humidity
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval={2}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              domain={[0, 100]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pop" radius={[4, 4, 0, 0]} maxBarSize={30}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.pop > 50 ? '#3b82f6' : '#60a5fa'} 
                  opacity={0.8}
                />
              ))}
            </Bar>
            <Bar dataKey="humidity" radius={[4, 4, 0, 0]} maxBarSize={30}>
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill="#06b6d4" 
                  opacity={0.4}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-400"></div>
          <span className="text-sm text-white/60">Rain Probability</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-cyan-400 opacity-40"></div>
          <span className="text-sm text-white/60">Humidity</span>
        </div>
      </div>
    </div>
  );
};

export default RainChart;
