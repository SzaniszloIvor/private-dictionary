// src/components/PracticeMode/PronunciationResults.jsx
import React, { useState, useEffect } from 'react';
import ConfettiReward from './ConfettiReward';
import StarRating from './StarRating';
import { 
  calculatePronunciationAccuracy,
  getPronunciationPerformanceLevel,
  getMotivationalQuote 
} from '../../utils/rewardHelper';

const PronunciationResults = ({ stats, reward, onRestart, onClose }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const quote = getMotivationalQuote();

  // Extract pronunciation stats
  const pronunciationStats = stats.pronunciationStats || { scores: [], attempts: [] };
  const avgScore = calculatePronunciationAccuracy(pronunciationStats.scores);
  const performance = getPronunciationPerformanceLevel(avgScore);
  
  // Calculate additional metrics
  const perfectCount = pronunciationStats.scores.filter(s => s >= 95).length;
  const goodCount = pronunciationStats.scores.filter(s => s >= 85).length;
  const avgAttempts = pronunciationStats.attempts.length > 0
    ? (pronunciationStats.attempts.reduce((a, b) => a + b, 0) / pronunciationStats.attempts.length).toFixed(1)
    : 0;

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(true);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

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

        {/* Performance Level Badge */}
        <div className={`
          inline-block px-6 py-3 rounded-full mb-6
          bg-gradient-to-r ${
            performance.color === 'gold' ? 'from-yellow-400 to-orange-500' :
            performance.color === 'green' ? 'from-green-400 to-emerald-500' :
            performance.color === 'blue' ? 'from-blue-400 to-cyan-500' :
            performance.color === 'yellow' ? 'from-yellow-400 to-yellow-600' :
            'from-orange-400 to-red-500'
          }
          text-white text-xl font-bold shadow-lg
        `}>
          <span className="text-2xl mr-2">{performance.icon}</span>
          {performance.label} - {avgScore}%
        </div>

        {/* Statistics Card */}
        <div className="
          bg-gradient-to-br from-gray-50 to-gray-100
          dark:from-gray-800 dark:to-gray-900
          rounded-xl p-6 mb-6 shadow-lg
        ">
          <h3 className="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">
            📊 Kiejtési Statisztikák
          </h3>

          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            {/* Average Score */}
            <div className="
              p-4 rounded-lg
              bg-white dark:bg-gray-800
              border-2 border-indigo-200 dark:border-indigo-700
            ">
              <div className="text-3xl font-bold text-indigo-500 dark:text-indigo-400">
                {avgScore}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Átlagos pontosság
              </div>
            </div>

            {/* Perfect Count */}
            <div className="
              p-4 rounded-lg
              bg-white dark:bg-gray-800
              border-2 border-green-200 dark:border-green-700
            ">
              <div className="text-3xl font-bold text-green-500 dark:text-green-400">
                {perfectCount} 🎯
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Tökéletes (95%+)
              </div>
            </div>

            {/* Good Count */}
            <div className="
              p-4 rounded-lg
              bg-white dark:bg-gray-800
              border-2 border-lime-200 dark:border-lime-700
            ">
              <div className="text-3xl font-bold text-lime-500 dark:text-lime-400">
                {goodCount} ✅
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Kiváló (85%+)
              </div>
            </div>

            {/* Average Attempts */}
            <div className="
              p-4 rounded-lg
              bg-white dark:bg-gray-800
              border-2 border-purple-200 dark:border-purple-700
            ">
              <div className="text-3xl font-bold text-purple-500 dark:text-purple-400">
                {avgAttempts} 🔄
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Átlag próbálkozás
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="
            mt-4 p-3 rounded-lg
            bg-gradient-to-r from-blue-50 to-indigo-50
            dark:from-blue-900/20 dark:to-indigo-900/20
            border border-blue-200 dark:border-blue-700
          ">
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
              {performance.message}
            </p>
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
              🎖️ Megszerzett Jelvények
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {reward.badges.map((badge, index) => (
                <div
                  key={badge.id}
                  className="
                    flex flex-col items-center p-4 rounded-xl
                    bg-white dark:bg-gray-800 shadow-md
                    hover:scale-105 transition-transform duration-200
                    animate-bounce
                  "
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="text-5xl mb-2">{badge.icon}</div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300 text-center">
                    {badge.name}
                  </div>
                  {badge.description && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                      {badge.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Score Breakdown */}
        <div className="
          mb-6 p-4 rounded-lg
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
        ">
          <h4 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100">
            📈 Részletes Eredmények
          </h4>
          
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {pronunciationStats.scores.map((score, index) => (
              <div 
                key={index}
                className="
                  flex justify-between items-center
                  p-2 rounded
                  bg-gray-50 dark:bg-gray-700
                "
              >
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {index + 1}. szó
                </span>
                <div className="flex items-center gap-2">
                  <span className={`
                    font-bold
                    ${score >= 95 ? 'text-green-500' :
                      score >= 85 ? 'text-lime-500' :
                      score >= 75 ? 'text-yellow-500' :
                      'text-orange-500'}
                  `}>
                    {score}%
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ({pronunciationStats.attempts[index]}× próba)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

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

export default PronunciationResults;
