import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';
import StrategySimulator from '../features/StrategySimulator';
import Slider from '@mui/material/Slider';

const UserAcquisition = () => {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState('budget');
  const [showSimulator, setShowSimulator] = useState(false);

  const handleBudgetChange = (value) => {
    dispatch({ type: 'SET_BUDGET', payload: value });
  };

  const handleAudienceChange = (field, value) => {
    dispatch({
      type: 'SET_AUDIENCE_TARGETING',
      payload: { [field]: value }
    });
  };

  const handleCreativeSelection = (format) => {
    const currentFormats = state.creativeSelection.formats;
    const updatedFormats = currentFormats.includes(format)
      ? currentFormats.filter(f => f !== format)
      : [...currentFormats, format].slice(0, 2);
    
    dispatch({
      type: 'SET_CREATIVE_SELECTION',
      payload: { formats: updatedFormats }
    });
  };

  const handleBiddingStrategy = (strategy) => {
    dispatch({ type: 'SET_BIDDING_STRATEGY', payload: strategy });
    calculateAndSetResults();
  };

  const calculateAndSetResults = () => {
    // Simulate campaign results based on user choices
    const results = {
      impressions: Math.floor(state.budget * (Math.random() * 1000 + 500)),
      clicks: Math.floor(state.budget * (Math.random() * 20 + 10)),
      installs: Math.floor(state.budget * (Math.random() * 5 + 2)),
      spend: state.budget
    };

    results.ctr = ((results.clicks / results.impressions) * 100).toFixed(2);
    results.cvr = ((results.installs / results.clicks) * 100).toFixed(2);
    results.cpi = (results.spend / results.installs).toFixed(2);

    dispatch({ type: 'SET_PHASE1_RESULTS', payload: results });
    dispatch({ type: 'SET_PHASE', payload: 'retention' });
  };

  const renderStep = () => {
    switch (step) {
      case 'budget':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Budget Allocation</h3>
            <div className="space-y-6 px-4">
              <Tooltip
                term="Campaign Budget"
                explanation="Your initial budget determines the scale of your user acquisition campaign. Higher budgets typically lead to more installs but require better optimization for profitability."
              >
                <p className="text-lg font-medium text-gray-700 mb-2">Select your campaign budget:</p>
              </Tooltip>

              <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col space-y-4">
                  <label className="text-gray-700">Select Budget (in $):</label>
                  <select 
                    value={state.budget}
                    onChange={(e) => handleBudgetChange(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {Array.from({ length: 16 }, (_, i) => 500 + i * 100).map(value => (
                      <option key={value} value={value}>${value}</option>
                    ))}
                  </select>
                  <p className="text-sm text-gray-500 text-center">
                    Selected Budget: ${state.budget}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setStep('audience')}
                className="w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 mt-4"
              >
                Continue to Audience Targeting →
              </button>
            </div>
          </motion.div>
        );

      case 'audience':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Audience Targeting</h3>
            <div className="space-y-6 px-4">
              <div>
                <Tooltip
                  term="Age Targeting"
                  explanation="Select target age range"
                >
                  <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-4">
                    <div className="w-full px-4">
                      <p className="text-lg font-medium text-gray-700 mb-4">Age Range:</p>
                      <div className="flex flex-col space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm text-gray-600">Minimum Age:</label>
                            <select 
                              value={state.audienceTargeting.ageRange?.[0] || 18}
                              onChange={(e) => {
                                const minAge = Number(e.target.value);
                                const maxAge = state.audienceTargeting.ageRange?.[1] || 84;
                                let ageGroup;
                                const avgAge = (minAge + maxAge) / 2;
                                if (avgAge <= 24) ageGroup = '18-24';
                                else if (avgAge <= 34) ageGroup = '25-34';
                                else if (avgAge <= 44) ageGroup = '35-44';
                                else if (avgAge <= 54) ageGroup = '45-54';
                                else if (avgAge <= 64) ageGroup = '55-64';
                                else ageGroup = '65-84+';
                                
                                handleAudienceChange('ageRange', [minAge, Math.max(minAge, maxAge)]);
                                handleAudienceChange('ageGroup', ageGroup);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              {Array.from({ length: 67 }, (_, i) => i + 18).map(age => (
                                <option key={age} value={age}>{age} years</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-sm text-gray-600">Maximum Age:</label>
                            <select 
                              value={state.audienceTargeting.ageRange?.[1] || 84}
                              onChange={(e) => {
                                const maxAge = Number(e.target.value);
                                const minAge = state.audienceTargeting.ageRange?.[0] || 18;
                                let ageGroup;
                                const avgAge = (minAge + maxAge) / 2;
                                if (avgAge <= 24) ageGroup = '18-24';
                                else if (avgAge <= 34) ageGroup = '25-34';
                                else if (avgAge <= 44) ageGroup = '35-44';
                                else if (avgAge <= 54) ageGroup = '45-54';
                                else if (avgAge <= 64) ageGroup = '55-64';
                                else ageGroup = '65-84+';
                                
                                handleAudienceChange('ageRange', [Math.min(minAge, maxAge), maxAge]);
                                handleAudienceChange('ageGroup', ageGroup);
                              }}
                              className="w-full p-2 border border-gray-300 rounded-lg"
                            >
                              {Array.from({ length: 67 }, (_, i) => i + 18).map(age => (
                                <option key={age} value={age}>{age} years</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                          Selected Age Range: {state.audienceTargeting.ageRange?.[0] || 25} - {state.audienceTargeting.ageRange?.[1] || 84} years
                        </p>
                      </div>
                    </div>
                  </div>
                </Tooltip>
              </div>

              <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-lg font-medium text-gray-700 mb-6">Interests:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                  {['Gaming', 'Social', 'Education', 'Entertainment', 'Productivity', 'Lifestyle'].map(interest => (
                    <button
                      key={interest}
                      onClick={() => {
                        const currentInterests = state.audienceTargeting.interests || [];
                        const updatedInterests = currentInterests.includes(interest)
                          ? currentInterests.filter(i => i !== interest)
                          : [...currentInterests, interest];
                        handleAudienceChange('interests', updatedInterests);
                      }}
                      className={`w-full py-4 px-5 rounded-lg text-sm font-medium transition-colors duration-200
                        ${state.audienceTargeting.interests?.includes(interest)
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <button
                  onClick={() => setStep('budget')}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep('creative')}
                  disabled={!state.audienceTargeting.ageRange || state.audienceTargeting.interests.length === 0}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          </motion.div>
        );

      case 'creative':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Creative Selection</h3>
            <Tooltip
              term="Ad Creatives"
              explanation="Choose up to two ad formats. Different formats perform better for different audience segments and campaign objectives."
            >
              <p className="text-gray-600 mb-4">Select up to 2 ad formats:</p>
            </Tooltip>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 mt-4">
              {[
                'Gameplay Videos',
                'Playable Ads',
                'Educational Videos',
                'Static Banner Ads',
                'Rewarded Videos'
              ].map((format) => (
                <button
                  key={format}
                  onClick={() => handleCreativeSelection(format)}
                  disabled={
                    !state.creativeSelection.formats.includes(format) &&
                    state.creativeSelection.formats.length >= 2
                  }
                  className={`p-4 rounded-lg border-2 transition-all ${
                    state.creativeSelection.formats.includes(format)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {format}
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setStep('audience')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <button
                onClick={() => setStep('bidding')}
                disabled={state.creativeSelection.formats.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            </div>
          </motion.div>
        );

      case 'bidding':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="card"
          >
            <h3 className="text-xl font-semibold mb-4">Bidding Strategy</h3>
            <Tooltip
              term="Bidding Strategy"
              explanation="Your bidding strategy affects how quickly you'll acquire users and at what cost. Higher bids typically lead to faster results but at a higher CPI."
            >
              <p className="text-gray-600 mb-4">Select your bidding approach:</p>
            </Tooltip>

            <div className="space-y-4 mb-8 mt-4">
              {[
                {
                  name: 'High',
                  description: 'Quick results, higher CPI',
                  multiplier: '1.5x market rate'
                },
                {
                  name: 'Moderate',
                  description: 'Balanced approach',
                  multiplier: '1x market rate'
                },
                {
                  name: 'Low',
                  description: 'Slower results, lower CPI',
                  multiplier: '0.7x market rate'
                }
              ].map((strategy) => (
                <button
                  key={strategy.name}
                  onClick={() => handleBiddingStrategy(strategy.name.toLowerCase())}
                  className="w-full p-4 rounded-lg border-2 transition-all hover:border-blue-300 text-left"
                >
                  <div className="font-semibold">{strategy.name} Bid</div>
                  <div className="text-sm text-gray-500">{strategy.description}</div>
                  <div className="text-xs text-gray-400">{strategy.multiplier}</div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep('creative')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8 px-4"
    >
      <button
        onClick={() => setShowSimulator(true)}
        className="mb-8 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center justify-center space-x-2"
      >
        <span className="text-xl">🎯</span>
        <span>Simulate Campaign Performance</span>
      </button>

      {showSimulator && (
        <StrategySimulator
          phase="acquisition"
          currentStrategy={state}
          onClose={() => setShowSimulator(false)}
        />
      )}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-6">Phase 1: User Acquisition</h2>
        <div className="flex items-center justify-center space-x-2 mb-8">
          {['budget', 'audience', 'creative', 'bidding'].map((phase, index) => (
            <div key={phase} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  step === phase
                    ? 'bg-blue-500 text-white font-medium'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div className="h-1 w-12 mx-2 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}
    </motion.div>
  );
};

export default UserAcquisition;
