import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';
import StrategySimulator from '../features/StrategySimulator';

const RetentionEngagement = () => {
  const { state, dispatch } = useGame();
  const [showResults, setShowResults] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleStrategyChange = (field, value) => {
    dispatch({
      type: 'SET_RETENTION_STRATEGY',
      payload: { [field]: value }
    });
  };

  const calculateResults = () => {
    // Simulate retention results based on user choices - Increased base retention rates by 2x
    const baseRetention = {
      d1: 42, // Increased from 21
      d7: 22, // Increased from 11
      d30: 12 // Increased from 6
    };

    // Adjust based on notification frequency - More forgiving multipliers
    const notificationMultiplier = {
      none: 0.85, // Increased from 0.7
      occasional: 1.1, // Increased from 0.9
      frequent: 1.0 // Increased from 0.8
    }[state.retentionStrategy.notificationFrequency];

    // Adjust based on content updates - More forgiving multipliers
    const contentMultiplier = {
      rare: 0.8, // Increased from 0.6
      regular: 1.0, // Increased from 0.8
      frequent: 1.2 // Increased from 1.0
    }[state.retentionStrategy.contentUpdates];

    // Adjust based on special events - Increased multiplier
    const eventMultiplier = state.retentionStrategy.specialEvents ? 1.3 : 1.0; // Increased from 1.1/0.8

    // Calculate final retention rates
    const results = {
      retentionRates: {
        d1: Math.min(100, Math.round(baseRetention.d1 * notificationMultiplier * contentMultiplier * eventMultiplier)),
        d7: Math.min(100, Math.round(baseRetention.d7 * notificationMultiplier * contentMultiplier * eventMultiplier)),
        d30: Math.min(100, Math.round(baseRetention.d30 * notificationMultiplier * contentMultiplier * eventMultiplier))
      },
      dau: Math.round(state.phase1Results.installs * (baseRetention.d7/100) * notificationMultiplier * contentMultiplier * eventMultiplier),
      sessionLength: Math.round(20 * contentMultiplier * (state.retentionStrategy.engagementSpend === 'high' ? 1.3 : state.retentionStrategy.engagementSpend === 'medium' ? 1.2 : 1.0))
    };

    dispatch({ type: 'SET_PHASE2_RESULTS', payload: results });
    setShowResults(true);
  };

  const proceedToMonetization = () => {
    dispatch({ type: 'SET_PHASE', payload: 'monetization' });
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Retention Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-6">
              <h4 className="font-semibold mb-4 dark:text-white">Retention Rates</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Tooltip
                    term="Day 1 Retention"
                    explanation="Percentage of users who return to your app one day after installing"
                  >
                    <span className="dark:text-gray-200">Day 1:</span>
                  </Tooltip>
                  <span className="font-semibold dark:text-white">{state.phase2Results.retentionRates.d1}%</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="Day 7 Retention"
                    explanation="Percentage of users who return to your app seven days after installing"
                  >
                    <span className="dark:text-gray-200">Day 7:</span>
                  </Tooltip>
                  <span className="font-semibold dark:text-white">{state.phase2Results.retentionRates.d7}%</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="Day 30 Retention"
                    explanation="Percentage of users who return to your app thirty days after installing"
                  >
                    <span className="dark:text-gray-200">Day 30:</span>
                  </Tooltip>
                  <span className="font-semibold dark:text-white">{state.phase2Results.retentionRates.d30}%</span>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-6">
              <h4 className="font-semibold mb-4 dark:text-white">Engagement Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Tooltip
                    term="Daily Active Users"
                    explanation="The number of unique users who engage with your app daily"
                  >
                    <span className="dark:text-gray-200">DAU:</span>
                  </Tooltip>
                  <span className="font-semibold dark:text-white">{state.phase2Results.dau}</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="Average Session Length"
                    explanation="The average time users spend in your app per session"
                  >
                    <span className="dark:text-gray-200">Session Length:</span>
                  </Tooltip>
                  <span className="font-semibold dark:text-white">{state.phase2Results.sessionLength} minutes</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={proceedToMonetization}
            className="btn-primary w-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Proceed to Monetization →
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8"
    >
      <button
        onClick={() => setShowSimulator(true)}
        className="mb-6 w-full bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        🎯 Simulate Retention Strategy
      </button>

      {showSimulator && (
        <StrategySimulator
          phase="retention"
          currentStrategy={state}
          onClose={() => setShowSimulator(false)}
        />
      )}
      <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-6">Phase 2: Retention & Engagement</h3>
        
        <div className="space-y-8">
          <div>
            <Tooltip
              term="Push Notifications"
              explanation="Push notifications can remind users about your app, but too many notifications may lead to app uninstalls."
            >
              <h4 className="font-semibold mb-3 dark:text-white">Notification Strategy</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['None', 'Occasional', 'Frequent'].map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => handleStrategyChange('notificationFrequency', frequency.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.retentionStrategy.notificationFrequency === frequency.toLowerCase()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  {frequency}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tooltip
              term="Content Updates"
              explanation="Regular content updates keep your app fresh and give users reasons to return."
            >
              <h4 className="font-semibold mb-3 dark:text-white">Content Update Frequency</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['Rare', 'Regular', 'Frequent'].map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => handleStrategyChange('contentUpdates', frequency.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.retentionStrategy.contentUpdates === frequency.toLowerCase()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  {frequency}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tooltip
              term="Special Events"
              explanation="Special events can create excitement and boost engagement during specific periods."
            >
              <h4 className="font-semibold mb-3 dark:text-white">Special Events</h4>
            </Tooltip>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleStrategyChange('specialEvents', true)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  state.retentionStrategy.specialEvents
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                }`}
              >
                Enable
              </button>
              <button
                onClick={() => handleStrategyChange('specialEvents', false)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  state.retentionStrategy.specialEvents === false
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                }`}
              >
                Disable
              </button>
            </div>
          </div>

          <div>
            <Tooltip
              term="Engagement Budget"
              explanation="Higher engagement spending allows for better features and more engaging content."
            >
              <h4 className="font-semibold mb-3 dark:text-white">Engagement Budget</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleStrategyChange('engagementSpend', level.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.retentionStrategy.engagementSpend === level.toLowerCase()
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-400'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateResults}
            className="btn-primary w-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600"
          >
            Calculate Results →
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RetentionEngagement;
