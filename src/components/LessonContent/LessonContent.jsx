// src/components/LessonContent/LessonContent.jsx
import React from 'react';
import WordTable from '../WordTable/WordTable';
import { styles } from '../../styles/styles';

const LessonContent = ({ lesson, lessonNumber, isDemo }) => {
  if (!lesson) {
    return (
      <div style={styles.emptyLesson}>
        <div style={styles.emptyLessonIcon}>📚</div>
        <h3>{lessonNumber}. óra</h3>
        {isDemo ? (
          <>
            <p>Ez a lecke még nem elérhető demo módban!</p>
            <p style={{ marginTop: '15px', color: '#495057' }}>
              Jelentkezz be Google fiókkal a teljes funkcionalitás eléréséhez.
            </p>
          </>
        ) : (
          <>
            <p>Ez az óra még üres!</p>
            <p style={{ marginTop: '15px', color: '#495057' }}>
              Kattints a "Szavak hozzáadása" gombra és kezdd el feltölteni ezt az órát.
            </p>
            <div style={{
              marginTop: '30px',
              padding: '20px',
              background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
              borderRadius: '10px',
              border: '2px dashed #28a745'
            }}>
              <h4 style={{ color: '#155724', marginBottom: '10px' }}>
                💡 Tipp az óra elkezdéséhez:
              </h4>
              <ul style={{ 
                textAlign: 'left', 
                color: '#155724',
                listStyle: 'none',
                padding: 0
              }}>
                <li style={{ marginBottom: '8px' }}>
                  ✅ Adj egy témát az órának (pl. "Család", "Munka", "Utazás")
                </li>
                <li style={{ marginBottom: '8px' }}>
                  ✅ Kezdj 10-15 szóval, később bővítheted
                </li>
                <li style={{ marginBottom: '8px' }}>
                  ✅ Használd az API-t pontos fonetikához
                </li>
                <li>
                  ✅ Csoportosítsd a kapcsolódó szavakat egy órába
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <div style={styles.lessonHeader}>
        <div style={styles.lessonTitle}>{lessonNumber}. óra</div>
        <div style={styles.lessonSubtitle}>{lesson.title}</div>
        <div style={styles.wordCount}>{lesson.words.length} szó</div>
        {!isDemo && lesson.words.length === 0 && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            background: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#856404'
          }}>
            ⚠️ Ez az óra még üres. Kattints a "Szavak hozzáadása" gombra!
          </div>
        )}
      </div>
      {lesson.words.length > 0 ? (
        <WordTable words={lesson.words} />
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f8f9fa',
          borderRadius: '10px',
          marginTop: '20px'
        }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>📝</div>
          <h3 style={{ color: '#495057' }}>Még nincsenek szavak ebben az órában</h3>
          <p style={{ color: '#6c757d', marginTop: '10px' }}>
            Használd a "Szavak hozzáadása" gombot az első szavak felvételéhez!
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonContent;
