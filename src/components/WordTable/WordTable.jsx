// src/components/WordTable/WordTable.jsx
import React, { useState } from 'react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable row component for desktop
const SortableRow = ({ word, index, isDemo, speak, speechRate, deleteWord, handleDeleteWord }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `${word.english}-${index}`,
    disabled: false
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: !isDemo ? 'move' : 'default'
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`
        border-b border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors duration-200
        ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
      `}
    >
      <td className="px-4 py-4 font-bold text-gray-800 dark:text-gray-200 text-base">
        {word.english}
      </td>
      <td className="px-4 py-4 text-red-500 dark:text-red-400 italic">
        {word.phonetic}
      </td>
      <td className="px-4 py-4 text-green-600 dark:text-green-400 font-medium">
        {word.hungarian}
      </td>
      <td className="px-4 py-4 text-center">
        <div className="flex gap-2 justify-center">
          <button
            className="
              bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600
              text-white rounded-full w-8 h-8 
              hover:shadow-lg hover:scale-110
              transition-all duration-300
              flex items-center justify-center
            "
            onClick={(e) => {
              e.stopPropagation();
              speak(word.english);
            }}
            title={`Kiejtés (${speechRate}x)`}
          >
            🔊
          </button>
          {!isDemo && deleteWord && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWord(index);
              }}
              className="
                bg-red-500 dark:bg-red-600 text-white rounded-full w-8 h-8
                hover:bg-red-600 dark:hover:bg-red-700
                hover:shadow-lg hover:scale-110
                transition-all duration-300
                flex items-center justify-center
              "
              title="Törlés"
            >
              🗑️
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

