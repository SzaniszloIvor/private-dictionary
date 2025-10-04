// src/components/PracticeMode/FlashCard.jsx
import React from 'react';

const FlashCard = ({ word, isFlipped, onSpeak, mode = 'sequential' }) => {
  if (!word) return null;
  
  const isReverse = mode === 'reverse';
  
  return (
    <div className="flip-card w-full max-w-lg mx-auto h-80 md:h-96 perspective-1000">
      <div className={`flip-card-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front Side */}
        <div className="flip-card-front">
          <div className="
            h-full w-full p-8
            bg-gradient-to-br from-indigo-500 to-purple-600
            dark:from-indigo-600 dark:to-purple-700
            rounded-2xl shadow-2xl
            flex flex-col items-center justify-center
            text-white
          ">
            {/* Main Word */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center break-words">
              {word.english}
            </h2>
            
            {/* Phonetic (only if not reverse mode) */}
            {!isReverse && word.phonetic && (
              <p className="text-xl md:text-2xl text-yellow-300 italic mb-6">
                /{word.phonetic}/
              </p>
            )}
            
            {/* Speaker Button (only if not reverse and has audio support) */}
            {!isReverse && onSpeak && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSpeak(word.english);
                }}
                className="
                  bg-white/20 hover:bg-white/30
                  backdrop-blur-sm
                  rounded-full w-16 h-16
                  flex items-center justify-center
                  text-3xl
                  transition-all duration-300
                  hover:scale-110 active:scale-95
                  shadow-lg
                "
                title="Kiejtés lejátszása"
              >
                🔊
              </button>
            )}
          </div>
        </div>
        
        {/* Back Side */}
        <div className="flip-card-back">
          <div className="
            h-full w-full p-8
            bg-gradient-to-br from-green-500 to-emerald-600
            dark:from-green-600 dark:to-emerald-700
            rounded-2xl shadow-2xl
            flex flex-col items-center justify-center
            text-white
          ">
            {/* Translation */}
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-center break-words">
              {word.hungarian}
            </h2>
            
            {/* Original Word (smaller) */}
            <p className="text-lg md:text-xl opacity-90 mb-2">
              {word.english}
            </p>
            
            {/* Phonetic (only if available) */}
            {word.phonetic && (
              <p className="text-base md:text-lg text-yellow-200 italic">
                /{word.phonetic}/
              </p>
            )}
            
            {/* Checkmark Icon */}
            <div className="mt-6 text-5xl opacity-50">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
