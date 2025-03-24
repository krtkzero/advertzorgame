import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Tooltip from './shared/Tooltip';
import { GENRE_POWERS } from '../utils/genrePowers';

const APP_GENRES = {
  'Casual Game': {
    name: 'Casual Game',
    description: 'High install rates, strong ad monetization potential, shorter sessions',
    metrics: {
      cpi: 0.8,
      retention: { d1: 1.2, d7: 0.9, d30: 0.7 },
      adRevenue: 1.2,
      iapRevenue: 0.8,
      sessionLength: 0.8
    },
    icon: '🎮'
  },
  'Social App': {
    name: 'Social App',
    description: 'High engagement, moderate acquisition costs, strong viral potential',
    metrics: {
      cpi: 1.1,
      retention: { d1: 1.3, d7: 1.2, d30: 1.1 },
      adRevenue: 0.7,
      iapRevenue: 0.9,
      sessionLength: 1.3
    },
    icon: '👥'
  },
  'Education App': {
    name: 'Education App',
    description: 'Higher user value, longer retention, strong IAP potential',
    metrics: {
      cpi: 1.2,
      retention: { d1: 0.9, d7: 1.1, d30: 1.3 },
      adRevenue: 0.8,
      iapRevenue: 1.4,
      sessionLength: 1.1
    },
    icon: '📚'
  },
  'Fitness & Health': {
    name: 'Fitness & Health',
    description: 'High subscription potential, seasonal variations, loyal user base',
    metrics: {
      cpi: 1.3,
      retention: { d1: 1.0, d7: 1.0, d30: 1.2 },
      adRevenue: 0.6,
      iapRevenue: 1.5,
      sessionLength: 0.9
    },
    icon: '💪'
  },
  'Productivity App': {
    name: 'Productivity App',
    description: 'High user value, longer sales cycle, strong B2B potential',
    metrics: {
      cpi: 1.4,
      retention: { d1: 0.8, d7: 1.0, d30: 1.4 },
      adRevenue: 0.5,
      iapRevenue: 1.6,
      sessionLength: 1.2
    },
    icon: '✅'
  }
};

