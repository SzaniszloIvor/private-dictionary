# Billentyűparancsok & Dark Mode Telepítési Útmutató

## Előfeltételek

- React projekt (16.8+, hooks támogatás)
- Működő Private Dictionary alkalmazás
- Node.js 20.0.0+
- npm vagy yarn

## Verzió Információ

- **Verzió**: 0.3.1
- **React verzió**: 19.1.1+
- **Tailwind CSS**: 3.4.1
- **Utolsó frissítés**: 2025-10-04

## Telepítési Lépések

### 1. Tailwind CSS Telepítése (v0.3.0+)

```bash
npm install -D tailwindcss@3.4.1 postcss@8.4.35 autoprefixer@10.4.17
npx tailwindcss init -p
```

**Konfiguráció:**

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

```javascript
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 2. Keyboard Shortcuts Hook

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

### 3. Dark Mode Hook (v0.3.0+)

Hozd létre a `src/hooks/useDarkMode.js` fájlt:

```javascript
// src/hooks/useDarkMode.js
import { useState, useEffect } from 'react';

export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Load from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia && 
           window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Save to localStorage
    localStorage.setItem('darkMode', darkMode);
    
    // Toggle dark class on HTML element
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    // Listen to system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only update if user hasn't set preference manually
      const saved = localStorage.getItem('darkMode');
      if (saved === null) {
        setDarkMode(e.matches);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return { darkMode, toggleDarkMode };
};

export default useDarkMode;
```

### 4. KeyboardShortcutsHelper Komponens (Tailwind v0.3.0+)

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
    { combo: 'mod+d', description: 'Sötét mód kapcsolása', icon: '🌙' },
    { combo: 'mod+k', description: 'Billentyűparancsok megjelenítése', icon: '⌨️' },
    { combo: 'mod+arrowright', description: 'Következő óra', icon: '➡️' },
    { combo: 'mod+arrowleft', description: 'Előző óra', icon: '⬅️' },
    { combo: 'mod+home', description: 'Első óra', icon: '⏮️' },
    { combo: 'mod+end', description: 'Utolsó óra', icon: '⏭️' },
    { combo: 'escape', description: 'Modal bezárása', icon: '❌' }
  ];

  return (
    <>
      {/* Floating Action Button - ONLY on desktop */}
      <button
        onClick={onOpen}
        className="
          hidden md:flex
          fixed bottom-5 right-5 z-[999]
          w-12 h-12 rounded-full
          bg-gradient-to-r from-indigo-500 to-purple-600
          dark:from-indigo-600 dark:to-purple-700
          text-white text-2xl
          items-center justify-center
          shadow-lg hover:shadow-xl
          hover:scale-110 active:scale-95
          transition-all duration-300
        "
        title="Billentyűparancsok (Ctrl/⌘+K)"
      >
        ⌨️
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="
            fixed inset-0 z-[1001]
            bg-black/70 dark:bg-black/85
            flex items-center justify-center
            p-5 animate-fade-in
          "
        >
          {/* Modal Content */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="
              bg-white dark:bg-gray-800
              rounded-2xl shadow-2xl
              p-8 max-w-lg w-full
              max-h-[80vh] overflow-y-auto
              animate-slide-in-up
            "
          >
            {/* Header */}
            <div className="
              flex justify-between items-center
              mb-6 pb-4
              border-b-2 border-gray-200 dark:border-gray-700
            ">
              <div className="
                text-2xl font-bold
                text-gray-800 dark:text-gray-100
                flex items-center gap-3
              ">
                ⌨️ Billentyűparancsok
              </div>
              <button
                onClick={onClose}
                className="
                  text-gray-600 dark:text-gray-400
                  hover:text-gray-900 dark:hover:text-gray-100
                  text-3xl font-bold
                  w-8 h-8 flex items-center justify-center
                  hover:scale-110 active:scale-95
                  transition-transform duration-200
                "
                title="Bezárás (ESC)"
              >
                ×
              </button>
            </div>

            {/* Shortcuts List */}
            <div className="flex flex-col gap-3">
              {shortcuts.map((shortcut, index) => (
                <div 
                  key={index}
                  className="
                    flex justify-between items-center
                    p-3 rounded-lg
                    bg-gray-50 dark:bg-gray-700/50
                    hover:bg-gray-100 dark:hover:bg-gray-700
                    hover:translate-x-1
                    transition-all duration-200
                    group
                  "
                >
                  {/* Left side: Icon + Description */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl flex-shrink-0">
                      {shortcut.icon}
                    </span>
                    <span className="
                      text-gray-800 dark:text-gray-200
                      text-sm font-medium
                      truncate
                    ">
                      {shortcut.description}
                    </span>
                  </div>

                  {/* Right side: Key combinations */}
                  <div className="flex gap-1 items-center flex-shrink-0 ml-2">
                    {getShortcutDisplay(shortcut.combo).split('+').map((key, i, arr) => (
                      <React.Fragment key={i}>
                        <kbd className="
                          bg-white dark:bg-gray-900
                          text-indigo-600 dark:text-indigo-400
                          border-2 border-indigo-600 dark:border-indigo-400
                          px-2.5 py-1 rounded
                          text-xs font-bold
                          min-w-[32px] text-center
                          shadow-sm
                          group-hover:shadow-md
                          transition-shadow duration-200
                        ">
                          {key}
                        </kbd>
                        {i < arr.length - 1 && (
                          <span className="text-gray-500 dark:text-gray-400 text-sm">
                            +
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div className="
              mt-6 p-4 rounded-lg
              bg-gradient-to-r from-green-50 to-emerald-50
              dark:from-green-900/20 dark:to-emerald-900/20
              border border-green-200 dark:border-green-800
              text-sm
              text-green-800 dark:text-green-300
            ">
              💡 <strong>Tipp:</strong> Nyomd meg a{' '}
              <kbd className="
                bg-white dark:bg-gray-800
                text-green-700 dark:text-green-400
                border border-green-600 dark:border-green-500
                px-2 py-0.5 rounded text-xs font-bold
              ">
                {getShortcutDisplay('mod+k')}
              </kbd>{' '}
              kombinációt bármikor a billentyűparancsok megjelenítéséhez!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default KeyboardShortcutsHelper;
```

