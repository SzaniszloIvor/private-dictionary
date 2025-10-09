// src/components/DailyProgress/DailyProgressCard.jsx
import React, { useState } from 'react';
import { useDailyProgress } from '../../hooks/useDailyProgress';

const DailyProgressCard = ({ onSettingsClick }) => {
  const {
    todayStats,
    dailyGoal,
    isGoalAchieved,
    progressPercentage,
    wordsRemaining,
    loading
  } = useDailyProgress();

  if (loading) {
    return (
      <div className="
        bg-white dark:bg-gray-800
        rounded-xl p-6 shadow-lg
        animate-pulse
      ">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    );
  }

  // Emoji feedback based on progress
  const getProgressEmoji = () => {
    if (isGoalAchieved) return '😊';
    if (progressPercentage >= 50) return '💪';
    if (todayStats?.wordsLearned > 0) return '🚀';
    return '⏰';
  };

  // Progress message
  const getProgressMessage = () => {
    if (isGoalAchieved) {
      return '🎉 Napi cél teljesítve!';
    }
    if (progressPercentage >= 75) {
      return `Még ${wordsRemaining} szó a célhoz!`;
    }
    if (progressPercentage >= 50) {
      return `Félúton vagy! Még ${wordsRemaining} szó!`;
    }
    if (todayStats?.wordsLearned > 0) {
      return `Még ${wordsRemaining} szó a cél eléréséhez!`;
    }
    return 'Kezdd el a mai gyakorlást!';
  };

  return (
    <div className="
      bg-white dark:bg-gray-800
      rounded-xl p-6 shadow-lg
      border-2 border-gray-200 dark:border-gray-700
      hover:shadow-xl transition-all duration-300
      relative
    ">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <span>Napi Haladás</span>
        </h3>
        
        {onSettingsClick && (
          <button
            onClick={onSettingsClick}
            className="
              text-gray-500 dark:text-gray-400
              hover:text-blue-500 dark:hover:text-blue-400
              transition-colors duration-200
              text-xl
            "
            title="Beállítások"
            aria-label="Napi cél beállítása"
          >
            ⚙️
          </button>
        )}
      </div>

      {/* Progress Stats */}
      <div className="mb-4">
        <div className="flex justify-between items-baseline mb-2">
          <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {todayStats?.wordsLearned || 0} / {dailyGoal}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            szó
          </span>
        </div>

        {/* Progress Bar */}
        <div className="
          bg-gray-200 dark:bg-gray-700
          rounded-full h-3 overflow-hidden
          shadow-inner
        ">
          <div
            className={`
              h-full rounded-full
              transition-all duration-500 ease-out
              ${isGoalAchieved 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : 'bg-gradient-to-r from-blue-400 to-cyan-500'}
            `}
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        <div className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
          {progressPercentage}%
        </div>
      </div>

      {/* Status Message */}
      <div className={`
        p-3 rounded-lg text-center font-medium
        ${isGoalAchieved
          ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
          : progressPercentage >= 50
            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
            : 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'}
      `}>
        <span className="text-2xl mr-2">{getProgressEmoji()}</span>
        <span className="text-sm">{getProgressMessage()}</span>
      </div>

      {/* Additional Stats */}
      {todayStats && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 grid grid-cols-2 gap-3 text-sm">
          <div>
            <div className="text-gray-500 dark:text-gray-400">Gyakorlások</div>
            <div className="font-bold text-gray-800 dark:text-gray-100">
              {todayStats.practiceSessionsCompleted || 0}
            </div>
          </div>
          <div>
            <div className="text-gray-500 dark:text-gray-400">Idő</div>
            <div className="font-bold text-gray-800 dark:text-gray-100">
              {Math.round(todayStats.timeSpentMinutes || 0)} perc
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyProgressCard;
