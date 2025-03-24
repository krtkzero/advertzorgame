import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';
import StrategySimulator from '../features/StrategySimulator';

const Monetization = () => {
  const { state, dispatch } = useGame();
  const [showResults, setShowResults] = useState(false);
  const [showSimulator, setShowSimulator] = useState(false);

  const handleStrategyChange = (field, value) => {
    dispatch({
      type: 'SET_MONETIZATION_STRATEGY',
      payload: { [field]: value }
    });
  };

  const toggleAdFormat = (format) => {
    const currentFormats = state.monetizationStrategy.adFormats;
    const updatedFormats = currentFormats.includes(format)
      ? currentFormats.filter(f => f !== format)
      : [...currentFormats, format];
    
    handleStrategyChange('adFormats', updatedFormats);
  };

  const calculateResults = () => {
    // Base values
    const baseEcpm = 10; // $10 base eCPM
    const baseIapRevenue = state.phase2Results.dau * 0.05; // $0.05 base ARPDAU from IAP

    // Calculate multipliers based on strategies
    const adFrequencyMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.2
    }[state.monetizationStrategy.adFrequency];

    const iapPricingMultiplier = {
      low: 0.7,
      medium: 1.0,
      high: 1.3
    }[state.monetizationStrategy.iapPricing];

    const promoMultiplier = {
      none: 0.8,
      limited: 1.0,
      frequent: 1.2
    }[state.monetizationStrategy.promotionalOffers];

    // Calculate fill rate based on ad frequency
    const fillRate = {
      low: 75,
      medium: 85,
      high: 95
    }[state.monetizationStrategy.adFrequency];

    // Calculate eCPM based on ad formats
    let formatMultiplier = 1.0;
    if (state.monetizationStrategy.adFormats.includes('rewarded')) formatMultiplier *= 1.3;
    if (state.monetizationStrategy.adFormats.includes('interstitial')) formatMultiplier *= 1.2;
    if (state.monetizationStrategy.adFormats.includes('banner')) formatMultiplier *= 0.8;

    const finalEcpm = baseEcpm * formatMultiplier * adFrequencyMultiplier;

    // Calculate ad revenue
    const impressionsPerUser = {
      low: 3,
      medium: 6,
      high: 10
    }[state.monetizationStrategy.adFrequency];

    const adRevenue = (state.phase2Results.dau * impressionsPerUser * (fillRate / 100) * (finalEcpm / 1000)).toFixed(2);
    
    // Calculate IAP revenue
    const iapRevenue = (baseIapRevenue * iapPricingMultiplier * promoMultiplier).toFixed(2);

    // Calculate ARPDAU
    const totalRevenue = parseFloat(adRevenue) + parseFloat(iapRevenue);
    const arpdau = (totalRevenue / state.phase2Results.dau).toFixed(2);

    const results = {
      arpdau,
      adRevenue,
      iapRevenue,
      fillRate,
      eCPM: finalEcpm.toFixed(2)
    };

    dispatch({ type: 'SET_PHASE3_RESULTS', payload: results });
    setShowResults(true);
  };

  const proceedToFinalResults = () => {
    // Calculate final ROAS and insights
    const totalRevenue = parseFloat(state.phase3Results.adRevenue) + parseFloat(state.phase3Results.iapRevenue);
    const totalSpend = state.budget;
    const roas = (totalRevenue / totalSpend).toFixed(2);

    // Generate insights based on performance
    const insights = [];
    if (roas < 1) {
      insights.push("Your campaign is currently unprofitable. Consider optimizing ad targeting and reducing acquisition costs.");
    } else {
      insights.push("Your campaign is profitable! Focus on scaling while maintaining efficiency.");
    }

    if (state.phase2Results.retentionRates.d7 < 20) {
      insights.push("Low retention rates are affecting your revenue. Consider improving user engagement strategies.");
    }

    if (state.phase3Results.arpdau < 0.10) {
      insights.push("Your ARPDAU is below industry average. Test different monetization strategies to improve revenue.");
    }

    dispatch({
      type: 'SET_FINAL_RESULTS',
      payload: {
        totalSpend,
        totalRevenue,
        roas,
        insights
      }
    });

    dispatch({ type: 'SET_PHASE', payload: 'results' });
  };

  if (showResults) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto py-8"
      >
        <div className="card">
          <h3 className="text-2xl font-bold text-blue-900 mb-6">Monetization Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-50 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Revenue Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Tooltip
                    term="ARPDAU"
                    explanation="Average Revenue Per Daily Active User - How much revenue you generate from each active user per day"
                  >
                    <span>ARPDAU:</span>
                  </Tooltip>
                  <span className="font-semibold">${state.phase3Results.arpdau}</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="Ad Revenue"
                    explanation="Daily revenue generated from all ad formats"
                  >
                    <span>Ad Revenue:</span>
                  </Tooltip>
                  <span className="font-semibold">${state.phase3Results.adRevenue}</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="IAP Revenue"
                    explanation="Daily revenue generated from in-app purchases"
                  >
                    <span>IAP Revenue:</span>
                  </Tooltip>
                  <span className="font-semibold">${state.phase3Results.iapRevenue}</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-semibold mb-4">Ad Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <Tooltip
                    term="Fill Rate"
                    explanation="Percentage of ad requests that were successfully filled with ads"
                  >
                    <span>Fill Rate:</span>
                  </Tooltip>
                  <span className="font-semibold">{state.phase3Results.fillRate}%</span>
                </div>
                <div className="flex justify-between">
                  <Tooltip
                    term="eCPM"
                    explanation="Effective Cost Per Mille - Average revenue earned per thousand ad impressions"
                  >
                    <span>eCPM:</span>
                  </Tooltip>
                  <span className="font-semibold">${state.phase3Results.eCPM}</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={proceedToFinalResults}
            className="btn-primary w-full"
          >
            View Final Results →
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
        className="mb-6 w-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
      >
        🎯 Simulate Monetization Strategy
      </button>

      {showSimulator && (
        <StrategySimulator
          phase="monetization"
          currentStrategy={state}
          onClose={() => setShowSimulator(false)}
        />
      )}
      <div className="card">
        <h3 className="text-2xl font-bold text-blue-900 mb-6">Phase 3: Monetization</h3>
        
        <div className="space-y-8">
          <div>
            <Tooltip
              term="Ad Formats"
              explanation="Different ad formats have varying impacts on user experience and revenue. Choose a mix that balances both."
            >
              <h4 className="font-semibold mb-3">Ad Formats</h4>
            </Tooltip>
            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  id: 'rewarded',
                  name: 'Rewarded Video Ads',
                  description: 'Users receive in-app rewards for watching'
                },
                {
                  id: 'interstitial',
                  name: 'Interstitial Ads',
                  description: 'Full-screen ads between activities'
                },
                {
                  id: 'banner',
                  name: 'Banner Ads',
                  description: 'Small ads at screen edges'
                }
              ].map((format) => (
                <button
                  key={format.id}
                  onClick={() => toggleAdFormat(format.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    state.monetizationStrategy.adFormats.includes(format.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="font-semibold">{format.name}</div>
                  <div className="text-sm text-gray-600">{format.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tooltip
              term="Ad Frequency"
              explanation="Higher ad frequency can increase revenue but may negatively impact user experience."
            >
              <h4 className="font-semibold mb-3">Ad Frequency</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => handleStrategyChange('adFrequency', frequency.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.monetizationStrategy.adFrequency === frequency.toLowerCase()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {frequency}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tooltip
              term="IAP Pricing"
              explanation="In-App Purchase pricing affects conversion rates and revenue per purchase."
            >
              <h4 className="font-semibold mb-3">IAP Pricing Strategy</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['Low', 'Medium', 'High'].map((level) => (
                <button
                  key={level}
                  onClick={() => handleStrategyChange('iapPricing', level.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.monetizationStrategy.iapPricing === level.toLowerCase()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Tooltip
              term="Promotional Offers"
              explanation="Special offers can boost IAP conversions but may reduce average revenue per purchase."
            >
              <h4 className="font-semibold mb-3">Promotional Offers</h4>
            </Tooltip>
            <div className="grid grid-cols-3 gap-3">
              {['None', 'Limited', 'Frequent'].map((frequency) => (
                <button
                  key={frequency}
                  onClick={() => handleStrategyChange('promotionalOffers', frequency.toLowerCase())}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    state.monetizationStrategy.promotionalOffers === frequency.toLowerCase()
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {frequency}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={calculateResults}
            disabled={
              state.monetizationStrategy.adFormats.length === 0 ||
              !state.monetizationStrategy.adFrequency ||
              !state.monetizationStrategy.iapPricing ||
              !state.monetizationStrategy.promotionalOffers
            }
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Calculate Results
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Monetization;
