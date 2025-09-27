// src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, signInWithGoogle, logout as firebaseLogout } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [authMode, setAuthMode] = useState(null); // 'google' | 'demo' | null

  useEffect(() => {
    const demoSession = localStorage.getItem('demoSession');
    if (demoSession === 'active') {
      setIsDemo(true);
      setAuthMode('demo');
      setCurrentUser({
        uid: 'demo-user',
        email: 'demo@example.com',
        displayName: 'Demo Felhasználó',
        photoURL: null
      });
      setLoading(false);
      return;
    }

    // Firebase auth listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setAuthMode('google');
        setIsDemo(false);
        localStorage.removeItem('demoSession');
      } else {
        setCurrentUser(null);
        setAuthMode(null);
        setIsDemo(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('demoSession');
      const user = await signInWithGoogle();
      setIsDemo(false);
      setAuthMode('google');
      return user;
    } catch (error) {
      console.error('Google bejelentkezési hiba:', error);
      setLoading(false);
      throw error;
    }
  };

  const loginAsDemo = () => {
    localStorage.setItem('demoSession', 'active');
    setIsDemo(true);
    setAuthMode('demo');
    setCurrentUser({
      uid: 'demo-user',
      email: 'demo@example.com',
      displayName: 'Demo Felhasználó',
      photoURL: null
    });
    setLoading(false);
  };

  const logout = async () => {
    setLoading(true);
    
    if (isDemo) {
      localStorage.removeItem('demoSession');
      setCurrentUser(null);
      setIsDemo(false);
      setAuthMode(null);
      setLoading(false);
    } else {
      try {
        await firebaseLogout();
        setCurrentUser(null);
        setAuthMode(null);
        setIsDemo(false);
      } catch (error) {
        console.error('Kijelentkezési hiba:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const value = {
    currentUser,
    isDemo,
    authMode,
    loginWithGoogle,
    loginAsDemo,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
