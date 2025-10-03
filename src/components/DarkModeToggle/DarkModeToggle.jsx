import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
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
