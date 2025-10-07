// src/hooks/useStreak.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getTodayDateString,
  getYesterdayDateString,
  loadStreakData,
  saveStreakData
} from '../services/firebase';
import {
  getStreakData,
  markTodayAsActive as demoMarkActive
} from '../utils/demoStatsHelper';

/**
 * Custom hook for managing learning streaks
 * Tracks consecutive days of practice
 */
export const useStreak = () => {
  const { currentUser, isDemo } = useAuth();
  
  const [streakData, setStreakData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ============================================
  // LOAD STREAK DATA
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
          // Demo mode: localStorage
          const data = getStreakData();
          setStreakData(data);
        } else {
          // Firebase mode
          const data = await loadStreakData(currentUser.uid);
          setStreakData(data);
        }
      } catch (err) {
        console.error('Error loading streak data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, isDemo]);

  // ============================================
  // CHECK MILESTONES
  // ============================================

  const checkMilestones = useCallback((streakCount, oldMilestones) => {
    return {
      week: streakCount >= 7 || oldMilestones.week,
      twoWeeks: streakCount >= 14 || oldMilestones.twoWeeks,
      month: streakCount >= 30 || oldMilestones.month,
      hundred: streakCount >= 100 || oldMilestones.hundred
    };
  }, []);

  // ============================================
  // UPDATE STREAK
  // ============================================

  const updateStreak = useCallback(async (wasActiveYesterday = false) => {
    if (!currentUser || !streakData) return null;

    try {
      const today = getTodayDateString();

      if (isDemo) {
        // Demo mode
        const updated = demoMarkActive();
        setStreakData(updated);
        return updated;
      } else {
        // Firebase mode
        let newStreakData;

        if (wasActiveYesterday || streakData.current === 0) {
          // Continue or start streak
          const newCurrent = streakData.current + 1;
          const newLongest = Math.max(newCurrent, streakData.longestStreak || 0);
          const newMilestones = checkMilestones(newCurrent, streakData.milestones);

          newStreakData = {
            currentStreak: newCurrent,
            longestStreak: newLongest,
            lastActiveDate: today,
            totalActiveDays: (streakData.totalActiveDays || 0) + 1,
            streakStartDate: streakData.streakStartDate || today,
            milestones: newMilestones
          };
        } else {
          // Streak broken, reset
          newStreakData = {
            currentStreak: 1,
            longestStreak: streakData.longestStreak || 0,
            lastActiveDate: today,
            totalActiveDays: (streakData.totalActiveDays || 0) + 1,
            streakStartDate: today,
            milestones: {
              week: false,
              twoWeeks: false,
              month: false,
              hundred: false
            }
          };
        }

        await saveStreakData(currentUser.uid, newStreakData);
        setStreakData(newStreakData);
        return newStreakData;
      }
    } catch (err) {
      console.error('Error updating streak:', err);
      setError(err.message);
      return null;
    }
  }, [currentUser, isDemo, streakData, checkMilestones]);

  // ============================================
  // CHECK STREAK STATUS
  // ============================================

  const checkStreakStatus = useCallback(async () => {
    if (!currentUser || !streakData) return false;

    try {
      const today = getTodayDateString();
      const yesterday = getYesterdayDateString();

      // Already marked active today
      if (streakData.lastActiveDate === today) {
        return true;
      }

      // Check if was active yesterday
      const wasActiveYesterday = streakData.lastActiveDate === yesterday;
      
      await updateStreak(wasActiveYesterday);
      return true;
    } catch (err) {
      console.error('Error checking streak status:', err);
      setError(err.message);
      return false;
    }
  }, [currentUser, streakData, updateStreak]);

  // ============================================
  // MARK TODAY AS ACTIVE
  // ============================================

  const markTodayAsActive = useCallback(async () => {
    if (!currentUser || !streakData) return false;

    try {
      const today = getTodayDateString();
      
      // Already marked today
      if (streakData.lastActiveDate === today) {
        return true;
      }

      const yesterday = getYesterdayDateString();
      const wasActiveYesterday = streakData.lastActiveDate === yesterday;
      
      await updateStreak(wasActiveYesterday);
      return true;
    } catch (err) {
      console.error('Error marking today as active:', err);
      setError(err.message);
      return false;
    }
  }, [currentUser, streakData, updateStreak]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isStreakActive = streakData?.lastActiveDate === getTodayDateString();
  
  const streakStatus = streakData?.currentStreak > 0 
    ? streakData.currentStreak >= 7 
      ? 'hot'   // 7+ days
      : 'warm'  // 1-6 days
    : 'cold';   // 0 days

  const nextMilestone = streakData 
    ? streakData.currentStreak < 7 
      ? { days: 7, label: 'Week Warrior' }
      : streakData.currentStreak < 14
        ? { days: 14, label: 'Two Week Champion' }
        : streakData.currentStreak < 30
          ? { days: 30, label: 'Month Master' }
          : streakData.currentStreak < 100
            ? { days: 100, label: 'Century Club' }
            : null
    : { days: 7, label: 'Week Warrior' };

  const daysToNextMilestone = nextMilestone && streakData
    ? nextMilestone.days - streakData.currentStreak
    : 7;

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    streakData,
    loading,
    error,
    
    // Computed values
    isStreakActive,
    streakStatus,
    nextMilestone,
    daysToNextMilestone,
    
    // Methods
    updateStreak,
    checkStreakStatus,
    markTodayAsActive
  };
};

export default useStreak;
