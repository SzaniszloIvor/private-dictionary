# Billentyűparancsok & Favorites Telepítési Útmutató

## Előfeltételek

- React projekt (16.8+, hooks támogatás)
- Működő Private Dictionary alkalmazás
- Node.js 20.0.0+
- npm vagy yarn
- Firebase (authenticated mode) vagy localStorage (demo mode)

## Verzió Információ

- **Verzió**: 0.7.0
- **React verzió**: 19.1.1+
- **Tailwind CSS**: 3.4.1
- **Firebase**: 10.x+
- **Utolsó frissítés**: 2025-10-11

## Újdonságok v0.7.0-ban

- ⭐ **Favorites System**: Kedvenc szavak jelölése és kezelése
- 🔍 **Keresés & Szűrés**: Teljes keresési funkcionalitás a kedvencekben
- ⌨️ **Új billentyűparancs**: `Ctrl+Shift+F` kedvencek megnyitása
- 📱 **Unified Navigation**: Desktop navigációs sáv egységes gombokkal
- 🎨 **Mobile Layout**: Optimalizált elrendezés kedvenc csillaggal bal oldalon

## Telepítési Lépések

### 1. Tailwind CSS Telepítése (v0.3.0+)

```bash
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17
npx tailwindcss init -p
```

**Konfiguráció:**

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. Lucide React Icons (v0.7.0+)

A favorites funkcióhoz szükséges (Star ikon):

```bash
npm install lucide-react
```

### 3. Keyboard Shortcuts Hook

Hozd létre a `src/hooks/useKeyboardShortcuts.js` fájlt:

```javascript
// src/hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? event.metaKey : event.ctrlKey;
    
    const key = event.key.toLowerCase();
    const combo = [];
    
    if (modKey) combo.push('mod');
    if (event.shiftKey) combo.push('shift');
    if (event.altKey) combo.push('alt');
    combo.push(key);
    
    const comboString = combo.join('+');
    
    if (shortcuts[comboString]) {
      event.preventDefault();
      event.stopPropagation();
      shortcuts[comboString](event);
      return;
    }
    
    if (shortcuts[key] && !modKey && !event.shiftKey && !event.altKey) {
      shortcuts[key](event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

export default useKeyboardShortcuts;
```

### 4. Favorites Hook (ÚJ v0.7.0)

Hozd létre a `src/hooks/useFavorites.js` fájlt:

```javascript
// src/hooks/useFavorites.js
import { useState, useEffect, useCallback } from 'react';
import { 
  getAllFavorites, 
  toggleFavorite as toggleFavoriteInFirebase 
} from '../services/firebase';
import {
  getAllDemoFavorites,
  toggleDemoFavorite,
  isDemoFavorite as checkDemoFavorite
} from '../utils/favoritesHelper';

export const useFavorites = (userId, isDemo, dictionary) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load favorites
  const loadFavorites = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let favList = [];

      if (isDemo) {
        // Demo mode: localStorage
        favList = getAllDemoFavorites();
      } else if (userId) {
        // Authenticated mode: Firebase
        favList = await getAllFavorites(userId);
      }

      // Sort by most recent
      favList.sort((a, b) => {
        const dateA = new Date(a.favoritedAt || 0);
        const dateB = new Date(b.favoritedAt || 0);
        return dateB - dateA;
      });

      setFavorites(favList);
      setFavoritesCount(favList.length);
    } catch (err) {
      console.error('Error loading favorites:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userId, isDemo]);

  // Initial load
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  // Toggle favorite
  const toggleFavorite = useCallback(async (lessonId, wordIndex) => {
    try {
      const word = dictionary[lessonId]?.words[wordIndex];
      if (!word) return;

      const newValue = !word.isFavorite;

      if (isDemo) {
        toggleDemoFavorite(lessonId, wordIndex, newValue);
      } else if (userId) {
        await toggleFavoriteInFirebase(userId, lessonId, wordIndex, newValue);
      }

      await loadFavorites();
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError(err.message);
    }
  }, [userId, isDemo, dictionary, loadFavorites]);

  // Check if favorited
  const isFavorited = useCallback((lessonId, wordIndex) => {
    if (isDemo) {
      return checkDemoFavorite(lessonId, wordIndex);
    }
    return favorites.some(
      f => f.lessonId === lessonId && f.wordIndex === parseInt(wordIndex)
    );
  }, [favorites, isDemo]);

  // Refresh favorites
  const refreshFavorites = useCallback(async () => {
    await loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    favoritesCount,
    loading,
    error,
    toggleFavorite,
    isFavorited,
    refreshFavorites
  };
};

export default useFavorites;
```

