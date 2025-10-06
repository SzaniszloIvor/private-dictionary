// src/components/PracticeMode/PracticeResults.jsx
import React, { useState, useEffect } from 'react';
import ConfettiReward from './ConfettiReward';
import StarRating from './StarRating';
import { calculateReward, getMotivationalQuote } from '../../utils/rewardHelper';
import PronunciationResults from './PronunciationResults';

const PracticeResults = ({ stats, mode, onRestart, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Calculate reward with mode detection
  const reward = calculateReward(stats, mode);
  const quote = getMotivationalQuote();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  // Use specialized component for pronunciation mode
  if (mode === 'pronunciation') {
    return (
      <PronunciationResults
        stats={stats}
        reward={reward}
        onRestart={onRestart}
        onClose={onClose}
      />
    );
  }

  // Original flashcard results (existing code)
  return (
    <>
      <ConfettiReward active={showConfetti} intensity={reward.confettiIntensity} />

      <div className="text-center p-6 md:p-8 animate-slide-in-up max-h-[80vh] overflow-y-auto">
        {/* Main Title */}
        <div className="text-6xl md:text-7xl mb-4 animate-bounce">
          {reward.emoji}
        </div>

        <h2 className="
          text-3xl md:text-4xl font-bold mb-4
          bg-gradient-to-r from-indigo-500 to-purple-600
          dark:from-indigo-400 dark:to-purple-500
          bg-clip-text text-transparent
        ">
          {reward.message}
        </h2>

        {/* Star Rating */}
        <StarRating stars={reward.stars} animated={true} />

        {/* Statistics Card */}
        <div className="
          bg-gradient-to-br from-gray-50 to-gray-100
          dark:from-gray-800 dark:to-gray-900
          rounded-xl p-6 mb-6 shadow-lg
        ">
          <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">
            📊 Statisztikák
          </h3>

          <div className="space-y-3 text-left max-w-md mx-auto">
            <div className="
              flex justify-between items-center
              p-3 rounded-lg
              bg-white dark:bg-gray-800
              transition-all duration-200
            ">
              <span className="text-gray-700 dark:text-gray-300">
                Gyakorolt kártyák:
              </span>
              <span className="font-bold text-blue-500 dark:text-blue-400">
                {stats.viewedCards}/{stats.totalCards} ✓
              </span>
            </div>

            <div className="
              flex justify-between items-center
              p-3 rounded-lg
              bg-white dark:bg-gray-800
            ">
              <span className="text-gray-700 dark:text-gray-300">
                Eltöltött idő:
              </span>
              <span className="font-bold text-green-500 dark:text-green-400">
                {stats.formattedTime} ⚡
              </span>
            </div>

            <div className="
              flex justify-between items-center
              p-3 rounded-lg
              bg-white dark:bg-gray-800
            ">
              <span className="text-gray-700 dark:text-gray-300">
                Összes fordítás:
              </span>
              <span className="font-bold text-purple-500 dark:text-purple-400">
                {stats.flips} 💯
              </span>
            </div>

            <div className="
              flex justify-between items-center
              p-3 rounded-lg
              bg-white dark:bg-gray-800
            ">
              <span className="text-gray-700 dark:text-gray-300">
                Teljesítés:
              </span>
              <span className="font-bold text-yellow-500 dark:text-yellow-400">
                {reward.completion}% 🎯
              </span>
            </div>
          </div>
        </div>

        {/* Badges Section */}
        {reward.badges.length > 0 && (
          <div className="
            bg-gradient-to-br from-yellow-50 to-orange-50
            dark:from-yellow-900/20 dark:to-orange-900/20
            border-2 border-yellow-300 dark:border-yellow-700
            rounded-xl p-6 mb-6
          ">
            <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">
              🎖️ Elnyert jelvények
            </h3>

            <div className="flex flex-wrap justify-center gap-4">
              {reward.badges.map((badge, index) => (
                <div
                  key={badge.id}
                  className="
                    flex flex-col items-center p-4 rounded-xl
                    bg-white dark:bg-gray-800 shadow-md
                    animate-bounce
                  "
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-4xl mb-2">{badge.icon}</div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {badge.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Motivational Quote */}
        <div className="
          mb-6 p-4 rounded-lg
          bg-gradient-to-r from-green-50 to-emerald-50
          dark:from-green-900/20 dark:to-emerald-900/20
          border border-green-300 dark:border-green-700
        ">
          <p className="text-sm italic text-green-800 dark:text-green-300">
            💭 {quote}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRestart}
            className="
              flex-1 px-6 py-4 rounded-xl font-bold text-lg
              bg-gradient-to-r from-blue-500 to-cyan-400
              dark:from-blue-600 dark:to-cyan-500
              text-white
              hover:shadow-xl hover:scale-105
              transition-all duration-300
            "
          >
            🔄 Újra Gyakorolom
          </button>

          <button
            onClick={onClose}
            className="
              flex-1 px-6 py-4 rounded-xl font-bold text-lg
              bg-gradient-to-r from-green-500 to-emerald-400
              dark:from-green-600 dark:to-emerald-500
              text-white
              hover:shadow-xl hover:scale-105
              transition-all duration-300
            "
          >
            ✓ Befejezés
          </button>
        </div>
      </div>
    </>
  );
};

export default PracticeResults;
