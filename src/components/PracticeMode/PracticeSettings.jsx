// src/components/PracticeMode/PracticeSettings.jsx
import React from 'react';

const PracticeSettings = ({ onStart, onCancel }) => {
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
    }
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onStart(mode.id)}
            className="
              group p-6 rounded-xl
              bg-white dark:bg-gray-800
              border-2 border-gray-200 dark:border-gray-700
              hover:border-transparent
              shadow-md hover:shadow-xl
              transform hover:scale-105
              transition-all duration-300
            "
          >
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
          <li>• Kövesd a haladásod az alsó pontokkal</li>
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
