/**
 * WeatherGlass Dashboard - Navbar Component
 * Top navigation with glass effect
 */

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Cloud, 
  Home, 
  Calendar, 
  Clock, 
  Star, 
  Thermometer,
  Menu,
  X
} from 'lucide-react';
import { useWeather } from '../../context/WeatherContext';

const Navbar = () => {
  const location = useLocation();
  const { temperatureUnit, toggleTemperatureUnit } = useWeather();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/forecast', label: 'Forecast', icon: Calendar },
    { path: '/history', label: 'History', icon: Clock },
    { path: '/favorites', label: 'Favorites', icon: Star },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-x-0 border-t-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 flex items-center justify-center transform group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/30">
              <Cloud className="w-6 h-6 text-white animate-float" />
            </div>
            <span className="text-xl font-heading font-bold gradient-text">
              WeatherGlass
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`
                  nav-link flex items-center gap-2 px-4 py-2 rounded-lg transition-all
                  ${isActive(link.path) ? 'bg-white/10 text-white' : 'text-white/70 hover:text-white hover:bg-white/5'}
                `}
              >
                <link.icon className="w-4 h-4" />
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Temperature Toggle */}
            <button
              onClick={toggleTemperatureUnit}
              className="glass-btn flex items-center gap-2 text-sm"
              title={`Switch to ${temperatureUnit === 'metric' ? 'Fahrenheit' : 'Celsius'}`}
            >
              <Thermometer className="w-4 h-4" />
              <span className="font-medium">
                °{temperatureUnit === 'metric' ? 'C' : 'F'}
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden glass-btn p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive(link.path) 
                      ? 'bg-cyan-500/20 text-cyan-400' 
                      : 'text-white/70 hover:text-white hover:bg-white/5'}
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