const GenreCard = ({ genre, onSelect, selectedGenre }) => {
  const powers = GENRE_POWERS[genre] || { powerUps: [], powerDowns: [] };

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl p-6 shadow-md transition-all duration-200
        ${selectedGenre === genre ? 'ring-4 ring-green-500 shadow-lg' : 'hover:shadow-lg'}
        cursor-pointer`}
      onClick={() => onSelect(genre)}
    >
      <div className="flex items-center space-x-4 mb-4">
        <span className="text-5xl">{APP_GENRES[genre].icon}</span>
        <h3 className="font-bold text-2xl text-gray-900">
          {APP_GENRES[genre].name}
        </h3>
      </div>
      
      <p className="text-gray-600 mb-6 min-h-[60px]">
        {APP_GENRES[genre].description}
      </p>
      
      <div className="space-y-3">
        {powers.powerUps.map((power, i) => (
          <div key={`up-${i}`} className="power-up flex items-center space-x-2">
            ✅ {power.label}
          </div>
        ))}
        {powers.powerDowns.map((power, i) => (
          <div key={`down-${i}`} className="power-down flex items-center space-x-2">
            ❌ {power.label}
          </div>
        ))}
      </div>
      
      <div className="space-y-3 mt-6">
        <Tooltip term="UA Cost" explanation="Cost per install compared to average">
          <div className="flex items-center space-x-2">
            <div className="w-24 font-medium text-gray-700">UA Cost:</div>
            <div className={`flex items-center space-x-1 ${APP_GENRES[genre].metrics.cpi > 1 ? 'text-red-600' : 'text-green-600'}`}>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${APP_GENRES[genre].metrics.cpi > 1 ? 'bg-red-500' : 'bg-green-500'}`} 
                  style={{ width: `${Math.min(100, Math.abs((APP_GENRES[genre].metrics.cpi - 1) * 100))}%` }}
                ></div>
              </div>
              <span>{APP_GENRES[genre].metrics.cpi > 1 ? '+' : '-'}{Math.abs((APP_GENRES[genre].metrics.cpi - 1) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </Tooltip>
        <Tooltip term="Retention" explanation="Long-term user retention compared to average">
          <div className="flex items-center space-x-2">
            <div className="w-24 font-medium text-gray-700">Retention:</div>
            <div className={`flex items-center space-x-1 ${APP_GENRES[genre].metrics.retention.d30 > 1 ? 'text-green-600' : 'text-red-600'}`}>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${APP_GENRES[genre].metrics.retention.d30 > 1 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(100, Math.abs((APP_GENRES[genre].metrics.retention.d30 - 1) * 100))}%` }}
                ></div>
              </div>
              <span>{APP_GENRES[genre].metrics.retention.d30 > 1 ? '+' : '-'}{Math.abs((APP_GENRES[genre].metrics.retention.d30 - 1) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </Tooltip>
        <Tooltip term="Ad Revenue" explanation="Revenue from ads compared to average">
          <div className="flex items-center space-x-2">
            <div className="w-24 font-medium text-gray-700">Ad Revenue:</div>
            <div className={`flex items-center space-x-1 ${APP_GENRES[genre].metrics.adRevenue > 1 ? 'text-green-600' : 'text-red-600'}`}>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${APP_GENRES[genre].metrics.adRevenue > 1 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(100, Math.abs((APP_GENRES[genre].metrics.adRevenue - 1) * 100))}%` }}
                ></div>
              </div>
              <span>{APP_GENRES[genre].metrics.adRevenue > 1 ? '+' : '-'}{Math.abs((APP_GENRES[genre].metrics.adRevenue - 1) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </Tooltip>
        <Tooltip term="IAP Revenue" explanation="Revenue from in-app purchases compared to average">
          <div className="flex items-center space-x-2">
            <div className="w-24 font-medium text-gray-700">IAP Revenue:</div>
            <div className={`flex items-center space-x-1 ${APP_GENRES[genre].metrics.iapRevenue > 1 ? 'text-green-600' : 'text-red-600'}`}>
              <div className="w-16 h-4 bg-gray-200 rounded-full overflow-hidden flex">
                <div 
                  className={`h-full ${APP_GENRES[genre].metrics.iapRevenue > 1 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${Math.min(100, Math.abs((APP_GENRES[genre].metrics.iapRevenue - 1) * 100))}%` }}
                ></div>
              </div>
              <span>{APP_GENRES[genre].metrics.iapRevenue > 1 ? '+' : '-'}{Math.abs((APP_GENRES[genre].metrics.iapRevenue - 1) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </Tooltip>
      </div>
    </motion.div>
  );
};

const AppGenreSelection = () => {
  const { state, dispatch } = useGame();
  const [selectedGenre, setSelectedGenre] = useState(null);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
  };

  const handleProceed = () => {
    if (!selectedGenre) return;
    
    dispatch({
      type: 'SET_APP_GENRE',
      payload: {
        genre: selectedGenre,
        metrics: APP_GENRES[selectedGenre].metrics
      }
    });
    dispatch({ type: 'SET_PHASE', payload: 'acquisition' });
  };

  const handleBackToHome = () => {
    dispatch({ type: 'SET_PHASE', payload: 'home' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-10">
          <button
            onClick={handleBackToHome}
            className="absolute top-8 left-8 bg-white hover:bg-gray-100 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
          >
            ← Back to Home
          </button>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your App Genre</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Choose a genre based on your preferred strategy—each type will impact installs, 
            retention, and revenue differently.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {Object.keys(APP_GENRES).map((genre) => (
            <GenreCard key={genre} genre={genre} onSelect={handleGenreSelect} selectedGenre={selectedGenre} />
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-indigo-100 to-transparent pt-16 pb-8 px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="max-w-5xl mx-auto flex justify-center">
            <button
              onClick={handleProceed}
              disabled={!selectedGenre}
              className={`
                py-3 px-8 rounded-lg text-lg font-medium shadow-md transition-all duration-200
                ${selectedGenre 
                  ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-lg transform hover:-translate-y-1' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
              `}
            >
              {selectedGenre 
                ? `Proceed with ${APP_GENRES[selectedGenre].name}` 
                : 'Select an App Genre to Continue'}
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AppGenreSelection;
