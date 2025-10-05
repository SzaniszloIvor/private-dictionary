// src/components/PracticeMode/ErrorDisplay.jsx - JAVÍTOTT
import React, { useState } from 'react';
import { getDetailedErrorMessage, getBrowserSpecificTips } from '../../utils/pronunciationHelper';

const ErrorDisplay = ({ errorCode, onRetry, onClose }) => {
  const [showDetails, setShowDetails] = useState(false);
  const errorDetails = getDetailedErrorMessage(errorCode);
  const browserTips = getBrowserSpecificTips();

  const colorClasses = {
    red: 'from-red-500 to-pink-500',
    orange: 'from-orange-500 to-red-400',
    yellow: 'from-yellow-500 to-orange-400'
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4 animate-slide-in-up">
      {/* Main Error Card */}
      <div className={`
        p-6 rounded-xl
        bg-gradient-to-br ${colorClasses[errorDetails.color]}
        text-white shadow-xl
      `}>
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="text-5xl flex-shrink-0">
            {errorDetails.icon}
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-2">
              {errorDetails.title}
            </h3>
            <p className="text-white/90 mb-4">
              {errorDetails.message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={onRetry}
                className="
                  px-4 py-2 rounded-lg
                  bg-white/20 hover:bg-white/30
                  backdrop-blur-sm
                  font-medium transition-all duration-200
                  hover:scale-105 active:scale-95
                "
              >
                🔄 Újra próbálom
              </button>
              
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="
                  px-4 py-2 rounded-lg
                  bg-white/20 hover:bg-white/30
                  backdrop-blur-sm
                  font-medium transition-all duration-200
                  hover:scale-105 active:scale-95
                "
              >
                {showDetails ? '▼ Kevesebb' : '▶ Részletek'}
              </button>
              
              {onClose && (
                <button
                  onClick={onClose}
                  className="
                    px-4 py-2 rounded-lg
                    bg-white/20 hover:bg-white/30
                    backdrop-blur-sm
                    font-medium transition-all duration-200
                    hover:scale-105 active:scale-95
                  "
                >
                  ✕ Bezárás
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Tips (Collapsible) */}
      {showDetails && (
        <div className="
          mt-4 p-4 rounded-lg
          bg-white dark:bg-gray-800
          border-2 border-gray-200 dark:border-gray-700
          animate-slide-in-up
        ">
          <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <span>💡</span>
            <span>Hibaelhárítási tippek</span>
          </h4>
          
          <ul className="space-y-2 mb-4">
            {errorDetails.tips.map((tip, index) => (
              <li 
                key={index}
                className="
                  flex items-start gap-2
                  text-sm text-gray-700 dark:text-gray-300
                "
              >
                <span className="text-blue-500 dark:text-blue-400 flex-shrink-0">
                  {index + 1}.
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>

          {/* Browser-specific tips */}
          {browserTips.length > 0 && (
            <>
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-3 mt-4">
                🌐 Böngésző-specifikus tippek
              </h4>
              <ul className="space-y-2">
                {browserTips.map((tip, index) => (
                  <li 
                    key={index}
                    className="
                      text-sm text-gray-700 dark:text-gray-300
                      flex items-start gap-2
                    "
                  >
                    <span className="flex-shrink-0">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="
            mt-4 pt-4 border-t border-gray-200 dark:border-gray-700
            text-sm text-center
          ">
            <span className="text-gray-600 dark:text-gray-400">
              További segítség:{' '}
            </span>
            
              <a href="https://support.google.com/chrome/answer/2693767"
              target="_blank"
              rel="noopener noreferrer"
              className="
                text-blue-600 dark:text-blue-400
                hover:underline font-medium
              "
            >
              Mikrofon beállítások útmutató
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay;
