/**
 * Favorites Helper for Demo Mode (localStorage)
 * Manages favorite words in browser storage
 */

const FAVORITES_STORAGE_KEY = 'demoFavorites';

/**
 * Get all favorites from localStorage
 * @returns {Array} Array of favorite references
 */
export const getDemoFavorites = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading demo favorites:', error);
    return [];
  }
};

/**
 * Save favorites to localStorage
 * @param {Array} favorites - Array of favorite references
 */
export const saveDemoFavorites = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    return true;
  } catch (error) {
    console.error('Error saving demo favorites:', error);
    return false;
  }
};

/**
 * Add a word to favorites
 * @param {string} lessonId - Lesson ID
 * @param {number} wordIndex - Word index
 * @returns {boolean} Success status
 */
export const addDemoFavorite = (lessonId, wordIndex) => {
  try {
    const favorites = getDemoFavorites();
    
    // Check if already exists
    const exists = favorites.some(
      f => f.lessonId === lessonId && f.wordIndex === wordIndex
    );
    
    if (!exists) {
      favorites.push({
        lessonId,
        wordIndex,
        addedAt: new Date().toISOString()
      });
      
      return saveDemoFavorites(favorites);
    }
    
    return true;
  } catch (error) {
    console.error('Error adding demo favorite:', error);
    return false;
  }
};

/**
 * Remove a word from favorites
 * @param {string} lessonId - Lesson ID
 * @param {number} wordIndex - Word index
 * @returns {boolean} Success status
 */
export const removeDemoFavorite = (lessonId, wordIndex) => {
  try {
    let favorites = getDemoFavorites();
    
    // Filter out the matching favorite
    favorites = favorites.filter(
      f => !(f.lessonId === lessonId && f.wordIndex === wordIndex)
    );
    
    return saveDemoFavorites(favorites);
  } catch (error) {
    console.error('Error removing demo favorite:', error);
    return false;
  }
};

/**
 * Toggle favorite status
 * @param {string} lessonId - Lesson ID
 * @param {number} wordIndex - Word index
 * @returns {boolean} New favorite status
 */
export const toggleDemoFavorite = (lessonId, wordIndex) => {
  try {
    const favorites = getDemoFavorites();
    
    const existingIndex = favorites.findIndex(
      f => f.lessonId === lessonId && f.wordIndex === wordIndex
    );
    
    if (existingIndex > -1) {
      // Remove from favorites
      favorites.splice(existingIndex, 1);
      saveDemoFavorites(favorites);
      return false;
    } else {
      // Add to favorites
      favorites.push({
        lessonId,
        wordIndex,
        addedAt: new Date().toISOString()
      });
      saveDemoFavorites(favorites);
      return true;
    }
  } catch (error) {
    console.error('Error toggling demo favorite:', error);
    return false;
  }
};

/**
 * Check if a word is favorited
 * @param {string} lessonId - Lesson ID
 * @param {number} wordIndex - Word index
 * @returns {boolean} Is favorited
 */
export const isDemoFavorite = (lessonId, wordIndex) => {
  try {
    const favorites = getDemoFavorites();
    return favorites.some(
      f => f.lessonId === lessonId && f.wordIndex === wordIndex
    );
  } catch (error) {
    console.error('Error checking demo favorite:', error);
    return false;
  }
};

/**
 * Get all favorite words with full data
 * @param {Object} dictionary - Full dictionary object
 * @returns {Array} Array of favorite words with metadata
 */
export const getAllDemoFavorites = (dictionary) => {
  try {
    const favoriteRefs = getDemoFavorites();
    const favorites = [];
    
    favoriteRefs.forEach(ref => {
      const lesson = dictionary[ref.lessonId];
      if (lesson && lesson.words && lesson.words[ref.wordIndex]) {
        const word = lesson.words[ref.wordIndex];
        favorites.push({
          ...word,
          lessonId: ref.lessonId,
          lessonTitle: lesson.title || `Lesson ${ref.lessonId}`,
          wordIndex: ref.wordIndex,
          favoritedAt: ref.addedAt
        });
      }
    });
    
    // Sort by addedAt (newest first)
    favorites.sort((a, b) => 
      new Date(b.favoritedAt) - new Date(a.favoritedAt)
    );
    
    return favorites;
  } catch (error) {
    console.error('Error getting all demo favorites:', error);
    return [];
  }
};

/**
 * Clear all favorites
 * @returns {boolean} Success status
 */
export const clearAllDemoFavorites = () => {
  try {
    localStorage.removeItem(FAVORITES_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing demo favorites:', error);
    return false;
  }
};

/**
 * Get favorites count
 * @returns {number} Number of favorites
 */
export const getDemoFavoritesCount = () => {
  try {
    const favorites = getDemoFavorites();
    return favorites.length;
  } catch (error) {
    console.error('Error getting favorites count:', error);
    return 0;
  }
};

/**
 * Migrate dictionary to include isFavorite fields
 * Updates existing dictionary data in localStorage
 * @param {Object} dictionary - Dictionary object to migrate
 * @returns {Object} Migrated dictionary
 */
export const migrateDictionaryForFavorites = (dictionary) => {
  try {
    const favorites = getDemoFavorites();
    const migratedDictionary = { ...dictionary };
    
    // Add isFavorite and favoritedAt fields to all words
    Object.keys(migratedDictionary).forEach(lessonId => {
      if (migratedDictionary[lessonId].words) {
        migratedDictionary[lessonId].words = migratedDictionary[lessonId].words.map((word, index) => {
          // Check if this word is in favorites
          const favoriteRef = favorites.find(
            f => f.lessonId === lessonId && f.wordIndex === index
          );
          
          return {
            ...word,
            isFavorite: !!favoriteRef,
            favoritedAt: favoriteRef ? favoriteRef.addedAt : null
          };
        });
      }
    });
    
    return migratedDictionary;
  } catch (error) {
    console.error('Error migrating dictionary:', error);
    return dictionary;
  }
};
