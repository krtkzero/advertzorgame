import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';

const Acquisition = () => {
  const { state, dispatch } = useGame();

  const handleBudgetChange = (event) => {
    const budget = parseInt(event.target.value);
    dispatch({
      type: 'SET_BUDGET',
      payload: budget
    });
  };

  const handleProceed = () => {
    // Calculate initial results based on budget
    const results = {
      installs: Math.floor(state.budget * 2), // Simplified calculation
      cpi: (state.budget / (state.budget * 2)).toFixed(2),
      ctr: '3.5',
      clicks: Math.floor(state.budget * 2 / 0.035)
    };

    dispatch({ type: 'SET_PHASE1_RESULTS', payload: results });
    dispatch({ type: 'SET_PHASE', payload: 'retention' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto py-8 px-4"
    >
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-blue-900 mb-6">Campaign Budget Allocation</h2>
        
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <Tooltip
              term="Campaign Budget"
              explanation="The amount you want to spend on user acquisition. Higher budgets typically result in more installs."
            >
              <h3 className="text-2xl font-bold text-gray-800">Select Your Budget</h3>
            </Tooltip>
            <span className="text-3xl font-bold text-green-600">${state.budget || 500}</span>
          </div>

          <div className="relative pt-2">
            <input
              type="range"
              min="500"
              max="2000"
              step="100"
              value={state.budget || 500}
              onChange={handleBudgetChange}
              className="w-full h-4 rounded-lg appearance-none cursor-pointer bg-gray-200 hover:bg-gray-300 transition-colors"
              style={{
                background: `linear-gradient(to right, #10B981 0%, #10B981 ${((state.budget || 500) - 500) / 15}%, #E5E7EB ${((state.budget || 500) - 500) / 15}%, #E5E7EB 100%)`
              }}
            />
            <div className="flex justify-between mt-4">
              <span className="text-xl font-semibold text-gray-700">$500</span>
              <span className="text-xl font-semibold text-gray-700">$2000</span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-6 mb-8">
          <h4 className="text-lg font-semibold text-blue-900 mb-4">Estimated Performance</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Tooltip
                term="Estimated Installs"
                explanation="Projected number of app installations based on your budget and market conditions"
              >
                <p className="text-gray-600">Estimated Installs</p>
              </Tooltip>
              <p className="text-2xl font-bold text-blue-900">{Math.floor(state.budget * 2)}</p>
            </div>
            <div>
              <Tooltip
                term="Estimated CPI"
                explanation="Cost Per Install - The average cost to acquire one user"
              >
                <p className="text-gray-600">Estimated CPI</p>
              </Tooltip>
              <p className="text-2xl font-bold text-blue-900">
                ${(state.budget / (state.budget * 2)).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleProceed}
          className="w-full bg-green-500 hover:bg-green-600 text-white text-xl font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          Launch Campaign →
        </button>
      </div>
    </motion.div>
  );
};

export default Acquisition;