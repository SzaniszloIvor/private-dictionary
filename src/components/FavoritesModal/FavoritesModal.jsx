import React, { useState, useMemo } from 'react';
import { X, Star, BookOpen, Search, Trash2 } from 'lucide-react';

/**
 * Modal showing all favorite words
 * Allows filtering, removing, and navigating to favorites
 * 
 * @param {boolean} isOpen - Modal open state
 * @param {Function} onClose - Close handler
 * @param {Array} favorites - Array of favorite words
 * @param {Function} onToggleFavorite - Toggle favorite handler
 * @param {Function} onNavigateToWord - Navigate to word handler
 */
const FavoritesModal = ({ 
  isOpen, 
  onClose, 
  favorites = [], 
  onToggleFavorite,
  onNavigateToWord
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLesson, setSelectedLesson] = useState('all');
  
  // Get unique lessons
  const lessons = useMemo(() => {
    const uniqueLessons = new Map();
    favorites.forEach(fav => {
      if (!uniqueLessons.has(fav.lessonId)) {
        uniqueLessons.set(fav.lessonId, {
          id: fav.lessonId,
          title: fav.lessonTitle
        });
      }
    });
    return Array.from(uniqueLessons.values());
  }, [favorites]);
  
  // Filter favorites
  const filteredFavorites = useMemo(() => {
    return favorites.filter(word => {
      const matchesSearch = 
        word.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.hungarian.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLesson = selectedLesson === 'all' || word.lessonId === selectedLesson;
      return matchesSearch && matchesLesson;
    });
  }, [favorites, searchQuery, selectedLesson]);
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-400 dark:bg-yellow-500 p-2 rounded-lg">
                <Star className="w-6 h-6 fill-white text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Kedvenc szavak
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {favorites.length} megjelölt szó
                </p>
              </div>
            </div>
            
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Keresés..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:border-blue-500 dark:focus:border-blue-400
                  focus:outline-none
                  transition-colors
                "
              />
            </div>
            
            {/* Lesson filter */}
            {lessons.length > 0 && (
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(e.target.value)}
                className="
                  px-4 py-2 rounded-lg
                  border-2 border-gray-300 dark:border-gray-600
                  bg-white dark:bg-gray-700
                  text-gray-900 dark:text-white
                  focus:border-blue-500 dark:focus:border-blue-400
                  focus:outline-none
                  transition-colors
                  cursor-pointer
                "
              >
                <option value="all">Összes lecke</option>
                {lessons.map(lesson => (
                  <option key={lesson.id} value={lesson.id}>
                    {lesson.title}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                {favorites.length === 0 
                  ? 'Még nincs kedvenc szavad. Jelölj meg szavakat a csillag ikonra kattintva!' 
                  : 'Nincs találat a szűrési feltételeknek megfelelően.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredFavorites.map((word) => (
                <div
                  key={`${word.lessonId}-${word.wordIndex}`}
                  className="
                    p-4 rounded-xl
                    border-2 border-gray-200 dark:border-gray-700
                    hover:border-yellow-400 dark:hover:border-yellow-500
                    transition-all
                    bg-white dark:bg-gray-700
                    group
                  "
                >
                  {/* Word content */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {word.english}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {word.hungarian}
                      </p>
                      {word.phonetic && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {word.phonetic}
                        </p>
                      )}
                    </div>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => onToggleFavorite(word.lessonId, word.wordIndex)}
                      className="
                        p-2 rounded-lg
                        hover:bg-gray-100 dark:hover:bg-gray-600
                        transition-colors
                        opacity-0 group-hover:opacity-100
                      "
                      title="Eltávolítás a kedvencekből"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                  
                  {/* Lesson info */}
                  <div className="
                    flex items-center justify-between
                    text-sm text-gray-500 dark:text-gray-400
                    pt-2 border-t border-gray-200 dark:border-gray-600
                  ">
                    <div className="flex items-center gap-2">
                      <BookOpen size={14} />
                      <span>{word.lessonTitle}</span>
                    </div>
                    <button
                      onClick={() => onNavigateToWord(word.lessonId, word.wordIndex)}
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Ugrás →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FavoritesModal;
