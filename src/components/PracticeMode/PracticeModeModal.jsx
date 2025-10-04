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

const PracticeModeModal = ({ isOpen, onClose, words, lessonTitle }) => {
  const [practiceMode, setPracticeMode] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const { speak } = useSpeechSynthesis();
  
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

  // Milestone notifications
  useEffect(() => {
    if (!practiceMode || practiceWords.length === 0) return;
    
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

  // Swipe gestures for mobile
  const swipeHandlers = useSwipeGesture(
    () => goToNext(), // Swipe left = next
    () => goToPrevious() // Swipe right = previous
  );

  // Keyboard shortcuts
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

  useKeyboardShortcuts(shortcuts, isOpen && practiceMode !== null && !showResults);

  // Start practice with selected mode
  const handleStartPractice = (mode) => {
    setPracticeMode(mode);
    setShowResults(false);
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
  };

  // Close modal
  const handleClose = () => {
    setPracticeMode(null);
    setShowResults(false);
    onClose();
  };

  // Auto-finish when all cards viewed
  useEffect(() => {
    if (practiceMode && viewedCards.size === practiceWords.length && practiceWords.length > 0 && !showResults) {
      // Small delay before showing results
      const timer = setTimeout(() => {
        handleFinish();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [viewedCards.size, practiceWords.length, practiceMode, showResults]);

  if (!isOpen) return null;

  // Results calculated when showing results
  const stats = showResults ? calculateStats({
    totalCards: practiceWords.length,
    viewedCards,
    startTime,
    flips
  }) : null;

  return (
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
          {...(practiceMode && !showResults ? swipeHandlers : {})}
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
                Card {currentIndex + 1} of {practiceWords.length}
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
                stats={stats}
                onRestart={handleRestart}
                onClose={handleClose}
              />
            )}

            {/* Practice Screen */}
            {practiceMode && !showResults && currentWord && (
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
  );
};

export default PracticeModeModal;
