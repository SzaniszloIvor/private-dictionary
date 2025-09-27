// src/components/SearchResults/SearchResults.jsx
import React from 'react';
import WordTable from '../WordTable/WordTable';
import { styles } from '../../styles/styles';

const SearchResults = ({ results, searchTerm }) => {
  if (results.length === 0) {
    return (
      <div style={styles.noResults}>
        <h3>🔍 Nincs találat</h3>
        <p>Nem találtunk eredményt a "<strong>{searchTerm}</strong>" keresésre.</p>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.lessonHeader}>
        <div style={styles.lessonTitle}>🔍 Keresési eredmények</div>
        <div style={styles.lessonSubtitle}>"{searchTerm}" keresésre</div>
        <div style={styles.wordCount}>{results.length} találat</div>
      </div>
      <WordTable words={results} lessonNumber={true} />
    </div>
  );
};

export default SearchResults;
