// src/utils/practiceHelper.js

/**
 * Fisher-Yates shuffle algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
export const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Format session time from milliseconds
 * @param {number} milliseconds - Time in ms
 * @returns {string} - Formatted time (e.g., "3m 42s")
 */
export const formatSessionTime = (milliseconds) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (minutes === 0) {
    return `${seconds}s`;
  }
  
  return `${minutes}m ${seconds}s`;
};

/**
 * Calculate practice statistics
 * @param {Object} sessionData - Session data
 * @returns {Object} - Calculated statistics
 */
export const calculateStats = (sessionData) => {
  const {
    totalCards,
    viewedCards,
    startTime,
    flips
  } = sessionData;
  
  const endTime = Date.now();
  const timeElapsed = endTime - startTime;
  const timeInMinutes = timeElapsed / 60000;
  
  return {
    totalCards,
    viewedCards: viewedCards.size,
    timeElapsed,
    timeInMinutes,
    formattedTime: formatSessionTime(timeElapsed),
    flips
  };
};