// Sortable card component for mobile
const SortableCard = ({ word, index, isDemo, speak, speechRate, expandedRows, toggleExpanded, handleDeleteWord }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `${word.english}-${index}`,
    disabled: false
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: !isDemo ? 'grab' : 'default',
    ...(isDragging && {
      transform: 'scale(1.05)',
      zIndex: 999
    })
  };

  const isExpanded = expandedRows.has(index);

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes} 
      {...listeners}
      className={`
        rounded-lg mb-2 p-3 relative
        shadow-md hover:shadow-lg
        transition-all duration-300
        ${index % 2 === 0 
          ? 'bg-gray-50 dark:bg-gray-900' 
          : 'bg-white dark:bg-gray-800'}
        ${isDragging ? 'shadow-2xl border-2 border-indigo-500 dark:border-indigo-400' : ''}
      `}
    >
      {/* Drag handle visual indicator on mobile */}
      {!isDemo && (
        <div className="
          absolute left-1 top-1/2 -translate-y-1/2
          text-xl text-indigo-500 dark:text-indigo-400 opacity-50
        ">
          ⋮⋮
        </div>
      )}
      
      <div className={`flex justify-between items-start ${!isDemo ? 'pl-6' : ''}`}>
        <div className="flex-1">
          <div className="font-bold text-base text-gray-800 dark:text-gray-200 mb-1">
            {word.english}
          </div>
          <div className="text-red-500 dark:text-red-400 italic text-sm mb-1">
            {word.phonetic}
          </div>
          <div className="text-green-600 dark:text-green-400 text-sm font-medium">
            {word.hungarian}
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(word.english);
            }}
            className="
              bg-gradient-to-r from-blue-400 to-cyan-400 
              dark:from-blue-500 dark:to-cyan-500
              text-white rounded-full w-9 h-9
              flex items-center justify-center
              shadow-md hover:shadow-lg
              active:scale-95 transition-transform
            "
            title={`Kiejtés (${speechRate}x)`}
          >
            🔊
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(index);
            }}
            className={`
              bg-gradient-to-r from-indigo-500 to-purple-600
              dark:from-indigo-600 dark:to-purple-700
              text-white rounded-full w-9 h-9
              flex items-center justify-center
              shadow-md hover:shadow-lg
              transition-all duration-300
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
            title="Több opció"
          >
            ⋮
          </button>
        </div>
      </div>
      
      {/* Expanded options */}
      {isExpanded && (
        <div className="
          mt-3 pt-3 border-t border-gray-200 dark:border-gray-700
          flex gap-2 flex-wrap
          animate-fade-in
        ">
          {!isDemo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWord(index);
              }}
              className="
                flex-1 min-w-[100px] px-3 py-2
                bg-red-500 dark:bg-red-600 text-white
                rounded-md text-sm
                hover:bg-red-600 dark:hover:bg-red-700
                transition-colors duration-200
              "
            >
              🗑️ Törlés
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const WordTable = ({ words, lessonNumber = null, deleteWord = null, isDemo = false, onReorderWords = null }) => {
  const { speak, speechRate, updateSpeechRate } = useSpeechSynthesis();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [localWords, setLocalWords] = useState(words);
  
  React.useEffect(() => {
    setLocalWords(words);
  }, [words]);

  const items = localWords.map((word, index) => ({
    id: `${word.english}-${index}`,
    ...word,
    originalIndex: index
  }));

  // Separate sensors for desktop and mobile
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDeleteWord = (index) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a szót?')) {
      deleteWord(lessonNumber, index);
    }
  };

  const toggleExpanded = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    
    // Haptic feedback on mobile (if supported)
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active && over && active.id !== over.id) {
      const oldIndex = localWords.findIndex((word, index) => 
        `${word.english}-${index}` === active.id
      );
      const newIndex = localWords.findIndex((word, index) => 
        `${word.english}-${index}` === over.id
      );
      
      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(localWords, oldIndex, newIndex);
        
        setLocalWords(newOrder);
        
        if (onReorderWords && lessonNumber) {
          onReorderWords(lessonNumber, newOrder);
        }
        
        // Haptic feedback for successful move
        if (navigator.vibrate) {
          navigator.vibrate([30, 50, 30]);
        }
      }
    }
    
    setActiveId(null);
  };

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile view
  if (isMobile) {
    return (
      <>
        {/* Speed control bar for mobile */}
        <div className="
          bg-gradient-to-r from-gray-50 to-gray-100 
          dark:from-gray-800 dark:to-gray-900
          p-3 mb-2 shadow-sm sticky top-0 z-50
        ">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <span className="font-bold text-xs text-gray-700 dark:text-gray-300">
                🔊 Sebesség: {speechRate}x
              </span>
              <button
                onClick={() => updateSpeechRate(0.7)}
                className="
                  bg-gray-600 dark:bg-gray-700 text-white
                  rounded px-2 py-1 text-xs
                  hover:bg-gray-700 dark:hover:bg-gray-600
                  transition-colors duration-200
                "
              >
                Alapért.
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Lassú</span>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.1"
                value={speechRate}
                onChange={(e) => updateSpeechRate(parseFloat(e.target.value))}
                className="flex-1 cursor-pointer accent-indigo-500 dark:accent-indigo-400"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Gyors</span>
            </div>
          </div>
        </div>

        {/* Usage hint for mobile drag & drop */}
        {!isDemo && localWords.length > 1 && (
          <div className="
            bg-blue-50 dark:bg-blue-900/30 
            border border-blue-300 dark:border-blue-700
            rounded-lg p-2 mx-2 mb-2
            text-xs text-gray-700 dark:text-gray-300
            flex items-center gap-2
            animate-fade-in
          ">
            <span className="text-lg">👆</span>
            <span>
              <strong>Tipp:</strong> Tartsd nyomva egy kártyát, majd húzd az új pozícióba!
            </span>
          </div>
        )}

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="p-2">
            <SortableContext
              items={items.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              {localWords.map((word, index) => (
                <SortableCard
                  key={`${word.english}-${index}`}
                  word={word}
                  index={index}
                  isDemo={isDemo}
                  speak={speak}
                  speechRate={speechRate}
                  expandedRows={expandedRows}
                  toggleExpanded={toggleExpanded}
                  handleDeleteWord={handleDeleteWord}
                />
              ))}
            </SortableContext>
          </div>
          
          {/* DragOverlay for better visual feedback on mobile */}
          <DragOverlay>
            {activeId ? (
              <div className="
                bg-white dark:bg-gray-800 rounded-lg p-3
                shadow-2xl opacity-90 rotate-3 scale-105
                border-2 border-indigo-500 dark:border-indigo-400
              ">
                {localWords.find((_, idx) => `${localWords[idx].english}-${idx}` === activeId)?.english}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </>
    );
  }

  // Desktop view
  return (
    <>
      {/* Speed control bar for desktop */}
      <div className="
        bg-gradient-to-r from-gray-50 to-gray-100 
        dark:from-gray-800 dark:to-gray-900
        p-4 rounded-lg mb-4 shadow-sm
      ">
        <div className="flex items-center gap-5 flex-wrap">
          <div className="font-bold text-sm text-gray-700 dark:text-gray-300 min-w-[120px]">
            🔊 Kiejtés sebesség:
          </div>
          <div className="flex-1 min-w-[200px] max-w-[400px]">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600 dark:text-gray-400">Lassú</span>
              <input
                type="range"
                min="0.3"
                max="1.2"
                step="0.1"
                value={speechRate}
                onChange={(e) => updateSpeechRate(parseFloat(e.target.value))}
                className="flex-1 cursor-pointer accent-indigo-500 dark:accent-indigo-400"
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">Gyors</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="
              bg-blue-500 dark:bg-blue-600 text-white
              px-3 py-1 rounded-full text-sm font-bold
            ">
              {speechRate}x
            </span>
            <button
              onClick={() => updateSpeechRate(0.7)}
              className="
                bg-gray-600 dark:bg-gray-700 text-white
                rounded px-2 py-1 text-xs
                hover:bg-gray-700 dark:hover:bg-gray-600
                transition-colors duration-200
              "
            >
              Alapértelmezett
            </button>
          </div>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="
            w-full rounded-lg overflow-hidden
            shadow-lg
          ">
            <thead>
              <tr className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                <th className="px-4 py-4 text-left text-lg font-bold">Angol szó</th>
                <th className="px-4 py-4 text-left text-lg font-bold">Fonetika</th>
                <th className="px-4 py-4 text-left text-lg font-bold">Magyar jelentés</th>
                <th className="px-4 py-4 text-center text-lg font-bold w-[120px]">
                  Műveletek
                </th>
              </tr>
            </thead>
            <tbody>
              <SortableContext
                items={items.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                {localWords.map((word, index) => (
                  <SortableRow
                    key={`${word.english}-${index}`}
                    word={word}
                    index={index}
                    isDemo={isDemo}
                    speak={speak}
                    speechRate={speechRate}
                    deleteWord={deleteWord}
                    handleDeleteWord={handleDeleteWord}
                  />
                ))}
              </SortableContext>
            </tbody>
          </table>
        </div>
      </DndContext>
    </>
  );
};

export default WordTable;
