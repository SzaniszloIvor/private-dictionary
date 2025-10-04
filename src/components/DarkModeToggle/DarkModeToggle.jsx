// src/components/DarkModeToggle/DarkModeToggle.jsx
import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode, isMobile = false }) => {
  if (isMobile) {
    // Mobile: Compact button for menu bar
    return (
      <button
        onClick={toggleDarkMode}
        className="w-9 h-9 rounded-full 
                   bg-gradient-to-br from-yellow-400 to-yellow-500
                   dark:from-slate-700 dark:to-slate-800
                   text-white text-xl
                   flex items-center justify-center
                   hover:scale-110 active:scale-95
                   transition-transform duration-200
                   shadow-md"
        title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {darkMode ? '🌙' : '☀️'}
      </button>
    );
  }

  // Desktop: Floating Action Button (FAB)
  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-20 right-5 w-12 h-12 rounded-full 
                 bg-gradient-to-br from-yellow-400 to-yellow-500
                 dark:from-slate-700 dark:to-slate-800
                 text-white text-2xl
                 shadow-lg hover:shadow-xl
                 transform hover:scale-110 hover:rotate-12
                 transition-all duration-300
                 flex items-center justify-center
                 z-[998]
                 animate-fade-in"
      title={darkMode ? 'Váltás világos módra (Ctrl/⌘+D)' : 'Váltás sötét módra (Ctrl/⌘+D)'}
      aria-label={darkMode ? 'Váltás világos módra' : 'Váltás sötét módra'}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
};

export default DarkModeToggle;
