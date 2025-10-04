// src/hooks/usePracticeMode.js
import { useState, useEffect } from 'react';
import { shuffleArray } from '../utils/practiceHelper';

/**
 * Custom hook for managing practice mode state and logic
 * @param {Array} words - Array of words from the lesson
 * @param {string} mode - Practice mode: 'sequential', 'random', or 'reverse'
 * @returns {Object} - Practice mode state and methods
 */
export const usePracticeMode = (words, mode = 'sequential') => {
  const [practiceWords, setPracticeWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewedCards, setViewedCards] = useState(new Set());
  const [isFlipped, setIsFlipped] = useState(false);
  const [flips, setFlips] = useState(0);
  const [startTime] = useState(Date.now());
  const [milestonesShown, setMilestonesShown] = useState(new Set());

  // Initialize practice words based on mode
  useEffect(() => {
    if (!words || words.length === 0) return;
    
    let processed = [...words];
    
    switch(mode) {
      case 'random':
        processed = shuffleArray(processed);
        break;
      case 'reverse':
        // Swap English and Hungarian for reverse practice
        processed = processed.map(w => ({
          english: w.hungarian,
          hungarian: w.english,
          phonetic: '' // No phonetic for Hungarian
        }));
        break;
      default: // sequential
        break;
    }
    
    setPracticeWords(processed);
    setCurrentIndex(0);
    setViewedCards(new Set());
    setIsFlipped(false);
    setFlips(0);
    setMilestonesShown(new Set());
  }, [words, mode]);

  // Mark current card as viewed
  const markAsViewed = (index) => {
    setViewedCards(prev => new Set([...prev, index]));
  };

  // Navigation methods
  const goToNext = () => {
    if (currentIndex < practiceWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsFlipped(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsFlipped(false);
    }
  };

  const goToCard = (index) => {
    if (index >= 0 && index < practiceWords.length) {
      setCurrentIndex(index);
      setIsFlipped(false);
    }
  };

  // Flip card
  const toggleFlip = () => {
    setIsFlipped(prev => !prev);
    setFlips(prev => prev + 1);
    
    // Mark as viewed when card is flipped
    if (!isFlipped) {
      markAsViewed(currentIndex);
    }
  };

  // Calculate progress
  const progress = practiceWords.length > 0 
    ? (viewedCards.size / practiceWords.length) * 100 
    : 0;

  // Check if session is complete
  const isComplete = viewedCards.size === practiceWords.length && practiceWords.length > 0;

  // Get current word
  const currentWord = practiceWords[currentIndex] || null;

  return {
    // State
    practiceWords,
    currentIndex,
    currentWord,
    viewedCards,
    isFlipped,
    flips,
    startTime,
    progress,
    isComplete,
    milestonesShown,
    
    // Methods
    goToNext,
    goToPrevious,
    goToCard,
    toggleFlip,
    markAsViewed,
    setMilestonesShown
  };
};

export default usePracticeMode;
