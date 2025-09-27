// src/components/LessonContent/LessonContent.jsx
import React from 'react';
import WordTable from '../WordTable/WordTable';
import { styles } from '../../styles/styles';

const LessonContent = ({ lesson, lessonNumber }) => {
  if (!lesson) {
    return (
      <div style={styles.emptyLesson}>
        <div style={styles.emptyLessonIcon}>📚</div>
        <h3>{lessonNumber}. óra</h3>
        <p>Ez a lecke még nem elérhető, de hamarosan feltöltjük!</p>
        <p>A szótár folyamatosan bővül újabb szavakkal és leckékkel.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.lessonHeader}>
        <div style={styles.lessonTitle}>{lessonNumber}. óra</div>
        <div style={styles.lessonSubtitle}>{lesson.title}</div>
        <div style={styles.wordCount}>{lesson.words.length} szó</div>
      </div>
      <WordTable words={lesson.words} />
    </div>
  );
};

export default LessonContent;
