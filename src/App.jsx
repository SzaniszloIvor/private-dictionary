// src/App.jsx
import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen/LoginScreen';
import Header from './components/Header/Header';
import ProgressSection from './components/ProgressSection/ProgressSection';
import SearchControls from './components/SearchControls/SearchControls';
import LessonNavigation from './components/LessonNavigation/LessonNavigation';
import LessonContent from './components/LessonContent/LessonContent';
import SearchResults from './components/SearchResults/SearchResults';
import AddWordsModal from './components/AddWordsModal/AddWordsModal';
import { initialDictionary } from './data/dictionary';
import { saveDictionary, loadDictionary } from './services/firebase';
import { styles } from './styles/styles';

const MainApp = () => {
  const { currentUser, isDemo, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Demo mode: Load first 2 lessons from initial data
  const getDemoLessons = () => {
    const demoLessons = {};
    if (initialDictionary[1]) demoLessons[1] = initialDictionary[1];
    if (initialDictionary[2]) demoLessons[2] = initialDictionary[2];
    return demoLessons;
  };
  
  const [dictionary, setDictionary] = useState(isDemo ? getDemoLessons() : {});
  const [currentLesson, setCurrentLesson] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  
  // Dynamic next lesson number calculation
  const getNextLessonNumber = () => {
    if (Object.keys(dictionary).length === 0) return 1;
    const lessonNumbers = Object.keys(dictionary).map(num => parseInt(num));
    return Math.max(...lessonNumbers) + 1;
  };

  // DEMO LIMITS CHECKER
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
        // ✅ DEMO MÓD: localStorage betöltés VAGY alapértelmezett órák
        setLoading(true);
        try {
          const savedDemoDictionary = localStorage.getItem('demoDictionary');
          
          if (savedDemoDictionary) {
            // Van mentett demo adat
            const parsedDictionary = JSON.parse(savedDemoDictionary);
            setDictionary(parsedDictionary);
            
            if (Object.keys(parsedDictionary).length > 0) {
              const firstLesson = Math.min(...Object.keys(parsedDictionary).map(num => parseInt(num)));
              setCurrentLesson(firstLesson);
            }
          } else {
            // Nincs mentett adat, használjuk az alapértelmezett demo órákat
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
          // ✅ ÉLES: Firebase mentés
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

  const updateDictionary = (newDictionary) => {
    setDictionary(newDictionary);
  };

  // Delete lesson (available in demo too, but can't delete below 0 lessons)
  
  const deleteLesson = (lessonNumber) => {
    // ✅ Demo védelem
    if (isDemo) {
      alert('⚠️ Demo módban az alapértelmezett órákat nem lehet törölni!');
      return;
    }
    
    if (window.confirm(`Biztosan törölni szeretnéd a ${lessonNumber}. órát és az összes szavát?`)) {
      const updatedDictionary = { ...dictionary };
      delete updatedDictionary[lessonNumber];
      setDictionary(updatedDictionary);
      
      // Ha az aktuális órát töröltük, váltson másikra
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

  // Rename lesson (available in demo too)
  const renameLesson = (lessonNumber, newTitle) => {
    const updatedDictionary = { ...dictionary };
    if (updatedDictionary[lessonNumber]) {
      updatedDictionary[lessonNumber].title = newTitle;
      setDictionary(updatedDictionary);
    }
  };

  // Delete word (available in demo too)
  const deleteWord = (lessonNumber, wordIndex) => {
    const updatedDictionary = { ...dictionary };
    if (updatedDictionary[lessonNumber]) {
      updatedDictionary[lessonNumber].words.splice(wordIndex, 1);
      setDictionary(updatedDictionary);
    }
  };

  // Reorder words (available in demo too)
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>Betöltés...</h2>
        </div>
      </div>
    );
  }

  const searchResults = getSearchResults();
  const demoLimits = getDemoLimits();

  const mobileNavStyles = {
    container: {
      background: '#f8f9fa', 
      padding: '8px 12px', 
      borderBottom: '1px solid #dee2e6',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    userRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    userInfo: {
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      flex: 1,
      minWidth: 0
    },
    userName: {
      fontWeight: 'bold', 
      color: '#495057',
      fontSize: '14px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    logoutBtn: {
      padding: '6px 12px',
      background: '#dc3545',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '13px',
      whiteSpace: 'nowrap'
    }
  };

  return (
    <div style={styles.container}>
      <div style={isMobile ? mobileNavStyles.container : { 
        background: '#f8f9fa', 
        padding: '10px 20px', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {isMobile ? (
          <>
            <div style={mobileNavStyles.userRow}>
              <div style={mobileNavStyles.userInfo}>
                {currentUser.photoURL && (
                  <img 
                    src={currentUser.photoURL} 
                    alt="Profile" 
                    style={{ 
                      width: '28px', 
                      height: '28px', 
                      borderRadius: '50%',
                      border: '2px solid #4facfe',
                      flexShrink: 0
                    }}
                  />
                )}
                <span style={mobileNavStyles.userName}>
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                {isDemo && (
                  <span style={{ 
                    background: 'orange', 
                    color: 'white', 
                    padding: '2px 6px', 
                    borderRadius: '4px',
                    fontSize: '11px',
                    flexShrink: 0
                  }}>
                    DEMO
                  </span>
                )}
              </div>
              <button
                onClick={logout}
                style={mobileNavStyles.logoutBtn}
              >
                Kilépés
              </button>
            </div>
            {lastSaved && !isDemo && (
              <div style={{ fontSize: '11px', color: '#6c757d' }}>
                Mentve: {lastSaved.toLocaleTimeString()}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {currentUser.photoURL && (
                <img 
                  src={currentUser.photoURL} 
                  alt="Profile" 
                  style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%',
                    border: '2px solid #4facfe'
                  }}
                />
              )}
              <span style={{ fontWeight: 'bold', color: '#495057' }}>
                {currentUser.displayName || currentUser.email}
              </span>
              {isDemo && (
                <span style={{ 
                  background: 'orange', 
                  color: 'white', 
                  padding: '2px 8px', 
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  DEMO
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              {lastSaved && !isDemo && (
                <span style={{ fontSize: '12px', color: '#6c757d' }}>
                  Mentve: {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={logout}
                style={{
                  padding: '6px 15px',
                  background: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Kijelentkezés
              </button>
            </div>
          </>
        )}
      </div>
      
      <Header isDemo={isDemo} demoLimits={demoLimits} />
      <ProgressSection dictionary={dictionary} isDemo={isDemo} demoLimits={demoLimits} />
      <SearchControls
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filter={filter}
        setFilter={setFilter}
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
      
      <div style={styles.lessonContent}>
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

      <div style={styles.controls}>
        <button 
          style={styles.addWordsBtn} 
          onClick={() => setShowAddModal(true)}
        >
          📚 Szavak hozzáadása
        </button>
        {isDemo && (
          <p style={{ marginTop: '10px', color: '#6c757d', fontSize: isMobile ? '13px' : '14px' }}>
            ⚠️ Demo módban: Max {demoLimits.maxLessons} óra, óránként {demoLimits.maxWordsPerLesson} szó
          </p>
        )}
      </div>

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
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AuthWrapper />
    </AuthProvider>
  );
};

const AuthWrapper = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <h2>Betöltés...</h2>
        </div>
      </div>
    );
  }

  return currentUser ? <MainApp /> : <LoginScreen />;
};

export default App;
