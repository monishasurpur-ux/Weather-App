/**
 * WeatherGlass Dashboard - DatePicker Component
 * Date picker for historical weather selection
 */

import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ onDateSelect, maxDaysBack = 5 }) => {
  const [selectedDate, setSelectedDate] = useState('');

  // Calculate date range (today to maxDaysBack days ago)
  const today = new Date();
  const minDate = new Date(today);
  minDate.setDate(today.getDate() - maxDaysBack);
  
  const minDateStr = minDate.toISOString().split('T')[0];
  const maxDateStr = today.toISOString().split('T')[0];

  const handleChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Generate quick select dates
  const quickDates = [];
  for (let i = 0; i < maxDaysBack; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    quickDates.push({
      date: date.toISOString().split('T')[0],
      label: i === 0 ? 'Today' : i === 1 ? 'Yesterday' : `${i} days ago`,
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
    });
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-heading font-semibold text-white mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-cyan-400" />
        Select Date
      </h3>

      {/* Quick Select */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {quickDates.map((item) => (
          <button
            key={item.date}
            onClick={() => handleChange({ target: { value: item.date } })}
            className={`
              p-3 rounded-xl text-center transition-all
              ${selectedDate === item.date 
                ? 'bg-cyan-500/30 text-white border-cyan-400/50' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'}
            `}
          >
            <div className="text-xs text-white/50">{item.day}</div>
            <div className="font-medium">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Date Input */}
      <div className="relative">
        <input
          type="date"
          value={selectedDate}
          onChange={handleChange}
          min={minDateStr}
          max={maxDateStr}
          className="w-full glass-input px-4 py-3"
        />
      </div>

      <p className="text-xs text-white/40 mt-3 text-center">
        Historical data available for up to {maxDaysBack} days back
      </p>
    </div>
  );
};

export default DatePicker;
