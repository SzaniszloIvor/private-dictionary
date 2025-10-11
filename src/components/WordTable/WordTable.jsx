// src/components/WordTable/WordTable.jsx - JAVÍTOTT VERZIÓ
import React, { useState } from 'react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { generatePhonetic } from '../../utils/phoneticHelper';
import FavoriteButton from '../FavoriteButton/FavoriteButton';
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

// ============================================
// DESKTOP: Sortable ROW component
// ============================================
const SortableRow = ({ 
  word, 
  index, 
  isDemo, 
  speak, 
  speechRate, 
  deleteWord, 
  handleDeleteWord,
  isEditing,
  editForm,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  isGeneratingPhonetic,
  onGeneratePhonetic,
  lessonNumber,
  isFavorited,
  handleToggleFavorite
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `${word.english}-${index}`,
    disabled: isDemo || isEditing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleButtonInteraction = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  // EDIT MODE
  if (isEditing) {
    return (
      <tr className="border-b border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20">
        <td className="px-2 py-4 text-center">
          {/* Empty cell for favorite column in edit mode */}
        </td>
        <td className="px-4 py-4">
          <input
            type="text"
            value={editForm.english}
            onChange={(e) => onEditChange('english', e.target.value)}
            className="
              w-full px-3 py-2 rounded
              border-2 border-blue-500 dark:border-blue-400
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              focus:outline-none
            "
          />
        </td>
        <td className="px-4 py-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={editForm.phonetic}
              onChange={(e) => onEditChange('phonetic', e.target.value)}
              className="
                flex-1 px-3 py-2 rounded
                border-2 border-blue-500 dark:border-blue-400
                bg-white dark:bg-gray-700
                text-red-500 dark:text-red-400
                focus:outline-none
              "
            />
            <button
              onClick={onGeneratePhonetic}
              disabled={isGeneratingPhonetic || !editForm.english}
              className={`
                px-3 py-2 rounded text-sm font-medium
                text-white whitespace-nowrap
                transition-all duration-200
                ${isGeneratingPhonetic || !editForm.english
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:scale-105'}
              `}
              title="Fonetika lekérése a Dictionary API-ból"
            >
              {isGeneratingPhonetic ? '⏳' : '🪄 API'}
            </button>
          </div>
        </td>
        <td className="px-4 py-4">
          <input
            type="text"
            value={editForm.hungarian}
            onChange={(e) => onEditChange('hungarian', e.target.value)}
            className="
              w-full px-3 py-2 rounded
              border-2 border-blue-500 dark:border-blue-400
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              focus:outline-none
            "
          />
        </td>
        <td className="px-4 py-4 text-center">
          <div className="flex gap-2 justify-center">
            <button
              onClick={onSaveEdit}
              disabled={isGeneratingPhonetic}
              className="
                bg-green-500 hover:bg-green-600
                dark:bg-green-600 dark:hover:bg-green-700
                text-white rounded-full w-8 h-8
                transition-colors duration-200
                flex items-center justify-center
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Mentés"
            >
              ✓
            </button>
            <button
              onClick={onCancelEdit}
              disabled={isGeneratingPhonetic}
              className="
                bg-gray-500 hover:bg-gray-600
                dark:bg-gray-600 dark:hover:bg-gray-700
                text-white rounded-full w-8 h-8
                transition-colors duration-200
                flex items-center justify-center
                disabled:opacity-50 disabled:cursor-not-allowed
              "
              title="Mégse"
            >
              ✗
            </button>
          </div>
        </td>
      </tr>
    );
  }

  // NORMAL MODE - TABLE ROW
  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...(!isDemo && listeners)}
      className={`
        border-b border-gray-200 dark:border-gray-700
        hover:bg-gray-50 dark:hover:bg-gray-800
        transition-colors duration-200
        ${!isDemo ? 'cursor-grab active:cursor-grabbing' : ''}
        ${index % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900' : 'bg-white dark:bg-gray-800'}
      `}
    >
      {/* ✅ FAVORITE COLUMN - MINDIG LÁTHATÓ */}
      <td className="px-2 py-4 text-center w-12">
        {handleToggleFavorite && lessonNumber !== null && (
          <FavoriteButton
            isFavorite={isFavorited(lessonNumber.toString(), index)}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(lessonNumber.toString(), index);
            }}
            onTouchStart={(e) => e.stopPropagation()} 
            onTouchEnd={(e) => e.stopPropagation()} 
            className="pointer-events-auto" 
          />
        )}
      </td>
      
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
            onClick={(e) => {
              handleButtonInteraction(e);
              speak(word.english);
            }}
            className="
              bg-gradient-to-r from-red-400 to-red-500 dark:from-red-500 dark:to-red-600
              text-white rounded-full w-8 h-8 
              hover:shadow-lg hover:scale-110
              transition-all duration-300
              flex items-center justify-center
              pointer-events-auto
            "
            title={`Kiejtés (${speechRate}x)`}
          >
            🔊
          </button>
          {!isDemo && (
            <>
              <button
                onClick={(e) => {
                  handleButtonInteraction(e);
                  onStartEdit(index);
                }}
                className="
                  bg-blue-500 hover:bg-blue-600
                  dark:bg-blue-600 dark:hover:bg-blue-700
                  text-white rounded-full w-8 h-8
                  hover:shadow-lg hover:scale-110
                  transition-all duration-300
                  flex items-center justify-center
                  pointer-events-auto
                "
                title="Szerkesztés"
              >
                ✏️
              </button>
              <button
                onClick={(e) => {
                  handleButtonInteraction(e);
                  handleDeleteWord(index);
                }}
                className="
                  bg-red-500 dark:bg-red-600 text-white rounded-full w-8 h-8
                  hover:bg-red-600 dark:hover:bg-red-700
                  hover:shadow-lg hover:scale-110
                  transition-all duration-300
                  flex items-center justify-center
                  pointer-events-auto
                "
                title="Törlés"
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// ============================================
// MOBILE: Sortable CARD component
// ============================================
const SortableCard = ({ 
  word, 
  index, 
  isDemo, 
  speak, 
  speechRate, 
  expandedRows, 
  toggleExpanded, 
  handleDeleteWord,
  isEditing,
  editForm,
  onStartEdit,
  onSaveEdit,
  onCancelEdit,
  onEditChange,
  isGeneratingPhonetic,
  onGeneratePhonetic,
  lessonNumber,
  isFavorited,
  handleToggleFavorite
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ 
    id: `${word.english}-${index}`,
    disabled: isDemo || isEditing
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    ...(isDragging && {
      transform: 'scale(1.05)',
      zIndex: 999
    })
  };

  const isExpanded = expandedRows.has(index);

  const handleButtonInteraction = (e) => {
    e.stopPropagation();
  };

  // EDIT MODE
  if (isEditing) {
    return (
      <div className="
        rounded-lg mb-2 p-4
        bg-blue-50 dark:bg-blue-900/20
        border-2 border-blue-500 dark:border-blue-400
        space-y-3
      ">
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Angol szó:
          </label>
          <input
            type="text"
            value={editForm.english}
            onChange={(e) => onEditChange('english', e.target.value)}
            className="
              w-full px-3 py-2 rounded
              border-2 border-blue-500 dark:border-blue-400
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              focus:outline-none
            "
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Fonetika:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={editForm.phonetic}
              onChange={(e) => onEditChange('phonetic', e.target.value)}
              className="
                flex-1 px-3 py-2 rounded
                border-2 border-blue-500 dark:border-blue-400
                bg-white dark:bg-gray-700
                text-red-500 dark:text-red-400
                focus:outline-none
              "
            />
            <button
              onClick={onGeneratePhonetic}
              disabled={isGeneratingPhonetic || !editForm.english}
              className={`
                px-3 py-2 rounded text-sm font-medium
                text-white whitespace-nowrap
                transition-all duration-200
                ${isGeneratingPhonetic || !editForm.english
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg'}
              `}
              title="Fonetika lekérése a Dictionary API-ból"
            >
              {isGeneratingPhonetic ? '⏳' : '🪄 API'}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Magyar jelentés:
          </label>
          <input
            type="text"
            value={editForm.hungarian}
            onChange={(e) => onEditChange('hungarian', e.target.value)}
            className="
              w-full px-3 py-2 rounded
              border-2 border-blue-500 dark:border-blue-400
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              focus:outline-none
            "
          />
        </div>
        <div className="flex gap-2 justify-end">
          <button
            onClick={onSaveEdit}
            disabled={isGeneratingPhonetic}
            className="
              flex-1 px-4 py-2 rounded-lg
              bg-green-500 hover:bg-green-600
              dark:bg-green-600 dark:hover:bg-green-700
              text-white font-medium
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            ✓ Mentés
          </button>
          <button
            onClick={onCancelEdit}
            disabled={isGeneratingPhonetic}
            className="
              flex-1 px-4 py-2 rounded-lg
              bg-gray-500 hover:bg-gray-600
              dark:bg-gray-600 dark:hover:bg-gray-700
              text-white font-medium
              transition-colors duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            ✗ Mégse
          </button>
        </div>
      </div>
    );
  }

  // NORMAL MODE - CARD
  return (
    <div 
      ref={setNodeRef} 
      style={style}
      {...attributes}
      {...(!isDemo && listeners)}
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
      {/* FAVORITE BUTTON  */}
      {handleToggleFavorite && lessonNumber !== null && (
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-20">
          <FavoriteButton
            isFavorite={isFavorited(lessonNumber.toString(), index)}
            onClick={(e) => {
              e.stopPropagation();
              handleToggleFavorite(lessonNumber.toString(), index);
            }}
            onTouchStart={(e) => e.stopPropagation()} 
            onTouchEnd={(e) => e.stopPropagation()} 
            className="pointer-events-auto" 
            size="md"
          />
        </div>
      )}
      
      {/*DRAG HANDLE  */}
      {!isDemo && (
        <div className="
          absolute right-2 top-2
          text-xl text-indigo-500 dark:text-indigo-400
          pointer-events-none
          select-none
          opacity-50
        ">
          ⋮⋮
        </div>
      )}
      
      {/*CARD CONTENT */}
      <div className="flex justify-between items-start pl-12 pr-8">
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
          {/* SPEAK BUTTON */}
          <button
            onClick={(e) => {
              handleButtonInteraction(e);
              speak(word.english);
            }}
            className="
              bg-gradient-to-r from-blue-400 to-cyan-400 
              dark:from-blue-500 dark:to-cyan-500
              text-white rounded-full w-9 h-9
              flex items-center justify-center
              shadow-md hover:shadow-lg
              active:scale-95 transition-transform
              touch-auto pointer-events-auto
            "
            title={`Kiejtés (${speechRate}x)`}
          >
            🔊
          </button>
          
          {/* MORE OPTIONS BUTTON */}
          <button
            onClick={(e) => {
              handleButtonInteraction(e);
              toggleExpanded(index);
            }}
            className={`
              bg-gradient-to-r from-indigo-500 to-purple-600
              dark:from-indigo-600 dark:to-purple-700
              text-white rounded-full w-9 h-9
              flex items-center justify-center
              shadow-md hover:shadow-lg
              transition-all duration-300
              touch-auto pointer-events-auto
              ${isExpanded ? 'rotate-180' : 'rotate-0'}
            `}
            title="Több opció"
          >
            ⋮
          </button>
        </div>
      </div>
      
      {/* EXPANDED OPTIONS */}
      {isExpanded && (
        <div className="
          mt-3 pt-3 border-t border-gray-200 dark:border-gray-700
          flex gap-2 flex-wrap
          animate-fade-in
        ">
          {!isDemo && (
            <>
              <button
                onClick={(e) => {
                  handleButtonInteraction(e);
                  onStartEdit(index);
                }}
                className="
                  flex-1 min-w-[100px] px-3 py-2
                  bg-blue-500 dark:bg-blue-600 text-white
                  rounded-md text-sm font-medium
                  hover:bg-blue-600 dark:hover:bg-blue-700
                  transition-colors duration-200
                  touch-auto pointer-events-auto
                "
              >
                ✏️ Szerkesztés
              </button>
              <button
                onClick={(e) => {
                  handleButtonInteraction(e);
                  handleDeleteWord(index);
                }}
                className="
                  flex-1 min-w-[100px] px-3 py-2
                  bg-red-500 dark:bg-red-600 text-white
                  rounded-md text-sm font-medium
                  hover:bg-red-600 dark:hover:bg-red-700
                  transition-colors duration-200
                  touch-auto pointer-events-auto
                "
              >
                🗑️ Törlés
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================
// MAIN WordTable Component
// ============================================
const WordTable = ({ 
  words, 
  lessonNumber = null, 
  deleteWord = null, 
  isDemo = false, 
  onReorderWords = null, 
  isFavorited = null, 
  handleToggleFavorite = null 
}) => {
  const { speak, speechRate, updateSpeechRate } = useSpeechSynthesis();
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [localWords, setLocalWords] = useState(words);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({ english: '', phonetic: '', hungarian: '' });
  const [isGeneratingPhonetic, setIsGeneratingPhonetic] = useState(false);
  
  React.useEffect(() => {
    setLocalWords(words);
  }, [words]);

  const items = localWords.map((word, index) => ({
    id: `${word.english}-${index}`,
    ...word,
    originalIndex: index
  }));

// ================================================================
// CRITICAL FIX v0.7.2: Mobile Drag & Drop Sensor Configuration
// ================================================================
// Bug: PointerSensor was active on mobile, conflicting with TouchSensor
// Result: Drag & drop didn't work on mobile devices
// Solution: Platform-specific sensors using conditional spread operator
// ================================================================

  const sensors = useSensors(
  // PointerSensor - DESKTOP ONLY
    ...(!isMobile ? [
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // 8px movement required on desktop
        },
      })
    ] : []),
    
    // TouchSensor - MOBILE ONLY
    ...(isMobile ? [
      useSensor(TouchSensor, {
        activationConstraint: {
          delay: 1000,      // 1 second hold required (prevents accidental drags)
          tolerance: 5,     // 5px movement tolerance
        },
      })
    ] : []),
    
    // KeyboardSensor - BOTH PLATFORMS
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
// ================================================================
// Platform Configuration Summary:
// ================================================================
// Desktop (>= 768px):
//   - PointerSensor: 8px distance activation
//   - KeyboardSensor: enabled
//   - TouchSensor: disabled
//
// Mobile (< 768px):
//   - TouchSensor: 1000ms delay + 5px tolerance
//   - KeyboardSensor: enabled  
//   - PointerSensor: disabled
// ================================================================

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

  const handleStartEdit = (index) => {
    setEditingIndex(index);
    setEditForm({
      english: localWords[index].english,
      phonetic: localWords[index].phonetic,
      hungarian: localWords[index].hungarian
    });
  };

  const handleGeneratePhonetic = async () => {
    if (!editForm.english.trim()) {
      alert('⚠️ Először add meg az angol szót!');
      return;
    }

    setIsGeneratingPhonetic(true);
    try {
      const phonetic = await generatePhonetic(editForm.english.trim());
      setEditForm(prev => ({ ...prev, phonetic }));
    } catch (error) {
      console.error('Phonetic generation error:', error);
      alert('❌ Hiba történt a fonetika generálása során!');
    } finally {
      setIsGeneratingPhonetic(false);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.english.trim() || !editForm.hungarian.trim()) {
      alert('⚠️ Az angol és magyar mezők kötelezőek!');
      return;
    }

    const updatedWords = [...localWords];
    updatedWords[editingIndex] = {
      english: editForm.english.trim(),
      phonetic: editForm.phonetic.trim(),
      hungarian: editForm.hungarian.trim()
    };
    
    setLocalWords(updatedWords);
    
    if (onReorderWords && lessonNumber) {
      onReorderWords(lessonNumber, updatedWords);
    }
    
    setEditingIndex(null);
    setEditForm({ english: '', phonetic: '', hungarian: '' });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({ english: '', phonetic: '', hungarian: '' });
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    
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

  // ============================================
  // MOBILE RENDER
  // ============================================
  if (isMobile) {
    return (
      <>
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

        {!isDemo && localWords.length > 1 && (
          <div className="
            bg-blue-50 dark:bg-blue-900/30 
            border border-blue-300 dark:border-blue-700
            rounded-lg p-3 mx-2 mb-2
            text-sm text-gray-700 dark:text-gray-300
            animate-fade-in
          ">
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">👆</span>
              <div>
                <strong className="block mb-1">💡 Tipp: Átrendezés mobilon</strong>
                <span>Tartsd nyomva <strong className="text-indigo-600 dark:text-indigo-400">1 másodpercig</strong> bármelyik kártyát, majd húzd az új pozícióba!</span>
              </div>
            </div>
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
                  isEditing={editingIndex === index}
                  editForm={editForm}
                  onStartEdit={handleStartEdit}
                  onSaveEdit={handleSaveEdit}
                  onCancelEdit={handleCancelEdit}
                  onEditChange={handleEditChange}
                  isGeneratingPhonetic={isGeneratingPhonetic}
                  onGeneratePhonetic={handleGeneratePhonetic}
                  lessonNumber={lessonNumber}
                  isFavorited={isFavorited}
                  handleToggleFavorite={handleToggleFavorite}
                />
              ))}
            </SortableContext>
          </div>
          
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

  // ============================================
  // DESKTOP RENDER
  // ============================================
  return (
    <>
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
                <th className="px-2 py-4 text-center text-lg font-bold w-12">
                  ⭐
                </th>
                <th className="px-4 py-4 text-left text-lg font-bold">Angol szó</th>
                <th className="px-4 py-4 text-left text-lg font-bold">Fonetika</th>
                <th className="px-4 py-4 text-left text-lg font-bold">Magyar jelentés</th>
                <th className="px-4 py-4 text-center text-lg font-bold w-[150px]">
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
                    isEditing={editingIndex === index}
                    editForm={editForm}
                    onStartEdit={handleStartEdit}
                    onSaveEdit={handleSaveEdit}
                    onCancelEdit={handleCancelEdit}
                    onEditChange={handleEditChange}
                    isGeneratingPhonetic={isGeneratingPhonetic}
                    onGeneratePhonetic={handleGeneratePhonetic}
                    lessonNumber={lessonNumber}
                    isFavorited={isFavorited}
                    handleToggleFavorite={handleToggleFavorite}
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