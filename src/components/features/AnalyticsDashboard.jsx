import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie,
  Cell
} from 'recharts';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';

const AnalyticsDashboard = () => {
  const { state } = useGame();

  // Prepare retention data
  const retentionData = [
    { day: 'D1', rate: state.phase2Results.retentionRates.d1 },
    { day: 'D7', rate: state.phase2Results.retentionRates.d7 },
    { day: 'D30', rate: state.phase2Results.retentionRates.d30 }
  ];

  // Prepare creative performance data
  const creativeData = state.creativeSelection.formats.map(format => ({
    name: format,
    ctr: (Math.random() * 5 + 2).toFixed(2), // Simulated CTR per format
    cvr: (Math.random() * 3 + 1).toFixed(2)  // Simulated CVR per format
  }));

  // Prepare revenue split data
  const revenueSplitData = [
    {
      name: 'Ad Revenue',
      value: parseFloat(state.phase3Results.adRevenue)
    },
    {
      name: 'IAP Revenue',
      value: parseFloat(state.phase3Results.iapRevenue)
    }
  ];

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <h2 className="text-2xl font-bold text-blue-900 mb-6">Campaign Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Retention Curve */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            <Tooltip
              term="Retention Curve"
              explanation="Shows how many users continue to use your app over time"
            >
              Retention Curve
            </Tooltip>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={retentionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <RechartsTooltip />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#4F46E5"
                strokeWidth={2}
                dot={{ fill: '#4F46E5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Creative Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            <Tooltip
              term="Creative Performance"
              explanation="Comparison of Click-Through Rate (CTR) and Conversion Rate (CVR) across different ad formats"
            >
              Creative Performance
            </Tooltip>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={creativeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="ctr" fill="#4F46E5" name="CTR %" />
              <Bar dataKey="cvr" fill="#10B981" name="CVR %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Split */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">
            <Tooltip
              term="Revenue Split"
              explanation="Distribution of revenue between advertising and in-app purchases"
            >
              Revenue Split
            </Tooltip>
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={revenueSplitData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => 
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {revenueSplitData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics Summary */}
        <div className="card bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-lg font-semibold mb-4">Key Metrics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>ROAS</span>
              <span className="font-semibold">{state.finalResults.roas}x</span>
            </div>
            <div className="flex justify-between">
              <span>ARPDAU</span>
              <span className="font-semibold">${state.phase3Results.arpdau}</span>
            </div>
            <div className="flex justify-between">
              <span>D7 Retention</span>
              <span className="font-semibold">{state.phase2Results.retentionRates.d7}%</span>
            </div>
            <div className="flex justify-between">
              <span>eCPM</span>
              <span className="font-semibold">${state.phase3Results.eCPM}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
