/**
 * WeatherGlass Dashboard - Loader Component
 * Animated loading skeleton with glass effect
 */

import React from 'react';

const Loader = ({ type = 'skeleton', message = 'Loading...' }) => {
  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 animate-spin"></div>
        </div>
        {message && (
          <p className="mt-4 text-white/70 font-body animate-pulse">{message}</p>
        )}
      </div>
    );
  }

  // Skeleton loader
  return (
    <div className="space-y-4 p-4">
      {/* Header skeleton */}
      <div className="flex items-center justify-between mb-6">
        <div className="skeleton h-8 w-32"></div>
        <div className="skeleton h-8 w-20 rounded-full"></div>
      </div>

      {/* Main weather card skeleton */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="skeleton h-10 w-48"></div>
            <div className="skeleton h-6 w-32"></div>
            <div className="skeleton h-16 w-40 mt-4"></div>
          </div>
          <div className="skeleton h-24 w-24 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 w-full"></div>
          ))}
        </div>
      </div>

      {/* Forecast skeleton */}
      <div className="glass-card p-6">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="skeleton h-24 w-20 flex-shrink-0"></div>
          ))}
        </div>
      </div>

      {/* Chart skeleton */}
      <div className="glass-card p-6">
        <div className="skeleton h-6 w-40 mb-4"></div>
        <div className="skeleton h-48 w-full"></div>
      </div>
    </div>
  );
};

export default Loader;