### 5. Favorites Helper Utilities (ÚJ v0.7.0)

Hozd létre a `src/utils/favoritesHelper.js` fájlt:

```javascript
// src/utils/favoritesHelper.js

const DEMO_FAVORITES_KEY = 'demoFavorites';

// Get all demo favorites
export const getAllDemoFavorites = () => {
  try {
    const stored = localStorage.getItem(DEMO_FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading demo favorites:', error);
    return [];
  }
};

// Save demo favorites
const saveDemoFavorites = (favorites) => {
  try {
    localStorage.setItem(DEMO_FAVORITES_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving demo favorites:', error);
  }
};

// Toggle demo favorite
export const toggleDemoFavorite = (lessonId, wordIndex, isFavorite) => {
  const favorites = getAllDemoFavorites();
  
  if (isFavorite) {
    // Add to favorites
    const newFavorite = {
      lessonId,
      wordIndex: parseInt(wordIndex),
      addedAt: new Date().toISOString()
    };
    favorites.push(newFavorite);
  } else {
    // Remove from favorites
    const filtered = favorites.filter(
      f => !(f.lessonId === lessonId && f.wordIndex === parseInt(wordIndex))
    );
    saveDemoFavorites(filtered);
    return;
  }
  
  saveDemoFavorites(favorites);
};

// Check if demo favorite
export const isDemoFavorite = (lessonId, wordIndex) => {
  const favorites = getAllDemoFavorites();
  return favorites.some(
    f => f.lessonId === lessonId && f.wordIndex === parseInt(wordIndex)
  );
};

// Get demo favorites count
export const getDemoFavoritesCount = () => {
  return getAllDemoFavorites().length;
};

// Clear all demo favorites
export const clearAllDemoFavorites = () => {
  localStorage.removeItem(DEMO_FAVORITES_KEY);
};
```

### 6. Firebase Integration (v0.7.0)

Frissítsd a `src/services/firebase.js` fájlt:

```javascript
// src/services/firebase.js

// ... existing imports ...

// Toggle favorite
export const toggleFavorite = async (userId, lessonId, wordIndex, isFavorite) => {
  try {
    const docRef = doc(db, 'dictionaries', userId);
    const timestamp = isFavorite ? new Date().toISOString() : null;
    
    await updateDoc(docRef, {
      [`dictionary.${lessonId}.words.${wordIndex}.isFavorite`]: isFavorite,
      [`dictionary.${lessonId}.words.${wordIndex}.favoritedAt`]: timestamp
    });
    
    return true;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    throw error;
  }
};

// Get all favorites
export const getAllFavorites = async (userId) => {
  try {
    const docRef = doc(db, 'dictionaries', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return [];
    
    const dictionary = docSnap.data().dictionary || {};
    const favorites = [];
    
    Object.entries(dictionary).forEach(([lessonId, lesson]) => {
      lesson.words?.forEach((word, index) => {
        if (word.isFavorite) {
          favorites.push({
            lessonId,
            wordIndex: index,
            word,
            lessonTitle: lesson.title,
            favoritedAt: word.favoritedAt
          });
        }
      });
    });
    
    return favorites;
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

// Get favorites count
export const getFavoritesCount = async (userId) => {
  const favorites = await getAllFavorites(userId);
  return favorites.length;
};

// Clear all favorites
export const clearAllFavorites = async (userId) => {
  try {
    const docRef = doc(db, 'dictionaries', userId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) return;
    
    const dictionary = docSnap.data().dictionary || {};
    const updates = {};
    
    Object.entries(dictionary).forEach(([lessonId, lesson]) => {
      lesson.words?.forEach((word, index) => {
        if (word.isFavorite) {
          updates[`dictionary.${lessonId}.words.${index}.isFavorite`] = false;
          updates[`dictionary.${lessonId}.words.${index}.favoritedAt`] = null;
        }
      });
    });
    
    if (Object.keys(updates).length > 0) {
      await updateDoc(docRef, updates);
    }
  } catch (error) {
    console.error('Error clearing favorites:', error);
    throw error;
  }
};
```

