import { useState, useEffect, useCallback } from 'react';
import { toggleFavorite, getAllFavorites } from '../services/firebase';
import {
  getDemoFavorites,
  toggleDemoFavorite,
  getAllDemoFavorites,
  isDemoFavorite,
  getDemoFavoritesCount
} from '../utils/favoritesHelper';

/**
 * Custom hook for managing favorite words
 * Supports both Firebase (authenticated) and localStorage (demo)
 * 
 * @param {string|null} userId - User ID (null for demo mode)
 * @param {boolean} isDemo - Whether in demo mode
 * @param {Object} dictionary - Current dictionary object
 * @returns {Object} Favorites state and functions
 */
export const useFavorites = (userId, isDemo, dictionary) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  /**
   * Load all favorite words
   */
  const loadFavorites = useCallback(async () => {
    if (!dictionary || Object.keys(dictionary).length === 0) {
      setFavorites([]);
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      if (isDemo) {
        // Demo mode: localStorage
        const demoFavs = getAllDemoFavorites(dictionary);
        setFavorites(demoFavs);
      } else if (userId) {
        // Firebase mode
        const allFavs = await getAllFavorites(userId);
        setFavorites(allFavs);
      } else {
        setFavorites([]);
      }
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError('Failed to load favorites');
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [userId, isDemo, dictionary]);
  
  /**
   * Load favorites on mount and when dependencies change
   */
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  
  /**
   * Toggle favorite status for a word
   * @param {string} lessonId - Lesson ID
   * @param {number} wordIndex - Word index
   * @returns {Promise<boolean>} New favorite status
   */
  const toggleWordFavorite = useCallback(async (lessonId, wordIndex) => {
    setError(null);
    
    try {
      if (isDemo) {
        // Demo mode: localStorage
        const newStatus = toggleDemoFavorite(lessonId, wordIndex);
        
        // Reload favorites to update state
        await loadFavorites();
        
        return newStatus;
      } else if (userId) {
        // Firebase mode
        const currentWord = dictionary[lessonId]?.words[wordIndex];
        if (!currentWord) {
          throw new Error('Word not found');
        }
        
        const newStatus = !currentWord.isFavorite;
        await toggleFavorite(userId, lessonId, wordIndex, newStatus);
        
        // Reload favorites to update state
        await loadFavorites();
        
        return newStatus;
      }
      
      return false;
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to toggle favorite');
      throw err;
    }
  }, [userId, isDemo, dictionary, loadFavorites]);
  
  /**
   * Check if a word is favorited
   * @param {string} lessonId - Lesson ID
   * @param {number} wordIndex - Word index
   * @returns {boolean} Is favorited
   */
  const isFavorited = useCallback((lessonId, wordIndex) => {
    if (isDemo) {
      return isDemoFavorite(lessonId, wordIndex);
    } else {
      // Check in favorites array
      return favorites.some(
        f => f.lessonId === lessonId && f.wordIndex === wordIndex
      );
    }
  }, [isDemo, favorites]);
  
  /**
   * Get favorites count
   */
  const favoritesCount = isDemo 
    ? getDemoFavoritesCount() 
    : favorites.length;
  
  /**
   * Get favorites for a specific lesson
   * @param {string} lessonId - Lesson ID
   * @returns {Array} Favorites in this lesson
   */
  const getFavoritesForLesson = useCallback((lessonId) => {
    return favorites.filter(f => f.lessonId === lessonId);
  }, [favorites]);
  
  /**
   * Check if any word in a lesson is favorited
   * @param {string} lessonId - Lesson ID
   * @returns {boolean} Has favorites
   */
  const lessonHasFavorites = useCallback((lessonId) => {
    return favorites.some(f => f.lessonId === lessonId);
  }, [favorites]);
  
  return {
    // State
    favorites,
    loading,
    error,
    favoritesCount,
    
    // Functions
    toggleWordFavorite,
    isFavorited,
    refreshFavorites: loadFavorites,
    getFavoritesForLesson,
    lessonHasFavorites
  };
};
