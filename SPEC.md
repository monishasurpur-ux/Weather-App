# WeatherGlass Dashboard - Specification

## 1. Project Overview

**Project Name:** WeatherGlass Dashboard  
**Type:** Single Page Application (React + Vite)  
**Core Functionality:** A glassmorphism weather dashboard that displays current weather, forecasts, historical data, and advanced metrics for any city worldwide.  
**Target Users:** General users seeking weather information with a modern, visually appealing interface.

---

## 2. UI/UX Specification

### Layout Structure

**Pages:**
- `/` - Home (Current Weather + Forecast)
- `/forecast` - Detailed Forecast
- `/history` - Historical Weather Data
- `/favorites` - Saved Favorite Cities

**Dashboard Sections:**
- Fixed Navbar (top)
- Search Bar (below navbar)
- Main Content Area (scrollable)
  - Weather Summary Cards
  - Forecast Charts
  - Detailed Metrics Grid

**Responsive Breakpoints:**
- Mobile: < 640px (single column)
- Tablet: 640px - 1024px (2 columns)
- Desktop: > 1024px (3-4 columns)

### Visual Design

**Color Palette:**
- Primary Background: Linear gradient `#1a1a2e` → `#16213e` → `#0f3460`
- Glass Card Background: `rgba(255, 255, 255, 0.08)`
- Glass Border: `rgba(255, 255, 255, 0.15)`
- Primary Accent: `#00d4ff` (cyan)
- Secondary Accent: `#ff6b6b` (coral)
- Text Primary: `#ffffff`
- Text Secondary: `rgba(255, 255, 255, 0.7)`
- Success: `#4ade80`
- Warning: `#fbbf24`
- Error: `#ef4444`

**Glassmorphism Effects:**
```
css
backdrop-filter: blur(20px);
background: rgba(255, 255, 255, 0.08);
border: 1px solid rgba(255, 255, 255, 0.15);
border-radius: 20px;
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
```

**Typography:**
- Font Family: 'Outfit' (headings), 'DM Sans' (body)
- Heading 1: 2.5rem, 700 weight
- Heading 2: 1.75rem, 600 weight
- Heading 3: 1.25rem, 600 weight
- Body: 1rem, 400 weight
- Small: 0.875rem, 400 weight

**Spacing System:**
- Base unit: 4px
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px

### Components

**Navbar:**
- Logo (left)
- Navigation links (center)
- Theme toggle + location button (right)
- Glassmorphism background

**SearchBar:**
- Input with glass effect
- Search icon
- Autocomplete dropdown
- Recent searches
- Geolocation button

**WeatherCard:**
- City name + country flag
- Large temperature display
- Weather condition icon (animated)
- Feels like, humidity, wind speed
- Min/Max temperatures

**ForecastCard:**
- Day/Date
- Weather icon
- High/Low temp
- Rain probability bar

**HistoryChart:**
- Line chart for temperature
- Bar chart for humidity/wind
- Date picker
- Metric selector

**Loader:**
- Animated glass spinner
- Skeleton cards with shimmer

**ErrorState:**
- Error icon
- Message
- Retry button

---

## 3. Functionality Specification

### Core Features

**1. Smart City Search:**
- Debounced search input (300ms)
- City suggestions from API
- Recent searches (localStorage, max 5)
- Geolocation detection
- Save to favorites

**2. Current Weather Display:**
- City name, country
- Temperature (Celsius/Fahrenheit toggle)
- Weather condition + icon
- Feels like temperature
- Humidity percentage
- Wind speed + direction
- Atmospheric pressure
- Visibility distance
- Sunrise/Sunset times
- UV Index (if available)
- Air quality (if available)

**3. Forecast Section:**
- Hourly forecast (next 24h)
- 5-day daily forecast
- Temperature chart (line graph)
- Rain probability (bar chart)
- Weather conditions per day

