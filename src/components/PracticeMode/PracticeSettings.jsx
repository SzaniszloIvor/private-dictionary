// src/components/PracticeMode/PracticeSettings.jsx frissítés
import React from 'react';

const PracticeSettings = ({ onStart, onCancel }) => {
  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = 
    typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const modes = [
    {
      id: 'sequential',
      name: 'Sorrendben',
      icon: '📖',
      description: 'Szavak eredeti sorrendben',
      color: 'from-blue-500 to-cyan-400'
    },
    {
      id: 'random',
      name: 'Véletlenszerű',
      icon: '🎲',
      description: 'Kártyák véletlenszerűen',
      color: 'from-purple-500 to-pink-400'
    },
    {
      id: 'reverse',
      name: 'Fordított',
      icon: '🔄',
      description: 'Magyar → Angol',
      color: 'from-green-500 to-emerald-400'
    },
    // NEW: Pronunciation mode
    ...(isSpeechRecognitionSupported ? [{
      id: 'pronunciation',
      name: 'Kiejtésgyakorlás',
      icon: '🎤',
      description: 'Gyakorold a kiejtést mikrofonnal',
      color: 'from-red-500 to-pink-500',
      badge: 'ÚJ' // Optional badge
    }] : [])
  ];

  return (
    <div className="p-6 md:p-8 text-center animate-slide-in-up">
      {/* Header */}
      <div className="mb-8">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-gray-800 dark:text-gray-100">
          Gyakorló Mód
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Válaszd ki a gyakorlás típusát
        </p>
      </div>

      {/* Mode Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onStart(mode.id)}
            className="
              group p-6 rounded-xl relative
              bg-white dark:bg-gray-800
              border-2 border-gray-200 dark:border-gray-700
              hover:border-transparent
              shadow-md hover:shadow-xl
              transform hover:scale-105
              transition-all duration-300
            "
          >
            {/* NEW Badge */}
            {mode.badge && (
              <div className="
                absolute top-2 right-2
                bg-red-500 text-white
                px-2 py-1 rounded-full
                text-xs font-bold
                animate-pulse
              ">
                {mode.badge}
              </div>
            )}

            {/* Icon with gradient background */}
            <div className={`
              w-20 h-20 mx-auto mb-4 rounded-full
              bg-gradient-to-br ${mode.color}
              flex items-center justify-center
              text-4xl
              group-hover:scale-110
              transition-transform duration-300
            `}>
              {mode.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {mode.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {mode.description}
            </p>
          </button>
        ))}
      </div>

      {/* Browser compatibility warning */}
      {!isSpeechRecognitionSupported && (
        <div className="
          mb-6 p-4 rounded-lg
          bg-orange-50 dark:bg-orange-900/20
          border border-orange-300 dark:border-orange-700
          text-orange-800 dark:text-orange-200
          text-left
        ">
          <div className="font-bold mb-2 flex items-center gap-2">
            <span>⚠️</span>
            <span>Kiejtésgyakorlás nem elérhető</span>
          </div>
          <div className="text-sm">
            A hangfelismerés nem támogatott ebben a böngészőben.
            A kiejtésgyakorló funkció használatához <strong>Chrome</strong> vagy 
            <strong> Edge</strong> böngészőt ajánlunk.
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="
        bg-blue-50 dark:bg-blue-900/20
        border border-blue-300 dark:border-blue-700
        rounded-lg p-4 mb-6
        text-left
      ">
        <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>Hogyan működik</span>
        </h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Kattints a kártyára a válasz megjelenítéséhez</li>
          <li>• Használd a billentyűzet nyilakat (←/→) navigáláshoz</li>
          <li>• Nyomd meg a Szóközt a kártya megfordításához</li>
          <li>• <strong>ÚJ:</strong> Gyakorold a kiejtést mikrofonnal valós időben! 🎤</li>
          <li>• Teljesítsd mind a kártyát csillagokért és jelvényekért!</li>
        </ul>
      </div>

      {/* Cancel Button */}
      <button
        onClick={onCancel}
        className="
          px-6 py-3 rounded-lg
          bg-gray-600 dark:bg-gray-700
          hover:bg-gray-700 dark:hover:bg-gray-600
          text-white font-medium
          transition-all duration-200
        "
      >
        Mégse
      </button>
    </div>
  );
};

export default PracticeSettings;
