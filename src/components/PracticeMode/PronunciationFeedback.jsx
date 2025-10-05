// src/components/PracticeMode/PronunciationFeedback.jsx
import React, { useRef, useEffect } from 'react';
import { getPronunciationFeedback, getPronunciationTip } from '../../utils/pronunciationHelper';

const PronunciationFeedback = ({ 
  score, 
  spoken, 
  target,
  attempts = 1,
  showTip = true 
}) => {
  const feedbackRef = useRef(null);

  // ♿ Auto-focus on feedback for screen readers
  useEffect(() => {
    if (feedbackRef.current) {
      feedbackRef.current.focus();
    }
  }, [score]);

  if (score === null || score === undefined) return null;

  const feedback = getPronunciationFeedback(score);
  const tip = showTip && score < 85 ? getPronunciationTip(spoken, target) : null;

  return (
    <div 
      ref={feedbackRef}
      tabIndex={-1}
      className="w-full max-w-lg mx-auto mt-6 space-y-4 animate-slide-in-up"
      role="region"
      aria-label="Kiejtési visszajelzés"
    >
      {/* Score Display */}
      <div 
        className={`
          p-6 rounded-xl
          bg-gradient-to-br ${feedback.className}
          text-white text-center
          shadow-lg
        `}
        role="alert"
        aria-live="assertive"
      >
        <div className="text-6xl mb-3" aria-hidden="true">
          {feedback.emoji}
        </div>
        
        <div className="text-2xl font-bold mb-2">
          {feedback.message}
        </div>
        
        <div className="text-4xl font-bold mb-3" aria-label={`Pontszám: ${score} százalék`}>
          {score}%
        </div>

        {/* Attempts Counter */}
        {attempts > 1 && (
          <div className="text-sm opacity-90">
            Próbálkozás: {attempts}. alkalommal
          </div>
        )}
      </div>

      {/* What You Said */}
      <div className="
        p-4 rounded-lg
        bg-gray-100 dark:bg-gray-800
        border-2 border-gray-300 dark:border-gray-600
      ">
        <div className="text-sm font-bold text-gray-600 dark:text-gray-400 mb-2">
          Amit mondtál:
        </div>
        <div className="text-xl font-medium text-gray-800 dark:text-gray-200">
          "{spoken || '...'}"
        </div>
      </div>

      {/* Target Word */}
      <div className="
        p-4 rounded-lg
        bg-green-50 dark:bg-green-900/20
        border-2 border-green-300 dark:border-green-700
      ">
        <div className="text-sm font-bold text-green-600 dark:text-green-400 mb-2">
          Helyes válasz:
        </div>
        <div className="text-xl font-medium text-green-800 dark:text-green-200">
          "{target}"
        </div>
      </div>

      {/* Pronunciation Tip */}
      {tip && (
        <div 
          className="
            p-4 rounded-lg
            bg-blue-50 dark:bg-blue-900/20
            border-2 border-blue-300 dark:border-blue-700
            text-blue-800 dark:text-blue-200
          "
          role="complementary"
          aria-label="Kiejtési tipp"
        >
          {tip}
        </div>
      )}
    </div>
  );
};

export default PronunciationFeedback;