**4. Historical Weather:**
- Date picker (last 5 days)
- Temperature graph
- Humidity levels
- Wind speed
- Pressure readings

**5. Advanced Metrics:**
- UV Index
- Cloud coverage
- Dew point
- Wind direction (compass)
- Visibility
- Pressure trend

**6. Favorites Management:**
- Add/remove cities
- Persist to localStorage
- Quick switch between favorites

### User Interactions

- Click city from autocomplete → fetch weather
- Click geolocation → get current location weather
- Toggle temperature unit → convert all temps
- Click star → add/remove from favorites
- Swipe between forecast hours
- Select date → fetch historical data

### Data Handling

- API responses cached (5 min TTL)
- Error states with retry
- Loading states with skeletons
- Offline detection
- localStorage for:
  - Favorites
  - Recent searches
  - Temperature unit preference

### Edge Cases

- City not found → show error
- API rate limit → show message
- No internet → show cached data
- Invalid coordinates → fallback to IP location
- Empty favorites → show empty state

---

## 4. Technical Architecture

### Project Structure
```
src/
├── assets/
│   └── icons/
├── components/
│   ├── common/
│   │   ├── Loader.jsx
│   │   ├── ErrorState.jsx
│   │   └── Button.jsx
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   ├── weather/
│   │   ├── SearchBar.jsx
│   │   ├── CurrentWeather.jsx
│   │   ├── WeatherCard.jsx
│   │   ├── ForecastCard.jsx
│   │   ├── HourlyForecast.jsx
│   │   └── AdvancedMetrics.jsx
│   ├── charts/
│   │   ├── TemperatureChart.jsx
│   │   └── RainChart.jsx
│   └── history/
│       ├── HistoricalWeather.jsx
│       └── DatePicker.jsx
├── pages/
│   ├── Home.jsx
│   ├── Forecast.jsx
│   ├── History.jsx
│   └── Favorites.jsx
├── services/
│   └── weatherApi.js
├── hooks/
│   ├── useWeather.js
│   ├── useForecast.js
│   ├── useGeolocation.js
│   └── useLocalStorage.js
├── context/
│   └── WeatherContext.jsx
├── utils/
│   ├── helpers.js
│   ├── constants.js
│   └── formatters.js
├── styles/
│   └── index.css
├── App.jsx
├── main.jsx
└── index.html
```

### API Integration

**Base URL:** `https://api.openweathermap.org/data/2.5`

**Endpoints:**
- Current Weather: `/weather?q={city}&appid={API_KEY}&units=metric`
- Forecast: `/forecast?q={city}&appid={API_KEY}&units=metric`
- Historical: `/3.0/onecall/timemachine?lat={lat}&lon={lon}&dt={timestamp}&appid={API_KEY}`
- OneCall (UV, etc): `/3.0/onecall?lat={lat}&lon={lon}&appid={API_KEY}`

---

## 5. Acceptance Criteria

### Visual Checkpoints
- [ ] Glassmorphism effect visible on all cards
- [ ] Gradient background renders correctly
- [ ] Weather icons animate smoothly
- [ ] Responsive layout works on all breakpoints
- [ ] Charts render with correct data
- [ ] Loading skeletons appear during fetch

### Functional Checkpoints
- [ ] Search returns city suggestions
- [ ] Geolocation works (with permission)
- [ ] Current weather displays all metrics
- [ ] Forecast shows 5-day + hourly data
- [ ] Historical data loads for selected date
- [ ] Favorites persist after refresh
- [ ] Temperature unit toggle works
- [ ] Error states display correctly
- [ ] Page navigation works

### Performance Checkpoints
- [ ] Initial load < 3 seconds
- [ ] Search debounce prevents excessive API calls
- [ ] Smooth animations (60fps)
- [ ] No console errors in production

---

## 6. API Key

```
javascript
const API_KEY = "PASTE_API_KEY_HERE"
```

Users must replace this with their OpenWeatherMap API key.
