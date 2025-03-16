import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Tooltip from './shared/Tooltip';

const FinalResults = () => {
  const { state, dispatch } = useGame();

  const resetGame = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const getROASColor = (roas) => {
    if (roas >= 1.5) return 'text-green-600';
    if (roas >= 1) return 'text-blue-600';
    return 'text-red-600';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-8"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-blue-900">Campaign Results</h2>
        <p className="text-gray-600 mt-2">Here's how your AdTech strategy performed</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold mb-4">User Acquisition</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Tooltip
                term="Campaign Budget"
                explanation="Total amount spent on user acquisition"
              >
                <span>Budget:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.budget)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="Installs"
                explanation="Total number of users who installed your app"
              >
                <span>Installs:</span>
              </Tooltip>
              <span className="font-semibold">{state.phase1Results.installs}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="CPI"
                explanation="Cost Per Install - Average cost to acquire one user"
              >
                <span>CPI:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.phase1Results.cpi)}</span>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-purple-50 to-pink-50">
          <h3 className="text-xl font-semibold mb-4">Retention</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Tooltip
                term="D7 Retention"
                explanation="Percentage of users still active 7 days after install"
              >
                <span>D7 Retention:</span>
              </Tooltip>
              <span className="font-semibold">{state.phase2Results.retentionRates.d7}%</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="DAU"
                explanation="Daily Active Users - Number of unique users who engage with your app daily"
              >
                <span>DAU:</span>
              </Tooltip>
              <span className="font-semibold">{state.phase2Results.dau}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="Session Length"
                explanation="Average time users spend in your app per session"
              >
                <span>Avg Session:</span>
              </Tooltip>
              <span className="font-semibold">{state.phase2Results.sessionLength} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-green-50 to-teal-50 mb-8">
        <h3 className="text-xl font-semibold mb-4">Revenue Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Tooltip
                term="Ad Revenue"
                explanation="Daily revenue generated from all ad formats"
              >
                <span>Ad Revenue:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.phase3Results.adRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="IAP Revenue"
                explanation="Daily revenue generated from in-app purchases"
              >
                <span>IAP Revenue:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.phase3Results.iapRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="ARPDAU"
                explanation="Average Revenue Per Daily Active User"
              >
                <span>ARPDAU:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.phase3Results.arpdau)}</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <Tooltip
                term="Total Revenue"
                explanation="Total daily revenue from all sources"
              >
                <span>Total Revenue:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.finalResults.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="Total Spend"
                explanation="Total amount spent on user acquisition"
              >
                <span>Total Spend:</span>
              </Tooltip>
              <span className="font-semibold">{formatCurrency(state.finalResults.totalSpend)}</span>
            </div>
            <div className="flex justify-between">
              <Tooltip
                term="ROAS"
                explanation="Return on Ad Spend - Revenue divided by ad spend. Above 1 means profitable."
              >
                <span>ROAS:</span>
              </Tooltip>
              <span className={`font-bold ${getROASColor(state.finalResults.roas)}`}>
                {state.finalResults.roas}x
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="card bg-gradient-to-br from-yellow-50 to-orange-50 mb-8">
        <h3 className="text-xl font-semibold mb-4">Key Insights</h3>
        <ul className="space-y-3">
          {state.finalResults.insights.map((insight, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              <span className="text-gray-700">{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={resetGame}
          className="btn-primary bg-gradient-to-r from-blue-600 to-blue-700"
        >
          Try Another Campaign
        </motion.button>
      </div>
    </motion.div>
  );
};

export default FinalResults;
