// Core simulation logic for campaign performance prediction
const VARIANCE_RANGE = { min: 0.05, max: 0.15 };
const POSITIVE_EVENT_PROBABILITY = 0.3; // 30% chance of positive events
const NEGATIVE_EVENT_PROBABILITY = 0.2; // 20% chance of negative events

// Game balance constants
const GAME_CONSTANTS = {
  BASE_CPI: 1.20,  // Reduced from 1.50
  BASE_ECPM: 14.00,  // Increased from 11.50
  AGE_RANGES: {
    '18-24': { cpi: 0.85, retention: 1.3, monetization: 0.7 },  // Younger users: Lower CPI, higher retention, lower monetization
    '25-34': { cpi: 0.95, retention: 1.2, monetization: 0.9 },  // Young adults: Balanced metrics
    '35-44': { cpi: 1.1, retention: 1.1, monetization: 1.2 },   // Middle age: Higher CPI, good retention and monetization
    '45-54': { cpi: 1.2, retention: 1.0, monetization: 1.4 },   // Higher spending power
    '55-64': { cpi: 1.3, retention: 0.9, monetization: 1.5 },   // Highest monetization
    '65-84+': { cpi: 1.4, retention: 0.8, monetization: 1.6 }   // Premium users
  },
  RETENTION_FLOORS: {
    D1: 0.35,  // Increased from 0.30
    D7: 0.22,  // Increased from 0.18
    D30: 0.15  // Increased from 0.10
  },
  PERFORMANCE_FLOORS: {
    CTR: 0.02,     // 2% minimum CTR (up from 1.5%)
    RETENTION: 0.08, // 8% minimum retention (up from 5%)
    ROAS: 0.5      // 0.5x minimum ROAS (up from 0.5x)
  },
  FILL_RATE: {
    MIN: 0.85,  // Increased from 0.80
    MAX: 1.00
  },
  AD_FREQUENCY_PENALTIES: {
    HIGH: -0.02,   // Reduced from -0.03
    MEDIUM: -0.01  // Reduced from -0.02
  }
};

// Feedback message pools
const FEEDBACK_POOLS = {
  CTR_LOW: [
    "Your CTR is underperforming. Try increasing your video ad share for better engagement.",
    "Users aren't clicking enough—consider adding more attractive creative formats.",
    "Your CTR is low—have you considered switching to a different geo or adjusting creative tone?",
    "Try A/B testing creative styles to improve CTR.",
    "CTR might improve with more audience-specific messaging—try adjusting ad copy."
  ],
  AUDIENCE_BROAD: [
    "Consider expanding your target age group to increase reach.",
    "Your audience targeting is too narrow—try adding another interest for better scale.",
    "Expanding audience targeting could reduce CPI and increase installs.",
    "Consider testing different audience segments for better CTR.",
    "Reaching more users might improve ad efficiency and lower CPI."
  ],
  CREATIVE_PERFORMANCE: [
    "Video ads are outperforming banners—consider increasing video split.",
    "Playable ads are delivering higher CVR—consider using more playable formats.",
    "Static banners aren't performing well—switch to video or interactive formats.",
    "Interactive ads show better engagement—try increasing their share.",
    "Consider testing new creative variations to improve performance."
  ],
  RETENTION: [
    "Retention dropped after D1—try increasing push notification frequency.",
    "Engagement might improve with more frequent content updates.",
    "Users are churning too early—try reducing ad frequency to improve session length.",
    "Consider adding more engaging features to improve retention.",
    "Try implementing a daily reward system to boost retention."
  ],
  MONETIZATION: [
    "ARPDAU is underperforming—consider increasing rewarded ad frequency.",
    "Interstitial ads might be too frequent—try reducing to improve retention.",
    "IAP revenue could increase with better pricing tiers.",
    "Try optimizing ad placement to improve viewability.",
    "Consider implementing dynamic pricing for IAPs."
  ],
  POSITIVE: [
    "Nice work! Your video ad split is driving high CTR.",
    "Your retention is strong—keep up the engagement!",
    "Great work—ROAS is improving with the current ad format strategy.",
    "Excellent balance of ad formats and frequency!",
    "Your monetization strategy is showing great results!"
  ]
};

// Helper function to get weighted random feedback
const getWeightedFeedback = (metrics) => {
  const feedback = [];
  const weights = {
    CTR_LOW: metrics.ctr < 0.02 ? 0.4 : 0.1,
    AUDIENCE_BROAD: metrics.cpi > GAME_CONSTANTS.BASE_CPI ? 0.3 : 0.1,
    CREATIVE_PERFORMANCE: metrics.cvr < 0.08 ? 0.3 : 0.1,
    RETENTION: metrics.retention?.d7 < GAME_CONSTANTS.RETENTION_FLOORS.D7 ? 0.4 : 0.1,
    MONETIZATION: metrics.arpdau < 0.5 ? 0.4 : 0.1,
    POSITIVE: metrics.roas > 0.7 ? 0.5 : 0.2
  };

  // Get 2-3 feedback messages based on weights
  const categories = Object.keys(weights);
  const totalMessages = Math.floor(Math.random() * 2) + 2; // 2-3 messages

  for (let i = 0; i < totalMessages; i++) {
    const roll = Math.random();
    let cumulative = 0;
    
    for (const category of categories) {
      cumulative += weights[category];
      if (roll <= cumulative) {
        const messages = FEEDBACK_POOLS[category];
        const message = messages[Math.floor(Math.random() * messages.length)];
        if (!feedback.includes(message)) {
          feedback.push(message);
          break;
        }
      }
    }
  }

  return feedback;
};

