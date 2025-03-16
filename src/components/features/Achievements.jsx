import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import Tooltip from '../shared/Tooltip';

const achievements = [
  {
    id: 'roas_rookie',
    title: 'ROAS Rookie',
    description: 'Achieve a ROAS above 1.0',
    icon: '🎯',
    condition: (state) => state.finalResults.roas >= 1.0
  },
  {
    id: 'retention_master',
    title: 'Retention Master',
    description: 'Achieve Day-7 Retention above 30%',
    icon: '🌟',
    condition: (state) => state.phase2Results.retentionRates.d7 >= 30
  },
  {
    id: 'monetization_pro',
    title: 'Ad Monetization Pro',
    description: 'Generate ARPDAU greater than $0.50',
    icon: '💰',
    condition: (state) => parseFloat(state.phase3Results.arpdau) >= 0.50
  },
  {
    id: 'creative_genius',
    title: 'Creative Genius',
    description: 'Achieve CTR above 5%',
    icon: '🎨',
    condition: (state) => parseFloat(state.phase1Results.ctr) >= 5.0
  },
  {
    id: 'engagement_expert',
    title: 'Engagement Expert',
    description: 'Achieve session length above 20 minutes',
    icon: '⏱️',
    condition: (state) => state.phase2Results.sessionLength >= 20
  }
];

const Achievement = ({ achievement, unlocked }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-4 rounded-xl ${
      unlocked 
        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200' 
        : 'bg-gray-50 border-2 border-gray-200'
    }`}
  >
    <div className="flex items-center space-x-3">
      <span className="text-2xl">{achievement.icon}</span>
      <div>
        <h3 className="font-semibold">{achievement.title}</h3>
        <p className="text-sm text-gray-600">{achievement.description}</p>
      </div>
      {unlocked && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="ml-auto text-green-500"
        >
          ✓
        </motion.div>
      )}
    </div>
  </motion.div>
);

const Achievements = () => {
  const { state } = useGame();
  
  const unlockedAchievements = achievements.filter(achievement => 
    achievement.condition(state)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-2xl bg-white p-6 shadow-lg"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900">Achievements</h2>
        <p className="text-gray-600">
          {unlockedAchievements.length} of {achievements.length} unlocked
        </p>
      </div>

      <div className="space-y-4">
        {achievements.map(achievement => (
          <Achievement
            key={achievement.id}
            achievement={achievement}
            unlocked={achievement.condition(state)}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Achievements;
