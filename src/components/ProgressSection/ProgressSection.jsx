// src/components/ProgressSection/ProgressSection.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const ProgressSection = ({ dictionary }) => {
  const completedLessons = Object.keys(dictionary).length;
  const totalWords = Object.values(dictionary).reduce((sum, lesson) => sum + lesson.words.length, 0);
  const progress = (completedLessons / 60 * 100).toFixed(1);

  return (
    <div style={styles.progressSection}>
      <div style={styles.progressStats}>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>60</div>
          <div style={styles.statLabel}>Összes óra</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{completedLessons}</div>
          <div style={styles.statLabel}>Elkészült óra</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{totalWords}</div>
          <div style={styles.statLabel}>Összes szó</div>
        </div>
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{progress}%</div>
          <div style={styles.statLabel}>Haladás</div>
        </div>
      </div>
      <div style={styles.progressBar}>
        <div style={{...styles.progressFill, width: `${progress}%`}} />
      </div>
      <div style={styles.progressInfo}>
        <small>A szótár folyamatosan bővül - hamarosan újabb leckék!</small>
      </div>
    </div>
  );
};

export default ProgressSection;
