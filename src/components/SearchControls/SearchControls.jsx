// src/components/SearchControls/SearchControls.jsx
import React, { useState, useEffect } from 'react';
import { styles } from '../../styles/styles';

const SearchControls = ({ searchTerm, setSearchTerm, filter, setFilter }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileStyles = {
    searchControls: {
      padding: '12px',
      background: 'white',
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    searchInputContainer: {
      position: 'relative',
      width: '100%'
    },
    searchInput: {
      width: '100%',
      padding: '10px 40px 10px 12px',
      border: '2px solid #dee2e6',
      borderRadius: '8px',
      fontSize: '16px',
      boxSizing: 'border-box'
    },
    clearBtn: {
      position: 'absolute',
      right: '8px',
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'transparent',
      border: 'none',
      fontSize: '20px',
      cursor: 'pointer',
      color: '#6c757d',
      padding: '4px',
      display: searchTerm ? 'block' : 'none'
    },
    filterContainer: {
      display: 'flex',
      gap: '8px',
      width: '100%'
    },
    filterBtn: {
      flex: 1,
      padding: '8px',
      border: '2px solid #dee2e6',
      background: 'white',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '14px',
      fontWeight: '500'
    }
  };

  const currentStyles = isMobile ? mobileStyles : styles;

  if (isMobile) {
    return (
      <div style={mobileStyles.searchControls}>
        <div style={mobileStyles.searchInputContainer}>
          <input
            type="text"
            style={mobileStyles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Keresés..."
          />
          <button
            style={mobileStyles.clearBtn}
            onClick={() => setSearchTerm('')}
            aria-label="Törlés"
          >
            ×
          </button>
        </div>
        <div style={mobileStyles.filterContainer}>
          <button
            style={{
              ...mobileStyles.filterBtn,
              ...(filter === 'all' ? styles.filterBtnActive : {})
            }}
            onClick={() => setFilter('all')}
          >
            Mind
          </button>
          <button
            style={{
              ...mobileStyles.filterBtn,
              ...(filter === 'english' ? styles.filterBtnActive : {})
            }}
            onClick={() => setFilter('english')}
          >
            🇬🇧 EN
          </button>
          <button
            style={{
              ...mobileStyles.filterBtn,
              ...(filter === 'hungarian' ? styles.filterBtnActive : {})
            }}
            onClick={() => setFilter('hungarian')}
          >
            🇭🇺 HU
          </button>
        </div>
      </div>
    );
  }

  // Desktop view
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
