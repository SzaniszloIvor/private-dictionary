// src/components/LessonNavigation/LessonNavigation.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const LessonNavigation = ({ dictionary, currentLesson, setCurrentLesson, isDemo, getNextLessonNumber }) => {

  const getLessonsToShow = () => {
    if (isDemo) {
      return [1, 2];
    }
    
    const existingLessons = Object.keys(dictionary)
      .map(num => parseInt(num))
      .sort((a, b) => a - b);
    
    return existingLessons;
  };

  const lessonsToShow = getLessonsToShow();
  const nextLessonNumber = !isDemo ? getNextLessonNumber() : null;

  return (
    <div style={styles.lessonNavigation}>
      {lessonsToShow.map(lessonNum => {
        const hasContent = dictionary[lessonNum];
        const isActive = lessonNum === currentLesson;
        
        let buttonStyle = styles.lessonNavBtn;
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
            {hasContent && (
              <div style={{ fontSize: '11px', marginTop: '2px' }}>
                {dictionary[lessonNum].words.length} szó
              </div>
            )}
          </button>
        );
      })}
      
      {!isDemo && (
        <button
          style={{
            ...styles.lessonNavBtn,
            background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
            color: 'white',
            border: '2px dashed #28a745',
            opacity: 0.9
          }}
          onClick={() => setCurrentLesson(nextLessonNumber)}
          title="Új óra létrehozása"
        >
          <div style={{ fontSize: '20px', lineHeight: '1' }}>+</div>
          <div style={{ fontSize: '11px', marginTop: '2px' }}>Új óra</div>
        </button>
      )}
      
      {isDemo && (
        <div style={{
          padding: '10px 15px',
          background: '#fff3cd',
          border: '2px solid #ffc107',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#856404',
          display: 'flex',
          alignItems: 'center'
        }}>
          ⚠️ Demo módban csak 2 óra érhető el
        </div>
      )}
    </div>
  );
};

export default LessonNavigation;
