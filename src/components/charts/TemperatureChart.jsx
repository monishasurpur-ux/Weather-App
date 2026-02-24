/**
 * WeatherGlass Dashboard - TemperatureChart Component
 * Line chart showing temperature forecast
 */

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { useWeather } from '../../context/WeatherContext';

const TemperatureChart = () => {
  const { forecast, temperatureUnit, loading } = useWeather();

  if (!forecast || loading) {
    return null;
  }

  const unitSymbol = temperatureUnit === 'metric' ? '°C' : '°F';

  // Prepare data for chart
  const chartData = forecast.list.map((item) => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    }),
    temp: Math.round(item.main.temp),
    feels_like: Math.round(item.main.feels_like),
    temp_min: Math.round(item.main.temp_min),
    temp_max: Math.round(item.main.temp_max),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3">
          <p className="text-white/70 text-sm mb-1">{label}</p>
          <p className="text-cyan-400 font-semibold">
            Temp: {payload[0].value}{unitSymbol}
          </p>
          {payload[1] && (
            <p className="text-white/50 text-sm">
              Feels: {payload[1].value}{unitSymbol}
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
        Temperature Forecast
      </h3>
      
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              interval={2}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              domain={['dataMin - 5', 'dataMax + 5']}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#00d4ff"
              strokeWidth={3}
              fill="url(#tempGradient)"
              dot={false}
              activeDot={{ r: 6, fill: '#00d4ff', stroke: '#fff', strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="feels_like"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
          <span className="text-sm text-white/60">Temperature</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white/50"></div>
          <span className="text-sm text-white/60">Feels Like</span>
        </div>
      </div>
    </div>
  );
};

export default TemperatureChart;
