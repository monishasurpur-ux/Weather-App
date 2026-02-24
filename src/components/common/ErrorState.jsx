/**
 * WeatherGlass Dashboard - ErrorState Component
 * Displays error messages with retry option
 */

import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorState = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  className = '' 
}) => {
  return (
    <div className={`glass-card p-8 flex flex-col items-center justify-center text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      
      <h3 className="text-xl font-heading font-semibold text-white mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-white/60 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="glass-btn primary flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
