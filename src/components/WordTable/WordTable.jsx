// src/components/WordTable/WordTable.jsx
import React from 'react';
import { styles } from '../../styles/styles';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

const WordTable = ({ words, lessonNumber = null }) => {
  const { speak } = useSpeechSynthesis();

  return (
    <table style={styles.dictionaryTable}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Angol szó</th>
          <th style={styles.tableHeader}>Fonetika</th>
          <th style={styles.tableHeader}>Magyar jelentés</th>
          {lessonNumber && <th style={styles.tableHeader}>Óra</th>}
          <th style={styles.tableHeader}>Kiejtés</th>
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
            {lessonNumber && <td style={styles.tableCell}>{word.lessonNumber}. óra</td>}
            <td style={styles.tableCell}>
              <button
                style={styles.playBtn}
                onClick={() => speak(word.english)}
                title="Kiejtés lejátszása"
              >
                ▶️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WordTable;
