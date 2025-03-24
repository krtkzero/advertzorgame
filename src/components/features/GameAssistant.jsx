import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';

const recommendations = {
  acquisition: {
    highCpi: {
      condition: (state) => state.phase1Results.cpi > 2.5,
      message: "Your CPI is high. Try adjusting your bidding strategy or testing different ad formats.",
      icon: "💰"
    },
    lowCtr: {
      condition: (state) => parseFloat(state.phase1Results.ctr) < 1.8,
      message: "Your CTR is low. Try different creative formats or target audiences that might be more interested in your app.",
      icon: "🎯"
    },
    poorTargeting: {
      condition: (state) => state.audienceTargeting.interests.length < 3,
      message: "Broader audience targeting might help you find more potential users. Consider selecting additional interests.",
      icon: "👥"
    },
    highBudgetLowROI: {
      condition: (state) => state.budget > 1500 && state.phase1Results.cpi > 2.0,
      message: "High budget but low ROI. Consider optimizing your targeting before increasing spend.",
      icon: "📊"
    },
    narrowAgeRange: {
      condition: (state) => {
        const [minAge, maxAge] = state.audienceTargeting.ageRange || [18, 84];
        return (maxAge - minAge) < 20;
      },
      message: "Your age targeting might be too narrow. Consider expanding to reach more potential users.",
      icon: "🎲"
    }
  },
  retention: {
    poorRetention: {
      condition: (state) => state.phase2Results.retentionRates.d7 < 20,
      message: "Your Day 7 retention is low. Consider improving user engagement with more frequent content updates.",
      icon: "📊"
    },
    excessiveNotifications: {
      condition: (state) => state.retentionStrategy.notificationFrequency === 'frequent',
      message: "Frequent notifications might be overwhelming users. Consider reducing frequency to improve retention.",
      icon: "🔔"
    },
    lowEngagement: {
      condition: (state) => state.phase2Results.sessionLength < 10,
      message: "Short session lengths indicate low engagement. Try adding more engaging content or special events.",
      icon: "⏱️"
    }
  },
  monetization: {
    lowArpdau: {
      condition: (state) => parseFloat(state.phase3Results.arpdau) < 0.10,
      message: "Your ARPDAU is below industry average. Consider optimizing your ad placement or IAP pricing strategy.",
      icon: "💰"
    },
    adFatigue: {
      condition: (state) => state.monetizationStrategy.adFrequency === 'high',
      message: "High ad frequency might be causing user fatigue. Consider balancing ad frequency with user experience.",
      icon: "😴"
    },
    missedRevenue: {
      condition: (state) => !state.monetizationStrategy.adFormats.includes('rewarded'),
      message: "Rewarded video ads often have high engagement. Consider adding them to your monetization strategy.",
      icon: "🎥"
    }
  }
};

const RecommendationCard = ({ recommendation, onDismiss }) => (
  <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    className="bg-white rounded-lg shadow-lg p-4 mb-3 border-l-4 border-blue-500"
  >
    <div className="flex items-start">
      <span className="text-2xl mr-3">{recommendation.icon}</span>
      <div className="flex-1">
        <p className="text-gray-700">{recommendation.message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-gray-400 hover:text-gray-600 ml-2"
      >
        ×
      </button>
    </div>
  </motion.div>
);

const GameAssistant = ({ phase }) => {
  const { state } = useGame();
  const [activeRecommendation, setActiveRecommendation] = useState(null);
  const [dismissedRecommendations, setDismissedRecommendations] = useState(new Set());

  useEffect(() => {
    if (!recommendations[phase]) return;

    // Get relevant recommendations for current phase
    const eligibleRecommendations = Object.entries(recommendations[phase])
      .filter(([id, rec]) => {
        return rec.condition(state) && !dismissedRecommendations.has(id);
      })
      .map(([id, rec]) => ({ id, ...rec }));

    // Randomly select one recommendation if there are any eligible
    if (eligibleRecommendations.length > 0) {
      const randomIndex = Math.floor(Math.random() * eligibleRecommendations.length);
      setActiveRecommendation(eligibleRecommendations[randomIndex]);
    } else {
      setActiveRecommendation(null);
    }
  }, [phase, state, dismissedRecommendations]);

  const handleDismiss = (recommendationId) => {
    setDismissedRecommendations(prev => new Set([...prev, recommendationId]));
    setActiveRecommendation(null);
  };

  if (!activeRecommendation) return null;

  return (
    <div className="fixed right-4 top-4 w-80 z-50">
      <AnimatePresence>
        <RecommendationCard
          key={activeRecommendation.id}
          recommendation={activeRecommendation}
          onDismiss={() => handleDismiss(activeRecommendation.id)}
        />
      </AnimatePresence>
    </div>
  );
};

export default GameAssistant;
