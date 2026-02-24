# WeatherGlass Dashboard

A beautiful glassmorphism weather dashboard built with React, Vite, and TailwindCSS. View current weather, forecasts, historical data, and advanced metrics for cities worldwide.

![WeatherGlass Dashboard](https://img.shields.io/badge/WeatherGlass-Dashboard-blue?style=for-the-badge)

## ✨ Features

- 🌤️ **Current Weather** - Real-time weather data with detailed metrics
- 📅 **5-Day Forecast** - Comprehensive forecast with daily and hourly data
- 📊 **Weather Charts** - Beautiful temperature and rain probability charts
- 📜 **Historical Weather** - View weather data for the past 5 days
- 🔍 **Smart City Search** - Search with autocomplete suggestions
- 📍 **Geolocation** - Get weather for your current location
- ⭐ **Favorites** - Save your favorite cities for quick access
- 🌡️ **Temperature Toggle** - Switch between Celsius and Fahrenheit
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Glassmorphism UI** - Modern, elegant glass effect design

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```
bash
git clone <repository-url>
cd weatherglass-dashboard
```

2. Install dependencies:
```
bash
npm install
```

3. Start the development server:
```
bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

## 🔑 API Configuration

The app uses the free Open-Meteo API, which does not require an API key!

No configuration needed - it works out of the box!

## 📁 Project Structure

```
src/
├── assets/              # Static assets
├── components/          # React components
│   ├── charts/         # Chart components
│   ├── common/         # Reusable components
│   ├── history/        # Historical weather components
│   ├── layout/         # Layout components
│   └── weather/        # Weather components
├── context/            # React Context (state management)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API services
├── styles/             # Global styles
└── utils/              # Utility functions
```

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Recharts** - Charts
- **Lucide React** - Icons

## 📱 Pages

- `/` - Home (Current weather + forecast)
- `/forecast` - Detailed forecast with charts
- `/history` - Historical weather data
- `/favorites` - Saved favorite cities

## 🎨 Design

The app features a beautiful glassmorphism design with:
- Frosted glass cards
- Soft shadows
- Gradient backgrounds
- Smooth animations
- Modern dashboard layout

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Weather data from [OpenWeatherMap](https://openweathermap.org/)
- Icons from [Lucide](https://lucide.dev/)
- Design inspiration from modern glassmorphism trends
