// src/hooks/useSpeechSynthesis.js
import { useEffect, useState } from 'react';

export const useSpeechSynthesis = () => {
  const [voices, setVoices] = useState([]);
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const [speechRate, setSpeechRate] = useState(() => {
    // Load saved rate from localStorage or use default
    const saved = localStorage.getItem('speechRate');
    return saved ? parseFloat(saved) : 0.7;
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices();
        setVoices(availableVoices);
      };

      loadVoices();
      
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
      }
    }
  }, []);

  const speak = (text, options = {}) => {
    if (!supported) {
      console.warn('Speech synthesis is not supported in this browser.');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // CRITICAL: Always set language to English
    utterance.lang = 'en-US';
    
    utterance.rate = options.rate || speechRate;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

    // Try to find the best English voice
    // Priority: 1) en-US, 2) en-GB, 3) any en-* voice
    let selectedVoice = null;
    
    if (voices.length > 0) {
      // Try US English first
      selectedVoice = voices.find(voice => 
        voice.lang === 'en-US' || voice.lang === 'en_US'
      );
      
      // Try British English
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang === 'en-GB' || voice.lang === 'en_GB'
        );
      }
      
      // Try any English voice
      if (!selectedVoice) {
        selectedVoice = voices.find(voice => 
          voice.lang.startsWith('en')
        );
      }
      
      // Set the voice if found
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    speechSynthesis.speak(utterance);
  };

  const cancel = () => {
    if (supported) {
      speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const pause = () => {
    if (supported && speaking) {
      speechSynthesis.pause();
    }
  };

  const resume = () => {
    if (supported) {
      speechSynthesis.resume();
    }
  };

  const updateSpeechRate = (newRate) => {
    const clampedRate = Math.min(Math.max(newRate, 0.3), 1.2);
    setSpeechRate(clampedRate);
    localStorage.setItem('speechRate', clampedRate.toString());
  };

  return {
    speak,
    cancel,
    pause,
    resume,
    speaking,
    voices,
    supported,
    speechRate,
    updateSpeechRate
  };
};
