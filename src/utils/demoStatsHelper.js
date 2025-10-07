// src/utils/demoStatsHelper.js
/**
 * Demo mode stats management using localStorage
 * Max 30 days history to keep storage under 50KB
 */

const DEMO_STATS_KEY = 'demoStats';
const MAX_HISTORY_DAYS = 30;

// ============================================
// CORE FUNCTIONS
// ============================================

/**
 * Get today's date in YYYY-MM-DD format
 */
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Get yesterday's date string
 */
export const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Initialize demo stats structure
 */
const initializeDemoStats = () => {
  const today = getTodayDateString();
  
  return {
    today: {
      date: today,
      wordsLearned: 0,
      wordsReviewed: 0,
      practiceSessionsCompleted: 0,
      pronunciationAttempts: 0,
      avgPronunciationScore: 0,
      timeSpentMinutes: 0,
      lessonsCompleted: [],
      goalAchieved: false,
      timestamp: new Date().toISOString()
    },
    history: [],
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      totalActiveDays: 0,
      streakStartDate: null,
      milestones: {
        week: false,
        twoWeeks: false,
        month: false,
        hundred: false
      }
    },
    goal: 10
  };
};

/**
 * Load demo stats from localStorage
 */
export const loadDemoStats = () => {
  try {
    const stored = localStorage.getItem(DEMO_STATS_KEY);
    
    if (!stored) {
      const initialized = initializeDemoStats();
      saveDemoStats(initialized);
      return initialized;
    }
    
    const parsed = JSON.parse(stored);
    const today = getTodayDateString();
    
    // Check if we need to roll over to a new day
    if (parsed.today.date !== today) {
      return rollOverToNewDay(parsed);
    }
    
    return parsed;
  } catch (error) {
    console.error('Error loading demo stats:', error);
    return initializeDemoStats();
  }
};

/**
 * Save demo stats to localStorage
 */
export const saveDemoStats = (stats) => {
  try {
    localStorage.setItem(DEMO_STATS_KEY, JSON.stringify(stats));
    return true;
  } catch (error) {
    console.error('Error saving demo stats:', error);
    return false;
  }
};

/**
 * Roll over to a new day (move today to history)
 */
const rollOverToNewDay = (oldStats) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  
  // Add yesterday's stats to history if it had activity
  let newHistory = [...oldStats.history];
  if (oldStats.today.wordsLearned > 0) {
    newHistory.unshift(oldStats.today);
    
    // Limit history to MAX_HISTORY_DAYS
    if (newHistory.length > MAX_HISTORY_DAYS) {
      newHistory = newHistory.slice(0, MAX_HISTORY_DAYS);
    }
  }
  
  // Update streak
  const newStreak = updateStreakOnNewDay(
    oldStats.streak,
    oldStats.today.date,
    oldStats.today.wordsLearned > 0
  );
  
  // Create new today stats
  const newToday = {
    date: today,
    wordsLearned: 0,
    wordsReviewed: 0,
    practiceSessionsCompleted: 0,
    pronunciationAttempts: 0,
    avgPronunciationScore: 0,
    timeSpentMinutes: 0,
    lessonsCompleted: [],
    goalAchieved: false,
    timestamp: new Date().toISOString()
  };
  
  return {
    today: newToday,
    history: newHistory,
    streak: newStreak,
    goal: oldStats.goal
  };
};

// ============================================
// DAILY STATS FUNCTIONS
// ============================================

/**
 * Get today's stats
 */
export const getTodayStats = () => {
  const stats = loadDemoStats();
  return stats.today;
};

/**
 * Update today's stats
 */
export const updateTodayStats = (updates) => {
  const stats = loadDemoStats();
  
  stats.today = {
    ...stats.today,
    ...updates,
    timestamp: new Date().toISOString()
  };
  
  // Check if goal achieved
  if (stats.today.wordsLearned >= stats.goal) {
    stats.today.goalAchieved = true;
  }
  
  saveDemoStats(stats);
  return stats.today;
};

/**
 * Increment words learned
 */
export const incrementWordsLearned = (count = 1) => {
  const stats = loadDemoStats();
  stats.today.wordsLearned += count;
  stats.today.timestamp = new Date().toISOString();
  
  // Check goal achievement
  if (stats.today.wordsLearned >= stats.goal) {
    stats.today.goalAchieved = true;
  }
  
  saveDemoStats(stats);
  return stats.today;
};

/**
 * Add practice session data
 */
export const addPracticeSession = (sessionData) => {
  const stats = loadDemoStats();
  
  stats.today.wordsLearned += sessionData.wordsLearned || 0;
  stats.today.wordsReviewed += sessionData.wordsReviewed || 0;
  stats.today.practiceSessionsCompleted += 1;
  stats.today.timeSpentMinutes += sessionData.timeSpentMinutes || 0;
  
  if (sessionData.pronunciationAttempts) {
    stats.today.pronunciationAttempts += sessionData.pronunciationAttempts;
    
    // Update average pronunciation score
    const totalAttempts = stats.today.pronunciationAttempts;
    const oldAvg = stats.today.avgPronunciationScore;
    const newScore = sessionData.avgPronunciationScore || 0;
    
    stats.today.avgPronunciationScore = 
      (oldAvg * (totalAttempts - sessionData.pronunciationAttempts) + 
       newScore * sessionData.pronunciationAttempts) / totalAttempts;
  }
  
  // Add lesson to completed list if not already there
  if (sessionData.lessonNumber && 
      !stats.today.lessonsCompleted.includes(sessionData.lessonNumber)) {
    stats.today.lessonsCompleted.push(sessionData.lessonNumber);
  }
  
  // Check goal achievement
  if (stats.today.wordsLearned >= stats.goal) {
    stats.today.goalAchieved = true;
  }
  
  stats.today.timestamp = new Date().toISOString();
  saveDemoStats(stats);
  
  return stats.today;
};