### 7. FavoriteButton Component (ÚJ v0.7.0)

Hozd létre a `src/components/FavoriteButton/FavoriteButton.jsx` fájlt:

```javascript
// src/components/FavoriteButton/FavoriteButton.jsx
import React from 'react';
import { Star } from 'lucide-react';

const FavoriteButton = ({ isFavorite, onClick, size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizes[size]}
        flex items-center justify-center
        rounded-full
        transition-all duration-200
        hover:scale-110 active:scale-95
        ${isFavorite 
          ? 'text-yellow-400 hover:text-yellow-500' 
          : 'text-gray-400 dark:text-gray-600 hover:text-gray-500'
        }
      `}
      title={isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
      aria-label={isFavorite ? 'Eltávolítás a kedvencekből' : 'Hozzáadás a kedvencekhez'}
    >
      <Star
        className={`w-full h-full ${isFavorite ? 'fill-current' : ''}`}
        strokeWidth={2}
      />
    </button>
  );
};

export default FavoriteButton;
```

### 8. FavoritesModal Component (ÚJ v0.7.0)

Hozd létre a `src/components/FavoritesModal/FavoritesModal.jsx` fájlt:

```javascript
// src/components/FavoritesModal/FavoritesModal.jsx
import React, { useState, useMemo } from 'react';
import { X, Star, Search, Trash2, ExternalLink } from 'lucide-react';

