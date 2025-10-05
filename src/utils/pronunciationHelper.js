// src/utils/pronunciationHelper.js - PHASE 1 + PHASE 2 KONSZOLIDÁLT

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching pronunciation
 */
const levenshteinDistance = (str1, str2) => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  const matrix = Array(s2.length + 1).fill(null).map(() => 
    Array(s1.length + 1).fill(null)
  );

  for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= s2.length; j++) {
    for (let i = 1; i <= s1.length; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      );
    }
  }

  return matrix[s2.length][s1.length];
};

/**
 * Normalize text for pronunciation comparison
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .replace(/\s+/g, ' ');
};

// ============================================
// PHASE 1: BASIC SCORING & FEEDBACK
// ============================================

/**
 * Calculate pronunciation similarity score (0-100)
 */
export const calculatePronunciationScore = (spoken, target) => {
  if (!spoken || !target) return 0;

  const normalizedSpoken = normalizeText(spoken);
  const normalizedTarget = normalizeText(target);

  // Exact match
  if (normalizedSpoken === normalizedTarget) {
    return 100;
  }

  // Calculate distance
  const distance = levenshteinDistance(normalizedSpoken, normalizedTarget);
  const maxLength = Math.max(normalizedSpoken.length, normalizedTarget.length);
  
  // Convert to percentage (inverse of distance ratio)
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.max(0, Math.min(100, Math.round(similarity)));
};

/**
 * Get pronunciation feedback based on score
 */
export const getPronunciationFeedback = (score) => {
  if (score >= 95) {
    return {
      level: 'perfect',
      message: '🎯 Tökéletes kiejtés!',
      emoji: '🏆',
      color: 'green',
      className: 'from-green-500 to-emerald-500'
    };
  }
  
  if (score >= 85) {
    return {
      level: 'excellent',
      message: '⭐ Kiváló! Majdnem tökéletes!',
      emoji: '✨',
      color: 'lime',
      className: 'from-lime-500 to-green-400'
    };
  }
  
  if (score >= 70) {
    return {
      level: 'good',
      message: '👍 Jó munka! Gyakorold még!',
      emoji: '💪',
      color: 'yellow',
      className: 'from-yellow-500 to-orange-400'
    };
  }
  
  if (score >= 50) {
    return {
      level: 'close',
      message: '🟡 Majdnem! Próbáld újra!',
      emoji: '🔄',
      color: 'orange',
      className: 'from-orange-500 to-red-400'
    };
  }
  
  return {
    level: 'tryagain',
    message: '🔴 Próbáld újra! Hallgasd meg a szót!',
    emoji: '🔊',
    color: 'red',
    className: 'from-red-500 to-pink-500'
  };
};

/**
 * Get pronunciation tips based on common mistakes
 */
export const getPronunciationTip = (spoken, target) => {
  const tips = {
    th: 'Tipp: A "th" hangot a nyelv kilökésével képezd a fogaid között! 👅',
    r: 'Tipp: Az angol "r" lágyabb, mint a magyar! Ne pergess! 🗣️',
    w: 'Tipp: A "w" hang az ajkak kerekítésével kezdődik! 💋',
    v: 'Tipp: Harapd meg az alsó ajkadat a "v" hangnál! 😬',
  };

  const normalizedTarget = normalizeText(target);
  
  if (normalizedTarget.includes('th')) return tips.th;
  if (normalizedTarget.includes('r')) return tips.r;
  if (normalizedTarget.includes('w')) return tips.w;
  if (normalizedTarget.includes('v')) return tips.v;
  
  return '💡 Hallgasd meg újra a szót és ismételd utána!';
};

/**
 * Format pronunciation statistics
 */
export const formatPronunciationStats = (stats) => {
  const {
    totalWords = 0,
    perfectCount = 0,
    goodCount = 0,
    attemptsCount = 0
  } = stats;

  const accuracy = totalWords > 0 
    ? Math.round(((perfectCount + goodCount) / totalWords) * 100) 
    : 0;
  
  const averageAttempts = totalWords > 0 
    ? (attemptsCount / totalWords).toFixed(1) 
    : 0;

  return {
    accuracy,
    averageAttempts,
    perfectCount,
    totalWords
  };
};

// ============================================
// PHASE 2: ADVANCED ERROR HANDLING
// ============================================

/**
 * Get detailed error message with troubleshooting tips
 */
