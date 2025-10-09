/**
 * Calculate rewards based on practice session statistics
 * NOW WITH PRONUNCIATION SUPPORT
 */
export const calculateReward = (stats, mode = 'flashcard') => {
  const { viewedCards, totalCards, timeInMinutes, flips } = stats;
  
  // Completion percentage
  const completion = (viewedCards / totalCards) * 100;
  
  // Calculate stars (1-5) - different logic for pronunciation
  let stars = 1;
  
  if (mode === 'pronunciation') {
    const { pronunciationStats } = stats;
    if (!pronunciationStats || pronunciationStats.scores.length === 0) {
      stars = 1;
    } else {
      const avgScore = pronunciationStats.scores.reduce((a, b) => a + b, 0) / pronunciationStats.scores.length;
      const avgAttempts = pronunciationStats.attempts.reduce((a, b) => a + b, 0) / pronunciationStats.attempts.length;
      
      // Stars based on average score and attempts
      if (avgScore >= 90 && avgAttempts <= 1.5) stars = 5;
      else if (avgScore >= 85 && avgAttempts <= 2) stars = 4;
      else if (avgScore >= 75) stars = 3;
      else if (avgScore >= 60) stars = 2;
      else stars = 1;
    }
  } else {
    // Original flashcard logic
    if (completion >= 100) {
      if (timeInMinutes < 5) stars = 5;
      else if (timeInMinutes < 10) stars = 4;
      else stars = 4;
    } else if (completion >= 80) {
      stars = 3;
    } else if (completion >= 50) {
      stars = 2;
    }
  }
  
  // Badges
  const badges = [];
  
  // ============================================
  // PRONUNCIATION-SPECIFIC BADGES
  // ============================================
  if (mode === 'pronunciation' && stats.pronunciationStats) {
    const { scores, attempts } = stats.pronunciationStats;
    
    if (scores.length > 0) {
      const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      const avgAttempts = attempts.reduce((a, b) => a + b, 0) / attempts.length;
      const perfectCount = scores.filter(s => s >= 95).length;
      const goodCount = scores.filter(s => s >= 85).length;
      
      // Perfect Speaker - 95%+ átlag
      if (avgScore >= 95) {
        badges.push({ 
          id: 'perfectSpeaker', 
          name: 'Tökéletes Beszélő', 
          icon: '🗣️', 
          color: 'gold',
          description: '95%+ átlagos pontosság!'
        });
      }
      
      // Native-like - 90%+ átlag első próbára
      if (avgScore >= 90 && avgAttempts <= 1.2) {
        badges.push({ 
          id: 'nativeLike', 
          name: 'Anyanyelvi Szint', 
          icon: '🎤', 
          color: 'purple',
          description: 'Első próbára 90%+ pontosság!'
        });
      }
      
      // Pronunciation Master - minden szó 85%+
      if (scores.every(s => s >= 85)) {
        badges.push({ 
          id: 'pronunciationMaster', 
          name: 'Kiejtés Mester', 
          icon: '👑', 
          color: 'gold',
          description: 'Minden szó 85%+ pontosság!'
        });
      }
      
      // Perfect Streak - 5+ egymás utáni tökéletes
      let currentStreak = 0;
      let maxStreak = 0;
      scores.forEach(score => {
        if (score >= 95) {
          currentStreak++;
          maxStreak = Math.max(maxStreak, currentStreak);
        } else {
          currentStreak = 0;
        }
      });
      
      if (maxStreak >= 5) {
        badges.push({ 
          id: 'perfectStreak', 
          name: 'Tökéletes Sorozat', 
          icon: '🔥', 
          color: 'orange',
          description: `${maxStreak} egymás utáni tökéletes kiejtés!`
        });
      }
      
      // One Shot Wonder - minden szó első próbára
      if (attempts.every(a => a === 1) && scores.length >= 5) {
        badges.push({ 
          id: 'oneShotWonder', 
          name: 'Első Próbára', 
          icon: '⚡', 
          color: 'yellow',
          description: 'Minden szó első próbára!'
        });
      }
      
      // Persistent Learner - 3+ próbálkozás legalább egy szónál
      if (attempts.some(a => a >= 3)) {
        badges.push({ 
          id: 'persistentLearner', 
          name: 'Kitartó Tanuló', 
          icon: '💪', 
          color: 'blue',
          description: 'Nem adtad fel!'
        });
      }
      
      // Pronunciation Champion - 20+ szó 85%+ átlaggal
      if (scores.length >= 20 && avgScore >= 85) {
        badges.push({ 
          id: 'pronunciationChampion', 
          name: 'Kiejtés Bajnok', 
          icon: '🏆', 
          color: 'gold',
          description: '20+ szó kiváló kiejtéssel!'
        });
      }
    }
  }
  
  // ============================================
  // ORIGINAL FLASHCARD BADGES
  // ============================================
  if (mode !== 'pronunciation') {
    if (completion === 100 && timeInMinutes < 5) {
      badges.push({ 
        id: 'speedDemon', 
        name: 'Sebességdémon', 
        icon: '⚡', 
        color: 'yellow',
        description: '5 perc alatt teljesítve!'
      });
    }
    
    if (completion === 100) {
      badges.push({ 
        id: 'perfectionist', 
        name: 'Perfekcionista', 
        icon: '🎯', 
        color: 'green',
        description: 'Minden kártya megtekintve!'
      });
    }
    
    if (timeInMinutes > 15) {
      badges.push({ 
        id: 'marathoner', 
        name: 'Maratonista', 
        icon: '🏃', 
        color: 'blue',
        description: '15+ perc kitartó gyakorlás!'
      });
    }
    
    if (flips / totalCards < 1.5 && viewedCards === totalCards) {
      badges.push({ 
        id: 'quickLearner', 
        name: 'Gyors Tanuló', 
        icon: '🧠', 
        color: 'purple',
        description: 'Kevés fordítással teljesítve!'
      });
    }

    if (totalCards >= 20) {
      badges.push({ 
        id: 'dedicated', 
        name: 'Elkötelezett', 
        icon: '💪', 
        color: 'red',
        description: '20+ kártya gyakorolva!'
      });
    }
  }
  
  // Encouraging message
  let message = '';
  let emoji = '🌟';
  
  if (mode === 'pronunciation') {
    if (stars === 5) {
      message = "Hihetetlen! Anyanyelvi szintű kiejtés!";
      emoji = '🏆';
    } else if (stars === 4) {
      message = "Nagyszerű! Kiváló kiejtés!";
      emoji = '⭐';
    } else if (stars === 3) {
      message = "Jó munka! Szépen haladsz!";
      emoji = '💪';
    } else if (stars === 2) {
      message = "Remek kezdés! Gyakorlással egyre jobb leszel!";
      emoji = '👍';
    } else {
      message = "Szép próbálkozás! A gyakorlás teszi a mestert!";
      emoji = '🌱';
    }
  } else {
    // Original flashcard messages
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
    "Minden ismétlés közelebb visz! 🎯",
    "A kiejtés a beszéd lelke! 🗣️",
    "Minden hang számít! 🎵",
    "Légy büszke minden kis sikerre! ⭐"
  ];
  
  return quotes[Math.floor(Math.random() * quotes.length)];
};

