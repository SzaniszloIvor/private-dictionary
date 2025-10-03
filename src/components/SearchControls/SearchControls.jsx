// src/components/SearchControls/SearchControls.jsx - TAILWIND
import React, { useState, useEffect } from 'react';

const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filter, 
  setFilter,
  searchInputRef
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 
                    border-b border-gray-200 dark:border-slate-700
                    flex flex-col gap-3
                    transition-all duration-300">
        {/* Search Input */}
        <div className="relative w-full">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Keresés... (Ctrl/⌘+F)"
            className="w-full px-3 py-2 pr-10
                     bg-white dark:bg-slate-700
                     text-gray-900 dark:text-gray-100
                     border-2 border-gray-300 dark:border-slate-600
                     rounded-lg
                     focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500
                     focus:border-transparent
                     transition-all duration-200
                     text-base"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2 top-1/2 -translate-y-1/2
                       text-gray-500 dark:text-gray-400
                       hover:text-gray-700 dark:hover:text-gray-200
                       text-xl p-1
                       transition-colors duration-200"
              aria-label="Törlés"
            >
              ×
            </button>
          )}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 w-full">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm
                     border-2 transition-all duration-200
                     ${filter === 'all'
                       ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                       : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                     }`}
          >
            Mind
          </button>
          
          <button
            onClick={() => setFilter('english')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm
                     border-2 transition-all duration-200
                     ${filter === 'english'
                       ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                       : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                     }`}
          >
            🇬🇧 EN
          </button>
          
          <button
            onClick={() => setFilter('hungarian')}
            className={`flex-1 px-3 py-2 rounded-lg font-medium text-sm
                     border-2 transition-all duration-200
                     ${filter === 'hungarian'
                       ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                       : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                     }`}
          >
            🇭🇺 HU
          </button>
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="p-5 bg-white dark:bg-slate-800 
                  border-b border-gray-200 dark:border-slate-700
                  flex flex-wrap gap-4 items-center
                  transition-all duration-300">
      {/* Search Input */}
      <input
        ref={searchInputRef}
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Keresés angol vagy magyar szavak között... (Ctrl/⌘+F)"
        className="flex-1 min-w-[200px] px-4 py-3
                 bg-white dark:bg-slate-700
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-500 dark:placeholder-gray-400
                 border-2 border-gray-300 dark:border-slate-600
                 rounded-lg
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500
                 focus:border-transparent
                 transition-all duration-200
                 text-base"
      />
      
      {/* Filter Buttons */}
      <button
        onClick={() => setFilter('all')}
        className={`px-5 py-3 rounded-lg font-medium text-sm
                 border-2 transition-all duration-200
                 ${filter === 'all'
                   ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                   : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                 }`}
      >
        Összes
      </button>
      
      <button
        onClick={() => setFilter('english')}
        className={`px-5 py-3 rounded-lg font-medium text-sm
                 border-2 transition-all duration-200
                 ${filter === 'english'
                   ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                   : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                 }`}
      >
        Angol
      </button>
      
      <button
        onClick={() => setFilter('hungarian')}
        className={`px-5 py-3 rounded-lg font-medium text-sm
                 border-2 transition-all duration-200
                 ${filter === 'hungarian'
                   ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600'
                   : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
                 }`}
      >
        Magyar
      </button>
      
      <button
        onClick={() => setSearchTerm('')}
        className="px-5 py-3 rounded-lg font-medium text-sm
                 bg-white dark:bg-slate-700 
                 text-gray-700 dark:text-gray-300
                 border-2 border-gray-300 dark:border-slate-600
                 hover:border-red-400 dark:hover:border-red-500
                 hover:text-red-600 dark:hover:text-red-400
                 transition-all duration-200"
      >
        Törlés
      </button>
    </div>
  );
};

export default SearchControls;
