# Billentyűparancsok Telepítési Útmutató

## Előfeltételek

- React projekt (16.8+, hooks támogatás)
- Működő Private Dictionary alkalmazás

## Telepítési Lépések

### 1. Hook Létrehozása

Hozd létre a `src/hooks/useKeyboardShortcuts.js` fájlt:

```javascript
// src/hooks/useKeyboardShortcuts.js
import { useEffect, useCallback } from 'react';

export const useKeyboardShortcuts = (shortcuts = {}, enabled = true) => {
  const handleKeyDown = useCallback((event) => {
    if (!enabled) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const modKey = isMac ? event.metaKey : event.ctrlKey;
    
    const key = event.key.toLowerCase();
    const combo = [];
    
    if (modKey) combo.push('mod');
    if (event.shiftKey) combo.push('shift');
    if (event.altKey) combo.push('alt');
    combo.push(key);
    
    const comboString = combo.join('+');
    
    if (shortcuts[comboString]) {
      event.preventDefault();
      event.stopPropagation();
      shortcuts[comboString](event);
      return;
    }
    
    if (shortcuts[key] && !modKey && !event.shiftKey && !event.altKey) {
      shortcuts[key](event);
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, enabled]);
};

export const getShortcutDisplay = (shortcut) => {
  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';
  
  return shortcut
    .replace('mod', modKey)
    .replace('shift', isMac ? '⇧' : 'Shift')
    .replace('alt', isMac ? '⌥' : 'Alt')
    .split('+')
    .map(key => key.charAt(0).toUpperCase() + key.slice(1))
    .join('+');
};

export default useKeyboardShortcuts;
```

### 2. KeyboardShortcutsHelper Komponens

Hozd létre a `src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx` fájlt:

```javascript
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
```

### 3. App.jsx Módosítások

Frissítsd az `src/App.jsx` fájlt:

```javascript
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper/KeyboardShortcutsHelper';

const MainApp = () => {
  // ... meglévő state-ek ...
  
  // Új state-ek
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef(null);
  
  // Toast helper
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };
  
  // Shortcuts konfiguráció
  const shortcuts = useMemo(() => ({
    'mod+e': (e) => {
      e.preventDefault();
      e.stopPropagation();
      setShowAddModal(true);
      showToast('➕ Új szó hozzáadása');
    },
    'mod+f': (e) => {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
        showToast('🔍 Keresés aktiválva');
      }
    },
    // ... további shortcuts
  }), [showAddModal, showShortcutsHelp, dictionary, currentLesson]);
  
  // Hook inicializálása
  useKeyboardShortcuts(shortcuts, !loading);
  
  // Toast komponens
  const ToastNotification = () => {
    if (!toastMessage) return null;
    
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '80px',
          right: '20px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
          zIndex: 1000,
          animation: 'slideInRight 0.3s ease-out',
          fontSize: '14px',
          fontWeight: '500',
          maxWidth: '300px'
        }}
      >
        {toastMessage}
      </div>
    );
  };
  
  return (
    <div>
      {/* ... meglévő komponensek ... */}
      
      <ToastNotification />
      <KeyboardShortcutsHelper 
        isOpen={showShortcutsHelp}
        onOpen={() => setShowShortcutsHelp(true)}
        onClose={() => setShowShortcutsHelp(false)}
      />
    </div>
  );
};
```

### 4. SearchControls Módosítás

Adj hozzá ref támogatást a `SearchControls` komponenshez:

```javascript
const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filter, 
  setFilter,
  searchInputRef  // Új prop
}) => {
  return (
    <div>
      <input
        ref={searchInputRef}  // Ref hozzáadása
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Keresés... (Ctrl/⌘+F)"
      />
    </div>
  );
};
```

### 5. CSS Animációk

Add hozzá az `src/index.css` fájlhoz:

```css
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.save-notification {
  animation: slideInRight 0.3s ease-out;
}
```

## Tesztelés

### 1. Alapvető Tesztek

- Nyomd meg `Ctrl+E` (vagy `⌘E` macOS-en) → Új szó modal megnyílik
- Nyomd meg `Ctrl+F` → Keresés fókuszálódik
- Nyomd meg `Ctrl+K` → Súgó megjelenik
- Nyomd meg `ESC` → Modal bezáródik

### 2. Navigációs Tesztek

- Nyomd meg `Ctrl+→` vagy `]` → Következő óra
- Nyomd meg `Ctrl+←` vagy `[` → Előző óra
- Nyomd meg `Ctrl+Home` → Első óra
- Nyomd meg `Ctrl+End` → Utolsó óra

### 3. Toast Tesztek

- Minden navigációs parancs után jelenik-e meg a toast?
- A toast 2 másodperc után eltűnik?
- A toast animáció smooth?

## Hibaelhárítás

### Hook nem működik

**Ellenőrzés:**
```javascript
console.log('Shortcuts enabled:', !loading);
```

Ha `false`, akkor a hook le van tiltva.

### Toast nem jelenik meg

Ellenőrizd, hogy a `ToastNotification` komponens renderelve van-e.

### Billentyűparancs ütközés

Ha egy parancs nem működik, lehet hogy a böngésző alapértelmezett viselkedése ütközik. Használj alternatív kombinációt.

## Verzió Információ

- **Verzió**: 1.0.1
- **React verzió**: 16.8+
- **Utolsó frissítés**: 2025-10-02