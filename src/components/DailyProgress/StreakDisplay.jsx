// src/components/DailyProgress/StreakDisplay.jsx
import React, { useState, useEffect } from 'react';
import { useStreak } from '../../hooks/useStreak';
import ConfettiReward from '../PracticeMode/ConfettiReward';

/**
 * Confetti trigger logic:
 * - Watches for streak milestones (7, 14, 30, 100 days)
 * - Shows confetti for 4 seconds when milestone achieved
 * - Only triggers once per milestone (tracked via lastStreak)
 */
const StreakDisplay = () => {
  const {
    streakData,
    loading,
    isStreakActive,
    streakStatus,
    nextMilestone,
    daysToNextMilestone
  } = useStreak();

  const [flameAnimation, setFlameAnimation] = useState(false);
  
  //  Confetti state
  const [showConfetti, setShowConfetti] = useState(false);
  const [lastStreak, setLastStreak] = useState(0);

  // Animate flame on mount
  useEffect(() => {
    const timer = setTimeout(() => setFlameAnimation(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Trigger confetti on milestone
  useEffect(() => {
    if (streakData && streakData.currentStreak > lastStreak) {
      // Check if milestone achieved
      const milestones = [7, 14, 30, 100];
      if (milestones.includes(streakData.currentStreak)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      setLastStreak(streakData.currentStreak);
    }
  }, [streakData?.currentStreak, lastStreak]);

  if (loading) {
    return (
      <div className="
        bg-white dark:bg-gray-800
        rounded-xl p-6 shadow-lg
        animate-pulse
      ">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      </div>
    );
  }

  const currentStreak = streakData?.currentStreak || 0;
  const longestStreak = streakData?.longestStreak || 0;

  // Milestone badges
  const milestones = [
    { days: 7, icon: '7️⃣', label: 'Heti', achieved: streakData?.milestones?.week },
    { days: 14, icon: '🔥', label: '2 Hét', achieved: streakData?.milestones?.twoWeeks },
    { days: 30, icon: '🏆', label: 'Havi', achieved: streakData?.milestones?.month },
    { days: 100, icon: '💯', label: '100 Nap', achieved: streakData?.milestones?.hundred }
  ];

  return (
    <>
      {/* Confetti */}
      <ConfettiReward active={showConfetti} intensity="high" />
      
      <div className="
        bg-white dark:bg-gray-800
        rounded-xl p-6 shadow-lg
        border-2 border-gray-200 dark:border-gray-700
        hover:shadow-xl transition-all duration-300
        relative overflow-hidden
      ">
        {/* Flame background effect */}
        {currentStreak > 0 && (
          <div className="
            absolute top-0 right-0 w-32 h-32
            bg-gradient-to-br from-orange-400/10 to-red-400/10
            rounded-full blur-3xl
            animate-pulse
          " />
        )}

        {/* Header */}
        <div className="relative z-10">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span>Sorozat</span>
          </h3>

          {/* Main Streak Display */}
          <div className="text-center mb-6">
            <div className={`
              text-6xl mb-2
              transition-all duration-500
              ${flameAnimation ? 'scale-100' : 'scale-0'}
              ${currentStreak > 0 ? 'animate-bounce' : ''}
            `}>
              {currentStreak > 0 ? '🔥' : '❄️'}
            </div>
            
            <div className="text-4xl font-bold mb-2">
              <span className={
                currentStreak > 0
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent'
                  : 'text-gray-400 dark:text-gray-600'
              }>
                {currentStreak}
              </span>
              <span className="text-lg text-gray-500 dark:text-gray-400 ml-2">
                nap
              </span>
            </div>

            {currentStreak > 0 ? (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {isStreakActive ? '✅ Ma is aktív!' : '⏰ Ma még nem gyakoroltál'}
              </div>
            ) : (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Kezdd el a sorozatot ma! 🚀
              </div>
            )}
          </div>

          {/* Longest Streak */}
          {longestStreak > 0 && (
            <div className="
              bg-yellow-50 dark:bg-yellow-900/20
              border border-yellow-200 dark:border-yellow-800
              rounded-lg p-3 mb-4
              text-center
            ">
              <div className="text-xs text-yellow-800 dark:text-yellow-300 mb-1">
                Leghosszabb sorozat
              </div>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {longestStreak} nap 🏆
              </div>
            </div>
          )}

          {/* Next Milestone */}
          {nextMilestone && currentStreak > 0 && (
            <div className="
              bg-blue-50 dark:bg-blue-900/20
              border border-blue-200 dark:border-blue-800
              rounded-lg p-3 mb-4
            ">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    Következő mérföldkő
                  </div>
                  <div className="font-bold text-blue-600 dark:text-blue-400">
                    {nextMilestone.label}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {daysToNextMilestone}
                  </div>
                  <div className="text-xs text-blue-800 dark:text-blue-300">
                    nap
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Milestone Badges */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 text-center">
              Elért mérföldkövek
            </div>
            <div className="flex justify-center gap-3">
              {milestones.map((milestone) => (
                <div
                  key={milestone.days}
                  className={`
                    flex flex-col items-center
                    transition-all duration-300
                    ${milestone.achieved 
                      ? 'scale-100 opacity-100' 
                      : 'scale-90 opacity-30'}
                  `}
                  title={`${milestone.label}: ${milestone.days} nap`}
                >
                  <div className={`
                    text-3xl
                    ${milestone.achieved ? 'animate-bounce' : ''}
                  `}>
                    {milestone.icon}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StreakDisplay;
