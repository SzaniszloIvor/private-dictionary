// src/components/Header/Header.jsx
import React, { useState, useEffect } from 'react';
import { styles } from '../../styles/styles';

const Header = ({ isDemo }) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mobileStyles = {
    header: {
      ...styles.header,
      padding: '20px 15px'
    },
    headerTitle: {
      ...styles.headerTitle,
      fontSize: '1.8em',
      marginBottom: '8px'
    },
    headerSubtitle: {
      ...styles.headerSubtitle,
      fontSize: '0.95em'
    }
  };

  const currentStyles = isMobile ? mobileStyles : styles;

  return (
    <div style={currentStyles.header}>
      <h1 style={currentStyles.headerTitle}>
        🎧 {isMobile ? 'Angol Szótár' : 'Interaktív Angol Szótár'}
        {isDemo && <span style={{ fontSize: '0.6em', marginLeft: isMobile ? '10px' : '15px' }}>
          {isMobile ? 'Demo' : '( Demo verzió )'}
        </span>}
      </h1>
      <p style={currentStyles.headerSubtitle}>
        {isDemo 
          ? isMobile ? 'Próbáld ki az első 2 órát!' : 'Próbáld ki az első 2 órát ingyenesen!' 
          : isMobile ? 'Hangos kiejtéssel!' : 'Személyre szabott angol szótanulási program hangos kiejtéssel!'}// src/components/Header/Header.jsx
      </p>
    </div>
  );
};

export default Header;