// Base metrics after game balance adjustments
const BASE_METRICS = {
  cpi: {
    base: GAME_CONSTANTS.BASE_CPI,
    modifiers: {
      creativeType: {
        gameplay_video: 0.9,
        playable_ad: 0.85,
        educational_video: 1.1,
        static_banner: 1.2,
        rewarded_video: 0.95
      },
      ageGroup: GAME_CONSTANTS.AGE_RANGES,
      interest: {
        gaming: 0.85,
        education: 1.1,
        lifestyle: 1.0
      }
    }
  },
  retention: {
    d1: GAME_CONSTANTS.RETENTION_FLOORS.D1,
    d7: GAME_CONSTANTS.RETENTION_FLOORS.D7,
    d30: GAME_CONSTANTS.RETENTION_FLOORS.D30,
    modifiers: {
      notification: {
        none: 0.8,
        occasional: 1.2,
        frequent: 0.9
      },
      contentUpdates: {
        rare: 0.7,
        regular: 1.0,
        frequent: 1.3
      },
      specialEvents: 1.2
    }
  },
  monetization: {
    fillRate: {
      low: 0.80,
      medium: 0.90,
      high: 1.00
    },
    baseEcpm: GAME_CONSTANTS.BASE_ECPM,
    adFormatMultiplier: {
      rewarded: 1.3,
      interstitial: 1.2,
      banner: 0.8
    },
    iapConversion: {
      low: 0.01,
      medium: 0.02,
      high: 0.03
    }
  }
};

// Random event definitions
const EVENTS = {
  positive: [
    {
      name: 'Viral Boost',
      impact: {
        installs: 1.2,
        ctr: 1.15
      }
    },
    {
      name: 'Seasonal Boost',
      impact: {
        arpdau: 1.15
      }
    }
  ],
  negative: [
    {
      name: 'User Backlash',
      impact: {
        retention: 0.92 // Reduced negative impact by 20%
      }
    },
    {
      name: 'Market Saturation',
      impact: {
        cpi: 1.05
      }
    }
  ]
};

// Add random variance to predictions
const addVariance = (value) => {
  const variance = VARIANCE_RANGE.min + Math.random() * (VARIANCE_RANGE.max - VARIANCE_RANGE.min);
  const multiplier = 1 + (Math.random() > 0.5 ? variance : -variance);
  return value * multiplier;
};

// Simulate random events
const simulateEvents = () => {
  const events = [];
  
  if (Math.random() < POSITIVE_EVENT_PROBABILITY) {
    events.push(EVENTS.positive[Math.floor(Math.random() * EVENTS.positive.length)]);
  }
  
  if (Math.random() < NEGATIVE_EVENT_PROBABILITY) {
    events.push(EVENTS.negative[Math.floor(Math.random() * EVENTS.negative.length)]);
  }
  
  return events;
};

// Apply genre-specific modifiers
const applyGenreModifiers = (value, genreMetrics, metricType) => {
  if (!genreMetrics) return value;
  
  switch (metricType) {
    case 'cpi':
      return value * genreMetrics.cpi;
    case 'retention':
      return value * genreMetrics.retention[metricType];
    case 'adRevenue':
      return value * genreMetrics.adRevenue;
    case 'iapRevenue':
      return value * genreMetrics.iapRevenue;
    case 'sessionLength':
      return value * genreMetrics.sessionLength;
    default:
      return value;
  }
};

// Apply modifiers with a cap on negative impact
const applyModifiers = (value, modifiers) => {
  let result = value;
  result = Math.max(result * modifiers.reduce((acc, mod) => acc * mod, 1), GAME_CONSTANTS.PERFORMANCE_FLOORS.ROAS);
  return result;
};

// UA Phase Simulation
export const simulateUA = (budget, ageGroup, interests, formats, genreMetrics) => {
  // Base calculations with improved rates
  let ctr = 0.03 + (Math.random() * 0.06);  // Increased base CTR range (3-9%)
  let cvr = 0.10 + (Math.random() * 0.05);  // Improved conversion rate (10-15%)
  let cpi = GAME_CONSTANTS.BASE_CPI;

  // Apply video format bonus with higher multipliers
  const videoShare = formats.filter(f => f === 'video').length / formats.length;
  if (videoShare >= 0.6) {
    ctr *= 1.4;  // 40% boost for video-heavy mix (up from 30%)
    cvr *= 1.3;  // 30% boost to conversion (up from 20%)
  }

  // Apply age range modifiers
  const ageRangeModifier = GAME_CONSTANTS.AGE_RANGES[ageGroup] || GAME_CONSTANTS.AGE_RANGES['25-34'];
  cpi *= ageRangeModifier.cpi;

  // Apply genre metrics with a cap on negative impact
  cpi *= Math.min(genreMetrics.cpi, 1.2); // Cap CPI increase at 20%
  
  // Apply floors
  ctr = Math.max(ctr, GAME_CONSTANTS.PERFORMANCE_FLOORS.CTR);
  
  // Calculate results
  const installs = Math.floor((budget / cpi) * (ctr * cvr));
  
  return {
    ctr,
    cvr,
    cpi,
    installs,
    feedback: getWeightedFeedback({ ctr, cvr, cpi })
  };
};

