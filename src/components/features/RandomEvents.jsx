import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const events = {
  acquisition: [
    {
      id: 'viral_creative',
      title: 'Viral Creative! 🚀',
      description: 'One of your ads went viral! +15% installs.',
      impact: (state) => ({
        type: 'SET_PHASE1_RESULTS',
        payload: {
          ...state.phase1Results,
          installs: Math.floor(state.phase1Results.installs * 1.15),
          cvr: (state.phase1Results.installs * 1.15 / state.phase1Results.clicks * 100).toFixed(2)
        }
      })
    },
    {
      id: 'market_competition',
      title: 'Increased Competition 📊',
      description: 'Market is getting crowded. CPI increased by 10%.',
      impact: (state) => ({
        type: 'SET_PHASE1_RESULTS',
        payload: {
          ...state.phase1Results,
          cpi: (state.phase1Results.cpi * 1.1).toFixed(2)
        }
      })
    }
  ],
  retention: [
    {
      id: 'user_backlash',
      title: 'User Backlash 😠',
      description: 'Users complain about notification frequency. Temporary decrease in retention.',
      impact: (state) => ({
        type: 'SET_PHASE2_RESULTS',
        payload: {
          ...state.phase2Results,
          retentionRates: {
            ...state.phase2Results.retentionRates,
            d7: Math.max(0, state.phase2Results.retentionRates.d7 * 0.85)
          }
        }
      })
    },
    {
      id: 'positive_reviews',
      title: 'Positive Reviews 🌟',
      description: 'Users love your app! +10% to all retention metrics.',
      impact: (state) => ({
        type: 'SET_PHASE2_RESULTS',
        payload: {
          ...state.phase2Results,
          retentionRates: {
            d1: Math.min(100, state.phase2Results.retentionRates.d1 * 1.1),
            d7: Math.min(100, state.phase2Results.retentionRates.d7 * 1.1),
            d30: Math.min(100, state.phase2Results.retentionRates.d30 * 1.1)
          }
        }
      })
    }
  ],
  monetization: [
    {
      id: 'ad_fatigue',
      title: 'Ad Fatigue 😴',
      description: 'Users are showing ad fatigue. -15% to ad revenue.',
      impact: (state) => ({
        type: 'SET_PHASE3_RESULTS',
        payload: {
          ...state.phase3Results,
          adRevenue: (state.phase3Results.adRevenue * 0.85).toFixed(2),
          arpdau: ((parseFloat(state.phase3Results.adRevenue) * 0.85 + parseFloat(state.phase3Results.iapRevenue)) / state.phase2Results.dau).toFixed(2)
        }
      })
    },
    {
      id: 'seasonal_boost',
      title: 'Seasonal Boost 🎉',
      description: 'Holiday season increases IAP purchases! +20% to IAP revenue.',
      impact: (state) => ({
        type: 'SET_PHASE3_RESULTS',
        payload: {
          ...state.phase3Results,
          iapRevenue: (state.phase3Results.iapRevenue * 1.2).toFixed(2),
          arpdau: ((parseFloat(state.phase3Results.adRevenue) + parseFloat(state.phase3Results.iapRevenue) * 1.2) / state.phase2Results.dau).toFixed(2)
        }
      })
    }
  ]
};

const RandomEventNotification = ({ event, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -50 }}
    className="fixed bottom-4 right-4 max-w-sm bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500"
  >
    <div className="flex items-start">
      <div className="flex-1">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600">{event.description}</p>
      </div>
      <button
        onClick={onClose}
        className="ml-4 text-gray-400 hover:text-gray-600"
      >
        ×
      </button>
    </div>
  </motion.div>
);

const useRandomEvents = (phase) => {
  const { state, dispatch } = useGame();
  const [currentEvent, setCurrentEvent] = useState(null);
  const [eventHistory, setEventHistory] = useState([]);

  useEffect(() => {
    const triggerRandomEvent = () => {
      // 30% chance of event occurring
      if (Math.random() > 0.3 || eventHistory.length >= 2) return;

      const phaseEvents = events[phase];
      if (!phaseEvents) return;

      // Filter out events that have already occurred
      const availableEvents = phaseEvents.filter(
        event => !eventHistory.includes(event.id)
      );
      if (availableEvents.length === 0) return;

      // Select random event
      const event = availableEvents[Math.floor(Math.random() * availableEvents.length)];
      
      // Apply event impact
      dispatch(event.impact(state));
      
      // Show notification
      setCurrentEvent(event);
      
      // Add to history
      setEventHistory(prev => [...prev, event.id]);
    };

    triggerRandomEvent();
  }, [phase]);

  return {
    currentEvent,
    clearEvent: () => setCurrentEvent(null)
  };
};

const RandomEvents = ({ phase }) => {
  const { currentEvent, clearEvent } = useRandomEvents(phase);

  return (
    <AnimatePresence>
      {currentEvent && (
        <RandomEventNotification
          event={currentEvent}
          onClose={clearEvent}
        />
      )}
    </AnimatePresence>
  );
};

export default RandomEvents;
