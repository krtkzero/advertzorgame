import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';

const MAX_HISTORY = 5;

const CampaignHistory = () => {
  const { state } = useGame();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Load history from localStorage
    const savedHistory = JSON.parse(localStorage.getItem('campaignHistory') || '[]');
    setHistory(savedHistory);
  }, []);

  useEffect(() => {
    // Save current campaign when it's completed
    if (state.currentPhase === 'results') {
      const campaign = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        metrics: {
          spend: state.budget,
          revenue: state.finalResults.totalRevenue,
          roas: state.finalResults.roas,
          cpi: state.phase1Results.cpi,
          retentionD7: state.phase2Results.retentionRates.d7,
          arpdau: state.phase3Results.arpdau
        },
        strategies: {
          audience: state.audienceTargeting,
          creatives: state.creativeSelection.formats,
          bidding: state.biddingStrategy,
          retention: state.retentionStrategy,
          monetization: state.monetizationStrategy
        }
      };

      const updatedHistory = [campaign, ...history].slice(0, MAX_HISTORY);
      setHistory(updatedHistory);
      localStorage.setItem('campaignHistory', JSON.stringify(updatedHistory));
    }
  }, [state.currentPhase]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getROASColor = (roas) => {
    if (roas >= 1.5) return 'text-green-600';
    if (roas >= 1) return 'text-blue-600';
    return 'text-red-600';
  };

  if (history.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Campaign History</h2>
        <Tooltip
          term="Campaign History"
          explanation="Compare your past campaigns to identify successful strategies and areas for improvement"
        >
          <span className="text-gray-500 cursor-help">ℹ️</span>
        </Tooltip>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-100">
              <th className="px-4 py-2 text-left text-gray-600">Date</th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="Spend" explanation="Total budget spent on user acquisition">
                  Spend
                </Tooltip>
              </th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="Revenue" explanation="Total revenue generated from ads and IAPs">
                  Revenue
                </Tooltip>
              </th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="ROAS" explanation="Return on Ad Spend - Revenue divided by spend">
                  ROAS
                </Tooltip>
              </th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="CPI" explanation="Cost Per Install">
                  CPI
                </Tooltip>
              </th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="D7 Retention" explanation="Percentage of users active 7 days after install">
                  D7 Ret.
                </Tooltip>
              </th>
              <th className="px-4 py-2 text-right text-gray-600">
                <Tooltip term="ARPDAU" explanation="Average Revenue Per Daily Active User">
                  ARPDAU
                </Tooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {history.map((campaign) => (
              <tr
                key={campaign.id}
                className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-gray-600">
                  {formatDate(campaign.timestamp)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(campaign.metrics.spend)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(campaign.metrics.revenue)}
                </td>
                <td className={`px-4 py-3 text-right font-semibold ${getROASColor(campaign.metrics.roas)}`}>
                  {campaign.metrics.roas}x
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(campaign.metrics.cpi)}
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {campaign.metrics.retentionD7}%
                </td>
                <td className="px-4 py-3 text-right text-gray-600">
                  {formatCurrency(campaign.metrics.arpdau)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Strategy Insights</h3>
        <div className="text-sm text-gray-600">
          {history.length > 1 ? (
            <>
              <p>
                Best ROAS: {formatCurrency(Math.max(...history.map(c => c.metrics.roas)))}x
                {' | '}
                Best Retention: {Math.max(...history.map(c => c.metrics.retentionD7))}%
              </p>
              <p className="mt-2">
                Most successful strategies:
                {history
                  .filter(c => c.metrics.roas >= 1)
                  .map(c => c.strategies.creatives.join(', '))
                  .slice(0, 2)
                  .join(' | ')}
              </p>
            </>
          ) : (
            <p>Complete more campaigns to unlock strategy insights!</p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CampaignHistory;
