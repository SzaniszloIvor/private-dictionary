// src/components/WordTable/WordTable.jsx
import React, { useState } from 'react';
import { styles } from '../../styles/styles';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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
import {
  useSortable
} from '@dnd-kit/sortable';
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
    disabled: isDemo 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: !isDemo ? 'move' : 'default',
    ...(index % 2 === 0 ? styles.tableRowEven : {})
  };

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <td style={styles.englishWord}>{word.english}</td>
      <td style={styles.phonetic}>{word.phonetic}</td>
      <td style={styles.hungarian}>{word.hungarian}</td>
      <td style={{...styles.tableCell, textAlign: 'center'}}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            style={{
              ...styles.playBtn,
              width: '32px',
              height: '32px',
              fontSize: '14px'
            }}
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
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
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
    disabled: isDemo 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    background: index % 2 === 0 ? '#f8f9fa' : 'white',
    borderRadius: '8px',
    marginBottom: '8px',
    padding: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: !isDemo ? 'move' : 'default',
    position: 'relative'
  };

  const isExpanded = expandedRows.has(index);

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '16px', 
            color: '#2c3e50',
            marginBottom: '4px'
          }}>
            {word.english}
          </div>
          <div style={{ 
            color: '#e74c3c', 
            fontStyle: 'italic',
            fontSize: '14px',
            marginBottom: '4px'
          }}>
            {word.phonetic}
          </div>
          <div style={{ 
            color: '#27ae60',
            fontSize: '15px',
            fontWeight: '500'
          }}>
            {word.hungarian}
          </div>
        </div>
        
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              speak(word.english);
            }}
            style={{
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '16px'
            }}
            title={`Kiejtés (${speechRate}x)`}
          >
            🔊
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpanded(index);
            }}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              fontSize: '18px',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}
            title="Több opció"
          >
            ⋮
          </button>
        </div>
      </div>
      
      {isExpanded && (
        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #dee2e6',
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap'
        }}>
          {!isDemo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteWord(index);
              }}
              style={{
                flex: '1',
                minWidth: '100px',
                padding: '8px',
                background: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
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
  const [showSpeedControl, setShowSpeedControl] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Local state for words to handle drag and drop immediately
  const [localWords, setLocalWords] = useState(words);
  
  // Update local words when props change
  React.useEffect(() => {
    setLocalWords(words);
  }, [words]);

  // Create word items with unique IDs
  const items = localWords.map((word, index) => ({
    id: `${word.english}-${index}`,
    ...word,
    originalIndex: index
  }));

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
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
        
        // Update local state immediately for smooth UX
        setLocalWords(newOrder);
        
        // Then update parent component
        if (onReorderWords && lessonNumber) {
          onReorderWords(lessonNumber, newOrder);
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

  // Speed control component
  const SpeedControl = () => (
    <div style={{
      position: 'absolute',
      bottom: '100%',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'white',
      border: '2px solid #4facfe',
      borderRadius: '8px',
      padding: '10px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      marginBottom: '10px',
      minWidth: '200px'
    }}>
      <div style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
        Sebesség: {speechRate}x
      </div>
      <input
        type="range"
        min="0.3"
        max="1.5"
        step="0.1"
        value={speechRate}
        onChange={(e) => updateSpeechRate(parseFloat(e.target.value))}
        style={{ width: '100%' }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '12px',
        marginTop: '4px'
      }}>
        <span>Lassú</span>
        <button
          onClick={() => updateSpeechRate(0.7)}
          style={{
            background: '#4facfe',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            padding: '2px 8px',
            fontSize: '11px',
            cursor: 'pointer'
          }}
        >
          Alapértelmezett
        </button>
        <span>Gyors</span>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Speed control bar for mobile */}
        <div style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          padding: '12px',
          marginBottom: '10px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ 
                fontWeight: 'bold', 
                fontSize: '13px',
                color: '#495057'
              }}>
                🔊 Sebesség: {speechRate}x
              </span>
              <button
                onClick={() => updateSpeechRate(0.7)}
                style={{
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                Alapért.
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#6c757d' }}>Lassú</span>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => updateSpeechRate(parseFloat(e.target.value))}
                style={{ 
                  flex: 1,
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '11px', color: '#6c757d' }}>Gyors</span>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{ padding: '8px' }}>
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
        </DndContext>
      </>
    );
  }

  // Desktop view
  return (
    <>
      {/* Speed control bar - always visible */}
      <div style={{
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        padding: '15px',
        borderRadius: '8px',
        marginBottom: '15px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ 
            fontWeight: 'bold', 
            fontSize: '14px',
            color: '#495057',
            minWidth: '120px'
          }}>
            🔊 Kiejtés sebesség:
          </div>
          <div style={{ 
            flex: 1, 
            minWidth: '200px',
            maxWidth: '400px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '12px', color: '#6c757d' }}>Lassú</span>
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={speechRate}
                onChange={(e) => updateSpeechRate(parseFloat(e.target.value))}
                style={{ 
                  flex: 1,
                  cursor: 'pointer'
                }}
              />
              <span style={{ fontSize: '12px', color: '#6c757d' }}>Gyors</span>
            </div>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span style={{
              background: '#4facfe',
              color: 'white',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              {speechRate}x
            </span>
            <button
              onClick={() => updateSpeechRate(0.7)}
              style={{
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '12px',
                cursor: 'pointer'
              }}
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
        <div style={{ overflowX: 'auto' }}>
          <table style={styles.dictionaryTable}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>Angol szó</th>
                <th style={styles.tableHeader}>Fonetika</th>
                <th style={styles.tableHeader}>Magyar jelentés</th>
                <th style={{...styles.tableHeader, width: '120px', textAlign: 'center'}}>
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
