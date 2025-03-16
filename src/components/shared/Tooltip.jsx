import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Tooltip = ({ term, explanation, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => setIsVisible(true);
  const handleMouseLeave = () => setIsVisible(false);
  const handleClick = () => setIsVisible(!isVisible);

  return (
    <div className="relative inline-block">
      <div
        className="inline-flex items-center cursor-help"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {children}
        <span className="ml-1 text-gray-500">🛈</span>
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="tooltip absolute z-50 w-64 p-3 text-sm text-white bg-gray-800 rounded-lg shadow-lg"
            style={{
              top: "100%",
              left: "50%",
              transform: "translateX(-50%)",
              marginTop: "0.5rem"
            }}
          >
            <div className="font-semibold mb-1">{term}</div>
            <div className="text-gray-200">{explanation}</div>
            <div
              className="absolute w-3 h-3 bg-gray-800"
              style={{
                top: "-6px",
                left: "50%",
                transform: "translateX(-50%) rotate(45deg)"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;
