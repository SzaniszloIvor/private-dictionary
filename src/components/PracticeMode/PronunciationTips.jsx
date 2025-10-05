// src/components/PracticeMode/PronunciationTips.jsx
import React, { useState } from 'react';
import { getAdvancedPronunciationTip } from '../../utils/pronunciationHelper';

const PronunciationTips = ({ spoken, target, score }) => {
  const [expandedTip, setExpandedTip] = useState(null);
  const tipData = getAdvancedPronunciationTip(spoken, target, score);

  if (!tipData || tipData.tips.length === 0) return null;

  const typeColors = {
    success: 'from-green-500 to-emerald-500',
    improvement: 'from-blue-500 to-indigo-500',
    general: 'from-purple-500 to-pink-500'
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-4 space-y-3">
      {/* Header Card */}
      <div className={`
        p-4 rounded-xl
        bg-gradient-to-br ${typeColors[tipData.type]}
        text-white
      `}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{tipData.icon}</span>
          <h3 className="text-lg font-bold">{tipData.title}</h3>
        </div>
        <p className="text-white/90">{tipData.message}</p>
      </div>

      {/* Individual Tips */}
      {tipData.tips.map((tip, index) => (
        <div
          key={index}
          className="
            bg-white dark:bg-gray-800
            rounded-lg border-2 border-gray-200 dark:border-gray-700
            overflow-hidden
            transition-all duration-300
          "
        >
          {/* Tip Header (Clickable) */}
          <button
            onClick={() => setExpandedTip(expandedTip === index ? null : index)}
            className="
              w-full p-4 text-left
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-colors duration-200
              flex items-center justify-between
            "
          >
            <div className="flex items-center gap-3 flex-1">
              <span className="
                text-2xl w-10 h-10 rounded-full
                bg-blue-100 dark:bg-blue-900
                flex items-center justify-center
                flex-shrink-0
              ">
                🎯
              </span>
              <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">
                  {tip.sound} hang
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {tip.problem}
                </p>
              </div>
            </div>
            <span className="text-2xl text-gray-400">
              {expandedTip === index ? '▼' : '▶'}
            </span>
          </button>

          {/* Expanded Content */}
          {expandedTip === index && (
            <div className="
              px-4 pb-4 space-y-4
              border-t border-gray-200 dark:border-gray-700
              animate-slide-in-up
            ">
              {/* Solution */}
              <div className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <h5 className="font-bold text-gray-800 dark:text-gray-200">
                    Megoldás
                  </h5>
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  {tip.solution}
                </p>
              </div>

              {/* Demo */}
              <div className="
                p-3 rounded-lg
                bg-indigo-50 dark:bg-indigo-900/20
                border border-indigo-200 dark:border-indigo-800
              ">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">🎬</span>
                  <h5 className="font-bold text-indigo-800 dark:text-indigo-300 text-sm">
                    Vizuális segítség
                  </h5>
                </div>
                <p className="text-indigo-700 dark:text-indigo-200 text-sm font-mono">
                  {tip.demo}
                </p>
              </div>

              {/* Examples */}
              <div className="
                p-3 rounded-lg
                bg-green-50 dark:bg-green-900/20
                border border-green-200 dark:border-green-800
              ">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">📝</span>
                  <h5 className="font-bold text-green-800 dark:text-green-300 text-sm">
                    Példa szavak
                  </h5>
                </div>
                <p className="text-green-700 dark:text-green-200 text-sm">
                  {tip.example}
                </p>
              </div>

              {/* Practice Button */}
              <button className="
                w-full py-2 rounded-lg
                bg-gradient-to-r from-blue-500 to-indigo-500
                hover:from-blue-600 hover:to-indigo-600
                text-white font-medium text-sm
                transition-all duration-200
                hover:scale-105 active:scale-95
              ">
                🔊 Hallgasd meg újra
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PronunciationTips;
