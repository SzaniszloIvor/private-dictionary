// src/components/SearchControls/SearchControls.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const SearchControls = ({ searchTerm, setSearchTerm, filter, setFilter }) => {
  return (
    <div style={styles.searchControls}>
      <input
        type="text"
        style={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Keresés angol vagy magyar szavak között..."
      />
      <button
        style={{
          ...styles.filterBtn,
          ...(filter === 'all' ? styles.filterBtnActive : {})
        }}
        onClick={() => setFilter('all')}
      >
        Összes
      </button>
      <button
        style={{
          ...styles.filterBtn,
          ...(filter === 'english' ? styles.filterBtnActive : {})
        }}
        onClick={() => setFilter('english')}
      >
        Angol
      </button>
      <button
        style={{
          ...styles.filterBtn,
          ...(filter === 'hungarian' ? styles.filterBtnActive : {})
        }}
        onClick={() => setFilter('hungarian')}
      >
        Magyar
      </button>
      <button
        style={styles.filterBtn}
        onClick={() => setSearchTerm('')}
      >
        Törlés
      </button>
    </div>
  );
};

export default SearchControls;
