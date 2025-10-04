// src/utils/rewardHelper.js

/**
 * Calculate rewards based on practice session statistics
 * @param {Object} stats - Session statistics
 * @returns {Object} - Reward data (stars, badges, messages, etc.)
 */
export const calculateReward = (stats) => {
  const { viewedCards, totalCards, timeInMinutes, flips } = stats;
  
  // Completion percentage
  const completion = (viewedCards / totalCards) * 100;
  
  // Calculate stars (1-5)
  let stars = 1;
  if (completion >= 100) {
    if (timeInMinutes < 5) stars = 5;
    else if (timeInMinutes < 10) stars = 4;
    else stars = 4;
  } else if (completion >= 80) {
    stars = 3;
  } else if (completion >= 50) {
    stars = 2;
  }
  
  // Badges
  const badges = [];
  
  if (completion === 100 && timeInMinutes < 5) {
    badges.push({ 
      id: 'speedDemon', 
      name: 'Sebességdémon', 
      icon: '⚡', 
      color: 'yellow' 
    });
  }
  
  if (completion === 100) {
    badges.push({ 
      id: 'perfectionist', 
      name: 'Perfekcionista', 
      icon: '🎯', 
      color: 'green' 
    });
  }
  
  if (timeInMinutes > 15) {
    badges.push({ 
      id: 'marathoner', 
      name: 'Maratonista', 
      icon: '🏃', 
      color: 'blue' 
    });
  }
  
  if (flips / totalCards < 1.5 && viewedCards === totalCards) {
    badges.push({ 
      id: 'quickLearner', 
      name: 'Gyors Tanuló', 
      icon: '🧠', 
      color: 'purple' 
    });
  }

  if (totalCards >= 20) {
    badges.push({ 
      id: 'dedicated', 
      name: 'Elkötelezett', 
      icon: '💪', 
      color: 'red' 
    });
  }
  
  // Encouraging message
  let message = '';
  let emoji = '🌟';
  
  if (completion === 100) {
    message = "Tökéletes! Szómágus vagy!";
    emoji = '🏆';
  } else if (completion >= 80) {
    message = "Kitűnő munka! Majdnem tökéletes!";
    emoji = '⭐';
  } else if (completion >= 60) {
    message = "Remek munka! Csak így tovább!";
    emoji = '💪';
  } else if (completion >= 40) {
    message = "Jó munka! A gyakorlás teszi a mestert!";
    emoji = '👍';
  } else {
    message = "Szép kezdés! Minden gyakorlás számít!";
    emoji = '🌱';
  }
  
  // Confetti intensity
  const confettiIntensity = stars === 5 ? 'epic' : stars >= 4 ? 'high' : 'normal';
  
  return {
    stars,
    badges,
    message,
    emoji,
    confettiIntensity,
    completion: completion.toFixed(0)
  };
};

/**
 * Get a random motivational quote
 * @returns {string} - Motivational quote with emoji
 */
export const getMotivationalQuote = () => {
  const quotes = [
    "Minden szakértő kezdőként indult. 🌱",
    "Minden megtanult szó egy lépés előre! 👣",
    "A következetesség a mesterség kulcsa! 🔑",
    "Szókincsed építése, tégláról téglára! 🧱",
    "A tanulás soha nem fárasztja ki az elmét. 🧠",
    "A kis haladás is haladás! 📈",
    "Csak így tovább, remekül megy! 🚀",
    "Róma sem egy nap alatt épült! 🏛️",
    "A gyakorlás teszi a mestert! 💯",
    "Minden ismétlés közelebb visz! 🎯"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};