const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites, 
  onToggleFavorite, 
  onNavigateToWord 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('all');

  // Get unique lessons
  const lessons = useMemo(() => {
    const lessonSet = new Set();
    favorites.forEach(fav => {
      if (fav.lessonTitle) {
        lessonSet.add(JSON.stringify({
          id: fav.lessonId,
          title: fav.lessonTitle
        }));
      }
    });
    return Array.from(lessonSet).map(item => JSON.parse(item));
  }, [favorites]);

  // Filter favorites
  const filteredFavorites = useMemo(() => {
    return favorites.filter(fav => {
      const matchesSearch = searchTerm === '' ||
        fav.word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fav.word.hungarian.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesLesson = selectedLesson === 'all' || 
        fav.lessonId === selectedLesson;
      
      return matchesSearch && matchesLesson;
    });
  }, [favorites, searchTerm, selectedLesson]);

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[1002] bg-black/70 dark:bg-black/85
                flex items-center justify-center p-5 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl
                  w-full max-w-6xl max-h-[90vh] overflow-hidden
                  flex flex-col animate-slide-in-up"
      >
        {/* Header */}
        <div className="p-6 border-b-2 border-gray-200 dark:border-gray-700
                      flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
            <div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                Kedvenc szavak
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {filteredFavorites.length} kedvenc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400
                     hover:text-gray-900 dark:hover:text-gray-100
                     w-10 h-10 flex items-center justify-center
                     rounded-full hover:bg-gray-100 dark:hover:bg-gray-700
                     transition-colors"
            title="Bezárás (ESC)"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700
                      flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2
                             w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Keresés angol vagy magyar szavak között..."
              className="w-full pl-10 pr-4 py-2 rounded-lg
                       border-2 border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700
                       text-gray-900 dark:text-gray-100
                       focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                       transition-all"
            />
          </div>

          {/* Lesson filter */}
          <select
            value={selectedLesson}
            onChange={(e) => setSelectedLesson(e.target.value)}
            className="px-4 py-2 rounded-lg
                     border-2 border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700
                     text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-yellow-400 focus:border-transparent
                     transition-all cursor-pointer"
          >
            <option value="all">Összes óra</option>
            {lessons.map(lesson => (
              <option key={lesson.id} value={lesson.id}>
                {lesson.title}
              </option>
            ))}
          </select>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredFavorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center
                          py-16 text-center">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                {searchTerm || selectedLesson !== 'all'
                  ? 'Nincs találat'
                  : 'Még nincs kedvenc szó'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md">
                {searchTerm || selectedLesson !== 'all'
                  ? 'Próbálj meg más keresési kifejezést vagy szűrőt.'
                  : 'Jelöld meg a fontos szavakat a ⭐ ikonnal!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((fav, index) => (
                <div
                  key={`${fav.lessonId}-${fav.wordIndex}-${index}`}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4
                           border-2 border-transparent
                           hover:border-yellow-400 dark:hover:border-yellow-500
                           transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="font-bold text-lg text-gray-800 dark:text-gray-200">
                          {fav.word.english}
                        </span>
                      </div>
                      <div className="text-red-500 dark:text-red-400 italic text-sm mb-1">
                        {fav.word.phonetic}
                      </div>
                      <div className="text-green-600 dark:text-green-400 font-medium">
                        {fav.word.hungarian}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📚 {fav.lessonTitle}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => onNavigateToWord(fav.lessonId, fav.wordIndex)}
                      className="flex-1 px-3 py-2 rounded-lg
                               bg-blue-500 hover:bg-blue-600
                               text-white text-sm font-medium
                               flex items-center justify-center gap-2
                               transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Megnyitás
                    </button>
                    <button
                      onClick={() => onToggleFavorite(fav.lessonId, fav.wordIndex)}
                      className="px-3 py-2 rounded-lg
                               bg-red-500 hover:bg-red-600
                               text-white
                               flex items-center justify-center
                               transition-colors"
                      title="Eltávolítás a kedvencekből"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
```

### 9. KeyboardShortcutsHelper Frissítése (v0.7.0)

Frissítsd a shortcuts listát:

```javascript
const shortcuts = [
  { combo: 'mod+e', description: 'Új szó hozzáadása', icon: '➕' },
  { combo: 'mod+f', description: 'Keresés fókuszálása', icon: '🔍' },
  { combo: 'mod+s', description: 'Mentési állapot', icon: '💾' },
  { combo: 'mod+d', description: 'Sötét mód kapcsolása', icon: '🌙' },
  { combo: 'mod+shift+f', description: 'Kedvencek megnyitása', icon: '⭐' }, // ÚJ
  { combo: 'mod+k', description: 'Billentyűparancsok', icon: '⌨️' },
  { combo: 'mod+arrowright', description: 'Következő óra', icon: '➡️' },
  { combo: 'mod+arrowleft', description: 'Előző óra', icon: '⬅️' },
  { combo: 'mod+home', description: 'Első óra', icon: '⏮️' },
  { combo: 'mod+end', description: 'Utolsó óra', icon: '⏭️' },
  { combo: 'escape', description: 'Modal bezárása', icon: '❌' }
];
```

### 10. App.jsx Integráció (v0.7.0)

Frissítsd az `src/App.jsx` fájlt:

```javascript
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import { useFavorites } from './hooks/useFavorites'; // ÚJ
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper';
import DarkModeToggle from './components/DarkModeToggle';
import FavoritesModal from './components/FavoritesModal'; // ÚJ

