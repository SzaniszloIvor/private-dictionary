// src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx
import React from 'react';
import { getShortcutDisplay } from '../../hooks/useKeyboardShortcuts';

const KeyboardShortcutsHelper = ({ isOpen, onOpen, onClose }) => {
  const shortcuts = [
    { combo: 'mod+e', description: 'Új szó hozzáadása', icon: '➕' },
    { combo: 'mod+f', description: 'Keresés fókuszálása', icon: '🔍' },
    { combo: 'mod+s', description: 'Mentési állapot megjelenítése', icon: '💾' },
    { combo: 'mod+d', description: 'Sötét mód kapcsolása', icon: '🌙' },
    { combo: 'mod+k', description: 'Billentyűparancsok megjelenítése', icon: '⌨️' },
    { combo: 'mod+arrowright', description: 'Következő óra', icon: '➡️' },
    { combo: 'mod+arrowleft', description: 'Előző óra', icon: '⬅️' },
    { combo: 'mod+home', description: 'Első óra', icon: '⏮️' },
    { combo: 'mod+end', description: 'Utolsó óra', icon: '⏭️' },
    { combo: 'escape', description: 'Modal bezárása', icon: '❌' }
  ];

  return (
    <>
      {/* Floating Action Button - DESKTOP ONLY */}
      <button
        onClick={onOpen}
        className="
          hidden md:flex
          fixed bottom-5 right-5 z-[999]
          w-12 h-12 rounded-full
          bg-gradient-to-r from-indigo-500 to-purple-600
          dark:from-indigo-600 dark:to-purple-700
          text-white text-2xl
          items-center justify-center
          shadow-lg hover:shadow-xl
          hover:scale-110 active:scale-95
          transition-all duration-300
        "
        title="Billentyűparancsok (Ctrl/⌘+K)"
      >
        ⌨️
      </button>

      {/* Modal Overlay - AVAILABLE ON BOTH MOBILE & DESKTOP */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="
            fixed inset-0 z-[1001]
            bg-black/70 dark:bg-black/85
            flex items-center justify-center
            p-5 animate-fade-in
          "
        >
          {/* Modal Content */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white dark:bg-gray-800
              rounded-2xl shadow-2xl
              p-8 max-w-lg w-full
              max-h-[80vh] overflow-y-auto
              animate-slide-in-up
            "
          >
            {/* Header */}
            <div className="
              flex justify-between items-center
              mb-6 pb-4
              border-b-2 border-gray-200 dark:border-gray-700
            ">
              <div className="
                text-2xl font-bold
                text-gray-800 dark:text-gray-100
                flex items-center gap-3
              ">
                ⌨️ Billentyűparancsok
              </div>
              <button
                onClick={onClose}
                className="
                  text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-gray-100
                  text-3xl font-bold
                  w-8 h-8 flex items-center justify-center
                  hover:scale-110 active:scale-95
                  transition-transform duration-200
                "
                title="Bezárás (ESC)"
              >
                ×
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="flex flex-col gap-3">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="
                    flex justify-between items-center
                    p-3 rounded-lg
                    bg-gray-50 dark:bg-gray-700/50
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    hover:translate-x-1
                    transition-all duration-200
                    group
                  "
                >
                  {/* Left side: Icon + Description */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">
                      {shortcut.icon}
                    </span>
                    <span className="
                      text-gray-800 dark:text-gray-200
                      text-sm font-medium
                      truncate
                    ">
                      {shortcut.description}
                    </span>
                  </div>

                  {/* Right side: Key combinations */}
                  <div className="flex gap-1 items-center flex-shrink-0 ml-2">
                    {getShortcutDisplay(shortcut.combo).split('+').map((key, i, arr) => (
                      <React.Fragment key={i}>
                        <kbd className="
                          bg-white dark:bg-gray-900
                          text-indigo-600 dark:text-indigo-400
                          border-2 border-indigo-600 dark:border-indigo-400
                          px-2.5 py-1 rounded
                          text-xs font-bold
                          min-w-[32px] text-center
                          shadow-sm
                          group-hover:shadow-md
                          transition-shadow duration-200
                        ">
                          {key}
                        </kbd>
                        {i < arr.length - 1 && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="
              mt-6 p-4 rounded-lg
              bg-gradient-to-r from-green-50 to-emerald-50
              dark:from-green-900/20 dark:to-emerald-900/20
              border border-green-200 dark:border-green-800
              text-sm
              text-green-800 dark:text-green-300
            ">
              💡 <strong>Tipp:</strong> Nyomd meg a{' '}
              <kbd className="
                bg-white dark:bg-gray-800
                text-green-700 dark:text-green-400
                border border-green-600 dark:border-green-500
                px-2 py-0.5 rounded text-xs font-bold
              ">
                {getShortcutDisplay('mod+k')}
              </kbd>{' '}
              kombinációt bármikor a billentyűparancsok megjelenítéséhez!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelper;
