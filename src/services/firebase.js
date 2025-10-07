// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

const missingEnvVars = requiredEnvVars.filter(
  varName => !import.meta.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error('❌ Hiányzó környezeti változók:', missingEnvVars.join(', '));
  console.error('Kérlek állítsd be őket a .env fájlban!');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error during sign in:", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error during sign out:", error);
    throw error;
  }
};

// ============================================
// DICTIONARY FUNCTIONS (EXISTING)
// ============================================

export const saveDictionary = async (userId, dictionary) => {
  try {
    await setDoc(doc(db, 'dictionaries', userId), {
      dictionary: dictionary,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error saving dictionary:", error);
    throw error;
  }
};

export const loadDictionary = async (userId) => {
  try {
    const docRef = doc(db, 'dictionaries', userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data().dictionary;
    } else {
      return {};
    }
  } catch (error) {
    console.error("Error loading dictionary:", error);
    return {};
  }
};

// ============================================
// DAILY STATS FUNCTIONS (NEW)
// ============================================

/**
 * Get today's date in YYYY-MM-DD format (UTC)
 */
export const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

/**
 * Save daily stats for a specific date
 * @param {string} userId - User ID
 * @param {string} date - Date string (YYYY-MM-DD)
 * @param {object} stats - Stats object
 */
export const saveDailyStats = async (userId, date, stats) => {
  try {
    const statsRef = doc(db, 'users', userId, 'stats', date);
    await setDoc(statsRef, {
      ...stats,
      date,
      timestamp: new Date().toISOString()
    }, { merge: true }); // Merge to update existing data
    
    return true;
  } catch (error) {
    console.error("Error saving daily stats:", error);
    throw error;
  }
};

/**
 * Load daily stats for a specific date
 * @param {string} userId - User ID
 * @param {string} date - Date string (YYYY-MM-DD)
 */
export const loadDailyStats = async (userId, date) => {
  try {
    const statsRef = doc(db, 'users', userId, 'stats', date);
    const statsSnap = await getDoc(statsRef);
    
    if (statsSnap.exists()) {
      return statsSnap.data();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error loading daily stats:", error);
    return null;
  }
};

/**
 * Load stats history for a date range
 * @param {string} userId - User ID
 * @param {string} startDate - Start date (YYYY-MM-DD)
 * @param {string} endDate - End date (YYYY-MM-DD)
 */
export const loadStatsHistory = async (userId, startDate, endDate) => {
  try {
    const statsRef = collection(db, 'users', userId, 'stats');
    const q = query(
      statsRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const history = [];
    
    querySnapshot.forEach((doc) => {
      history.push(doc.data());
    });
    
    return history;
  } catch (error) {
    console.error("Error loading stats history:", error);
    return [];
  }
};

/**
 * Load recent stats (last N days)
 * @param {string} userId - User ID
 * @param {number} days - Number of days to load (default: 30)
 */
export const loadRecentStats = async (userId, days = 30) => {
  try {
    const statsRef = collection(db, 'users', userId, 'stats');
    const q = query(
      statsRef,
      orderBy('date', 'desc'),
      limit(days)
    );
    
    const querySnapshot = await getDocs(q);
    const recentStats = [];
    
    querySnapshot.forEach((doc) => {
      recentStats.push(doc.data());
    });
    
    return recentStats;
  } catch (error) {
    console.error("Error loading recent stats:", error);
    return [];
  }
};

// ============================================
// STREAK FUNCTIONS (NEW)
// ============================================

/**
 * Save streak data
 * @param {string} userId - User ID
 * @param {object} streakData - Streak object
 */
export const saveStreakData = async (userId, streakData) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', 'current');
    await setDoc(streakRef, {
      ...streakData,
      updatedAt: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error("Error saving streak data:", error);
    throw error;
  }
};

/**
 * Load streak data
 * @param {string} userId - User ID
 */
export const loadStreakData = async (userId) => {
  try {
    const streakRef = doc(db, 'users', userId, 'streaks', 'current');
    const streakSnap = await getDoc(streakRef);
    
    if (streakSnap.exists()) {
      return streakSnap.data();
    } else {
      // Return default streak data
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: null,
        totalActiveDays: 0,
        streakStartDate: null,
        milestones: {
          week: false,
          twoWeeks: false,
          month: false,
          hundred: false
        }
      };
    }
  } catch (error) {
    console.error("Error loading streak data:", error);
    return null;
  }
};

// ============================================
// SETTINGS FUNCTIONS (NEW)
// ============================================

/**
 * Save user settings
 * @param {string} userId - User ID
 * @param {object} settings - Settings object
 */
export const saveUserSettings = async (userId, settings) => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    await setDoc(settingsRef, {
      ...settings,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    
    return true;
  } catch (error) {
    console.error("Error saving user settings:", error);
    throw error;
  }
};

/**
 * Load user settings
 * @param {string} userId - User ID
 */
export const loadUserSettings = async (userId) => {
  try {
    const settingsRef = doc(db, 'users', userId, 'settings', 'preferences');
    const settingsSnap = await getDoc(settingsRef);
    
    if (settingsSnap.exists()) {
      return settingsSnap.data();
    } else {
      // Return default settings
      return {
        dailyGoal: 10,
        reminderEnabled: false,
        reminderTime: "19:00",
        weeklyGoal: 50
      };
    }
  } catch (error) {
    console.error("Error loading user settings:", error);
    return null;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get yesterday's date string
 */
export const getYesterdayDateString = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
};

/**
 * Get date N days ago
 * @param {number} daysAgo - Number of days ago
 */
export const getDateNDaysAgo = (daysAgo) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date.toISOString().split('T')[0];
};

/**
 * Check if two dates are consecutive days
 * @param {string} date1 - First date (YYYY-MM-DD)
 * @param {string} date2 - Second date (YYYY-MM-DD)
 */
export const areConsecutiveDays = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};