const MainApp = () => {
  // Dark mode
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  // Favorites (ÚJ v0.7.0)
  const {
    favorites,
    favoritesCount,
    toggleFavorite,
    isFavorited,
    refreshFavorites
  } = useFavorites(user?.uid, isDemo, dictionary);
  
  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false); // ÚJ
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef(null);
  
  // Toast helper
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };
  
  // Navigate to word from favorites (ÚJ)
  const handleNavigateToWord = useCallback((lessonId, wordIndex) => {
    setCurrentLesson(parseInt(lessonId));
    setShowFavoritesModal(false);
    showToast(`📍 ${dictionary[lessonId]?.title || 'Óra'}`);
    
    setTimeout(() => {
      const element = document.getElementById(`word-${wordIndex}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
  }, [dictionary]);
  
  // Toggle favorite handler (ÚJ)
  const handleToggleFavorite = useCallback((lessonId, wordIndex) => {
    const word = dictionary[lessonId]?.words[wordIndex];
    if (!word) return;
    
    const willBeFavorite = !word.isFavorite;
    toggleFavorite(lessonId, wordIndex);
    
    showToast(
      willBeFavorite 
        ? '⭐ Kedvencekhez adva!' 
        : 'Eltávolítva a kedvencekből'
    );
  }, [dictionary, toggleFavorite]);
  
  // Shortcuts (FRISSÍTVE v0.7.0)
  const shortcuts = useMemo(() => ({
    'mod+e': (e) => {
      e.preventDefault();
      setShowAddModal(true);
      showToast('➕ Új szó hozzáadása');
    },
    'mod+f': (e) => {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
        showToast('🔍 Keresés aktiválva');
      }
    },
    'mod+d': (e) => {
      e.preventDefault();
      toggleDarkMode();
      showToast(darkMode ? '☀️ Világos mód' : '🌙 Sötét mód');
    },
    'mod+shift+f': (e) => {  // ÚJ v0.7.0
      e.preventDefault();
      setShowFavoritesModal(true);
      showToast('⭐ Kedvencek megnyitása');
    },
    'mod+k': (e) => {
      e.preventDefault();
      setShowShortcutsHelp(prev => !prev);
    },
    'mod+s': (e) => {
      e.preventDefault();
      setShowSaveNotification(true);
    },
    'escape': () => {  // BŐVÍTVE
      if (showAddModal) setShowAddModal(false);
      else if (showShortcutsHelp) setShowShortcutsHelp(false);
      else if (showFavoritesModal) setShowFavoritesModal(false);
    },
    // ... további parancsok
  }), [
    showAddModal,
    showShortcutsHelp,
    showFavoritesModal,
    dictionary,
    currentLesson,
    darkMode,
    toggleDarkMode
  ]);
  
  useKeyboardShortcuts(shortcuts, !loading);
  
  return (
    <div className="...">
      {/* Existing components */}
      <ToastNotification />
      <KeyboardShortcutsHelper 
        isOpen={showShortcutsHelp}
        onOpen={() => setShowShortcutsHelp(true)}
        onClose={() => setShowShortcutsHelp(false)}
      />
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* ÚJ v0.7.0 */}
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
        onNavigateToWord={handleNavigateToWord}
      />
      
      {/* Desktop Navigation Bar */}
      <div className="flex items-center gap-3">
        {/* Favorites Button */}
        <button
          onClick={() => setShowFavoritesModal(true)}
          className="relative w-36 h-10 rounded-lg
                   bg-gradient-to-r from-yellow-400 to-amber-500
                   hover:from-yellow-500 hover:to-amber-600
                   text-white font-medium text-sm
                   transition-all duration-200
                   hover:shadow-lg hover:scale-105
                   flex items-center justify-center gap-2"
        >
          <Star className="w-4 h-4 fill-white" />
          <span>Kedvencek</span>
          {favoritesCount > 0 && (
            <span className="absolute -top-2 -right-2 
                           bg-red-500 text-white 
                           w-5 h-5 rounded-full text-xs font-bold 
                           flex items-center justify-center">
              {favoritesCount}
            </span>
          )}
        </button>
        
        {/* Other buttons... */}
      </div>
      
      {/* Pass favorites props to LessonContent */}
      <LessonContent
        lesson={lesson}
        lessonNumber={currentLesson}
        handleToggleFavorite={handleToggleFavorite}
        isFavorited={isFavorited}
        // ... other props
      />
    </div>
  );
};
```

### 11. WordTable Integration (v0.7.0)

Pass favorites props through to WordTable:

```javascript
// LessonContent.jsx
<WordTable
  words={lesson.words}
  lessonNumber={lessonNumber}
  handleToggleFavorite={handleToggleFavorite}  // Pass down
  isFavorited={isFavorited}                     // Pass down
  // ... other props
/>

// WordTable.jsx
import FavoriteButton from '../FavoriteButton';

// Desktop: Add favorite column
<th className="px-2 py-4">⭐</th>

// Desktop row: Add favorite cell
<td className="px-2 py-4">
  {handleToggleFavorite && lessonNumber !== null && (
    <FavoriteButton
      isFavorite={isFavorited(lessonNumber.toString(), index)}
      onClick={() => handleToggleFavorite(lessonNumber.toString(), index)}
      size="md"
    />
  )}
</td>

// Mobile card: Add favorite button (left side)
<div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
  {handleToggleFavorite && lessonNumber !== null && (
    <FavoriteButton
      isFavorite={isFavorited(lessonNumber.toString(), index)}
      onClick={(e) => {
        e.stopPropagation();
        handleToggleFavorite(lessonNumber.toString(), index);
      }}
      size="md"
    />
  )}
</div>
```

## Tesztelés

### 1. Favorites Alapvető Tesztek

- ✅ Csillag ikon megjelenik minden szó mellett
- ✅ Csillag kattintásra váltja az állapotot
- ✅ `Ctrl+Shift+F` megnyitja a kedvencek modal-t
- ✅ Keresés működik angol és magyar szavak között
- ✅ Lesson filter helyesen szűr
- ✅ Navigálás a szóhoz működik
- ✅ Eltávolítás kedvencekből működik
- ✅ Favorites counter frissül valós időben

### 2. Perzisztencia Tesztek

- ✅ Kedvencek megmaradnak oldal frissítés után
- ✅ Demo mode: localStorage tárolás működik
- ✅ Authenticated mode: Firebase sync működik
- ✅ Logout törli a demo kedvenceket

### 3. UI/UX Tesztek

- ✅ Desktop: Csillag első oszlopban
- ✅ Mobile: Csillag bal oldalon, középen függőlegesen
- ✅ Hover effects működnek
- ✅ Toast notifications megjelennek
- ✅ Empty state helyesen jelenik meg
- ✅ Dark mode minden komponensen működik

### 4. Modal Tesztek

- ✅ `Ctrl+Shift+F` megnyitja
- ✅ `ESC` bezárja
- ✅ Overlay click bezárja
- ✅ Keresés real-time frissít
- ✅ Responsive layout (mobile/desktop)

## Migrációs Útmutató v0.3.0 → v0.7.0

### Új függőségek:

```bash
npm install lucide-react
```

### Új fájlok:

1. `src/hooks/useFavorites.js`
2. `src/utils/favoritesHelper.js`
3. `src/components/FavoriteButton/FavoriteButton.jsx`
4. `src/components/FavoritesModal/FavoritesModal.jsx`

### Firebase frissítések:

Add hozzá a `firebase.js`-hez:
- `toggleFavorite()`
- `getAllFavorites()`
- `getFavoritesCount()`
- `clearAllFavorites()`

### Word schema frissítés:

```javascript
{
  english: "apple",
  hungarian: "alma",
  phonetic: "/ˈæp.əl/",
  isFavorite: false,
  favoritedAt: null
}
```

## Függőségek

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1",
    "lucide-react": "^0.263.1",
    "firebase": "^10.x"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "vite": "^7.1.6"
  }
}
```

## Kapcsolódó Dokumentáció

- [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md) - Teljes dokumentáció
- [CHANGELOG.md](../../CHANGELOG.md) - Verzió történet (v0.7.0)
- [README.md](../../README.md) - Projekt README (frissítve)

---

**Verzió**: 0.7.0  
**Utolsó frissítés**: 2025-10-11  
**Szerző**: Private Dictionary Team
