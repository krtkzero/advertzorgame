import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import Tooltip from './shared/Tooltip';

const HomeScreen = () => {
  const { dispatch } = useGame();

  const handleStart = () => {
    dispatch({ type: 'SET_PHASE', payload: 'acquisition' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center py-12"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-5xl font-bold text-blue-900 mb-4">
          🎯 Advertzor
        </h1>
        <p className="text-2xl text-blue-700 font-semibold">
          The Ultimate AdTech Simulator
        </p>
      </motion.div>

      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-4">Welcome to Advertzor!</h2>
        <p className="text-gray-600 mb-6">
          Step into the shoes of a mobile app marketer and master the art of:
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50 p-4 rounded-xl">
            <h3 className="font-semibold text-blue-900 mb-2">User Acquisition</h3>
            <p className="text-sm text-gray-600">
              Master campaign targeting and bidding strategies
            </p>
          </div>
          
          <div className="card bg-purple-50 p-4 rounded-xl">
            <h3 className="font-semibold text-purple-900 mb-2">Retention</h3>
            <p className="text-sm text-gray-600">
              Keep users engaged and coming back
            </p>
          </div>
          
          <div className="card bg-green-50 p-4 rounded-xl">
            <h3 className="font-semibold text-green-900 mb-2">Monetization</h3>
            <p className="text-sm text-gray-600">
              Optimize revenue streams effectively
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Key Metrics You'll Master:</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Tooltip
              term="ROAS"
              explanation="Return on Ad Spend measures revenue earned for each dollar spent on ads. Higher ROAS means your campaigns are profitable."
            >
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">ROAS</span>
            </Tooltip>
            <Tooltip
              term="CTR"
              explanation="Click-Through Rate is the percentage of users who click on your ad after seeing it. Higher CTR indicates more engaging ad creative."
            >
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">CTR</span>
            </Tooltip>
            <Tooltip
              term="CPI"
              explanation="Cost Per Install represents how much you pay for each user who installs your app through your ad campaign."
            >
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">CPI</span>
            </Tooltip>
            <Tooltip
              term="ARPDAU"
              explanation="Average Revenue Per Daily Active User shows how much revenue you generate from each active user per day."
            >
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm font-medium">ARPDAU</span>
            </Tooltip>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleStart}
          className="btn-primary text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700"
        >
          Start Simulation
        </motion.button>
      </div>
    </motion.div>
  );
};

export default HomeScreen;
