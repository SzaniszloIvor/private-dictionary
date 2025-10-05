// src/components/PracticeMode/PracticeModeModal.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { usePracticeMode } from '../../hooks/usePracticeMode';
import { useSwipeGesture } from '../../hooks/useSwipeGesture';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { calculateStats } from '../../utils/practiceHelper';
import PracticeSettings from './PracticeSettings';
import FlashCard from './FlashCard';
import PracticeControls from './PracticeControls';
import PracticeProgress from './PracticeProgress';
import PracticeResults from './PracticeResults';
import PronunciationCard from './PronunciationCard';
import ErrorBoundary from '../ErrorBoundary';

const PracticeModeModal = ({ isOpen, onClose, words, lessonTitle }) => {
  const [practiceMode, setPracticeMode] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { speak } = useSpeechSynthesis();

  const [pronunciationStats, setPronunciationStats] = useState({
    scores: [],
    attempts: []
  });
  
  const {
    practiceWords,
    currentIndex,
    currentWord,
    viewedCards,
    isFlipped,
    flips,
    startTime,
    progress,
    goToNext,
    goToPrevious,
    toggleFlip,
    milestonesShown,
    setMilestonesShown
  } = usePracticeMode(words, practiceMode);

  // Toast notification helper
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };

  // Milestone notifications (only for non-pronunciation modes)
  useEffect(() => {
    if (!practiceMode || practiceWords.length === 0 || practiceMode === 'pronunciation') return;
    
    const progressPercent = Math.floor(progress);
    
    if (progressPercent === 25 && !milestonesShown.has(25)) {
      showToast('🚀 Negyedúton vagy! Rajta!');
      setMilestonesShown(prev => new Set([...prev, 25]));
    } else if (progressPercent === 50 && !milestonesShown.has(50)) {
      showToast('💪 Félúton! Remekül megy!');
      setMilestonesShown(prev => new Set([...prev, 50]));
    } else if (progressPercent === 75 && !milestonesShown.has(75)) {
      showToast('🎯 Majdnem kész! Még egy kicsit!');
      setMilestonesShown(prev => new Set([...prev, 75]));
    }
  }, [progress, milestonesShown, setMilestonesShown, practiceMode, practiceWords.length]);

  // Swipe gestures for mobile (not for pronunciation mode)
  const swipeHandlers = useSwipeGesture(
    () => practiceMode !== 'pronunciation' && goToNext(),
    () => practiceMode !== 'pronunciation' && goToPrevious()
  );

  // Handle pronunciation next
  const handlePronunciationNext = (result) => {
    setPronunciationStats(prev => ({
      scores: [...prev.scores, result.score],
      attempts: [...prev.attempts, result.attempts]
    }));
    
    goToNext();
  };

  // Keyboard shortcuts (disabled for pronunciation mode)
  const shortcuts = useMemo(() => ({
    'arrowright': (e) => {
      e.preventDefault();
      goToNext();
    },
    'arrowleft': (e) => {
      e.preventDefault();
      goToPrevious();
    },
    'space': (e) => {
      e.preventDefault();
      toggleFlip();
    },
    'escape': () => {
      handleClose();
    }
  }), [goToNext, goToPrevious, toggleFlip]);

  const isPronunciationMode = practiceMode === 'pronunciation';
  
  useKeyboardShortcuts(
    shortcuts, 
    isOpen && practiceMode !== null && !showResults && !isPronunciationMode
  );

  // Start practice with selected mode
  const handleStartPractice = (mode) => {
    setPracticeMode(mode);
    setShowResults(false);
    setPronunciationStats({ scores: [], attempts: [] });
  };

  // Finish practice and show results
  const handleFinish = () => {
    const stats = calculateStats({
      totalCards: practiceWords.length,
      viewedCards,
      startTime,
      flips
    });
    
    setShowResults(true);
    return stats;
  };

  // Restart practice
  const handleRestart = () => {
    setPracticeMode(null);
    setShowResults(false);
    setPronunciationStats({
      scores: [],
      attempts: []
    });
  };

  // Close modal
  const handleClose = () => {
    setPracticeMode(null);
    setShowResults(false);
    setPronunciationStats({
      scores: [],
      attempts: []
    });
    onClose();
  };

  // Auto-finish when all cards completed
  useEffect(() => {
    if (!practiceMode || showResults || practiceWords.length === 0) return;
    
    let timer;
    
    // Pronunciation mode: check if reached last card + 1
    if (practiceMode === 'pronunciation') {
      if (currentIndex >= practiceWords.length) {
        timer = setTimeout(() => {
          handleFinish();
        }, 500);
      }
    } 
    // Other modes: check if all cards viewed
    else {
      if (viewedCards.size === practiceWords.length) {
        timer = setTimeout(() => {
          handleFinish();
        }, 500);
      }
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [
    viewedCards.size, 
    currentIndex,
    practiceWords.length, 
    practiceMode, 
    showResults
  ]);

  if (!isOpen) return null;

  // Results calculated when showing results
  const stats = showResults ? calculateStats({
    totalCards: practiceWords.length,
    viewedCards,
    startTime,
    flips
  }) : null;

  return (
    <ErrorBoundary>
    <>
      {/* Modal Overlay */}
      <div
        onClick={handleClose}
        className="
          fixed inset-0 z-[1002]
          bg-black/70 dark:bg-black/85
          flex items-center justify-center
          p-4 animate-fade-in
        "
      >
        {/* Modal Content */}
        <div
          onClick={(e) => e.stopPropagation()}
          {...(practiceMode && !showResults && !isPronunciationMode ? swipeHandlers : {})}
          className="
            bg-white dark:bg-gray-800
            rounded-2xl shadow-2xl
            w-full max-w-4xl
            max-h-[90vh] overflow-y-auto
            animate-slide-in-up
            relative
          "
        >
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="
              absolute top-4 right-4 z-10
              w-10 h-10 rounded-full
              bg-gray-200 dark:bg-gray-700
              hover:bg-gray-300 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-300
              flex items-center justify-center
              text-2xl font-bold
              transition-all duration-200
              hover:scale-110
            "
            title="Close (Esc)"
          >
            ×
          </button>

          {/* Header */}
          <div className="
            bg-gradient-to-r from-indigo-500 to-purple-600
            dark:from-indigo-600 dark:to-purple-700
            text-white p-6 rounded-t-2xl
          ">
            <h2 className="text-2xl md:text-3xl font-bold text-center">
              {practiceMode === null ? '🎯 Gyakorló Mód' : `📚 ${lessonTitle || 'Gyakorlás'}`}
            </h2>
            {practiceMode && !showResults && (
              <p className="text-center text-sm mt-2 opacity-90">
                {isPronunciationMode 
                  ? `${currentIndex + 1} / ${practiceWords.length} szó`
                  : `Card ${currentIndex + 1} of ${practiceWords.length}`
                }
              </p>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Settings Screen */}
            {practiceMode === null && (
              <PracticeSettings
                onStart={handleStartPractice}
                onCancel={handleClose}
              />
            )}

            {/* Results Screen */}
            {showResults && stats && (
              <PracticeResults
                stats={{
                  ...stats,
                  ...(isPronunciationMode && {
                    pronunciationStats
                  })
                }}
                mode={practiceMode}
                onRestart={handleRestart}
                onClose={handleClose}
              />
            )}

            {/* Pronunciation Mode */}
            {isPronunciationMode && !showResults && currentWord && (
              <div className="space-y-6">
                <PronunciationCard
                  word={currentWord}
                  onNext={handlePronunciationNext}
                  onSkip={goToNext}
                  autoPlayAudio={true}
                />
                
                {/* Progress Indicator */}
                <PracticeProgress
                  currentIndex={currentIndex}
                  totalCards={practiceWords.length}
                  viewedCards={new Set(pronunciationStats.scores.map((_, i) => i))}
                />

                {/* Manual Finish Button */}
                {pronunciationStats.scores.length > 0 && (
                  <div className="text-center">
                    <button
                      onClick={handleFinish}
                      className="
                        px-6 py-3 rounded-lg
                        bg-green-500 dark:bg-green-600
                        hover:bg-green-600 dark:hover:bg-green-700
                        text-white font-medium
                        transition-all duration-200
                        hover:scale-105
                      "
                    >
                      ✓ Befejezés ({pronunciationStats.scores.length}/{practiceWords.length})
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Other Practice Modes (Sequential, Random, Reverse) */}
            {practiceMode && !isPronunciationMode && !showResults && currentWord && (
              <div className="space-y-6">
                <FlashCard
                  word={currentWord}
                  isFlipped={isFlipped}
                  onSpeak={speak}
                  mode={practiceMode}
                />

                <PracticeControls
                  currentIndex={currentIndex}
                  totalCards={practiceWords.length}
                  onPrevious={goToPrevious}
                  onNext={goToNext}
                  onFlip={toggleFlip}
                  isFlipped={isFlipped}
                />

                <PracticeProgress
                  currentIndex={currentIndex}
                  totalCards={practiceWords.length}
                  viewedCards={viewedCards}
                />

                {/* Finish Button */}
                {viewedCards.size > 0 && (
                  <div className="text-center mt-6">
                    <button
                      onClick={handleFinish}
                      className="
                        px-6 py-3 rounded-lg
                        bg-green-500 dark:bg-green-600
                        hover:bg-green-600 dark:hover:bg-green-700
                        text-white font-medium
                        transition-all duration-200
                        hover:scale-105
                      "
                    >
                      ✓ Finish Practice
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="
          fixed bottom-20 right-5 z-[1003]
          bg-gradient-to-r from-indigo-500 to-purple-600
          dark:from-indigo-600 dark:to-purple-700
          text-white px-5 py-3 rounded-lg
          shadow-lg animate-slide-in-right
          max-w-[300px]
        ">
          <div className="text-sm font-medium">
            {toastMessage}
          </div>
        </div>
      )}
    </>
    </ErrorBoundary>
  );
};

export default PracticeModeModal;
