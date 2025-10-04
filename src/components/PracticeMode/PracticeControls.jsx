// src/components/PracticeMode/PracticeControls.jsx
import React from 'react';

const PracticeControls = ({
  currentIndex,
  totalCards,
  onPrevious,
  onNext,
  onFlip,
  isFlipped
}) => {
  return (
    <div className="flex flex-col gap-4 mt-6 w-full max-w-lg mx-auto">
      {/* Show/Hide Answer Button */}
      <button
        onClick={onFlip}
        className="
          px-8 py-4 rounded-xl
          bg-gradient-to-r from-indigo-500 to-purple-600
          dark:from-indigo-600 dark:to-purple-700
          text-white text-lg font-bold
          shadow-lg hover:shadow-xl
          transform hover:scale-105 active:scale-95
          transition-all duration-300
          flex items-center justify-center gap-2
        "
      >
        <span className="text-2xl">{isFlipped ? '👁️' : '💡'}</span>
        <span>{isFlipped ? 'Válasz elrejtése' : 'Válasz megjelenítése'}</span>
        <span className="text-sm opacity-75">(Szóköz)</span>
      </button>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onPrevious}
          disabled={currentIndex === 0}
          className="
            flex-1 px-6 py-3 rounded-lg
            bg-gray-600 dark:bg-gray-700
            hover:bg-gray-700 dark:hover:bg-gray-600
            text-white font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-gray-600 dark:disabled:hover:bg-gray-700
            transition-all duration-200
            flex items-center justify-center gap-2
          "
        >
          <span>⬅</span>
          <span className="hidden sm:inline">Előző</span>
        </button>

        <button
          onClick={onNext}
          disabled={currentIndex === totalCards - 1}
          className="
            flex-1 px-6 py-3 rounded-lg
            bg-gray-600 dark:bg-gray-700
            hover:bg-gray-700 dark:hover:bg-gray-600
            text-white font-medium
            disabled:opacity-50 disabled:cursor-not-allowed
            disabled:hover:bg-gray-600 dark:disabled:hover:bg-gray-700
            transition-all duration-200
            flex items-center justify-center gap-2
          "
        >
          <span className="hidden sm:inline">Következő</span>
          <span>➡</span>
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="
        text-center text-xs
        text-gray-500 dark:text-gray-400
        hidden md:block
      ">
        💡 Tipp: Használd a ← → nyilakat navigáláshoz • Szóköz a megfordításhoz • Esc a kilépéshez
      </div>
    </div>
  );
};

export default PracticeControls;
