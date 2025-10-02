// src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx
import React from 'react';
import { getShortcutDisplay } from '../../hooks/useKeyboardShortcuts';

const KeyboardShortcutsHelper = ({ isOpen, onOpen, onClose }) => {
  const shortcuts = [
  { combo: 'mod+e', description: 'Új szó hozzáadása', icon: '➕' },
  { combo: 'mod+f', description: 'Keresés fókuszálása', icon: '🔍' },
  { combo: 'mod+s', description: 'Mentési állapot megjelenítése', icon: '💾' },
  { combo: 'mod+k', description: 'Billentyűparancsok megjelenítése', icon: '⌨️' },
  { combo: 'mod+arrowright', description: 'Következő óra', icon: '➡️' },
  { combo: 'mod+arrowleft', description: 'Előző óra', icon: '⬅️' },
  { combo: ']', description: 'Következő óra (alternatív)', icon: '➡️' },
  { combo: '[', description: 'Előző óra (alternatív)', icon: '⬅️' },
  { combo: 'mod+home', description: 'Első óra', icon: '⏮️' },
  { combo: 'mod+end', description: 'Utolsó óra', icon: '⏭️' },
  { combo: 'escape', description: 'Modal bezárása', icon: '❌' }
];

  const helperStyles = {
    button: {
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      border: 'none',
      fontSize: '24px',
      cursor: 'pointer',
      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s ease',
      zIndex: 999
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1001,
      padding: '20px'
    },
    content: {
      background: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '500px',
      width: '100%',
      maxHeight: '80vh',
      overflowY: 'auto',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '25px',
      paddingBottom: '15px',
      borderBottom: '2px solid #e9ecef'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#495057',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    closeBtn: {
      background: 'transparent',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: '#6c757d',
      padding: '0',
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    shortcutsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    shortcutItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 15px',
      background: '#f8f9fa',
      borderRadius: '8px',
      transition: 'all 0.2s ease'
    },
    shortcutLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1
    },
    icon: {
      fontSize: '24px'
    },
    description: {
      color: '#495057',
      fontSize: '15px'
    },
    keys: {
      display: 'flex',
      gap: '4px',
      alignItems: 'center'
    },
    key: {
      background: 'white',
      padding: '4px 10px',
      borderRadius: '5px',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#667eea',
      border: '2px solid #667eea',
      minWidth: '30px',
      textAlign: 'center'
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        style={helperStyles.button}
        onClick={onOpen}
        title="Billentyűparancsok (Ctrl/⌘+K)"
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        }}
      >
        ⌨️
      </button>

      {/* Modal */}
      {isOpen && (
        <div 
          style={helperStyles.modal}
          onClick={onClose}
        >
          <div 
            style={helperStyles.content}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={helperStyles.header}>
              <div style={helperStyles.title}>
                ⌨️ Billentyűparancsok
              </div>
              <button
                style={helperStyles.closeBtn}
                onClick={onClose}
                title="Bezárás (ESC)"
              >
                ×
              </button>
            </div>

            <div style={helperStyles.shortcutsList}>
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index} 
                  style={helperStyles.shortcutItem}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = '#e9ecef';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={helperStyles.shortcutLeft}>
                    <span style={helperStyles.icon}>{shortcut.icon}</span>
                    <span style={helperStyles.description}>{shortcut.description}</span>
                  </div>
                  <div style={helperStyles.keys}>
                    {getShortcutDisplay(shortcut.combo).split('+').map((key, i, arr) => (
                      <React.Fragment key={i}>
                        <span style={helperStyles.key}>{key}</span>
                        {i < arr.length - 1 && <span style={{ color: '#6c757d' }}>+</span>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: '25px',
              padding: '15px',
              background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
              borderRadius: '8px',
              fontSize: '13px',
              color: '#155724'
            }}>
              💡 <strong>Tipp:</strong> Nyomd meg a <strong>{getShortcutDisplay('mod+k')}</strong> kombinációt 
              bármikor a billentyűparancsok megjelenítéséhez!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelper;
