// Genre-specific power-up configurations
export const GENRE_POWERS = {
  'Casual Game': {
    powerUps: [
      { label: '+10% Installs (Viral Effect)', modifier: { installs: 1.10 } },
      { label: '+5% CTR for Video Ads', modifier: { ctr: 1.05 } }
    ],
    powerDowns: [
      { label: '-5% Retention (Short Sessions)', modifier: { retention: 0.95 } }
    ]
  },
  'Social App': {
    powerUps: [
      { label: '+15% D1 Retention', modifier: { retentionD1: 1.15 } },
      { label: '+10% CTR from Sharing', modifier: { ctr: 1.10 } }
    ],
    powerDowns: [
      { label: '+10% Higher CPI', modifier: { cpi: 1.10 } }
    ]
  },
  'Education App': {
    powerUps: [
      { label: '+20% IAP Revenue', modifier: { iapRevenue: 1.20 } },
      { label: '+5% D7 Retention', modifier: { retentionD7: 1.05 } }
    ],
    powerDowns: [
      { label: '-10% Banner CTR', modifier: { bannerCTR: 0.90 } }
    ]
  },
  'Fitness & Health': {
    powerUps: [
      { label: '+5% Retention Boost', modifier: { retentionD1: 1.05 } },
      { label: '+15% ARPDAU', modifier: { arpdau: 1.15 } }
    ],
    powerDowns: [
      { label: '-10% Installs', modifier: { installs: 0.90 } }
    ]
  },
  'Productivity App': {
    powerUps: [
      { label: '+20% Ad Revenue', modifier: { adRevenue: 1.20 } },
      { label: '+5% Fill Rate', modifier: { fillRate: 1.05 } }
    ],
    powerDowns: [
      { label: '-5% Retention', modifier: { retentionD1: 0.95 } }
    ]
  }
};

export const applyGenreModifiers = (metrics, genre) => {
  const modifiers = GENRE_POWERS[genre] || {};
  return {
    ...metrics,
    ...Object.entries(modifiers.powerUps || {}).reduce((acc, [_, { modifier }]) => ({
      ...acc,
      ...Object.fromEntries(Object.entries(modifier).map(([k, v]) => [k, acc[k] * v]))
    }), metrics),
    ...Object.entries(modifiers.powerDowns || {}).reduce((acc, [_, { modifier }]) => ({
      ...acc,
      ...Object.fromEntries(Object.entries(modifier).map(([k, v]) => [k, acc[k] * v]))
    }), metrics)
  };
};
