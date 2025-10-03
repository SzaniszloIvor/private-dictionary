// src/components/LessonNavigation/LessonNavigation.jsx - TAILWIND VERZIÓ
import React, { useState, useEffect } from 'react';

const LessonNavigation = ({ 
  dictionary, 
  currentLesson, 
  setCurrentLesson, 
  isDemo, 
  getNextLessonNumber,
  canAddLesson,
  demoLimits 
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getLessonsToShow = () => {
    const existingLessons = Object.keys(dictionary)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);
    
    return existingLessons;
  };

  const lessonsToShow = getLessonsToShow();
  const nextLessonNumber = canAddLesson() ? getNextLessonNumber() : null;

  return (
    <div className="flex flex-wrap gap-2 p-4 
                   bg-gray-50 dark:bg-slate-800 
                   max-h-[300px] overflow-y-auto
                   border-b-2 border-gray-200 dark:border-slate-700
                   transition-all duration-300">
      {/* Existing Lessons */}
      {lessonsToShow.map(lessonNum => {
        const hasContent = dictionary[lessonNum];
        const isActive = lessonNum === currentLesson;
        
        return (
          <button
            key={lessonNum}
            onClick={() => setCurrentLesson(lessonNum)}
            title={hasContent ? dictionary[lessonNum].title : 'Nincs még tartalom'}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm
              min-w-[70px] md:min-w-[80px]
              border-2 transition-all duration-200
              ${isActive
                ? 'bg-blue-500 dark:bg-purple-600 text-white border-blue-500 dark:border-purple-600 shadow-md'
                : hasContent
                  ? 'bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600 hover:shadow-md'
                  : 'bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-slate-600 hover:border-blue-400 dark:hover:border-purple-500'
              }
            `}
          >
            <div>{lessonNum}. óra</div>
            {hasContent && !isMobile && (
              <div className="text-xs mt-1 opacity-90">
                {dictionary[lessonNum].words.length} szó
              </div>
            )}
          </button>
        );
      })}
      
      {/* New Lesson Button */}
      {nextLessonNumber && (
        <button
          onClick={() => setCurrentLesson(nextLessonNumber)}
          title="Új óra létrehozása"
          className="px-4 py-2 rounded-lg font-medium text-sm
                   min-w-[70px] md:min-w-[80px]
                   bg-gradient-to-br from-green-400 to-green-500
                   dark:from-green-600 dark:to-green-700
                   text-white
                   border-2 border-dashed border-green-500 dark:border-green-600
                   opacity-90 hover:opacity-100
                   hover:shadow-md
                   transition-all duration-200"
        >
          <div className="text-lg md:text-xl leading-none">+</div>
          {!isMobile && (
            <div className="text-xs mt-1">Új óra</div>
          )}
        </button>
      )}
      
      {/* Demo Limit Warning */}
      {isDemo && !canAddLesson() && (
        <div className={`
          px-3 py-2 rounded-lg text-sm
          bg-yellow-50 dark:bg-yellow-900/20
          border-2 border-yellow-400 dark:border-yellow-600
          text-yellow-800 dark:text-yellow-300
          flex items-center
          ${isMobile ? 'w-full' : 'w-auto'}
        `}>
          ⚠️ {isMobile 
            ? `Max ${demoLimits.maxLessons} óra` 
            : `Demo limit: Max ${demoLimits.maxLessons} óra`}
        </div>
      )}
    </div>
  );
};

export default LessonNavigation;
