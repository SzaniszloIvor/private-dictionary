// src/components/ProgressSection/ProgressSection.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const ProgressSection = ({ dictionary, isDemo }) => {
  const completedLessons = Object.keys(dictionary).length;
  const totalWords = Object.values(dictionary).reduce((sum, lesson) => sum + lesson.words.length, 0);
  
  const maxLessons = isDemo ? 2 : completedLessons + 10; 
  const progress = isDemo 
    ? (completedLessons / 2 * 100).toFixed(1)
    : completedLessons > 0 ? 100 : 0; 

  return (
    <div style={styles.progressSection}>
      <div style={styles.progressStats}>
        {isDemo ? (
          <>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>2</div>
              <div style={styles.statLabel}>Demo órák</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{completedLessons}</div>
              <div style={styles.statLabel}>Elérhető</div>
            </div>
          </>
        ) : (
          <>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>{completedLessons}</div>
              <div style={styles.statLabel}>Létrehozott órák</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>∞</div>
              <div style={styles.statLabel}>Lehetséges órák</div>
            </div>
          </>
        )}
        <div style={styles.statItem}>
          <div style={styles.statNumber}>{totalWords}</div>
          <div style={styles.statLabel}>Összes szó</div>
        </div>
        <div style={styles.statItem}>
          <div style={{
            ...styles.statNumber,
            fontSize: completedLessons === 0 && !isDemo ? '1.5em' : '2em'
          }}>
            {completedLessons === 0 && !isDemo 
              ? 'Kezdj el!' 
              : isDemo 
                ? `${progress}%` 
                : `${completedLessons} óra`}
          </div>
          <div style={styles.statLabel}>
            {isDemo ? 'Demo haladás' : 'Saját haladás'}
          </div>
        </div>
      </div>
      
      {isDemo && (
        <>
          <div style={styles.progressBar}>
            <div style={{...styles.progressFill, width: `${progress}%`}} />
          </div>
          <div style={styles.progressInfo}>
            <small>Demo módban csak 2 óra érhető el. Jelentkezz be a teljes funkcionalitásért!</small>
          </div>
        </>
      )}
      
      {!isDemo && completedLessons > 0 && (
        <div style={styles.progressInfo}>
          <small>Gratulálunk! {completedLessons} órát hoztál létre {totalWords} szóval. Folytasd a tanulást!</small>
        </div>
      )}
      
      {!isDemo && completedLessons === 0 && (
        <div style={{
          ...styles.progressInfo,
          background: '#fff3cd',
          padding: '15px',
          borderRadius: '8px',
          border: '1px solid #ffc107',
          marginTop: '15px'
        }}>
          <strong>👋 Üdvözlünk!</strong><br />
          <small>Kezdd el építeni saját szótáradat! Kattints a "Szavak hozzáadása" gombra az első óra létrehozásához.</small>
        </div>
      )}
    </div>
  );
};

export default ProgressSection;
