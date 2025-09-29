// src/components/LessonNavigation/LessonNavigation.jsx
import React, { useState, useEffect } from 'react';
import { styles } from '../../styles/styles';

const LessonNavigation = ({ dictionary, currentLesson, setCurrentLesson, isDemo, getNextLessonNumber }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Demo módban csak 2 óra, élesben dinamikus
  const getLessonsToShow = () => {
    if (isDemo) {
      return [1, 2];
    }
    
    // Éles módban: meglévő órák + egy "új óra" gomb
    const existingLessons = Object.keys(dictionary)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);
    
    return existingLessons;
  };

  const lessonsToShow = getLessonsToShow();
  const nextLessonNumber = !isDemo ? getNextLessonNumber() : null;

  const mobileStyles = {
    lessonNavigation: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      padding: '12px',
      background: '#f8f9fa',
      maxHeight: '200px',
      overflowY: 'auto',
      borderBottom: '2px solid #e9ecef'
    },
    lessonNavBtn: {
      padding: '8px 12px',
      border: '2px solid #dee2e6',
      background: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '13px',
      fontWeight: '500',
      minWidth: '70px',
      textAlign: 'center'
    }
  };

  const currentStyles = isMobile ? mobileStyles : styles;

  return (
    <div style={currentStyles.lessonNavigation}>
      {lessonsToShow.map(lessonNum => {
        const hasContent = dictionary[lessonNum];
        const isActive = lessonNum === currentLesson;
        
        let buttonStyle = currentStyles.lessonNavBtn;
        if (hasContent && !isActive) {
          buttonStyle = { ...buttonStyle, ...styles.lessonNavBtnCompleted };
        } else if (isActive) {
          buttonStyle = { ...buttonStyle, ...styles.lessonNavBtnActive };
        }

        return (
          <button
            key={lessonNum}
            style={buttonStyle}
            onClick={() => setCurrentLesson(lessonNum)}
            title={hasContent ? dictionary[lessonNum].title : 'Nincs még tartalom'}
          >
            {lessonNum}. óra
            {hasContent && !isMobile && (
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                {dictionary[lessonNum].words.length} szó
              </div>
            )}
          </button>
        );
      })}
      
      {/* Új óra hozzáadása gomb - csak éles módban */}
      {!isDemo && (
        <button
          style={{
            ...currentStyles.lessonNavBtn,
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: '2px dashed #28a745',
            opacity: 0.9
          }}
          onClick={() => setCurrentLesson(nextLessonNumber)}
          title="Új óra létrehozása"
        >
          <div style={{ fontSize: isMobile ? '16px' : '20px', lineHeight: '1' }}>+</div>
          {!isMobile && <div style={{ fontSize: '11px', marginTop: '2px' }}>Új óra</div>}
        </button>
      )}
      
      {/* Demo módban tájékoztató */}
      {isDemo && (
        <div style={{
          padding: isMobile ? '8px 10px' : '10px 15px',
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          fontSize: isMobile ? '12px' : '14px',
          color: '#856404',
          display: 'flex',
          alignItems: 'center',
          width: isMobile ? '100%' : 'auto'
        }}>
          ⚠️ {isMobile ? 'Max 2 óra' : 'Demo módban csak 2 óra érhető el'}
        </div>
      )}
    </div>
  );
};

export default LessonNavigation;
