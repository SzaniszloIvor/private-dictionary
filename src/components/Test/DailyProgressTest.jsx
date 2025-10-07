// src/components/Test/DailyProgressTest.jsx

import React from 'react';
import { useDailyProgress } from '../../hooks/useDailyProgress';
import { useStreak } from '../../hooks/useStreak';
import { useStatsHistory } from '../../hooks/useStatsHistory';

const DailyProgressTest = () => {
  // Test hooks
  const {
    todayStats,
    dailyGoal,
    loading: dailyLoading,
    isGoalAchieved,
    progressPercentage,
    wordsRemaining,
    incrementWordsLearned,
    updateSessionStats,
    updateDailyGoal
  } = useDailyProgress();

  const {
    streakData,
    loading: streakLoading,
    isStreakActive,
    streakStatus,
    nextMilestone,
    daysToNextMilestone,
    markTodayAsActive
  } = useStreak();

  const {
    historyData,
    loading: historyLoading,
    totalDaysTracked,
    totalWordsAllTime,
    activeDays,
    getWeekSummary,
    getMonthSummary
  } = useStatsHistory('week');

  // Test functions
  const handleAddWords = () => {
    incrementWordsLearned(5);
  };

  const handleCompleteSession = () => {
    updateSessionStats({
      wordsLearned: 3,
      timeSpentMinutes: 5.5,
      lessonNumber: 1
    });
  };

  const handleChangeGoal = () => {
    const newGoal = prompt('New daily goal:', dailyGoal);
    if (newGoal) {
      updateDailyGoal(parseInt(newGoal));
    }
  };

  const handleMarkActive = () => {
    markTodayAsActive();
  };

  const weekSummary = !historyLoading ? getWeekSummary() : null;

  if (dailyLoading || streakLoading || historyLoading) {
    return (
      <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          📊 Daily Progress Test Component
        </h1>

        {/* Daily Progress Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            🎯 Daily Progress
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Today's Words:</span>
              <span className="font-bold text-blue-500">{todayStats?.wordsLearned || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Daily Goal:</span>
              <span className="font-bold text-purple-500">{dailyGoal}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Progress:</span>
              <span className="font-bold text-green-500">{progressPercentage}%</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Remaining:</span>
              <span className="font-bold text-orange-500">{wordsRemaining} words</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Goal Achieved:</span>
              <span className="font-bold">
                {isGoalAchieved ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
              <span className="font-bold">{todayStats?.practiceSessionsCompleted || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
              <span className="font-bold">{todayStats?.timeSpentMinutes || 0} min</span>
            </div>
          </div>

          <div className="mt-6 flex gap-3 flex-wrap">
            <button
              onClick={handleAddWords}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              +5 Words
            </button>
            
            <button
              onClick={handleCompleteSession}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Complete Session
            </button>
            
            <button
              onClick={handleChangeGoal}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              Change Goal
            </button>
          </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            🔥 Streak
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Current Streak:</span>
              <span className="font-bold text-orange-500 text-2xl">
                {streakData?.currentStreak || 0} 🔥
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Longest Streak:</span>
              <span className="font-bold text-yellow-500">{streakData?.longestStreak || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Active Days:</span>
              <span className="font-bold text-blue-500">{streakData?.totalActiveDays || 0}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Status:</span>
              <span className="font-bold">
                {streakStatus === 'hot' ? '🔥 Hot' : streakStatus === 'warm' ? '🌤️ Warm' : '❄️ Cold'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Today Active:</span>
              <span className="font-bold">
                {isStreakActive ? '✅ Yes' : '❌ No'}
              </span>
            </div>

            {nextMilestone && (
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Next Milestone:</span>
                <span className="font-bold text-purple-500">
                  {nextMilestone.label} ({daysToNextMilestone} days)
                </span>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-bold mb-2 text-gray-700 dark:text-gray-300">Milestones:</h3>
              <div className="flex gap-2">
                <span className={streakData?.milestones?.week ? 'text-2xl' : 'text-xl opacity-30'}>
                  7️⃣
                </span>
                <span className={streakData?.milestones?.twoWeeks ? 'text-2xl' : 'text-xl opacity-30'}>
                  🔥
                </span>
                <span className={streakData?.milestones?.month ? 'text-2xl' : 'text-xl opacity-30'}>
                  🏆
                </span>
                <span className={streakData?.milestones?.hundred ? 'text-2xl' : 'text-xl opacity-30'}>
                  💯
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleMarkActive}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
            >
              Mark Today Active
            </button>
          </div>
        </div>

        {/* History Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            📈 History & Stats
          </h2>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Days Tracked:</span>
              <span className="font-bold text-blue-500">{totalDaysTracked}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Active Days:</span>
              <span className="font-bold text-green-500">{activeDays}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Words (All Time):</span>
              <span className="font-bold text-purple-500">{totalWordsAllTime}</span>
            </div>

            {weekSummary && (
              <>
                <h3 className="font-bold mt-4 mb-2 text-gray-700 dark:text-gray-300">
                  This Week:
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Words This Week:</span>
                    <span className="font-bold">{weekSummary.totalWords}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Time This Week:</span>
                    <span className="font-bold">{weekSummary.totalTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Days Active:</span>
                    <span className="font-bold">{weekSummary.daysActive}/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Words/Day:</span>
                    <span className="font-bold">{weekSummary.avgWordsPerDay}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Raw Data (Dev) */}
        <details className="bg-gray-800 text-white rounded-xl p-6 shadow-lg">
          <summary className="cursor-pointer font-bold text-lg mb-4">
            🔧 Raw Data (Developer)
          </summary>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ todayStats, streakData, historyData: historyData?.slice(0, 3) }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default DailyProgressTest;
