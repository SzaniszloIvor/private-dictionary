// src/components/SearchResults/SearchResults.jsx
import React from 'react';
import WordTable from '../WordTable/WordTable';

const SearchResults = ({ results, searchTerm }) => {
  if (results.length === 0) {
    return (
      <div className="
        text-center py-16 px-5
        text-gray-600 dark:text-gray-400
        animate-fade-in
      ">
        <div className="text-6xl mb-5">🔍</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-700 dark:text-gray-300">
          Nincs találat
        </h3>
        <p className="text-lg">
          Nem találtunk eredményt a "<strong className="text-gray-800 dark:text-gray-200">{searchTerm}</strong>" keresésre.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Search results header */}
      <div className="
        text-center mb-8 p-6 rounded-xl
        bg-gradient-to-r from-gray-50 to-gray-100
        dark:from-gray-800 dark:to-gray-900
      ">
        <div className="
          text-3xl font-bold mb-2
          text-gray-700 dark:text-gray-200
        ">
          🔍 Keresési eredmények
        </div>
        <div className="
          text-lg text-gray-600 dark:text-gray-400 mb-3
        ">
          "{searchTerm}" keresésre
        </div>
        <div className="inline-block">
          <span className="
            bg-blue-500 dark:bg-blue-600
            text-white font-bold
            px-4 py-2 rounded-full text-sm
          ">
            {results.length} találat
          </span>
        </div>
      </div>
      
      {/* Results table */}
      <WordTable words={results} lessonNumber={true} />
    </div>
  );
};

export default SearchResults;