// ============================================
// STREAK FUNCTIONS
// ============================================

/**
 * Get streak data
 */
export const getStreakData = () => {
  const stats = loadDemoStats();
  return stats.streak;
};

/**
 * Update streak on new day
 */
const updateStreakOnNewDay = (oldStreak, lastDate, hadActivity) => {
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  
  // If no activity yesterday, check if streak should reset
  if (!hadActivity) {
    return oldStreak; // Keep as is, user hasn't practiced today yet
  }
  
  // User had activity yesterday, now check if it was consecutive
  const wasConsecutive = lastDate === yesterday;
  
  if (wasConsecutive) {
    // Continue streak
    const newCurrent = oldStreak.current + 1;
    const newLongest = Math.max(newCurrent, oldStreak.longestStreak);
    const newMilestones = checkMilestones(newCurrent, oldStreak.milestones);
    
    return {
      current: newCurrent,
      longest: newLongest,
      lastActiveDate: lastDate,
      totalActiveDays: oldStreak.totalActiveDays + 1,
      streakStartDate: oldStreak.streakStartDate || lastDate,
      milestones: newMilestones
    };
  } else {
    // Streak broken, reset
    return {
      current: 1,
      longest: oldStreak.longest,
      lastActiveDate: lastDate,
      totalActiveDays: oldStreak.totalActiveDays + 1,
      streakStartDate: lastDate,
      milestones: {
        week: false,
        twoWeeks: false,
        month: false,
        hundred: false
      }
    };
  }
};

/**
 * Check and update milestones
 */
const checkMilestones = (streakCount, oldMilestones) => {
  return {
    week: streakCount >= 7 || oldMilestones.week,
    twoWeeks: streakCount >= 14 || oldMilestones.twoWeeks,
    month: streakCount >= 30 || oldMilestones.month,
    hundred: streakCount >= 100 || oldMilestones.hundred
  };
};

/**
 * Mark today as active (update streak)
 */
export const markTodayAsActive = () => {
  const stats = loadDemoStats();
  const today = getTodayDateString();
  const yesterday = getYesterdayDateString();
  
  // Don't update if already marked today
  if (stats.streak.lastActiveDate === today) {
    return stats.streak;
  }
  
  const wasActiveYesterday = stats.streak.lastActiveDate === yesterday;
  
  if (wasActiveYesterday || stats.streak.current === 0) {
    // Continue or start streak
    const newCurrent = stats.streak.current + 1;
    const newLongest = Math.max(newCurrent, stats.streak.longest);
    const newMilestones = checkMilestones(newCurrent, stats.streak.milestones);
    
    stats.streak = {
      current: newCurrent,
      longest: newLongest,
      lastActiveDate: today,
      totalActiveDays: stats.streak.totalActiveDays + 1,
      streakStartDate: stats.streak.streakStartDate || today,
      milestones: newMilestones
    };
  } else {
    // Streak broken, reset to 1
    stats.streak = {
      current: 1,
      longest: stats.streak.longest,
      lastActiveDate: today,
      totalActiveDays: stats.streak.totalActiveDays + 1,
      streakStartDate: today,
      milestones: {
        week: false,
        twoWeeks: false,
        month: false,
        hundred: false
      }
    };
  }
  
  saveDemoStats(stats);
  return stats.streak;
};

// ============================================
// HISTORY FUNCTIONS
// ============================================

/**
 * Get stats history
 */
export const getStatsHistory = () => {
  const stats = loadDemoStats();
  return stats.history;
};

/**
 * Get stats for specific date
 */
export const getStatsForDate = (date) => {
  const stats = loadDemoStats();
  const today = getTodayDateString();
  
  if (date === today) {
    return stats.today;
  }
  
  return stats.history.find(s => s.date === date) || null;
};

/**
 * Get stats for date range
 */
export const getStatsForDateRange = (startDate, endDate) => {
  const stats = loadDemoStats();
  const today = getTodayDateString();
  
  const allStats = [stats.today, ...stats.history];
  
  return allStats.filter(s => {
    return s.date >= startDate && s.date <= endDate;
  }).sort((a, b) => b.date.localeCompare(a.date));
};

/**
 * Get recent stats (last N days)
 */
export const getRecentStats = (days = 7) => {
  const stats = loadDemoStats();
  const today = getTodayDateString();
  
  const allStats = [stats.today, ...stats.history];
  
  return allStats.slice(0, days);
};

// ============================================
// SETTINGS FUNCTIONS
// ============================================

/**
 * Get daily goal
 */
export const getDailyGoal = () => {
  const stats = loadDemoStats();
  return stats.goal;
};

/**
 * Set daily goal
 */
export const setDailyGoal = (newGoal) => {
  const stats = loadDemoStats();
  stats.goal = newGoal;
  
  // Recheck today's goal achievement
  if (stats.today.wordsLearned >= newGoal) {
    stats.today.goalAchieved = true;
  } else {
    stats.today.goalAchieved = false;
  }
  
  saveDemoStats(stats);
  return newGoal;
};

// ============================================
// CLEANUP FUNCTIONS
// ============================================

/**
 * Clear all demo stats
 */
export const clearDemoStats = () => {
  try {
    localStorage.removeItem(DEMO_STATS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing demo stats:', error);
    return false;
  }
};

/**
 * Reset demo stats (initialize fresh)
 */
export const resetDemoStats = () => {
  const initialized = initializeDemoStats();
  saveDemoStats(initialized);
  return initialized;
};
