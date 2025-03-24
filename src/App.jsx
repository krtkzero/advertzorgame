import React, { useReducer, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AppGenreSelection from './components/AppGenreSelection';
import HomeScreen from './components/HomeScreen';
import UserAcquisition from './components/phases/UserAcquisition';
import RetentionEngagement from './components/phases/RetentionEngagement';
import Monetization from './components/phases/Monetization';
import FinalResults from './components/FinalResults';
import { GameProvider } from './context/GameContext';
import { initialState, gameReducer } from './reducers/gameReducer';

// Import new feature components
import Achievements from './components/features/Achievements';
import AnalyticsDashboard from './components/features/AnalyticsDashboard';
import RandomEvents from './components/features/RandomEvents';
import GameAssistant from './components/features/GameAssistant';
import CampaignHistory from './components/features/CampaignHistory';
import AdTechGlossary from './components/features/AdTechGlossary';

function App() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showGlossary, setShowGlossary] = useState(false);

  // Determine current game phase for RandomEvents and GameAssistant
  const getPhaseForEvents = () => {
    switch (state.currentPhase) {
      case 'acquisition': return 'acquisition';
      case 'retention': return 'retention';
      case 'monetization': return 'monetization';
      default: return null;
    }
  };

  const getPhaseComponent = () => {
    // Show home screen first, then genre selection if user proceeds
    if (state.currentPhase === 'home') {
      return <HomeScreen />;
    }
    
    // After home screen, if no genre is selected, show genre selection
    if (!state.appGenre && state.currentPhase !== 'home') {
      return <AppGenreSelection />;
    }

    // Otherwise show the appropriate phase component
    switch (state.currentPhase) {
      case 'acquisition': return <UserAcquisition />;
      case 'retention': return <RetentionEngagement />;
      case 'monetization': return <Monetization />;
      case 'results': return (
        <div className="space-y-8">
          <FinalResults />
          <Achievements />
          <AnalyticsDashboard />
          <CampaignHistory />
        </div>
      );
      default: return null;
    }
  };

  return (
    <GameProvider value={{ state, dispatch }}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Glossary Button */}
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 z-50"
          >
            {showGlossary ? '✕ Close Glossary' : '📖 AdTech Glossary'}
          </button>

          {/* Game Assistant and Random Events */}
          {getPhaseForEvents() && (
            <>
              <RandomEvents phase={getPhaseForEvents()} />
              <GameAssistant phase={getPhaseForEvents()} />
            </>
          )}

          {/* Main Content */}
          <AnimatePresence mode="wait">
            {getPhaseComponent()}
          </AnimatePresence>

          {/* Glossary Modal */}
          <AnimatePresence>
            {showGlossary && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setShowGlossary(false);
                }}
              >
                <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                  <AdTechGlossary />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
