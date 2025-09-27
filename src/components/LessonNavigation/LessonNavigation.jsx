// src/components/LessonNavigation/LessonNavigation.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const LessonNavigation = ({ dictionary, currentLesson, setCurrentLesson }) => {
  const lessons = Array.from({ length: 60 }, (_, i) => i + 1);

  return (
    <div style={styles.lessonNavigation}>
      {lessons.map(lessonNum => {
        const hasContent = dictionary[lessonNum];
        const isActive = lessonNum === currentLesson;
        
        let buttonStyle = styles.lessonNavBtn;
        if (hasContent && !isActive) {
          buttonStyle = { ...buttonStyle, ...styles.lessonNavBtnCompleted };
        } else if (isActive) {
          buttonStyle = { ...buttonStyle, ...styles.lessonNavBtnActive };
        } else if (!hasContent) {
          buttonStyle = { ...buttonStyle, ...styles.lessonNavBtnEmpty };
        }

        return (
          <button
            key={lessonNum}
            style={buttonStyle}
            onClick={() => setCurrentLesson(lessonNum)}
            title={hasContent ? dictionary[lessonNum].title : 'Hamarosan elérhető'}
            disabled={!hasContent && !isActive}
          >
            {lessonNum}. óra
          </button>
        );
      })}
    </div>
  );
};

export default LessonNavigation;
