// src/components/PracticeMode/PracticeProgress.jsx
import React from 'react';

const PracticeProgress = ({ currentIndex, totalCards, viewedCards }) => {
  const progress = totalCards > 0 ? (viewedCards.size / totalCards) * 100 : 0;
  
  return (
    <div className="w-full max-w-lg mx-auto mt-6">
      {/* Progress Bar */}
      <div className="
        bg-gray-200 dark:bg-gray-700
        rounded-full h-3 overflow-hidden
        mb-3 shadow-inner
      ">
        <div
          className="
            h-full
            bg-gradient-to-r from-green-400 to-emerald-500
            dark:from-green-500 dark:to-emerald-600
            transition-all duration-500 ease-out
            rounded-full
          "
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {Array.from({ length: totalCards }).map((_, index) => (
          <div
            key={index}
            className={`
              w-2 h-2 rounded-full
              transition-all duration-300
              ${index === currentIndex
                ? 'w-6 bg-indigo-500 dark:bg-indigo-400'
                : viewedCards.has(index)
                ? 'bg-green-500 dark:bg-green-400'
                : 'bg-gray-300 dark:bg-gray-600'}
            `}
            title={`${index + 1}. kártya${viewedCards.has(index) ? ' (megtekintve)' : ''}`}
          />
        ))}
      </div>
      
      {/* Text Stats */}
      <div className="
        text-center mt-3
        text-sm text-gray-600 dark:text-gray-400
      ">
        {currentIndex + 1}. kártya / {totalCards} • {progress.toFixed(0)}% kész
      </div>
    </div>
  );
};

export default PracticeProgress;
