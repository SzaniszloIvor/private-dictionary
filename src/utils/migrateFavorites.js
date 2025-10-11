/**
 * Migration Script for Favorites Feature
 * Adds isFavorite and favoritedAt fields to existing dictionary data
 */

import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { migrateDictionaryForFavorites } from './favoritesHelper';

/**
 * Migrate Firebase dictionary for a user
 * Adds isFavorite and favoritedAt fields to all words
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Migration result
 */
export const migrateFirebaseDictionary = async (userId) => {
  try {
    console.log('🔄 Starting Firebase dictionary migration for user:', userId);
    
    const docRef = doc(db, 'dictionaries', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      console.warn('⚠️ No dictionary found for user:', userId);
      return {
        success: false,
        message: 'No dictionary found'
      };
    }
    
    const dictionary = docSnap.data().dictionary;
    let migratedCount = 0;
    let alreadyMigratedCount = 0;
    
    // Add isFavorite and favoritedAt to all words
    Object.keys(dictionary).forEach(lessonId => {
      const lesson = dictionary[lessonId];
      
      if (lesson.words && Array.isArray(lesson.words)) {
        lesson.words = lesson.words.map(word => {
          // Check if already migrated
          if (word.hasOwnProperty('isFavorite')) {
            alreadyMigratedCount++;
            return word;
          }
          
          // Add new fields
          migratedCount++;
          return {
            ...word,
            isFavorite: false,
            favoritedAt: null
          };
        });
      }
    });
    
    if (migratedCount > 0) {
      // Save migrated dictionary
      await setDoc(docRef, {
        dictionary: dictionary,
        updatedAt: new Date().toISOString(),
        migratedAt: new Date().toISOString()
      });
      
      console.log('✅ Migration completed:', {
        migratedCount,
        alreadyMigratedCount,
        totalWords: migratedCount + alreadyMigratedCount
      });
      
      return {
        success: true,
        migratedCount,
        alreadyMigratedCount,
        message: `Successfully migrated ${migratedCount} words`
      };
    } else {
      console.log('ℹ️ Dictionary already migrated');
      return {
        success: true,
        migratedCount: 0,
        alreadyMigratedCount,
        message: 'Dictionary already migrated'
      };
    }
  } catch (error) {
    console.error('❌ Error migrating Firebase dictionary:', error);
    return {
      success: false,
      error: error.message,
      message: 'Migration failed'
    };
  }
};

/**
 * Migrate demo dictionary in localStorage
 * Adds isFavorite and favoritedAt fields to all words
 * @returns {Object} Migration result
 */
export const migrateDemoDictionary = () => {
  try {
    console.log('🔄 Starting demo dictionary migration...');
    
    const demoDict = localStorage.getItem('demoDictionary');
    
    if (!demoDict) {
      console.warn('⚠️ No demo dictionary found');
      return {
        success: false,
        message: 'No demo dictionary found'
      };
    }
    
    const dictionary = JSON.parse(demoDict);
    const migratedDictionary = migrateDictionaryForFavorites(dictionary);
    
    // Count migrated words
    let migratedCount = 0;
    let alreadyMigratedCount = 0;
    
    Object.keys(dictionary).forEach(lessonId => {
      if (dictionary[lessonId].words) {
        dictionary[lessonId].words.forEach(word => {
          if (!word.hasOwnProperty('isFavorite')) {
            migratedCount++;
          } else {
            alreadyMigratedCount++;
          }
        });
      }
    });
    
    if (migratedCount > 0) {
      // Save migrated dictionary
      localStorage.setItem('demoDictionary', JSON.stringify(migratedDictionary));
      
      console.log('✅ Migration completed:', {
        migratedCount,
        alreadyMigratedCount,
        totalWords: migratedCount + alreadyMigratedCount
      });
      
      return {
        success: true,
        migratedCount,
        alreadyMigratedCount,
        message: `Successfully migrated ${migratedCount} words`
      };
    } else {
      console.log('ℹ️ Dictionary already migrated');
      return {
        success: true,
        migratedCount: 0,
        alreadyMigratedCount,
        message: 'Dictionary already migrated'
      };
    }
  } catch (error) {
    console.error('❌ Error migrating demo dictionary:', error);
    return {
      success: false,
      error: error.message,
      message: 'Migration failed'
    };
  }
};

/**
 * Auto-migrate function to run on app load
 * Detects mode and runs appropriate migration
 * @param {Object} user - Current user object (null if demo)
 * @returns {Promise<Object>} Migration result
 */
export const autoMigrateFavorites = async (user) => {
  try {
    if (user) {
      // Firebase mode
      console.log('🔄 Auto-migrating Firebase dictionary...');
      return await migrateFirebaseDictionary(user.uid);
    } else {
      // Demo mode
      console.log('🔄 Auto-migrating demo dictionary...');
      return migrateDemoDictionary();
    }
  } catch (error) {
    console.error('❌ Error in auto-migration:', error);
    return {
      success: false,
      error: error.message,
      message: 'Auto-migration failed'
    };
  }
};

/**
 * Check if dictionary needs migration
 * @param {Object} dictionary - Dictionary object
 * @returns {boolean} True if migration needed
 */
export const needsMigration = (dictionary) => {
  try {
    if (!dictionary || Object.keys(dictionary).length === 0) {
      return false;
    }
    
    // Check first word in first lesson
    const firstLessonId = Object.keys(dictionary)[0];
    const firstLesson = dictionary[firstLessonId];
    
    if (firstLesson.words && firstLesson.words.length > 0) {
      const firstWord = firstLesson.words[0];
      return !firstWord.hasOwnProperty('isFavorite');
    }
    
    return false;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};
