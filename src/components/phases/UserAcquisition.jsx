import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';

const UserAcquisition = () => {
  const { state, dispatch } = useGame();
  const [step, setStep] = useState('budget');

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
            <div className="space-y-4">
              <Tooltip
                term="Campaign Budget"
                explanation="Your initial budget determines the scale of your user acquisition campaign. Higher budgets typically lead to more installs but require better optimization for profitability."
              >
                <p className="text-gray-600">Select your campaign budget:</p>
              </Tooltip>
              
              <div className="flex flex-col space-y-3">
                {[500, 1000, 2000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      handleBudgetChange(amount);
                      setStep('audience');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      state.budget === amount
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="font-semibold">${amount}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {amount === 500 ? '(Conservative)' : amount === 2000 ? '(Aggressive)' : '(Balanced)'}
                    </span>
                  </button>
                ))}
              </div>
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
            <div className="space-y-6">
              <div>
                <Tooltip
                  term="Age Group Targeting"
                  explanation="Different age groups have varying app usage patterns and purchasing behaviors. Choose your target demographic carefully."
                >
                  <p className="text-gray-600 mb-2">Age Group:</p>
                </Tooltip>
                <div className="grid grid-cols-3 gap-3">
                  {['18-24', '25-34', '35-44'].map((age) => (
                    <button
                      key={age}
                      onClick={() => handleAudienceChange('ageGroup', age)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        state.audienceTargeting.ageGroup === age
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {age}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Tooltip
                  term="Interest Targeting"
                  explanation="Target users based on their demonstrated interests and behaviors."
                >
                  <p className="text-gray-600 mb-2">Interests:</p>
                </Tooltip>
                <div className="grid grid-cols-3 gap-3">
                  {['Gaming', 'Education', 'Lifestyle'].map((interest) => (
                    <button
                      key={interest}
                      onClick={() => {
                        const currentInterests = state.audienceTargeting.interests;
                        const newInterests = currentInterests.includes(interest)
                          ? currentInterests.filter(i => i !== interest)
                          : [...currentInterests, interest];
                        handleAudienceChange('interests', newInterests);
                      }}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        state.audienceTargeting.interests.includes(interest)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
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
                  disabled={!state.audienceTargeting.ageGroup || state.audienceTargeting.interests.length === 0}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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

            <div className="space-y-4">
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
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900">Phase 1: User Acquisition</h2>
        <div className="flex justify-between mt-4">
          {['budget', 'audience', 'creative', 'bidding'].map((phase, index) => (
            <div
              key={phase}
              className={`flex items-center ${index !== 0 ? 'ml-4' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === phase
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                {index + 1}
              </div>
              {index < 3 && (
                <div className="h-1 w-16 mx-2 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderStep()}
    </div>
  );
};

export default UserAcquisition;