// Retention Phase Simulation
export const simulateRetention = (installs, notificationFreq, contentUpdates, specialEvents, genreMetrics) => {
  // Base retention rates
  let d1 = GAME_CONSTANTS.RETENTION_FLOORS.D1;
  let d7 = GAME_CONSTANTS.RETENTION_FLOORS.D7;
  let d30 = GAME_CONSTANTS.RETENTION_FLOORS.D30;

  // Apply notification boost with higher multipliers
  if (notificationFreq === 'frequent') {
    d1 *= 1.3;  // 30% boost (up from 20%)
    d7 *= 1.25; // 25% boost (up from 15%)
    d30 *= 1.2; // 20% boost (up from 10%)
  } else if (notificationFreq === 'occasional') {
    d1 *= 1.15;
    d7 *= 1.12;
    d30 *= 1.1;
  }

  // Apply content update boost with higher multipliers
  if (contentUpdates === 'frequent') {
    d7 *= 1.3;   // 30% boost (up from 20%)
    d30 *= 1.35; // 35% boost (up from 25%)
  } else if (contentUpdates === 'regular') {
    d7 *= 1.15;
    d30 *= 1.2;
  }

  // Apply special events boost with higher impact
  if (specialEvents) {
    d7 *= 1.25;  // 25% boost (up from 15%)
    d30 *= 1.3;  // 30% boost (up from 20%)
  }

  // Apply genre metrics with a cap on negative impact
  d1 *= Math.max(genreMetrics.retention.d1, 0.8);  // Cap retention loss at 20%
  d7 *= Math.max(genreMetrics.retention.d7, 0.8);
  d30 *= Math.max(genreMetrics.retention.d30, 0.8);

  // Apply floors
  d1 = Math.max(d1, GAME_CONSTANTS.PERFORMANCE_FLOORS.RETENTION);
  d7 = Math.max(d7, GAME_CONSTANTS.PERFORMANCE_FLOORS.RETENTION);
  d30 = Math.max(d30, GAME_CONSTANTS.PERFORMANCE_FLOORS.RETENTION);

  // Calculate DAU with improved retention
  const dau = Math.floor(installs * (d7 / 100) * 1.2); // 20% bonus to DAU

  return {
    d1,
    d7,
    d30,
    dau,
    feedback: getWeightedFeedback({ retention: { d1, d7, d30 } })
  };
};

// Monetization Phase Simulation
export const simulateMonetization = (dau, adFrequency, adFormats, iapPricing, promotionalOffers, genreMetrics) => {
  // Base calculations with improved rates
  let fillRate = GAME_CONSTANTS.FILL_RATE.MIN + (Math.random() * (GAME_CONSTANTS.FILL_RATE.MAX - GAME_CONSTANTS.FILL_RATE.MIN));
  let ecpm = GAME_CONSTANTS.BASE_ECPM;
  let iapRevenue = 0;
  
  // Calculate ad revenue with higher multipliers
  const adMultiplier = adFrequency === 'high' ? 1.8 : adFrequency === 'medium' ? 1.3 : 0.7;  // Increased multipliers
  let adRevenue = (dau * (ecpm / 1000) * fillRate * adMultiplier);

  // Calculate IAP revenue with higher conversion rates
  if (iapPricing === 'premium') {
    iapRevenue = dau * 0.07 * 9.99;  // 7% conversion at $9.99 (up from 5%)
  } else if (iapPricing === 'standard') {
    iapRevenue = dau * 0.12 * 4.99;  // 12% conversion at $4.99 (up from 8%)
  } else {
    iapRevenue = dau * 0.18 * 1.99;  // 18% conversion at $1.99 (up from 12%)
  }

  // Apply promotional boost with higher impact
  if (promotionalOffers) {
    iapRevenue *= 1.35;  // 35% boost (up from 25%)
  }

  // Apply genre metrics with a cap on negative impact
  adRevenue *= Math.max(genreMetrics.adRevenue, 0.8);   // Cap revenue loss at 20%
  iapRevenue *= Math.max(genreMetrics.iapRevenue, 0.8);

  // Calculate ARPDAU and ROAS with improved rates
  const arpdau = (adRevenue + iapRevenue) / dau;
  const roas = applyModifiers(arpdau * 30 / GAME_CONSTANTS.BASE_CPI, [1]);

  return {
    fillRate,
    ecpm,
    adRevenue,
    iapRevenue,
    arpdau,
    roas,
    feedback: getWeightedFeedback({ arpdau, roas })
  };
};
