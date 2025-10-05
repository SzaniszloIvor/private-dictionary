// src/components/PracticeMode/PronunciationCard.jsx
import React, { useState, useEffect } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { 
  calculatePronunciationScore,
  getPronunciationDifficulty 
} from '../../utils/pronunciationHelper';
import MicrophoneButton from './MicrophoneButton';
import PronunciationFeedback from './PronunciationFeedback';
import WaveformVisualizer from './WaveformVisualizer';
import ErrorDisplay from './ErrorDisplay';
import PronunciationTips from './PronunciationTips';

const PronunciationCard = ({ 
  word, 
  onNext,
  onSkip,
  autoPlayAudio = true 
}) => {
  const [score, setScore] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [hasEvaluated, setHasEvaluated] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false);
  
  const { speak } = useSpeechSynthesis();
  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  } = useSpeechRecognition();

  // Get difficulty level
  const difficulty = getPronunciationDifficulty(word?.english || '');

  useEffect(() => {
    if (autoPlayAudio && word?.english && !hasPlayedAudio) {
      const timer = setTimeout(() => {
        speak(word.english);
        setHasPlayedAudio(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [word?.english, autoPlayAudio, hasPlayedAudio]);

  // Reset hasPlayedAudio when word changes
  useEffect(() => {
    setHasPlayedAudio(false);
  }, [word?.english]);

  // Evaluate pronunciation when transcript changes
  useEffect(() => {
    if (transcript && word?.english && !hasEvaluated) {
      const calculatedScore = calculatePronunciationScore(transcript, word.english);
      setScore(calculatedScore);
      setAttempts(prev => prev + 1);
      setHasEvaluated(true);
      
      // Show tips if score is low
      if (calculatedScore < 85) {
        setShowTips(true);
      }
    }
  }, [transcript, word, hasEvaluated]);

  const handlePlayAudio = () => {
    if (word?.english) {
      speak(word.english);
    }
  };

  const handleRetry = () => {
    resetTranscript();
    setScore(null);
    setHasEvaluated(false);
    setShowTips(false);
  };

  const handleNext = () => {
    resetTranscript();
    setScore(null);
    setAttempts(0);
    setHasEvaluated(false);
    setShowTips(false);
    setHasPlayedAudio(false); // Reset audio flag
    onNext({ score, attempts: attempts || 1 });
  };

  const handleSkip = () => {
    resetTranscript();
    setScore(null);
    setAttempts(0);
    setHasEvaluated(false);
    setShowTips(false);
    setHasPlayedAudio(false); // ✅ Reset audio flag
    onSkip();
  };

  if (!word) return null;

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Browser Support Warning */}
      {!isSupported && (
        <div className="
          p-4 rounded-lg
          bg-red-50 dark:bg-red-900/20
          border-2 border-red-300 dark:border-red-700
          text-red-800 dark:text-red-200
          animate-slide-in-up
        ">
          <div className="font-bold mb-2">⚠️ Nem támogatott böngésző</div>
          <div className="text-sm">
            A hangfelismerés nem elérhető ebben a böngészőben.
            Használj Chrome vagy Edge böngészőt a legjobb élményhez!
          </div>
        </div>
      )}

      {/* Word Display with Difficulty Badge */}
      <div className="
        text-center p-8 rounded-xl
        bg-gradient-to-br from-indigo-500 to-purple-600
        dark:from-indigo-600 dark:to-purple-700
        text-white shadow-xl
        relative
      ">
        {/* Difficulty Badge */}
        <div className={`
          absolute top-4 right-4
          px-3 py-1 rounded-full text-sm font-bold
          ${difficulty.color === 'green' ? 'bg-green-500' : ''}
          ${difficulty.color === 'yellow' ? 'bg-yellow-500' : ''}
          ${difficulty.color === 'red' ? 'bg-red-500' : ''}
        `}>
          {difficulty.label}
        </div>

        <h2 className="text-5xl md:text-6xl font-bold mb-4">
          {word.english}
        </h2>
        
        {word.phonetic && (
          <p className="text-2xl md:text-3xl text-yellow-300 italic mb-2">
            /{word.phonetic}/
          </p>
        )}

        <p className="text-sm opacity-75 mb-6">
          {difficulty.advice}
        </p>

        <button
          onClick={handlePlayAudio}
          className="
            px-6 py-3 rounded-lg
            bg-white/20 hover:bg-white/30
            backdrop-blur-sm
            text-white font-medium
            transition-all duration-300
            hover:scale-105 active:scale-95
            flex items-center justify-center gap-2
            mx-auto
          "
        >
          <span className="text-2xl">🔊</span>
          <span>Meghallgatom</span>
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <ErrorDisplay
          errorCode={error}
          onRetry={handleRetry}
          onClose={() => resetTranscript()}
        />
      )}

      {/* Waveform Visualizer */}
      {isSupported && !error && (
        <WaveformVisualizer 
          isListening={isListening}
          color="#667eea"
        />
      )}

      {/* Microphone Section */}
      {isSupported && score === null && !error && (
        <MicrophoneButton
          isListening={isListening}
          isDisabled={!isSupported}
          onStart={startListening}
          onStop={stopListening}
        />
      )}

      {/* Live Transcript */}
      {(isListening || interimTranscript) && (
        <div className="
          p-4 rounded-lg text-center
          bg-blue-50 dark:bg-blue-900/20
          border-2 border-blue-300 dark:border-blue-700
          animate-pulse
        ">
          <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
            Felismerés folyamatban...
          </div>
          <div className="text-lg text-blue-800 dark:text-blue-200">
            "{interimTranscript || '...'}"
          </div>
        </div>
      )}

      {/* Pronunciation Feedback */}
      {score !== null && (
        <>
          <PronunciationFeedback
            score={score}
            spoken={transcript}
            target={word.english}
            attempts={attempts}
            showTip={false}
          />

          {/* Advanced Tips */}
          {showTips && (
            <PronunciationTips
              spoken={transcript}
              target={word.english}
              score={score}
            />
          )}
        </>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center flex-wrap">
        {score !== null ? (
          <>
            {score < 85 && (
              <button
                onClick={handleRetry}
                className="
                  px-6 py-3 rounded-lg font-medium
                  bg-orange-500 hover:bg-orange-600
                  dark:bg-orange-600 dark:hover:bg-orange-700
                  text-white
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  flex items-center gap-2
                "
              >
                <span>🔄</span>
                <span>Újra próbálom</span>
              </button>
            )}
            
            <button
              onClick={() => setShowTips(!showTips)}
              className="
                px-6 py-3 rounded-lg font-medium
                bg-blue-500 hover:bg-blue-600
                dark:bg-blue-600 dark:hover:bg-blue-700
                text-white
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center gap-2
              "
            >
              <span>💡</span>
              <span>{showTips ? 'Tippek elrejtése' : 'Tippek mutatása'}</span>
            </button>
            
            <button
              onClick={handleNext}
              className="
                px-6 py-3 rounded-lg font-medium
                bg-green-500 hover:bg-green-600
                dark:bg-green-600 dark:hover:bg-green-700
                text-white
                transition-all duration-200
                hover:scale-105 active:scale-95
                flex items-center gap-2
              "
            >
              <span>➡️</span>
              <span>Következő szó</span>
            </button>
          </>
        ) : (
          <button
            onClick={handleSkip}
            className="
              px-6 py-3 rounded-lg font-medium
              bg-gray-500 hover:bg-gray-600
              dark:bg-gray-600 dark:hover:bg-gray-700
              text-white
              transition-all duration-200
              hover:scale-105 active:scale-95
              flex items-center gap-2
            "
          >
            <span>⏭️</span>
            <span>Kihagyom</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default PronunciationCard;