/**
 * Calculate pronunciation accuracy percentage
 */
export const calculatePronunciationAccuracy = (scores) => {
  if (!scores || scores.length === 0) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(total / scores.length);
};

/**
 * Get pronunciation performance level
 */
export const getPronunciationPerformanceLevel = (avgScore) => {
  if (avgScore >= 95) {
    return {
      level: 'exceptional',
      label: 'Kivételes',
      color: 'gold',
      icon: '🏆',
      message: 'Anyanyelvi szintű kiejtés!'
    };
  } else if (avgScore >= 85) {
    return {
      level: 'excellent',
      label: 'Kiváló',
      color: 'green',
      icon: '⭐',
      message: 'Nagyon jó kiejtés!'
    };
  } else if (avgScore >= 75) {
    return {
      level: 'good',
      label: 'Jó',
      color: 'blue',
      icon: '👍',
      message: 'Jó úton haladsz!'
    };
  } else if (avgScore >= 60) {
    return {
      level: 'fair',
      label: 'Közepes',
      color: 'yellow',
      icon: '💪',
      message: 'Gyakorolj még!'
    };
  } else {
    return {
      level: 'needsWork',
      label: 'Fejlesztendő',
      color: 'orange',
      icon: '📚',
      message: 'Ne add fel, gyakorolj!'
    };
  }
};

// ============================================
// STREAK-BASED BADGES
// ============================================

/**
 * Streak badges configuration
 */
export const STREAK_BADGES = {
  weekWarrior: {
    id: 'weekWarrior',
    name: 'Week Warrior',
    icon: '7️⃣',
    description: '7 nap egymást követő gyakorlás!',
    requirement: (streak) => streak >= 7
  },
  twoWeekChampion: {
    id: 'twoWeekChampion',
    name: 'Két Hét Bajnok',
    icon: '🔥',
    description: '14 nap sorozat!',
    requirement: (streak) => streak >= 14
  },
  monthMaster: {
    id: 'monthMaster',
    name: 'Month Master',
    icon: '🏆',
    description: '30 nap megszakítás nélkül!',
    requirement: (streak) => streak >= 30
  },
  centuryClub: {
    id: 'centuryClub',
    name: 'Century Club',
    icon: '💯',
    description: '100 napos sorozat! Hihetetlen!',
    requirement: (streak) => streak >= 100
  },
  goalGetter: {
    id: 'goalGetter',
    name: 'Goal Getter',
    icon: '🎯',
    description: 'Napi cél 7 napig egymás után!',
    requirement: (consecutiveDays) => consecutiveDays >= 7
  }
};

/**
 * Check which streak badges user has earned
 * @param {number} currentStreak - Current streak count
 * @param {number} longestStreak - Longest streak ever
 * @returns {Array} - Array of earned badges
 */
export const checkStreakBadges = (currentStreak, longestStreak) => {
  const badges = [];
  
  Object.values(STREAK_BADGES).forEach(badge => {
    if (badge.requirement(currentStreak)) {
      badges.push(badge);
    }
  });
  
  return badges;
};

/**
 * Get streak badge for specific milestone
 * @param {number} streak - Streak count
 * @returns {Object|null} - Badge object or null
 */
export const getStreakBadge = (streak) => {
  if (streak >= 100) return STREAK_BADGES.centuryClub;
  if (streak >= 30) return STREAK_BADGES.monthMaster;
  if (streak >= 14) return STREAK_BADGES.twoWeekChampion;
  if (streak >= 7) return STREAK_BADGES.weekWarrior;
  return null;
};
