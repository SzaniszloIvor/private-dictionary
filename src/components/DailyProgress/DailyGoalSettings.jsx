// src/components/DailyProgress/DailyGoalSettings.jsx
import React, { useState, useEffect } from 'react';
import { useDailyProgress } from '../../hooks/useDailyProgress';

const DailyGoalSettings = ({ isOpen, onClose }) => {
  const { dailyGoal, updateDailyGoal } = useDailyProgress();
  const [selectedGoal, setSelectedGoal] = useState(dailyGoal);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setSelectedGoal(dailyGoal);
  }, [dailyGoal, isOpen]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDailyGoal(selectedGoal);
      
      // Show success message
      setTimeout(() => {
        setSaving(false);
        onClose();
      }, 500);
    } catch (error) {
      console.error('Error saving goal:', error);
      setSaving(false);
    }
  };

  const goalPresets = [5, 10, 15, 20, 30, 50];

  return (
    <div
      onClick={onClose}
      className="
        fixed inset-0 z-[1002]
        bg-black/70 dark:bg-black/85
        flex items-center justify-center
        p-4 animate-fade-in
      "
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          bg-white dark:bg-gray-800
          rounded-2xl shadow-2xl
          w-full max-w-md
          animate-slide-in-up
        "
      >
        {/* Header */}
        <div className="
          bg-gradient-to-r from-blue-500 to-cyan-400
          dark:from-blue-600 dark:to-cyan-500
          text-white p-6 rounded-t-2xl
          relative
        ">
          <button
            onClick={onClose}
            className="
              absolute top-4 right-4
              text-white text-3xl font-bold
              hover:scale-110 transition-transform
              leading-none
            "
          >
            ×
          </button>
          
          <h2 className="text-2xl font-bold text-center">
            🎯 Napi Cél Beállítása
          </h2>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Current Goal Display */}
          <div className="text-center mb-6">
            <div className="text-6xl font-bold mb-2">
              <span className="bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {selectedGoal}
              </span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              szó / nap
            </div>
          </div>

          {/* Slider */}
          <div className="mb-6">
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={selectedGoal}
              onChange={(e) => setSelectedGoal(parseInt(e.target.value))}
              className="
                w-full h-2 rounded-lg appearance-none cursor-pointer
                bg-gray-200 dark:bg-gray-700
                accent-blue-500
              "
              style={{
                background: `linear-gradient(to right, 
                  #3b82f6 0%, 
                  #3b82f6 ${((selectedGoal - 5) / 45) * 100}%, 
                  #e5e7eb ${((selectedGoal - 5) / 45) * 100}%, 
                  #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>5</span>
              <span>50</span>
            </div>
          </div>

          {/* Quick Presets */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Gyors választás:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {goalPresets.map((preset) => (
                <button
                  key={preset}
                  onClick={() => setSelectedGoal(preset)}
                  className={`
                    px-4 py-3 rounded-lg font-medium
                    border-2 transition-all duration-200
                    ${selectedGoal === preset
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-400'}
                  `}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Info Box */}
          <div className="
            bg-blue-50 dark:bg-blue-900/20
            border border-blue-200 dark:border-blue-800
            rounded-lg p-4 mb-6
            text-sm text-blue-800 dark:text-blue-300
          ">
            <div className="font-bold mb-2">💡 Mi számít a célba?</div>
            <ul className="space-y-1 text-xs">
              <li>• Egyedi szavak gyakorlása során</li>
              <li>• Flashcard módban megtekintett szavak</li>
              <li>• Kiejtésgyakorlásban gyakorolt szavak</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`
                flex-1 px-6 py-3 rounded-lg font-bold
                text-white
                transition-all duration-200
                ${saving
                  ? 'bg-gray-400 cursor-wait'
                  : 'bg-green-500 hover:bg-green-600 hover:shadow-lg hover:scale-105'}
              `}
            >
              {saving ? '💾 Mentés...' : '✓ Mentés'}
            </button>
            
            <button
              onClick={onClose}
              disabled={saving}
              className="
                flex-1 px-6 py-3 rounded-lg font-bold
                bg-gray-500 hover:bg-gray-600
                text-white
                transition-all duration-200
                hover:shadow-lg hover:scale-105
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Mégse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyGoalSettings;
