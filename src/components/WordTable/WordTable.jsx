// src/components/WordTable/WordTable.jsx
import React from 'react';
import { styles } from '../../styles/styles';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

const WordTable = ({ words, lessonNumber = null, deleteWord = null, isDemo = false }) => {
  const { speak } = useSpeechSynthesis();

  const handleDeleteWord = (index) => {
    if (window.confirm('Biztosan törölni szeretnéd ezt a szót?')) {
      deleteWord(lessonNumber, index);
    }
  };

  return (
    <table style={styles.dictionaryTable}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Angol szó</th>
          <th style={styles.tableHeader}>Fonetika</th>
          <th style={styles.tableHeader}>Magyar jelentés</th>
          {typeof lessonNumber === 'boolean' && lessonNumber && <th style={styles.tableHeader}>Óra</th>}
          <th style={styles.tableHeader}>Kiejtés</th>
          {!isDemo && deleteWord && <th style={styles.tableHeader}>Műveletek</th>}
        </tr>
      </thead>
      <tbody>
        {words.map((word, index) => (
          <tr
            key={index}
            style={index % 2 === 0 ? styles.tableRowEven : {}}
          >
            <td style={styles.englishWord}>{word.english}</td>
            <td style={styles.phonetic}>{word.phonetic}</td>
            <td style={styles.hungarian}>{word.hungarian}</td>
            {typeof lessonNumber === 'boolean' && lessonNumber && (
              <td style={styles.tableCell}>{word.lessonNumber}. óra</td>
            )}
            <td style={styles.tableCell}>
              <button
                style={styles.playBtn}
                onClick={() => speak(word.english)}
                title="Kiejtés lejátszása"
              >
                ▶️
              </button>
            </td>
            {!isDemo && deleteWord && (
              <td style={styles.tableCell}>
                <button
                  onClick={() => handleDeleteWord(index)}
                  style={{
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#c82333'}
                  onMouseOut={(e) => e.target.style.background = '#dc3545'}
                  title="Szó törlése"
                >
                  🗑️ Törlés
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordTable;
