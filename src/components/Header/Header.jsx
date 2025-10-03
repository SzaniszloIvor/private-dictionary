// src/components/Header/Header.jsx - TAILWIND
import React, { useState, useEffect } from 'react';

const Header = ({ isDemo }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-400 to-cyan-400 
                    dark:from-purple-600 dark:to-indigo-700
                    text-white p-8 text-center
                    transition-all duration-300">
      <h1 className="text-4xl md:text-5xl font-bold mb-2 
                     drop-shadow-lg
                     transition-all duration-300">
        🎧 {isMobile ? 'Angol Szótár' : 'Interaktív Angol Szótár'}
        {isDemo && (
          <span className="text-2xl md:text-3xl ml-3 md:ml-4 
                         opacity-90">
            {isMobile ? 'Demo' : '( Demo verzió )'}
          </span>
        )}
      </h1>
      <p className="text-base md:text-lg opacity-90">
        {isDemo 
          ? isMobile 
            ? 'Próbáld ki az első 2 órát!' 
            : 'Próbáld ki az első 2 órát ingyenesen!' 
          : isMobile 
            ? 'Hangos kiejtéssel!' 
            : 'Személyre szabott angol szótanulási program hangos kiejtéssel!'}
      </p>
    </div>
  );
};

export default Header;
