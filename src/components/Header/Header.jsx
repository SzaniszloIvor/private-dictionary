// src/components/Header/Header.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const Header = ({ isDemo }) => {
  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>
        🎧 Interaktív Angol Szótár
        {isDemo && <span style={{ fontSize: '0.6em', marginLeft: '15px' }}>( Demo verzió )</span>}
      </h1>
      <p style={styles.headerSubtitle}>
        {isDemo 
          ? 'Próbáld ki az első 2 órát ingyenesen!' 
          : 'Személyre szabott angol szótanulási program hangos kiejtéssel!'}
      </p>
    </div>
  );
};

export default Header;
