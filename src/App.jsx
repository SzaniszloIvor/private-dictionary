// src/App.jsx - COMPLETE TAILWIND INTEGRATION + TEST MODE FIX
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen/LoginScreen';

// ============================================
// TEST MODE: Conditionally import test component
// ============================================
const DailyProgressTest = import.meta.env.VITE_ENABLE_TEST_MODE === 'true' 
  ? React.lazy(() => import('./components/Test/DailyProgressTest'))
  : null;

import Header from './components/Header/Header';
import ProgressSection from './components/ProgressSection/ProgressSection';
import SearchControls from './components/SearchControls/SearchControls';
import LessonNavigation from './components/LessonNavigation/LessonNavigation';
import LessonContent from './components/LessonContent/LessonContent';
import SearchResults from './components/SearchResults/SearchResults';
import AddWordsModal from './components/AddWordsModal/AddWordsModal';
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper/KeyboardShortcutsHelper';
import DarkModeToggle from './components/DarkModeToggle/DarkModeToggle';
import { initialDictionary } from './data/dictionary';
import { saveDictionary, loadDictionary } from './services/firebase';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';

const MainApp = () => {
  const { currentUser, isDemo, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  // === DEMO LESSONS INITIALIZATION ===
  const getDemoLessons = () => {
    const demoLessons = {};
    if (initialDictionary[1]) demoLessons[1] = initialDictionary[1];
    if (initialDictionary[2]) demoLessons[2] = initialDictionary[2];
    return demoLessons;
  };
  
  // === STATE MANAGEMENT ===
  const [dictionary, setDictionary] = useState(isDemo ? getDemoLessons() : {});
  const [currentLesson, setCurrentLesson] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  
  // === KEYBOARD SHORTCUTS & UI STATE ===
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState(''); 
  const searchInputRef = useRef(null);

  // === TOAST NOTIFICATION HELPER ===
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };
  
  // === KEYBOARD SHORTCUTS CONFIGURATION ===
  const shortcuts = useMemo(() => ({
    // Add new word
    'mod+e': (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowAddModal(true);
      showToast('➕ Add new word');
    },
    
    // Focus search
    'mod+f': (e) => {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
        showToast('🔍 Search activated');
      }
    },
    
    // Toggle shortcuts help
    'mod+k': (e) => {
      e.preventDefault();
      setShowShortcutsHelp(prev => !prev);
    },
    
    // Show save notification
    'mod+s': (e) => {
      e.preventDefault();
      setShowSaveNotification(true);
    },
    
    // Toggle dark mode
    'mod+d': (e) => {
      e.preventDefault();
      toggleDarkMode();
      showToast(darkMode ? '☀️ Light mode' : '🌙 Dark mode');
    },
    
    // === NAVIGATION: Next lesson ===
    'mod+arrowright': (e) => {
      e.preventDefault();
      const lessons = Object.keys(dictionary).map(n => parseInt(n)).sort((a,b) => a-b);
      const currentIndex = lessons.indexOf(currentLesson);
      if (currentIndex < lessons.length - 1) {
        const nextLesson = lessons[currentIndex + 1];
        setCurrentLesson(nextLesson);
        showToast(`➡️ ${dictionary[nextLesson]?.title || `Lesson ${nextLesson}`}`);
      } else {
        showToast('⚠️ This is the last lesson');
      }
    },
    
    // === NAVIGATION: Previous lesson ===
    'mod+arrowleft': (e) => {
      e.preventDefault();
      const lessons = Object.keys(dictionary).map(n => parseInt(n)).sort((a,b) => a-b);
      const currentIndex = lessons.indexOf(currentLesson);
      if (currentIndex > 0) {
        const prevLesson = lessons[currentIndex - 1];
        setCurrentLesson(prevLesson);
        showToast(`⬅️ ${dictionary[prevLesson]?.title || `Lesson ${prevLesson}`}`);
      } else {
        showToast('⚠️ This is the first lesson');
      }
    },
    
    // === NAVIGATION: First lesson ===
    'mod+home': (e) => {
      e.preventDefault();
      const lessons = Object.keys(dictionary).map(n => parseInt(n)).sort((a,b) => a-b);
      if (lessons.length > 0) {
        const firstLesson = lessons[0];
        setCurrentLesson(firstLesson);
        showToast(`⏮️ ${dictionary[firstLesson]?.title || `Lesson ${firstLesson}`}`);
      }
    },
    
    // === NAVIGATION: Last lesson ===
    'mod+end': (e) => {
      e.preventDefault();
      const lessons = Object.keys(dictionary).map(n => parseInt(n)).sort((a,b) => a-b);
      if (lessons.length > 0) {
        const lastLesson = lessons[lessons.length - 1];
        setCurrentLesson(lastLesson);
        showToast(`⏭️ ${dictionary[lastLesson]?.title || `Lesson ${lastLesson}`}`);
      }
    },
    
    // Close modals with Escape
    'escape': () => {
      if (showAddModal) {
        setShowAddModal(false);
      } else if (showShortcutsHelp) {
        setShowShortcutsHelp(false);
      }
    }
  }), [showAddModal, showShortcutsHelp, dictionary, currentLesson, darkMode, toggleDarkMode]);

  // === TOAST NOTIFICATION COMPONENT ===
  const ToastNotification = () => {
    if (!toastMessage) return null;
    
    return (
      <div className="fixed bottom-20 right-5 z-[1000]
                    bg-gradient-to-r from-primary-600 to-primary-dark
                    text-white px-5 py-3 rounded-lg
                    shadow-lg animate-slide-in-right
                    max-w-[300px]">
        <div className="text-sm font-medium">
          {toastMessage}
        </div>
      </div>
    );
  };

  // === INITIALIZE KEYBOARD SHORTCUTS ===
  useKeyboardShortcuts(shortcuts, !loading);

  // === RESPONSIVE HANDLER ===
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // === SAVE NOTIFICATION AUTO-HIDE ===
  useEffect(() => {
    if (showSaveNotification) {
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);

  // === SAVE NOTIFICATION COMPONENT ===
  const SaveNotification = () => {
    if (!showSaveNotification) return null;
    
    return (
      <div className="fixed top-5 right-5 z-[1000]
                    bg-gradient-to-r from-success-500 to-success-light
                    text-white px-6 py-4 rounded-xl
                    shadow-lg animate-fade-in
                    flex items-center gap-3">
        <span className="text-2xl">💾</span>
        <div>
          <div className="font-bold">
            {isDemo ? 'Demo mode - Session saved' : 'Auto-save active'}
          </div>
          {lastSaved && !isDemo && (
            <div className="text-sm opacity-90">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
          {isDemo && (
            <div className="text-xs opacity-90">
              Sign in for permanent storage!
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // === UTILITY FUNCTIONS ===
  const getNextLessonNumber = () => {
    if (Object.keys(dictionary).length === 0) return 1;
    const lessonNumbers = Object.keys(dictionary).map(num => parseInt(num));
    return Math.max(...lessonNumbers) + 1;
  };

  const getDemoLimits = () => {
    return {
      maxLessons: 2,
      maxWordsPerLesson: 20
    };
  };

  const canAddLesson = () => {
    if (!isDemo) return true;
    const limits = getDemoLimits();
    return Object.keys(dictionary).length < limits.maxLessons;
  };

  const canAddWordsToLesson = (lessonNumber) => {
    if (!isDemo) return { canAdd: true, remaining: Infinity };
    const limits = getDemoLimits();
    const currentWords = dictionary[lessonNumber]?.words?.length || 0;
    return {
      canAdd: currentWords < limits.maxWordsPerLesson,
      remaining: limits.maxWordsPerLesson - currentWords
    };
  };

  // === LOAD USER DICTIONARY ===
  useEffect(() => {
    const loadUserDictionary = async () => {
      if (currentUser && !isDemo) {
        setLoading(true);
        try {
          const userDictionary = await loadDictionary(currentUser.uid);
          setDictionary(userDictionary || {});
          if (userDictionary && Object.keys(userDictionary).length > 0) {
            const firstLesson = Math.min(...Object.keys(userDictionary).map(num => parseInt(num)));
            setCurrentLesson(firstLesson);
          }
        } catch (error) {
          console.error('Error loading dictionary:', error);
          setDictionary({});
        } finally {
          setLoading(false);
        }
      } else if (isDemo) {
        setLoading(true);
        try {
          const savedDemoDictionary = localStorage.getItem('demoDictionary');
          
          if (savedDemoDictionary) {
            const parsedDictionary = JSON.parse(savedDemoDictionary);
            setDictionary(parsedDictionary);
            
            if (Object.keys(parsedDictionary).length > 0) {
              const firstLesson = Math.min(...Object.keys(parsedDictionary).map(num => parseInt(num)));
              setCurrentLesson(firstLesson);
            }
          } else {
            setDictionary(getDemoLessons());
            setCurrentLesson(1);
          }
        } catch (error) {
          console.error('Error loading demo dictionary:', error);
          setDictionary(getDemoLessons());
          setCurrentLesson(1);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    loadUserDictionary();
  }, [currentUser, isDemo]);

  // === AUTO-SAVE DICTIONARY ===
  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      if (dictionary && Object.keys(dictionary).length > 0) {
        if (isDemo) {
          try {
            localStorage.setItem('demoDictionary', JSON.stringify(dictionary));
            setLastSaved(new Date());
          } catch (error) {
            console.error('Error saving to localStorage:', error);
          }
        } else if (currentUser) {
          try {
            await saveDictionary(currentUser.uid, dictionary);
            setLastSaved(new Date());
          } catch (error) {
            console.error('Error saving dictionary:', error);
          }
        }
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [dictionary, currentUser, isDemo]);

  // === DICTIONARY OPERATIONS ===
  const updateDictionary = (newDictionary) => {
    setDictionary(newDictionary);
  };

  const deleteLesson = (lessonNumber) => {
    // Demo protection
    if (isDemo) {
      alert('⚠️ Cannot delete default lessons in demo mode!');
      return;
    }
    
    if (window.confirm(`Are you sure you want to delete lesson ${lessonNumber} and all its words?`)) {
      const updatedDictionary = { ...dictionary };
      delete updatedDictionary[lessonNumber];
      setDictionary(updatedDictionary);
      
      if (currentLesson === lessonNumber) {
        const remainingLessons = Object.keys(updatedDictionary).map(num => parseInt(num));
        if (remainingLessons.length > 0) {
          setCurrentLesson(Math.min(...remainingLessons));
        } else {
          setCurrentLesson(1);
        }
      }
    }
  };

  const renameLesson = (lessonNumber, newTitle) => {
    const updatedDictionary = { ...dictionary };
    if (updatedDictionary[lessonNumber]) {
      updatedDictionary[lessonNumber].title = newTitle;
      setDictionary(updatedDictionary);
    }
  };

  const deleteWord = (lessonNumber, wordIndex) => {
    const updatedDictionary = { ...dictionary };
    if (updatedDictionary[lessonNumber]) {
      updatedDictionary[lessonNumber].words.splice(wordIndex, 1);
      setDictionary(updatedDictionary);
    }
  };

   const reorderWords = (lessonNumber, newWordOrder) => {
    const updatedDictionary = { ...dictionary };
    const lessonKey = lessonNumber.toString();
    
    if (updatedDictionary[lessonKey]) {
      updatedDictionary[lessonKey] = {
        ...updatedDictionary[lessonKey],
        words: [...newWordOrder]
      };
      setDictionary(updatedDictionary);
    } else {
      console.warn('Lesson not found:', lessonKey);
    }
  };

  // === SEARCH FUNCTIONALITY ===
  const getSearchResults = () => {
    if (!searchTerm) return null;

    const results = [];
    Object.entries(dictionary).forEach(([lessonNum, lesson]) => {
      lesson.words.forEach(word => {
        const englishMatch = word.english.toLowerCase().includes(searchTerm.toLowerCase());
        const hungarianMatch = word.hungarian.toLowerCase().includes(searchTerm.toLowerCase());
        
        if ((filter === 'all' && (englishMatch || hungarianMatch)) ||
            (filter === 'english' && englishMatch) ||
            (filter === 'hungarian' && hungarianMatch)) {
          results.push({ ...word, lessonNumber: lessonNum });
        }
      });
    });

    return results;
  };

  // === LOADING STATE ===
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen
                    bg-gradient-to-br from-primary-600 to-primary-dark">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  const searchResults = getSearchResults();
  const demoLimits = getDemoLimits();

  // === MAIN RENDER ===
  return (
    <div className="max-w-7xl mx-auto my-5 
                  bg-white dark:bg-slate-900 
                  rounded-2xl shadow-2xl overflow-hidden
                  transition-all duration-300">
      {/* User Navigation Bar */}
      <div className={`
        bg-gray-50 dark:bg-slate-800 
        border-b border-gray-200 dark:border-slate-700
        transition-all duration-300
        ${isMobile ? 'p-3 flex flex-col gap-2' : 'px-5 py-3 flex justify-between items-center'}
      `}>
        {isMobile ? (
          // ===== MOBILE LAYOUT =====
          <>
            <div className="flex justify-between items-center">
              {/* Left: Profile info */}
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    className="w-7 h-7 rounded-full 
                             border-2 border-blue-400 dark:border-purple-500
                             flex-shrink-0"
                  />
                )}
                <span className="font-bold text-gray-800 dark:text-gray-200 
                               text-sm truncate">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                {isDemo && (
                  <span className="bg-orange-500 text-white 
                                 px-2 py-0.5 rounded text-xs flex-shrink-0">
                    DEMO
                  </span>
                )}
              </div>
              
              {/* Right: Action buttons */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Dark Mode Toggle - Mobile */}
                <DarkModeToggle 
                  darkMode={darkMode} 
                  toggleDarkMode={toggleDarkMode}
                  isMobile={true}
                />
                
                {/* Keyboard Shortcuts - Mobile */}
                <button
                  onClick={() => setShowShortcutsHelp(true)}
                  className="w-9 h-9 rounded-full 
                           bg-gradient-to-r from-indigo-500 to-purple-600
                           dark:from-indigo-600 dark:to-purple-700
                           text-white text-xl
                           flex items-center justify-center
                           hover:scale-110 active:scale-95
                           transition-transform duration-200
                           shadow-md"
                  title="Keyboard shortcuts"
                  aria-label="Show keyboard shortcuts"
                >
                  ⌨️
                </button>
                
                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 
                           text-white rounded-md text-xs font-medium
                           transition-colors duration-200 whitespace-nowrap"
                >
                  Logout
                </button>
              </div>
            </div>
            
            {/* Last saved info */}
            {lastSaved && !isDemo && (
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Saved: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          // ===== DESKTOP LAYOUT (unchanged) =====
          <>
            <div className="flex items-center gap-3">
              {currentUser.photoURL && (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full 
                           border-2 border-blue-400 dark:border-purple-500"
                />
              )}
              <span className="font-bold text-gray-800 dark:text-gray-200">
                {currentUser.displayName || currentUser.email}
              </span>
              {isDemo && (
                <span className="bg-orange-500 text-white 
                               px-2 py-1 rounded text-xs">
                  DEMO
                </span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {lastSaved && !isDemo && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 
                         text-white rounded-lg text-sm font-medium
                         transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </>
        )}
      </div>
      
      {/* Main Content */}
      <Header isDemo={isDemo} demoLimits={demoLimits} />
      <ProgressSection dictionary={dictionary} isDemo={isDemo} demoLimits={demoLimits} />
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
        searchInputRef={searchInputRef}
      />
      <LessonNavigation
        dictionary={dictionary}
        currentLesson={currentLesson}
        setCurrentLesson={setCurrentLesson}
        isDemo={isDemo}
        getNextLessonNumber={getNextLessonNumber}
        canAddLesson={canAddLesson}
        demoLimits={demoLimits}
      />
      
      {/* Lesson Content or Search Results */}
      <div className="p-8 min-h-[400px] 
                    bg-white dark:bg-slate-900 
                    text-gray-900 dark:text-gray-100">
        {searchResults ? (
          <SearchResults results={searchResults} searchTerm={searchTerm} />
        ) : (
          <LessonContent
            lesson={dictionary[currentLesson]}
            lessonNumber={currentLesson}
            isDemo={isDemo}
            deleteLesson={deleteLesson}
            renameLesson={renameLesson}
            deleteWord={deleteWord}
            reorderWords={reorderWords}
          />
        )}
      </div>

      {/* Add Words Button */}
      <div className="bg-gray-50 dark:bg-slate-800 
                    p-5 text-center 
                    border-t border-gray-200 dark:border-slate-700
                    transition-all duration-300">
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-400 to-cyan-400
                   dark:from-purple-600 dark:to-indigo-600
                   text-white px-8 py-4 rounded-full
                   font-semibold text-lg
                   shadow-lg hover:shadow-xl
                   transform hover:scale-105
                   transition-all duration-300"
        >
          📚 Szavak hozzáadása
        </button>
        {isDemo && (
          <p className={`mt-3 text-gray-600 dark:text-gray-400 
                        ${isMobile ? 'text-xs' : 'text-sm'}`}>
            ⚠️ Demo mode: Max {demoLimits.maxLessons} lessons, 
            {demoLimits.maxWordsPerLesson} words per lesson
          </p>
        )}
      </div>

      {/* Modals and Overlays */}
      <AddWordsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        dictionary={dictionary}
        setDictionary={updateDictionary}
        isDemo={isDemo}
        getNextLessonNumber={getNextLessonNumber}
        canAddLesson={canAddLesson}
        canAddWordsToLesson={canAddWordsToLesson}
        demoLimits={demoLimits}
      />
      <SaveNotification />
      <ToastNotification />
      
      {/* Keyboard Shortcuts Modal - Always available */}
      <KeyboardShortcutsHelper 
        isOpen={showShortcutsHelp}
        onOpen={() => setShowShortcutsHelp(true)}
        onClose={() => setShowShortcutsHelp(false)}
      />
      
      {/* FAB Buttons - Desktop ONLY */}
      {!isMobile && (
        <DarkModeToggle 
          darkMode={darkMode} 
          toggleDarkMode={toggleDarkMode}
          isMobile={false}
        />
      )}
    </div>
  );
};

// ============================================
// APP ROOT
// ============================================
const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

// ============================================
// AUTH WRAPPER - WITH TEST MODE SUPPORT
// ============================================
const AuthWrapper = () => {
  const { currentUser, loading } = useAuth();
  
  // ✅ TEST MODE CHECK
  const isTestMode = import.meta.env.VITE_ENABLE_TEST_MODE === 'true';

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen
                    bg-gradient-to-br from-primary-600 to-primary-dark">
        <div className="text-center text-white">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <h2 className="text-2xl font-bold">Loading...</h2>
        </div>
      </div>
    );
  }

  // ✅ TEST MODE: Render test component instead of normal app
  if (isTestMode && DailyProgressTest) {
    console.log('🧪 Test Mode Enabled - Loading DailyProgressTest component');
    
    return (
      <>
        {/* Test Mode Banner */}
        <div className="fixed top-0 left-0 right-0 z-[9999]
                      bg-red-600 text-white text-center py-2 font-bold
                      shadow-lg">
          🧪 TEST MODE ACTIVE - Component Testing Environment
        </div>
        
        {/* Test Component with Suspense */}
        <div className="pt-12">
          <React.Suspense fallback={
            <div className="flex justify-center items-center min-h-screen
                          bg-gradient-to-br from-primary-600 to-primary-dark">
              <div className="text-center text-white">
                <div className="text-6xl mb-4 animate-bounce">🧪</div>
                <h2 className="text-2xl font-bold">Loading Test Component...</h2>
              </div>
            </div>
          }>
            <DailyProgressTest />
          </React.Suspense>
        </div>
      </>
    );
  }

  // ✅ NORMAL MODE: Render login or main app
  return currentUser ? <MainApp /> : <LoginScreen />;
};

export default App;
