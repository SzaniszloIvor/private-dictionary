// src/hooks/useStatsHistory.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getTodayDateString,
  getDateNDaysAgo,
  loadStatsHistory,
  loadRecentStats
} from '../services/firebase';
import {
  getStatsHistory,
  getStatsForDate,
  getStatsForDateRange,
  getRecentStats
} from '../utils/demoStatsHelper';

/**
 * Custom hook for managing historical stats data
 * Provides data for calendar and chart visualizations
 */
export const useStatsHistory = (period = 'month') => {
  const { currentUser, isDemo } = useAuth();
  
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // LOAD HISTORY
  // ============================================

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        if (isDemo) {
          // Demo mode: localStorage (max 30 days)
          const data = getStatsHistory();
          setHistoryData(data);
        } else {
          // Firebase mode
          const daysToLoad = period === 'week' ? 7 : period === 'month' ? 30 : 90;
          const data = await loadRecentStats(currentUser.uid, daysToLoad);
          setHistoryData(data);
        }
      } catch (err) {
        console.error('Error loading stats history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, isDemo, period]);

  // ============================================
  // GET CALENDAR DATA
  // ============================================

  const getCalendarData = useCallback((year, month) => {
    if (!historyData) return [];

    // Generate all days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const calendarData = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      // Find stats for this day
      const dayStats = historyData.find(s => s.date === date);
      
      calendarData.push({
        date,
        day,
        wordsLearned: dayStats?.wordsLearned || 0,
        goalAchieved: dayStats?.goalAchieved || false,
        practiceSessionsCompleted: dayStats?.practiceSessionsCompleted || 0,
        timeSpentMinutes: dayStats?.timeSpentMinutes || 0,
        hasActivity: dayStats ? dayStats.wordsLearned > 0 : false
      });
    }

    return calendarData;
  }, [historyData]);

  // ============================================
  // GET CHART DATA
  // ============================================

  const getChartData = useCallback((days = 7) => {
    if (!historyData) return [];

    const today = getTodayDateString();
    const chartData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = getDateNDaysAgo(i);
      
      // Find stats for this day
      const dayStats = historyData.find(s => s.date === date);
      
      // Get day name (Mon, Tue, etc.)
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('hu-HU', { weekday: 'short' });
      
      chartData.push({
        date,
        dayName,
        wordsLearned: dayStats?.wordsLearned || 0,
        timeSpentMinutes: dayStats?.timeSpentMinutes || 0,
        avgPronunciationScore: dayStats?.avgPronunciationScore || 0,
        practiceSessionsCompleted: dayStats?.practiceSessionsCompleted || 0,
        goalAchieved: dayStats?.goalAchieved || false
      });
    }

    return chartData;
  }, [historyData]);

  // ============================================
  // GET STATS FOR SPECIFIC DATE
  // ============================================

  const getDateStats = useCallback(async (date) => {
    try {
      if (isDemo) {
        return getStatsForDate(date);
      } else {
        // Check if already in historyData
        const existing = historyData.find(s => s.date === date);
        if (existing) return existing;
        
        // Load from Firebase
        const stats = await loadDailyStats(currentUser.uid, date);
        return stats;
      }
    } catch (err) {
      console.error('Error getting date stats:', err);
      return null;
    }
  }, [currentUser, isDemo, historyData]);

  // ============================================
  // GET WEEK SUMMARY
  // ============================================

  const getWeekSummary = useCallback(() => {
    const weekData = getChartData(7);
    
    const totalWords = weekData.reduce((sum, day) => sum + day.wordsLearned, 0);
    const totalTime = weekData.reduce((sum, day) => sum + day.timeSpentMinutes, 0);
    const totalSessions = weekData.reduce((sum, day) => sum + day.practiceSessionsCompleted, 0);
    const daysActive = weekData.filter(day => day.wordsLearned > 0).length;
    const goalsAchieved = weekData.filter(day => day.goalAchieved).length;
    
    const avgWordsPerDay = daysActive > 0 ? Math.round(totalWords / daysActive) : 0;
    const avgTimePerDay = daysActive > 0 ? Math.round((totalTime / daysActive) * 10) / 10 : 0;

    return {
      totalWords,
      totalTime,
      totalSessions,
      daysActive,
      goalsAchieved,
      avgWordsPerDay,
      avgTimePerDay,
      weekData
    };
  }, [getChartData]);

  // ============================================
  // GET MONTH SUMMARY
  // ============================================

  const getMonthSummary = useCallback(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    const monthData = getCalendarData(year, month);
    
    const totalWords = monthData.reduce((sum, day) => sum + day.wordsLearned, 0);
    const totalTime = monthData.reduce((sum, day) => sum + day.timeSpentMinutes, 0);
    const totalSessions = monthData.reduce((sum, day) => sum + day.practiceSessionsCompleted, 0);
    const daysActive = monthData.filter(day => day.hasActivity).length;
    const goalsAchieved = monthData.filter(day => day.goalAchieved).length;
    
    const avgWordsPerDay = daysActive > 0 ? Math.round(totalWords / daysActive) : 0;
    const avgTimePerDay = daysActive > 0 ? Math.round((totalTime / daysActive) * 10) / 10 : 0;

    return {
      totalWords,
      totalTime,
      totalSessions,
      daysActive,
      goalsAchieved,
      avgWordsPerDay,
      avgTimePerDay,
      monthData
    };
  }, [getCalendarData]);

  // ============================================
  // RELOAD DATA
  // ============================================

  const reloadHistory = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      if (isDemo) {
        const data = getStatsHistory();
        setHistoryData(data);
      } else {
        const daysToLoad = period === 'week' ? 7 : period === 'month' ? 30 : 90;
        const data = await loadRecentStats(currentUser.uid, daysToLoad);
        setHistoryData(data);
      }
    } catch (err) {
      console.error('Error reloading stats history:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUser, isDemo, period]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const totalDaysTracked = historyData?.length || 0;
  
  const totalWordsAllTime = historyData
    ? historyData.reduce((sum, day) => sum + (day.wordsLearned || 0), 0)
    : 0;
  
  const totalTimeAllTime = historyData
    ? historyData.reduce((sum, day) => sum + (day.timeSpentMinutes || 0), 0)
    : 0;
  
  const activeDays = historyData
    ? historyData.filter(day => day.wordsLearned > 0).length
    : 0;

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    historyData,
    loading,
    error,
    
    // Computed values
    totalDaysTracked,
    totalWordsAllTime,
    totalTimeAllTime,
    activeDays,
    
    // Methods
    getCalendarData,
    getChartData,
    getDateStats,
    getWeekSummary,
    getMonthSummary,
    reloadHistory
  };
};

export default useStatsHistory;
