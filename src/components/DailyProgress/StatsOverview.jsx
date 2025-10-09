// src/components/DailyProgress/StatsOverview.jsx
import React from 'react';
import { useStatsHistory } from '../../hooks/useStatsHistory';
import { useStreak } from '../../hooks/useStreak';
import { useDailyProgress } from '../../hooks/useDailyProgress';

const StatsOverview = () => {
  const { 
    totalDaysTracked, 
    totalWordsAllTime, 
    totalTimeAllTime, 
    activeDays,
    getWeekSummary,
    loading: historyLoading 
  } = useStatsHistory('month');
  
  const { 
    streakData, 
    loading: streakLoading 
  } = useStreak();
  
  const { 
    todayStats, 
    loading: dailyLoading 
  } = useDailyProgress();

  const weekSummary = !historyLoading ? getWeekSummary() : null;

  if (historyLoading || streakLoading || dailyLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  // Lifetime stats
  const lifetimeStats = [
    {
      label: 'Összes nap',
      value: totalDaysTracked,
      icon: '📅',
      color: 'blue'
    },
    {
      label: 'Aktív napok',
      value: activeDays,
      icon: '✅',
      color: 'green'
    },
    {
      label: 'Összes szó',
      value: totalWordsAllTime,
      icon: '📚',
      color: 'purple'
    },
    {
      label: 'Összidő',
      value: `${Math.round(totalTimeAllTime)} perc`,
      icon: '⏱️',
      color: 'orange'
    }
  ];

  // Streak milestones badges
  const streakBadges = [
    { 
      id: 'week', 
      label: 'Heti Harcos', 
      icon: '7️⃣', 
      achieved: streakData?.milestones?.week,
      requirement: '7 nap sorozat'
    },
    { 
      id: 'twoWeeks', 
      label: 'Két Hét Bajnok', 
      icon: '🔥', 
      achieved: streakData?.milestones?.twoWeeks,
      requirement: '14 nap sorozat'
    },
    { 
      id: 'month', 
      label: 'Havi Mester', 
      icon: '🏆', 
      achieved: streakData?.milestones?.month,
      requirement: '30 nap sorozat'
    },
    { 
      id: 'hundred', 
      label: 'Century Club', 
      icon: '💯', 
      achieved: streakData?.milestones?.hundred,
      requirement: '100 nap sorozat'
    }
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-2 border-gray-200 dark:border-gray-700">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6 flex items-center gap-2">
        <span className="text-2xl">📊</span>
        <span>Összesített Statisztikák</span>
      </h3>

      {/* Lifetime Stats Grid */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Lifetime Statisztikák
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {lifetimeStats.map((stat) => (
            <div
              key={stat.label}
              className={`
                p-4 rounded-xl
                bg-gradient-to-br
                ${stat.color === 'blue' ? 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20' : ''}
                ${stat.color === 'green' ? 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20' : ''}
                ${stat.color === 'purple' ? 'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20' : ''}
                ${stat.color === 'orange' ? 'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20' : ''}
                border-2
                ${stat.color === 'blue' ? 'border-blue-200 dark:border-blue-800' : ''}
                ${stat.color === 'green' ? 'border-green-200 dark:border-green-800' : ''}
                ${stat.color === 'purple' ? 'border-purple-200 dark:border-purple-800' : ''}
                ${stat.color === 'orange' ? 'border-orange-200 dark:border-orange-800' : ''}
              `}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Week Summary */}
      {weekSummary && (
        <div className="mb-6">
          <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Ezen a héten
          </h4>
          <div className="
            bg-gradient-to-r from-indigo-50 to-purple-50
            dark:from-indigo-900/20 dark:to-purple-900/20
            border-2 border-indigo-200 dark:border-indigo-800
            rounded-xl p-4
          ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {weekSummary.totalWords}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Szavak
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {Math.round(weekSummary.totalTime)}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Perc
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
                  {weekSummary.daysActive}/7
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Aktív napok
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {weekSummary.avgWordsPerDay}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Átlag/nap
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Best Streaks */}
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Legjobb Sorozatok
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="
            bg-gradient-to-br from-orange-50 to-red-50
            dark:from-orange-900/20 dark:to-red-900/20
            border-2 border-orange-200 dark:border-orange-800
            rounded-xl p-4 text-center
          ">
            <div className="text-4xl mb-2">🔥</div>
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {streakData?.currentStreak || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Jelenlegi sorozat
            </div>
          </div>
          
          <div className="
            bg-gradient-to-br from-yellow-50 to-amber-50
            dark:from-yellow-900/20 dark:to-amber-900/20
            border-2 border-yellow-200 dark:border-yellow-800
            rounded-xl p-4 text-center
          ">
            <div className="text-4xl mb-2">🏆</div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
              {streakData?.longestStreak || 0}
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Leghosszabb sorozat
            </div>
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div>
        <h4 className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
          Elért Jelvények
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {streakBadges.map((badge) => (
            <div
              key={badge.id}
              className={`
                p-4 rounded-xl text-center
                border-2
                transition-all duration-300
                ${badge.achieved
                  ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-300 dark:border-green-700 scale-100'
                  : 'bg-gray-50 dark:bg-gray-900/20 border-gray-200 dark:border-gray-700 opacity-50 scale-95'}
              `}
            >
              <div className={`
                text-4xl mb-2
                ${badge.achieved ? 'animate-bounce' : ''}
              `}>
                {badge.icon}
              </div>
              <div className="text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                {badge.label}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {badge.requirement}
              </div>
              {badge.achieved && (
                <div className="mt-2 text-green-600 dark:text-green-400 text-xs font-bold">
                  ✓ Elérve
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsOverview;