### 5. DarkModeToggle Komponens (v0.3.0+)

Hozd létre a `src/components/DarkModeToggle/DarkModeToggle.jsx` fájlt:

```javascript
// src/components/DarkModeToggle/DarkModeToggle.jsx
import React from 'react';

const DarkModeToggle = ({ darkMode, toggleDarkMode }) => {
  return (
    <button
      onClick={toggleDarkMode}
      className="fixed bottom-20 right-5 w-12 h-12 rounded-full 
                 bg-gradient-to-br from-yellow-400 to-yellow-500
                 dark:from-slate-700 dark:to-slate-800
                 text-white text-2xl
                 shadow-lg hover:shadow-xl
                 transform hover:scale-110 hover:rotate-12
                 transition-all duration-300
                 flex items-center justify-center
                 z-[998]
                 animate-fade-in"
      title={darkMode ? 'Váltás világos módra (Ctrl/⌘+D)' : 'Váltás sötét módra (Ctrl/⌘+D)'}
      aria-label={darkMode ? 'Váltás világos módra' : 'Váltás sötét módra'}
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
};

export default DarkModeToggle;
```

### 6. App.jsx Integráció (v0.3.0+)

Frissítsd az `src/App.jsx` fájlt:

```javascript
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper';
import DarkModeToggle from './components/DarkModeToggle';

const MainApp = () => {
  // Dark mode
  const { darkMode, toggleDarkMode } = useDarkMode();
  
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
      showToast('➕ Add new word');
    },
    'mod+f': (e) => {
      e.preventDefault();
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.select();
        showToast('🔍 Search activated');
      }
    },
    'mod+d': (e) => {
      e.preventDefault();
      toggleDarkMode();
      showToast(darkMode ? '☀️ Light mode' : '🌙 Dark mode');
    },
    'mod+k': (e) => {
      e.preventDefault();
      setShowShortcutsHelp(prev => !prev);
    },
    'mod+s': (e) => {
      e.preventDefault();
      setShowSaveNotification(true);
    },
    'mod+arrowright': (e) => {
      e.preventDefault();
      // Navigate to next lesson + showToast
    },
    'mod+arrowleft': (e) => {
      e.preventDefault();
      // Navigate to previous lesson + showToast
    },
    'mod+home': (e) => {
      e.preventDefault();
      // Navigate to first lesson + showToast
    },
    'mod+end': (e) => {
      e.preventDefault();
      // Navigate to last lesson + showToast
    },
    'escape': () => {
      if (showAddModal) setShowAddModal(false);
      else if (showShortcutsHelp) setShowShortcutsHelp(false);
    }
  }), [showAddModal, showShortcutsHelp, dictionary, currentLesson, darkMode, toggleDarkMode]);
  
  // Hook inicializálása
  useKeyboardShortcuts(shortcuts, !loading);
  
  // Cleanup for SaveNotification
  useEffect(() => {
    if (showSaveNotification) {
      const timer = setTimeout(() => {
        setShowSaveNotification(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSaveNotification]);
  
  // Toast komponens (Tailwind)
  const ToastNotification = () => {
    if (!toastMessage) return null;
    
    return (
      <div className="fixed bottom-20 right-5 z-[1000]
                    bg-gradient-to-r from-primary-600 to-primary-dark
                    text-white px-5 py-3 rounded-lg
                    shadow-lg animate-slide-in-right
                    max-w-[300px]">
        <div className="text-sm font-medium">
          {toastMessage}
        </div>
      </div>
    );
  };
  
  return (
    <div className="max-w-7xl mx-auto my-5 
                  bg-white dark:bg-slate-900 
                  rounded-2xl shadow-2xl overflow-hidden
                  transition-all duration-300">
      {/* ... meglévő komponensek ... */}
      
      <ToastNotification />
      <KeyboardShortcutsHelper 
        isOpen={showShortcutsHelp}
        onOpen={() => setShowShortcutsHelp(true)}
        onClose={() => setShowShortcutsHelp(false)}
      />
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  );
};
```