export const getDetailedErrorMessage = (errorCode) => {
  const errorMap = {
    'no-speech': {
      title: '🔇 Nem hallottam semmit',
      message: 'Nem érzékeltem beszédet. Próbáld újra!',
      tips: [
        'Ellenőrizd, hogy a mikrofon nincs-e lenémítva',
        'Beszélj közelebb a mikrofonhoz',
        'Csökkentsd a háttérzajt',
        'Ellenőrizd a mikrofon beállításokat a böngészőben'
      ],
      icon: '🔇',
      color: 'orange'
    },
    'audio-capture': {
      title: '🎤 Mikrofon hiba',
      message: 'Nem sikerült elérni a mikrofont.',
      tips: [
        'Ellenőrizd, hogy van-e csatlakoztatva mikrofon',
        'Adj engedélyt a mikrofonhoz a böngészőben',
        'Bezárj minden más alkalmazást ami használja a mikrofont',
        'Próbáld újraindítani a böngészőt'
      ],
      icon: '🎤',
      color: 'red'
    },
    'not-allowed': {
      title: '🚫 Hozzáférés megtagadva',
      message: 'A mikrofon hozzáférés nincs engedélyezve.',
      tips: [
        'Kattints a címsorra és engedélyezd a mikrofont',
        'Ellenőrizd a böngésző beállításokban',
        'Lehet hogy blokkoltad korábban - távolítsd el a blokkot',
        'Próbáld meg inkognitó módban'
      ],
      icon: '🚫',
      color: 'red'
    },
    'network': {
      title: '🌐 Hálózati hiba',
      message: 'Nincs internetkapcsolat vagy a kapcsolat megszakadt.',
      tips: [
        'Ellenőrizd az internetkapcsolatot',
        'Próbáld újratölteni az oldalt',
        'Ellenőrizd a WiFi jelét',
        'Várd meg amíg visszatér a kapcsolat'
      ],
      icon: '🌐',
      color: 'red'
    },
    'aborted': {
      title: '⏹️ Megszakítva',
      message: 'A felvétel megszakadt.',
      tips: [
        'Nyomd meg újra a mikrofon gombot',
        'Ne válts fület vagy ablakot felvétel közben',
        'Várj egy kicsit mielőtt újra próbálod'
      ],
      icon: '⏹️',
      color: 'yellow'
    },
    'language-not-supported': {
      title: '🌍 Nyelv nem támogatott',
      message: 'Az angol hangfelismerés nem elérhető.',
      tips: [
        'Ez általában ideiglenes probléma',
        'Próbáld újratölteni az oldalt',
        'Ellenőrizd a böngésző nyelvbeállításait',
        'Használj Chrome vagy Edge böngészőt'
      ],
      icon: '🌍',
      color: 'red'
    }
  };

  return errorMap[errorCode] || {
    title: '⚠️ Ismeretlen hiba',
    message: `Váratlan hiba történt: ${errorCode}`,
    tips: [
      'Próbáld újratölteni az oldalt',
      'Ellenőrizd a böngésző konzolt',
      'Ha a probléma továbbra is fennáll, használj másik böngészőt'
    ],
    icon: '⚠️',
    color: 'red'
  };
};

/**
 * Get browser-specific troubleshooting tips
 */
export const getBrowserSpecificTips = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (userAgent.includes('chrome')) {
    return [
      '💡 Chrome-ban: Kattints a lakat/kamera ikonra a címsorban',
      '💡 Beállítások → Adatvédelem és biztonság → Webhely engedélyek → Mikrofon'
    ];
  }
  
  if (userAgent.includes('firefox')) {
    return [
      '⚠️ A Firefox korlátozott hangfelismerést támogat',
      '💡 Javasoljuk Chrome vagy Edge használatát'
    ];
  }
  
  if (userAgent.includes('safari')) {
    return [
      '⚠️ A Safari korlátozott hangfelismerést támogat',
      '💡 Beállítások → Webhelyek → Mikrofon',
      '💡 Javasoljuk Chrome vagy Edge használatát'
    ];
  }
  
  if (userAgent.includes('edge')) {
    return [
      '💡 Edge-ben: Kattints a lakat/kamera ikonra a címsorban',
      '💡 Beállítások → Cookie-k és webhelyek engedélyei → Mikrofon'
    ];
  }
  
  return [];
};

// ============================================
// PHASE 2: ADVANCED PRONUNCIATION TIPS
// ============================================

