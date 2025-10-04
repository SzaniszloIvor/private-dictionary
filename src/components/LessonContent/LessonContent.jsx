// src/components/LessonContent/LessonContent.jsx
import React, { useState } from 'react';
import WordTable from '../WordTable/WordTable';
import PracticeModeModal from '../PracticeMode/PracticeModeModal';

const LessonContent = ({ 
  lesson, 
  lessonNumber, 
  isDemo, 
  deleteLesson, 
  renameLesson, 
  deleteWord, 
  reorderWords 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(lesson?.title || '');
  const [showPracticeModal, setShowPracticeModal] = useState(false);

  const handleRename = () => {
    if (newTitle.trim() && newTitle !== lesson.title) {
      renameLesson(lessonNumber, newTitle.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteLesson(lessonNumber);
  };

  const handleReorderWords = (lessonNum, newWordOrder) => {
    if (reorderWords) {
      reorderWords(lessonNum, newWordOrder);
    }
  };

  if (!lesson) {
    return (
      <div className="text-center p-16 text-gray-600 dark:text-gray-400">
        <div className="text-6xl mb-5">📚</div>
        <h3 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">
          {lessonNumber}. óra
        </h3>
        
        {isDemo ? (
          <>
            <p className="text-base mb-4">
              Ez a lecke még nem elérhető demo módban!
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Demo módban maximum 2 óra érhető el, óránként maximum 20 szóval.
            </p>
          </>
        ) : (
          <>
            <p className="text-base mb-4">Ez az óra még üres!</p>
            <p className="text-gray-700 dark:text-gray-300 mb-8">
              Kattints a "Szavak hozzáadása" gombra és kezd el feltölteni ezt az órát.
            </p>
            
            <div className="max-w-2xl mx-auto mt-8 p-6
                          bg-gradient-to-br from-green-50 to-emerald-50
                          dark:from-green-900/20 dark:to-emerald-900/20
                          border-2 border-dashed border-green-500 dark:border-green-600
                          rounded-xl">
              <h4 className="text-green-800 dark:text-green-300 font-bold mb-3 text-lg">
                💡 Tipp az óra elkezdéséhez:
              </h4>
              <ul className="text-left text-green-700 dark:text-green-400 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-500 flex-shrink-0">✅</span>
                  <span>Adj egy témát az órának (pl. "Család", "Munka", "Utazás")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-500 flex-shrink-0">✅</span>
                  <span>Kezdj 10-15 szóval, később bővítheted</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-500 flex-shrink-0">✅</span>
                  <span>Használd az API-t pontos fonetikához</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 dark:text-green-500 flex-shrink-0">✅</span>
                  <span>Csoportosítsd a kapcsolódó szavakat egy órába</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Lesson Header */}
      <div className="text-center mb-8 p-5
                    bg-gradient-to-br from-gray-50 to-gray-100
                    dark:from-slate-800 dark:to-slate-700
                    rounded-xl
                    transition-all duration-300">
        <div className="flex justify-between items-center mb-3">
          <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            {lessonNumber}. óra
          </div>
          
          <div className="flex gap-2">
            {/* Practice Button */}
            {lesson.words.length > 0 && (
              <button
                onClick={() => setShowPracticeModal(true)}
                className="px-4 py-2 rounded-lg font-medium text-sm
                         bg-gradient-to-r from-green-500 to-emerald-500
                         dark:from-green-600 dark:to-emerald-600
                         hover:from-green-600 hover:to-emerald-600
                         dark:hover:from-green-700 dark:hover:to-emerald-700
                         text-white
                         transition-all duration-200
                         shadow-md hover:shadow-lg
                         flex items-center gap-2"
                title="Gyakorlás flashcard módban"
              >
                <span>🎯</span>
                <span>Gyakorlás</span>
              </button>
            )}
            
            {/* Rename Button */}
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 rounded-lg font-medium text-sm
                       bg-yellow-400 hover:bg-yellow-500
                       dark:bg-yellow-500 dark:hover:bg-yellow-600
                       text-white
                       transition-all duration-200
                       shadow-md hover:shadow-lg"
              title="Óra átnevezése"
            >
              ✏️ Átnevezés
            </button>
            
            {/* Delete Button */}
            {lesson.words.length === 0 && (
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg font-medium text-sm
                         bg-red-500 hover:bg-red-600
                         dark:bg-red-600 dark:hover:bg-red-700
                         text-white
                         transition-all duration-200
                         shadow-md hover:shadow-lg"
                title="Óra törlése"
              >
                🗑️ Törlés
              </button>
            )}
          </div>
        </div>
        
        {/* Edit Mode */}
        {isEditing ? (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleRename()}
              autoFocus
              className="flex-1 px-3 py-2 text-base
                       bg-white dark:bg-slate-700
                       text-gray-900 dark:text-gray-100
                       border-2 border-yellow-400 dark:border-yellow-500
                       rounded-lg
                       focus:ring-2 focus:ring-yellow-500
                       transition-all duration-200"
            />
            <button
              onClick={handleRename}
              className="px-4 py-2 rounded-lg font-medium
                       bg-green-500 hover:bg-green-600 text-white
                       transition-all duration-200"
            >
              ✓ Mentés
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewTitle(lesson.title);
              }}
              className="px-4 py-2 rounded-lg font-medium
                       bg-gray-500 hover:bg-gray-600 text-white
                       transition-all duration-200"
            >
              ✗ Mégse
            </button>
          </div>
        ) : (
          <div className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {lesson.title}
          </div>
        )}
        
        {/* Word Count Badge */}
        <div className="inline-block bg-blue-500 dark:bg-purple-600 
                      text-white px-4 py-1 rounded-full text-sm">
          {lesson.words.length} szó
          {isDemo && ` / 20 max`}
        </div>
        
        {/* Demo Warning */}
        {isDemo && lesson.words.length === 0 && (
          <div className="mt-4 p-3 
                        bg-yellow-50 dark:bg-yellow-900/20 
                        border border-yellow-400 dark:border-yellow-600
                        rounded-lg text-sm
                        text-yellow-800 dark:text-yellow-300">
            ⚠️ Demo mód: Maximum 20 szó adható hozzá ehhez az órához
          </div>
        )}
      </div>
      
      {/* Word Table or Empty State */}
      {lesson.words.length > 0 ? (
        <WordTable 
          words={lesson.words} 
          lessonNumber={lessonNumber}
          deleteWord={deleteWord}
          isDemo={false}
          onReorderWords={handleReorderWords}
        />
      ) : (
        <div className="text-center p-16 
                      bg-gray-50 dark:bg-slate-800 
                      rounded-xl
                      transition-all duration-300">
          <div className="text-5xl mb-5">📝</div>
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Még nincsenek szavak ebben az órában
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Használd a "Szavak hozzáadása" gombot az első szavak felvételéhez!
          </p>
        </div>
      )}
      
      {/* Practice Mode Modal */}
      {lesson && lesson.words.length > 0 && (
        <PracticeModeModal
          isOpen={showPracticeModal}
          onClose={() => setShowPracticeModal(false)}
          words={lesson.words}
          lessonTitle={lesson.title}
        />
      )}
    </div>
  );
};

export default LessonContent;
