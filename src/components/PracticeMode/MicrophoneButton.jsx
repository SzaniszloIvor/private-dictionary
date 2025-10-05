// src/components/PracticeMode/MicrophoneButton.jsx
import React from 'react';

const MicrophoneButton = ({ 
  isListening, 
  isDisabled = false,
  onStart, 
  onStop 
}) => {
  const handleClick = () => {
    if (isListening) {
      onStop();
    } else {
      onStart();
    }
  };

  // ⚡ Prevent double-tap zoom on mobile
  const handleTouchStart = (e) => {
    e.preventDefault();
    handleClick();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        disabled={isDisabled}
        className={`
          relative w-24 h-24 md:w-28 md:h-28 rounded-full
          flex items-center justify-center
          text-5xl md:text-6xl
          transition-all duration-300
          shadow-lg hover:shadow-xl
          ${isListening 
            ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse scale-110' 
            : 'bg-gradient-to-br from-blue-500 to-indigo-600 hover:scale-110 active:scale-95'}
          ${isDisabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'cursor-pointer'}
          touch-manipulation
        `}
        style={{
          // ⚡ Better touch target (min 44x44px recommended)
          minWidth: '44px',
          minHeight: '44px',
          // ⚡ Disable iOS button styling
          WebkitAppearance: 'none',
          // ⚡ Prevent text selection
          userSelect: 'none',
          WebkitUserSelect: 'none',
          // ⚡ Prevent context menu on long press
          WebkitTouchCallout: 'none'
        }}
        title={isListening ? 'Felvétel leállítása' : 'Kiejtés gyakorlása'}
        aria-label={isListening ? 'Felvétel leállítása' : 'Mikrofon indítása'}
        aria-pressed={isListening}
      >
        {/* Microphone Icon */}
        <span className="text-white drop-shadow-lg">
          {isListening ? '⏹️' : '🎤'}
        </span>

        {/* Pulsing Ring Animation */}
        {isListening && (
          <>
            <span className="
              absolute inset-0 rounded-full
              border-4 border-red-400
              animate-ping
            " />
            <span className="
              absolute inset-0 rounded-full
              border-4 border-red-500
              opacity-75
            " />
          </>
        )}
      </button>

      {/* Status Text */}
      <div className={`
        text-center font-medium text-sm md:text-base
        transition-colors duration-300
        ${isListening 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-gray-700 dark:text-gray-300'}
      `}>
        {isListening 
          ? '🔴 Beszélj most...' 
          : '🎤 Nyomd meg és beszélj!'}
      </div>

      {/* Help Text */}
      {!isListening && (
        <div className="
          text-xs text-gray-500 dark:text-gray-400 
          max-w-xs text-center
          px-4
        ">
          💡 Tipp: Hallgasd meg a szót először, majd próbáld megismételni!
        </div>
      )}
    </div>
  );
};

export default MicrophoneButton;
