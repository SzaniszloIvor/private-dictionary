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
  const [dictionary, setDictionary] = useState(isDemo ? initialDictionary : {});
  const [currentLesson, setCurrentLesson] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    const loadUserDictionary = async () => {
      if (currentUser && !isDemo) {
        setLoading(true);
        try {
          const userDictionary = await loadDictionary(currentUser.uid);
          setDictionary(userDictionary);
        } catch (error) {
          console.error('Error loading dictionary:', error);
        } finally {
          setLoading(false);
        }
      } else if (isDemo) {
        setDictionary(initialDictionary);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };

    loadUserDictionary();
  }, [currentUser, isDemo]);

  useEffect(() => {
    const saveTimer = setTimeout(async () => {
      if (currentUser && !isDemo && dictionary) {
        try {
          await saveDictionary(currentUser.uid, dictionary);
          setLastSaved(new Date());
        } catch (error) {
          console.error('Error saving dictionary:', error);
        }
      }
    }, 1000);

    return () => clearTimeout(saveTimer);
  }, [dictionary, currentUser, isDemo]);

  const updateDictionary = (newDictionary) => {
    setDictionary(newDictionary);
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

  return (
    <div style={styles.container}>
      <div style={{ 
        background: '#f8f9fa', 
        padding: '10px 20px', 
        borderBottom: '1px solid #dee2e6',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
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
      </div>
      
      <Header />
      <ProgressSection dictionary={dictionary} />
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
      />
      
      <div style={styles.lessonContent}>
        {searchResults ? (
          <SearchResults results={searchResults} searchTerm={searchTerm} />
        ) : (
          <LessonContent
            lesson={dictionary[currentLesson]}
            lessonNumber={currentLesson}
          />
        )}
      </div>

      <div style={styles.controls}>
        <button style={styles.addWordsBtn} onClick={() => setShowAddModal(true)}>
          📚 Szavak hozzáadása
        </button>
        {isDemo && (
          <p style={{ marginTop: '10px', color: '#6c757d', fontSize: '14px' }}>
            ⚠️ Demo módban vagy - a változtatások nem kerülnek mentésre!
          </p>
        )}
      </div>

      <AddWordsModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        dictionary={dictionary}
        setDictionary={updateDictionary}
      />
    </div>
  );
};

const App = () => {
  const [authReady, setAuthReady] = useState(false);

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