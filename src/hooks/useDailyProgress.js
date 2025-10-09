// src/hooks/useDailyProgress.js
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getTodayDateString,
  loadDailyStats,
  saveDailyStats,
  loadUserSettings,
  saveUserSettings
} from '../services/firebase';
import {
  getTodayStats,
  updateTodayStats,
  incrementWordsLearned as demoIncrementWords,
  addPracticeSession as demoAddSession,
  getDailyGoal as demoGetGoal,
  setDailyGoal as demoSetGoal
} from '../utils/demoStatsHelper';

/**
 * Custom hook for managing daily learning progress
 * Works with both Firebase (authenticated) and localStorage (demo)
 */
export const useDailyProgress = () => {
  const { currentUser, isDemo } = useAuth();
  
  const [todayStats, setTodayStats] = useState(null);
  const [dailyGoal, setDailyGoal] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [goalJustAchieved, setGoalJustAchieved] = useState(false);

  // ============================================
  // LOAD TODAY'S STATS & SETTINGS
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
          const stats = getTodayStats();
          const goal = demoGetGoal();
          
          setTodayStats(stats);
          setDailyGoal(goal);
        } else {
          // Firebase mode
          const today = getTodayDateString();
          
          // Load today's stats and settings in parallel
          const [stats, settings] = await Promise.all([
            loadDailyStats(currentUser.uid, today),
            loadUserSettings(currentUser.uid)
          ]);
          
          // Initialize today's stats if not exists
          if (!stats) {
            const initialStats = {
              date: today,
              wordsLearned: 0,
              wordsReviewed: 0,
              practiceSessionsCompleted: 0,
              pronunciationAttempts: 0,
              avgPronunciationScore: 0,
              timeSpentMinutes: 0,
              lessonsCompleted: [],
              goalAchieved: false
            };
            
            await saveDailyStats(currentUser.uid, today, initialStats);
            setTodayStats(initialStats);
          } else {
            setTodayStats(stats);
          }
          
          setDailyGoal(settings?.dailyGoal || 10);
        }
      } catch (err) {
        console.error('Error loading daily progress:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [currentUser, isDemo]);

  // ============================================
  // INCREMENT WORDS LEARNED
  // ============================================

  const incrementWordsLearned = useCallback(async (count = 1) => {
    if (!currentUser || !todayStats) return false;

    try {
      if (isDemo) {
        // Demo mode
        const updated = demoIncrementWords(count);
        setTodayStats(updated);
        return true;
      } else {
        // Firebase mode
        const today = getTodayDateString();
        const newWordsLearned = todayStats.wordsLearned + count;
        const goalAchieved = newWordsLearned >= dailyGoal;

        const wasGoalAchieved = todayStats?.goalAchieved || false;
        const newGoalAchieved = newWordsLearned >= dailyGoal;

        if (!wasGoalAchieved && newGoalAchieved) {
          setGoalJustAchieved(true);
          setTimeout(() => setGoalJustAchieved(false), 3000);
        }
        
        const updates = {
          wordsLearned: newWordsLearned,
          goalAchieved
        };
        
        await saveDailyStats(currentUser.uid, today, updates);
        
        setTodayStats(prev => ({
          ...prev,
          ...updates
        }));
        
        return true;
      }
    } catch (err) {
      console.error('Error incrementing words learned:', err);
      setError(err.message);
      return false;
    }
  }, [currentUser, isDemo, todayStats, dailyGoal]);

  // ============================================
  // UPDATE SESSION STATS
  // ============================================

  const updateSessionStats = useCallback(async (sessionData) => {
    if (!currentUser || !todayStats) return false;

    try {
      if (isDemo) {
        // Demo mode
        const updated = demoAddSession(sessionData);
        setTodayStats(updated);
        return true;
      } else {
        // Firebase mode
        const today = getTodayDateString();
        
        // Calculate new values
        const newWordsLearned = todayStats.wordsLearned + (sessionData.wordsLearned || 0);
        const newWordsReviewed = todayStats.wordsReviewed + (sessionData.wordsReviewed || 0);
        const newSessionsCompleted = todayStats.practiceSessionsCompleted + 1;
        const newTimeSpent = todayStats.timeSpentMinutes + (sessionData.timeSpentMinutes || 0);
        
        // Handle pronunciation stats
        let newPronunciationAttempts = todayStats.pronunciationAttempts;
        let newAvgScore = todayStats.avgPronunciationScore;
        
        if (sessionData.pronunciationAttempts) {
          newPronunciationAttempts += sessionData.pronunciationAttempts;
          
          const totalAttempts = newPronunciationAttempts;
          const oldAvg = todayStats.avgPronunciationScore || 0;
          const newScore = sessionData.avgPronunciationScore || 0;
          const addedAttempts = sessionData.pronunciationAttempts;
          
          newAvgScore = (
            (oldAvg * (totalAttempts - addedAttempts)) + 
            (newScore * addedAttempts)
          ) / totalAttempts;
        }
        
        // Handle lessons completed
        const newLessonsCompleted = [...todayStats.lessonsCompleted];
        if (sessionData.lessonNumber && 
            !newLessonsCompleted.includes(sessionData.lessonNumber)) {
          newLessonsCompleted.push(sessionData.lessonNumber);
        }
        
        const goalAchieved = newWordsLearned >= dailyGoal;

          // Check if goal JUST achieved
        const wasGoalAchieved = todayStats?.goalAchieved || false;
        const newGoalAchieved = newWordsLearned >= dailyGoal;

        if (!wasGoalAchieved && newGoalAchieved) {
          setGoalJustAchieved(true);
          setTimeout(() => setGoalJustAchieved(false), 3000);
        }
        
        const updates = {
          wordsLearned: newWordsLearned,
          wordsReviewed: newWordsReviewed,
          practiceSessionsCompleted: newSessionsCompleted,
          timeSpentMinutes: Math.round(newTimeSpent * 100) / 100,
          pronunciationAttempts: newPronunciationAttempts,
          avgPronunciationScore: Math.round(newAvgScore * 100) / 100,
          lessonsCompleted: newLessonsCompleted,
          goalAchieved
        };
        
        await saveDailyStats(currentUser.uid, today, updates);
        
        setTodayStats(prev => ({
          ...prev,
          ...updates
        }));
        
        return true;
      }
    } catch (err) {
      console.error('Error updating session stats:', err);
      setError(err.message);
      return false;
    }
  }, [currentUser, isDemo, todayStats, dailyGoal]);

  // ============================================
  // UPDATE DAILY GOAL
  // ============================================

  const updateDailyGoal = useCallback(async (newGoal) => {
    if (!currentUser) return false;

    try {
      if (isDemo) {
        // Demo mode
        demoSetGoal(newGoal);
        setDailyGoal(newGoal);
        
        // Recheck today's goal achievement
        const stats = getTodayStats();
        setTodayStats(stats);
        
        return true;
      } else {
        // Firebase mode
        await saveUserSettings(currentUser.uid, {
          dailyGoal: newGoal
        });
        
        setDailyGoal(newGoal);
        
        // Recheck today's goal achievement
        const today = getTodayDateString();
        const goalAchieved = todayStats.wordsLearned >= newGoal;
        
        await saveDailyStats(currentUser.uid, today, {
          goalAchieved
        });
        
        setTodayStats(prev => ({
          ...prev,
          goalAchieved
        }));
        
        return true;
      }
    } catch (err) {
      console.error('Error updating daily goal:', err);
      setError(err.message);
      return false;
    }
  }, [currentUser, isDemo, todayStats]);

  // ============================================
  // COMPUTED VALUES
  // ============================================

  const isGoalAchieved = todayStats?.goalAchieved || false;
  
  const progressPercentage = todayStats 
    ? Math.min(100, Math.round((todayStats.wordsLearned / dailyGoal) * 100))
    : 0;
  
  const wordsRemaining = todayStats 
    ? Math.max(0, dailyGoal - todayStats.wordsLearned)
    : dailyGoal;

  // ============================================
  // RETURN
  // ============================================

  return {
    // State
    todayStats,
    dailyGoal,
    loading,
    error,
    goalJustAchieved, 
    
    // Computed values
    isGoalAchieved,
    progressPercentage,
    wordsRemaining,
    
    // Methods
    incrementWordsLearned,
    updateSessionStats,
    updateDailyGoal
  };
};

export default useDailyProgress;
