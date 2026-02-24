/**
 * WeatherGlass Dashboard - Button Component
 * Reusable button with glass effect
 */

import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'default', 
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => {
  const baseClasses = 'glass-btn transition-all duration-300 font-medium';
  
  const variants = {
    default: '',
    primary: 'bg-gradient-to-r from-cyan-500 to-cyan-600 border-none hover:from-cyan-400 hover:to-cyan-500',
    danger: 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30',
    ghost: 'bg-transparent border-transparent hover:bg-white/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
