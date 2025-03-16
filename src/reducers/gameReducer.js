export const initialState = {
  currentPhase: 'home',
  budget: 1000,
  audienceTargeting: {
    ageGroup: null,
    interests: [],
    geo: null,
    deviceType: null
  },
  creativeSelection: {
    formats: [],
    segmentMapping: {}
  },
  biddingStrategy: null,
  phase1Results: {
    impressions: 0,
    clicks: 0,
    ctr: 0,
    installs: 0,
    cvr: 0,
    cpi: 0,
    spend: 0
  },
  retentionStrategy: {
    notificationFrequency: null,
    contentUpdates: null,
    specialEvents: false,
    engagementSpend: null
  },
  phase2Results: {
    retentionRates: {
      d1: 0,
      d7: 0,
      d30: 0
    },
    dau: 0,
    sessionLength: 0
  },
  monetizationStrategy: {
    adFormats: [],
    adFrequency: null,
    iapPricing: null,
    promotionalOffers: null
  },
  phase3Results: {
    arpdau: 0,
    adRevenue: 0,
    iapRevenue: 0,
    fillRate: 0,
    eCPM: 0
  },
  finalResults: {
    totalSpend: 0,
    totalRevenue: 0,
    roas: 0,
    insights: []
  }
};

export const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.payload
      };
    
    case 'SET_BUDGET':
      return {
        ...state,
        budget: action.payload
      };

    case 'SET_AUDIENCE_TARGETING':
      return {
        ...state,
        audienceTargeting: {
          ...state.audienceTargeting,
          ...action.payload
        }
      };

    case 'SET_CREATIVE_SELECTION':
      return {
        ...state,
        creativeSelection: {
          ...state.creativeSelection,
          ...action.payload
        }
      };

    case 'SET_BIDDING_STRATEGY':
      return {
        ...state,
        biddingStrategy: action.payload
      };

    case 'SET_PHASE1_RESULTS':
      return {
        ...state,
        phase1Results: {
          ...state.phase1Results,
          ...action.payload
        }
      };

    case 'SET_RETENTION_STRATEGY':
      return {
        ...state,
        retentionStrategy: {
          ...state.retentionStrategy,
          ...action.payload
        }
      };

    case 'SET_PHASE2_RESULTS':
      return {
        ...state,
        phase2Results: {
          ...state.phase2Results,
          ...action.payload
        }
      };

    case 'SET_MONETIZATION_STRATEGY':
      return {
        ...state,
        monetizationStrategy: {
          ...state.monetizationStrategy,
          ...action.payload
        }
      };

    case 'SET_PHASE3_RESULTS':
      return {
        ...state,
        phase3Results: {
          ...state.phase3Results,
          ...action.payload
        }
      };

    case 'SET_FINAL_RESULTS':
      return {
        ...state,
        finalResults: {
          ...state.finalResults,
          ...action.payload
        }
      };

    case 'RESET_GAME':
      return initialState;

    default:
      return state;
  }
};
