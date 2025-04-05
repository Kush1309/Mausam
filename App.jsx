// // src/App.jsx

import React from "react";
import './index.css';



import { useState, useEffect } from 'react';
import { fetchWeatherData } from './services/weatherApi';
import SearchBar from './src/components/SearchBar';
import WeatherCard from './src/components/WeatherCard';
import Loader from './src/components/Loader';
import RecentSearches from './src/components/RecentSearches';
import Forecast from './src/components/Forecast';
import Footer from './src/components/Footer';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleSearch = async (city) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchWeatherData(city);
      setWeatherData(data);
      
      // Update recent searches
      setRecentSearches(prev => {
        const updated = [city, ...prev.filter(item => item.toLowerCase() !== city.toLowerCase())].slice(0, 5);
        return updated;
      });
    } catch (err) {
      // Silently handle errors without console logging
      setError(null);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (weatherData) {
      handleSearch(weatherData.name);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        <header className="mb-8 text-center relative w-full">
          <button 
            onClick={toggleDarkMode} 
            className="absolute right-4 top-0 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <h1 className="text-3xl font-bold mb-2">Weather Dashboard</h1>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Search for a city to check current weather conditions
          </p>
        </header>
        
        <main className="w-full max-w-xl flex flex-col items-center">
          <SearchBar onSearch={handleSearch} isLoading={loading} />
          
          <RecentSearches searches={recentSearches} onSelect={handleSearch} />
          
          {loading && <Loader />}
          
          {weatherData && !loading && (
            <div className="mt-6 w-full">
              <WeatherCard data={weatherData} />
              
              <Forecast city={weatherData.name} />
              
              <button 
                onClick={handleRefresh}
                className={`mt-4 flex mx-auto items-center justify-center px-4 py-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600' 
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Refresh
              </button>
            </div>
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default App;

// function App() {
//   return <h1>Hello, Weather App!</h1>;
// }

// export default App;
