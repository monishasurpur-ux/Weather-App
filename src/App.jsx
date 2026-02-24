/**
 * WeatherGlass Dashboard - Main App Component
 * Glassmorphism Weather Dashboard Application
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Forecast from './pages/Forecast';
import History from './pages/History';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/history" element={<History />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Layout>
  );
}

export default App;
