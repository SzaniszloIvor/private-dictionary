// src/components/LoginScreen/LoginScreen.jsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { styles } from '../../styles/styles';

const LoginScreen = () => {
  const { loginWithGoogle, loginAsDemo } = useAuth();

  const loginStyles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    card: {
      background: 'white',
      borderRadius: '20px',
      padding: '40px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      maxWidth: '400px',
      width: '100%',
      textAlign: 'center'
    },
    title: {
      fontSize: '2.5em',
      marginBottom: '10px',
      color: '#333',
      fontWeight: 'bold'
    },
    subtitle: {
      fontSize: '1.1em',
      color: '#666',
      marginBottom: '40px'
    },
    button: {
      width: '100%',
      padding: '15px',
      marginBottom: '15px',
      border: 'none',
      borderRadius: '10px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px'
    },
    googleButton: {
      background: '#4285f4',
      color: 'white',
      boxShadow: '0 3px 10px rgba(66,133,244,0.3)'
    },
    demoButton: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      boxShadow: '0 3px 10px rgba(102,126,234,0.3)'
    },
    divider: {
      margin: '20px 0',
      color: '#999',
      fontSize: '14px',
      position: 'relative'
    },
    dividerLine: {
      position: 'absolute',
      top: '50%',
      left: '0',
      right: '0',
      height: '1px',
      background: '#e0e0e0',
      zIndex: 0
    },
    dividerText: {
      background: 'white',
      padding: '0 15px',
      position: 'relative',
      zIndex: 1
    },
    features: {
      marginTop: '30px',
      padding: '20px',
      background: '#f8f9fa',
      borderRadius: '10px',
      textAlign: 'left'
    },
    featureTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333'
    },
    featureList: {
      listStyle: 'none',
      padding: 0
    },
    featureItem: {
      padding: '5px 0',
      color: '#666',
      fontSize: '14px'
    }
  };

  return (
    <div style={loginStyles.container}>
      <div style={loginStyles.card}>
        <h1 style={loginStyles.title}>🎧 Angol Szótár</h1>
        <p style={loginStyles.subtitle}>Korlátlan szavas interaktív szótanulási program</p>
        
        <button
          style={{...loginStyles.button, ...loginStyles.googleButton}}
          onClick={loginWithGoogle}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Belépés Google fiókkal
        </button>
        
        <div style={loginStyles.divider}>
          <div style={loginStyles.dividerLine}></div>
          <span style={loginStyles.dividerText}>VAGY</span>
        </div>
        
        <button
          style={{...loginStyles.button, ...loginStyles.demoButton}}
          onClick={loginAsDemo}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          👤 Demó fiók használata
        </button>
        
        <div style={loginStyles.features}>
          <div style={loginStyles.featureTitle}>Mit kapsz?</div>
          <ul style={loginStyles.featureList}>
            <li style={loginStyles.featureItem}>✅ Saját személyre szabott szótár</li>
            <li style={loginStyles.featureItem}>✅ Automatikus mentés a felhőbe</li>
            <li style={loginStyles.featureItem}>✅ Hozzáférés minden eszközről</li>
            <li style={loginStyles.featureItem}>✅ Korlátlan szavak hozzáadása</li>
            <li style={loginStyles.featureItem}>✅ Hangos kiejtés minden szóhoz</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
