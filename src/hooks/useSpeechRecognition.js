// src/hooks/useSpeechRecognition.js
import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for speech recognition - OPTIMIZED VERSION
 * Uses Web Speech API (SpeechRecognition)
 */
export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const timeoutRef = useRef(null);

  // Check browser support (memoized)
  const isSupported = useRef(
    typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
  ).current;

  useEffect(() => {
    if (!isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    // Configuration
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';
    recognitionRef.current.maxAlternatives = 3;

    // Event handlers
    recognitionRef.current.onstart = () => {
      setIsListening(true);
      setError(null);
      setTranscript('');
      setInterimTranscript('');
    };

    recognitionRef.current.onresult = (event) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);
      if (final) {
        setTranscript(final.trim().toLowerCase());
      }
    };

    recognitionRef.current.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      
      const errorMessages = {
        'no-speech': 'Nem hallottam semmit. Próbáld újra!',
        'audio-capture': 'Mikrofon hiba. Ellenőrizd a beállításokat!',
        'not-allowed': 'Mikrofon hozzáférés megtagadva.',
        'network': 'Hálózati hiba. Ellenőrizd az internetkapcsolatot!',
        'aborted': 'Megszakítva.',
      };
      
      setError(errorMessages[event.error] || `Hiba történt: ${event.error}`);
      setIsListening(false);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Error stopping recognition:', e);
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSupported]);

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError('A hangfelismerés nem támogatott ebben a böngészőben.');
      return false;
    }

    if (!recognitionRef.current) {
      setError('A hangfelismerés inicializálása sikertelen.');
      return false;
    }

    if (isListening) {
      return false;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current.start();
      
      // ⚡ AUTO-STOP after 10 seconds (prevent hanging)
      timeoutRef.current = setTimeout(() => {
        if (recognitionRef.current && isListening) {
          recognitionRef.current.stop();
        }
      }, 10000);
      
      return true;
    } catch (err) {
      console.error('Error starting recognition:', err);
      setError('Nem sikerült elindítani a hangfelismerést. Engedélyezd a mikrofon hozzáférést!');
      return false;
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  };
};

export default useSpeechRecognition;
