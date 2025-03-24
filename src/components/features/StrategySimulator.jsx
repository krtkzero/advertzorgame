import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { simulateUA, simulateRetention, simulateMonetization } from '../../utils/simulator';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const StrategySimulator = ({ phase, metrics, genreMetrics }) => {
  const [feedback, setFeedback] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [simResults, setSimResults] = useState(null);

  useEffect(() => {
    if (!metrics || !genreMetrics) return;

    let results;
    switch (phase) {
      case 'ua':
        results = simulateUA(
          metrics.budget,
          metrics.ageGroup,
          metrics.interests,
          metrics.creatives,
          genreMetrics
        );
        setChartData([
          { name: 'Current', CTR: results.ctr * 100, CPI: results.cpi, Installs: results.installs },
          { name: 'Target', CTR: 5, CPI: 1.5, Installs: metrics.budget / 1.5 }
        ]);
        break;
      case 'retention':
        results = simulateRetention(
          metrics.installs,
          metrics.notificationFreq,
          metrics.contentUpdates,
          metrics.specialEvents,
          genreMetrics
        );
        setChartData([
          { name: 'D1', value: results.d1 },
          { name: 'D7', value: results.d7 },
          { name: 'D30', value: results.d30 }
        ]);
        break;
      case 'monetization':
        results = simulateMonetization(
          metrics.dau,
          metrics.adFrequency,
          metrics.adFormats,
          metrics.iapPricing,
          metrics.promotionalOffers,
          genreMetrics
        );
        setChartData([
          { name: 'Current', ARPDAU: results.arpdau, ROAS: results.roas },
          { name: 'Target', ARPDAU: 0.85, ROAS: 0.75 }
        ]);
        break;
    }

    if (results) {
      setSimResults(results);
      setFeedback(results.feedback || []);
    }
  }, [phase, metrics, genreMetrics]);

  if (!simResults) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-xl p-4 z-50"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Strategy Simulator</h3>
          <div className="flex space-x-2">
            {phase === 'ua' && (
              <>
                <MetricBadge
                  label="CTR"
                  value={`${(simResults.ctr * 100).toFixed(1)}%`}
                  target="5.0%"
                />
                <MetricBadge
                  label="CPI"
                  value={`$${simResults.cpi.toFixed(2)}`}
                  target="$1.50"
                />
                <MetricBadge
                  label="Installs"
                  value={simResults.installs}
                  target={Math.floor(metrics.budget / 1.5)}
                />
              </>
            )}
            {phase === 'retention' && (
              <>
                <MetricBadge
                  label="D1"
                  value={`${simResults.d1.toFixed(1)}%`}
                  target="30.0%"
                />
                <MetricBadge
                  label="D7"
                  value={`${simResults.d7.toFixed(1)}%`}
                  target="18.0%"
                />
                <MetricBadge
                  label="DAU"
                  value={simResults.dau}
                  target={Math.floor(metrics.installs * 0.18)}
                />
              </>
            )}
            {phase === 'monetization' && (
              <>
                <MetricBadge
                  label="ARPDAU"
                  value={`$${simResults.arpdau.toFixed(2)}`}
                  target="$0.85"
                />
                <MetricBadge
                  label="Fill Rate"
                  value={`${(simResults.fillRate * 100).toFixed(1)}%`}
                  target="90.0%"
                />
                <MetricBadge
                  label="ROAS"
                  value={`${simResults.roas.toFixed(2)}x`}
                  target="0.75x"
                />
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Performance Chart</h4>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  {Object.keys(chartData[0] || {}).map((key, index) => (
                    key !== 'name' && (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={`hsl(${index * 60}, 70%, 50%)`}
                        strokeWidth={2}
                      />
                    )
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-600 mb-2">Strategic Feedback</h4>
            <div className="space-y-2">
              <AnimatePresence mode="wait">
                {feedback.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-sm text-gray-700 bg-white p-2 rounded shadow-sm"
                  >
                    {msg}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MetricBadge = ({ label, value, target }) => {
  const isGood = parseFloat(value) >= parseFloat(target);
  
  return (
    <div className="bg-gray-100 rounded-lg px-3 py-1">
      <div className="text-xs font-medium text-gray-500">{label}</div>
      <div className={`text-sm font-semibold ${isGood ? 'text-green-600' : 'text-red-600'}`}>
        {value}
      </div>
    </div>
  );
};

export default StrategySimulator;