/**
 * Advanced pronunciation tips based on phonetic analysis
 */
export const getAdvancedPronunciationTip = (spoken, target, score) => {
  const normalizedSpoken = normalizeText(spoken);
  const normalizedTarget = normalizeText(target);
  
  // If score is good, give encouraging feedback
  if (score >= 85) {
    return {
      type: 'success',
      icon: '🎯',
      title: 'Kiváló!',
      message: 'Szinte tökéletes! Kis finomítással hibátlan lesz!',
      tips: []
    };
  }

  // Analyze common pronunciation issues
  const issues = [];

  // Check for TH sounds
  if (normalizedTarget.includes('th')) {
    if (!normalizedSpoken.includes('th')) {
      issues.push({
        sound: 'TH',
        problem: 'A "th" hang hiányzik vagy helytelenül ejtve',
        solution: 'Nyújtsd ki a nyelved a fogaid közé és fújd ki a levegőt',
        example: 'think, three, thank',
        demo: '👅 → 🦷 → 💨'
      });
    }
  }

  // Check for R sounds
  if (normalizedTarget.includes('r')) {
    issues.push({
      sound: 'R',
      problem: 'Az angol "r" lágyabb, mint a magyar',
      solution: 'Ne pergess! Csak görbítsd fel a nyelved hátul',
      example: 'red, right, around',
      demo: '🔵 Nem: rrrr ❌ | Igen: ɹ ✅'
    });
  }

  // Check for W sounds
  if (normalizedTarget.includes('w') && normalizedSpoken.includes('v')) {
    issues.push({
      sound: 'W vs V',
      problem: 'A "w" és "v" különböző hangok',
      solution: 'W: kerekítsd az ajkaidat (mint egy csók 💋)',
      example: 'wine ≠ vine, west ≠ vest',
      demo: 'W = 💋 | V = 😬 (fogak az alsó ajkon)'
    });
  }

  // Check for long/short vowels
  if (normalizedTarget.includes('ee') || normalizedTarget.includes('ea')) {
    issues.push({
      sound: 'Hosszú É',
      problem: 'A hosszú "ee" hang lehet rövidebb',
      solution: 'Húzd ki a hangot: "eeee"',
      example: 'see, tea, need',
      demo: '📏 Hosszan: "siiiiii"'
    });
  }

  // If specific issues found, return detailed tips
  if (issues.length > 0) {
    return {
      type: 'improvement',
      icon: '💡',
      title: 'Fejlesztési lehetőségek',
      message: `${issues.length} javítható részlet található:`,
      tips: issues
    };
  }

  // Generic tip
  return {
    type: 'general',
    icon: '🎓',
    title: 'Gyakorlási tipp',
    message: 'Próbáld meg lassabban kiejteni a szót!',
    tips: [
      {
        sound: 'Általános',
        problem: 'A kiejtés még nem pontos',
        solution: 'Hallgasd meg újra a helyes kiejtést és ismételd utána',
        example: target,
        demo: '🔊 → 👂 → 🗣️ → 🔁'
      }
    ]
  };
};

/**
 * Get pronunciation difficulty level
 */
export const getPronunciationDifficulty = (word) => {
  const normalizedWord = normalizeText(word);
  let difficulty = 0;

  // Check for difficult sounds
  const difficultPatterns = {
    'th': 2,
    'r': 1,
    'w': 1,
    'v': 1,
    'tion': 1,
    'ough': 3,
    'augh': 2,
    'eigh': 2,
    'silent': 2
  };

  Object.entries(difficultPatterns).forEach(([pattern, points]) => {
    if (normalizedWord.includes(pattern)) {
      difficulty += points;
    }
  });

  // Word length adds difficulty
  if (normalizedWord.length > 10) difficulty += 2;
  if (normalizedWord.length > 15) difficulty += 3;

  if (difficulty >= 5) {
    return {
      level: 'hard',
      label: '🔴 Nehéz',
      color: 'red',
      advice: 'Ez egy nehéz szó! Fogd fel részekre és gyakorold külön!'
    };
  } else if (difficulty >= 3) {
    return {
      level: 'medium',
      label: '🟡 Közepes',
      color: 'yellow',
      advice: 'Figyelj a speciális hangokra!'
    };
  } else {
    return {
      level: 'easy',
      label: '🟢 Könnyű',
      color: 'green',
      advice: 'Ez egy viszonylag egyszerű szó!'
    };
  }
};
