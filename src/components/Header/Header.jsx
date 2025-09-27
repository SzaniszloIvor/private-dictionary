// src/components/Header/Header.jsx
import React from 'react';
import { styles } from '../../styles/styles';

const Header = () => {
  return (
    <div style={styles.header}>
      <h1 style={styles.headerTitle}>🎧 60 Órás Interaktív Angol Szótár</h1>
      <p style={styles.headerSubtitle}>Komplett angol szótanulási program hangos kiejtéssel!</p>
    </div>
  );
};

export default Header;