### 7. SearchControls Módosítás

Adj hozzá ref támogatást és Tailwind osztályokat:

```javascript
const SearchControls = ({ 
  searchTerm, 
  setSearchTerm, 
  filter, 
  setFilter,
  searchInputRef  // Új prop
}) => {
  return (
    <div className="p-5 bg-white dark:bg-slate-800 
                  border-b border-gray-200 dark:border-slate-700
                  flex flex-wrap gap-4 items-center
                  transition-all duration-300">
      <input
        ref={searchInputRef}  // Ref hozzáadása
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Keresés... (Ctrl/⌘+F)"
        className="flex-1 min-w-[200px] px-4 py-3
                 bg-white dark:bg-slate-700
                 text-gray-900 dark:text-gray-100
                 placeholder-gray-500 dark:placeholder-gray-400
                 border-2 border-gray-300 dark:border-slate-600
                 rounded-lg
                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-purple-500
                 focus:border-transparent
                 transition-all duration-200
                 text-base"
      />
    </div>
  );
};
```

### 8. CSS/Tailwind Beállítások

Frissítsd az `src/index.css` fájlt:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom Animations */
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* Apply animations */
.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-slide-in-up {
  animation: slide-in-up 0.4s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

/* Touch optimizations */
@layer base {
  .touch-none {
    touch-action: none !important;
    user-select: none;
  }
  
  .touch-auto {
    touch-action: auto !important;
  }
}

/* Focus styles */
:focus-visible {
  outline: 3px solid #667eea;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Dark mode scrollbar */
@media (prefers-color-scheme: dark) {
  ::-webkit-scrollbar-track {
    background: #1f2937;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #4b5563;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #6b7280;
  }
}
```

### 9. Vite Build Konfiguráció

Frissítsd a `vite.config.js` fájlt:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
```

## Tesztelés

### 1. Alapvető Tesztek

- ✅ `Ctrl+E` (vagy `⌘E` macOS-en) → Új szó modal megnyílik
- ✅ `Ctrl+F` → Keresés fókuszálódik
- ✅ `Ctrl+D` → Dark mode vált
- ✅ `Ctrl+K` → Súgó megjelenik (csak desktop)
- ✅ `ESC` → Modal bezáródik

### 2. Navigációs Tesztek

- ✅ `Ctrl+→` → Következő óra
- ✅ `Ctrl+←` → Előző óra
- ✅ `Ctrl+Home` → Első óra
- ✅ `Ctrl+End` → Utolsó óra

### 3. Toast Tesztek

- ✅ Minden navigációs parancs után jelenik-e meg a toast?
- ✅ A toast 2 másodperc után eltűnik?
- ✅ A toast animáció smooth?
- ✅ Dark mode-ban is jól látható?

### 4. Dark Mode Tesztek

- ✅ `Ctrl+D` váltja a dark mode-ot?
- ✅ localStorage-ban tárolódik?
- ✅ Oldal frissítés után megmarad?
- ✅ Rendszer preferencia érzékelése működik?
- ✅ Minden komponens dark mode-ban is jól néz ki?

### 5. Mobil Tesztek

- ✅ Keyboard shortcuts FAB rejtett mobilon?
- ✅ Dark mode toggle látható mobilon?
- ✅ Toast notifications jól jelennek meg?
- ✅ Touch optimalizáció működik? (drag & drop)

## Hibaelhárítás

### Hook nem működik

**Ellenőrzés:**
```javascript
console.log('Shortcuts enabled:', !loading);
console.log('Dark mode:', darkMode);
```

Ha `false`, akkor a hook le van tiltva.

### Toast nem jelenik meg

Ellenőrizd:
- `ToastNotification` komponens renderelve van?
- Tailwind animációk betöltődtek?
- z-index érték helyes? (`z-[1000]`)

### Dark mode nem vált

Ellenőrizd:
- localStorage írható? (privacy mode)
- `<html>` elem elérhető?
- Tailwind `darkMode: 'class'` konfiguráció helyes?
- `useDarkMode` hook helyesen importálva?

### Tailwind osztályok nem működnek

Ellenőrizd:
- `tailwind.config.js` content path helyes?
- `@tailwind` direktívák az `index.css`-ben?
- PostCSS konfiguráció helyes?
- Build után CSS purging működik?

### Billentyűparancs ütközés

Ha egy parancs nem működik, lehet hogy a böngésző alapértelmezett viselkedése ütközik. Használj alternatív kombinációt vagy add hozzá `preventDefault()`-et.

## Production Build

```bash
# Build
npm run build

# Preview
npm run preview
```

**Ellenőrzőlista:**
- ✅ Console.log üzenetek eltávolítva
- ✅ Tailwind CSS purging működik (~70% méretcsökkentés)
- ✅ Dark mode működik production-ben
- ✅ Keyboard shortcuts működnek
- ✅ localStorage persistence működik

## Migrációs Útmutató v0.2.0 → v0.3.1

### Eltávolítandó:

1. **Inline styles helyett Tailwind**:
   ```javascript
   // ELŐTTE
   style={{ background: 'white', padding: '20px' }}
   
   // UTÁNA
   className="bg-white p-5"
   ```

2. **Alternatív navigációs parancsok**:
   - ❌ `]` és `[` billentyűk eltávolítva
   - ✅ Csak `Ctrl+→/←` működik

3. **`src/styles/styles.js` fájl**:
   - Törölhető, már nem szükséges

### Hozzáadandó:

1. **Dark mode support**:
   - `useDarkMode` hook
   - `DarkModeToggle` komponens
   - `Ctrl+D` shortcut

2. **Tailwind CSS**:
   - Konfiguráció fájlok
   - Custom animációk
   - Dark mode osztályok

3. **Mobil optimalizáció**:
   - `hidden md:flex` a FAB-ra
   - Touch sensor optimalizáció (150ms/5px)

## Függőségek

```json
{
  "dependencies": {
    "react": "^19.1.1",
    "react-dom": "^19.1.1"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.1",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "vite": "^7.1.6"
  }
}
```

## Kapcsolódó Dokumentáció

- [KEYBOARD_SHORTCUTS.md](./KEYBOARD_SHORTCUTS.md) - Teljes dokumentáció
- [CHANGELOG.md](../../CHANGELOG.md) - Verzió történet
- [README.md](../../README.md) - Projekt README

## Támogatás

Ha problémákba ütközöl:
1. Ellenőrizd a [Hibaelhárítás](#hibaelhárítás) szekciót
2. Nézd meg a [CHANGELOG.md](../../CHANGELOG.md) fájlt
3. Ellenőrizd a browser konzolt hibákért

---

**Verzió**: 0.3.0  
**Utolsó frissítés**: 2025-10-04  
**Szerző**: Private Dictionary Team