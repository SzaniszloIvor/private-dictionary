# Billentyűparancsok Dokumentáció

## Áttekintés

A Private Dictionary alkalmazás teljes billentyűparancs-kezelő rendszert tartalmaz, amely lehetővé teszi a gyors navigációt és műveletvégzést billentyűzet segítségével. A v0.7.0 óta támogatja a kedvencek (favorites) kezelést is billentyűparanccsal.

## Elérhető Billentyűparancsok

### Alapvető Műveletek

| Parancs | Windows/Linux | macOS | Funkció |
|---------|---------------|-------|---------|
| Új szó | `Ctrl+E` | `⌘E` | Új szó hozzáadása modal megnyitása |
| Keresés | `Ctrl+F` | `⌘F` | Keresési mező fókuszálása |
| Mentés állapot | `Ctrl+S` | `⌘S` | Mentési értesítés megjelenítése |
| Sötét mód | `Ctrl+D` | `⌘D` | Sötét/világos mód váltása |
| Kedvencek | `Ctrl+Shift+F` | `⌘⇧F` | **Kedvencek modal megnyitása (ÚJ v0.7.0)** |
| Súgó | `Ctrl+K` | `⌘K` | Billentyűparancsok listája (toggle) |
| Bezárás | `ESC` | `ESC` | Aktív modal bezárása (Add Words, Shortcuts, Favorites) |

### Navigáció (Órák között)

| Parancs | Windows/Linux | macOS | Funkció |
|---------|---------------|-------|---------|
| Következő óra | `Ctrl+→` | `⌘→` | Ugrás a következő órára |
| Előző óra | `Ctrl+←` | `⌘←` | Ugrás az előző órára |
| Első óra | `Ctrl+Home` | `⌘Home` | Ugrás az első órára |
| Utolsó óra | `Ctrl+End` | `⌘End` | Ugrás az utolsó órára |

> **Megjegyzés**: A v0.3.0 óta az alternatív navigációs parancsok (`]` és `[`) el lettek távolítva a jobb UX érdekében.

## Visual Feedback

### Toast Notifications

Minden navigációs parancs vizuális visszajelzést ad toast notification formájában:

- **Következő/Előző óra**: `➡️ 2. óra címe` vagy `⬅️ 1. óra címe`
- **Első óra**: `⏮️ 1. óra címe`
- **Utolsó óra**: `⏭️ 5. óra címe`
- **Határok**: `⚠️ Ez az első/utolsó óra` (ha nincs több óra)
- **Új szó**: `➕ Új szó hozzáadása`
- **Keresés**: `🔍 Keresés aktiválva`
- **Sötét mód**: `🌙 Sötét mód` vagy `☀️ Világos mód`
- **Kedvencek**: `⭐ Kedvencek megnyitása` **(ÚJ v0.7.0)**

### Toast Stílus (Tailwind CSS)

- **Pozíció**: Jobb alsó sarok (80px a lap aljától)
- **Időtartam**: 2000ms (2 másodperc)
- **Animáció**: `animate-slide-in-right` (Tailwind custom animation)
- **Szín**: `bg-gradient-to-r from-primary-600 to-primary-dark`
- **Dark Mode**: Automatikus alkalmazkodás sötét témához

## Favorites System (v0.7.0+)

### Funkcionalitás

- **Gyors hozzáférés**: `Ctrl+Shift+F` billentyűparancs
- **Keresés**: Szűrés angol és magyar szavak között
- **Lesson filter**: Kedvencek szűrése lecke szerint
- **Navigáció**: Ugrás a szó eredeti helyére
- **Eltávolítás**: Kedvencekből való törlés egy kattintással
- **Persistence**: Firebase (auth) vagy localStorage (demo)

### Implementáció

```javascript
// Favorites modal toggle
'mod+shift+f': (e) => {
  e.preventDefault();
  setShowFavoritesModal(true);
  showToast('⭐ Kedvencek megnyitása');
}

// Escape key - bezárja a favorites modal-t is
'escape': () => {
  if (showAddModal) setShowAddModal(false);
  else if (showShortcutsHelp) setShowShortcutsHelp(false);
  else if (showFavoritesModal) setShowFavoritesModal(false);
}
```

## Dark Mode Support (v0.3.0+)

### Funkcionalitás

- **Automatikus érzékelés**: Rendszer preferencia alapján (`prefers-color-scheme: dark`)
- **Manuális váltás**: `Ctrl/⌘+D` billentyűparancs vagy 🌙 gomb
- **Persistence**: localStorage-ban tárolva (`darkMode` kulcs)
- **Smooth transitions**: Átmenetek minden komponensen
- **Enhanced contrast**: Javított kontraszt sötét módban

### Implementáció

```javascript
// Dark mode hook használata
const { darkMode, toggleDarkMode } = useDarkMode();

// Keyboard shortcut
'mod+d': (e) => {
  e.preventDefault();
  toggleDarkMode();
  showToast(darkMode ? '☀️ Világos mód' : '🌙 Sötét mód');
}
```

### CSS Class Strategy

```javascript
// HTML root element
<html class="dark">  {/* vagy class nélkül világos módban */}

// Tailwind dark: variant használata
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
```

## Architektúra

### Fájlstruktúra

```
src/
├── hooks/
│   ├── useKeyboardShortcuts.js    # Core hook a billentyűparancsok kezeléséhez
│   ├── useDarkMode.js             # Dark mode hook (v0.3.0+)
│   └── useFavorites.js            # Favorites hook (v0.7.0+)
├── components/
│   ├── KeyboardShortcutsHelper/
│   │   └── KeyboardShortcutsHelper.jsx  # Súgó UI komponens (Tailwind)
│   ├── DarkModeToggle/
│   │   └── DarkModeToggle.jsx     # Dark mode toggle button (v0.3.0+)
│   ├── FavoriteButton/
│   │   └── FavoriteButton.jsx     # Favorite star button (v0.7.0+)
│   └── FavoritesModal/
│       └── FavoritesModal.jsx     # Favorites browser modal (v0.7.0+)
├── utils/
│   ├── favoritesHelper.js         # localStorage utilities (v0.7.0+)
│   └── migration.js               # Data migration (v0.7.0+)
├── App.jsx                         # Főalkalmazás integrációval
└── index.css                       # Tailwind directives + custom animations
```

### Komponensek

#### 1. useKeyboardShortcuts Hook

**Felelősség**: Event listener kezelés és billentyűkombinációk felismerése

**Paraméterek**:
- `shortcuts` (Object): Billentyűkombináció → callback párok
- `enabled` (Boolean): Hook engedélyezése/letiltása

**Működés**:
```javascript
const shortcuts = useMemo(() => ({
  'mod+e': (event) => { /* handler */ },
  'mod+d': (event) => { /* dark mode toggle */ },
  'mod+shift+f': (event) => { /* favorites modal */ }, // ÚJ v0.7.0
  'mod+arrowright': (event) => { /* handler */ }
}), [dependencies, darkMode, showFavoritesModal]);

useKeyboardShortcuts(shortcuts, !loading);
```

#### 2. useFavorites Hook (v0.7.0+)

**Felelősség**: Kedvencek állapot és műveletek kezelése

**Működés**:
```javascript
export const useFavorites = (userId, isDemo, dictionary) => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Toggle favorite
  const toggleFavorite = async (lessonId, wordIndex) => {
    const word = dictionary[lessonId]?.words[wordIndex];
    const newValue = !word.isFavorite;
    
    if (isDemo) {
      // localStorage implementation
      toggleDemoFavorite(lessonId, wordIndex, newValue);
    } else {
      // Firebase implementation
      await toggleFavoriteInFirebase(userId, lessonId, wordIndex, newValue);
    }
    
    await refreshFavorites();
  };

  // Check if favorited
  const isFavorited = (lessonId, wordIndex) => {
    return favorites.some(
      f => f.lessonId === lessonId && f.wordIndex === wordIndex
    );
  };

  return {
    favorites,
    favoritesCount,
    loading,
    toggleFavorite,
    isFavorited,
    refreshFavorites
  };
};
```

#### 3. useDarkMode Hook (v0.3.0+)

**Felelősség**: Sötét mód állapot kezelése

**Működés**:
```javascript
export const useDarkMode = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return { darkMode, toggleDarkMode };
};
```

#### 4. KeyboardShortcutsHelper Komponens

**Felelősség**: Billentyűparancsok vizuális megjelenítése

**Props**:
- `isOpen` (Boolean): Modal láthatósága
- `onOpen` (Function): Modal megnyitása
- `onClose` (Function): Modal bezárása

**Jellemzők (v0.7.0)**:
- Floating action button (⌨️) - **Desktop only** (`hidden md:flex`)
- Modal overlay teljes listával (Tailwind CSS)
- **12 parancs** megjelenítése (új: Ctrl+Shift+F)
- Platform-függő billentyűk megjelenítése
- Dark mode támogatás (`dark:bg-gray-800`, `dark:text-gray-100`)
- Enhanced contrast sötét módban
- **Mobil eszközökön rejtett** a jobb UX érdekében

#### 5. FavoritesModal Komponens (v0.7.0+)

**Felelősség**: Kedvencek böngészése és kezelése

**Props**:
- `isOpen` (Boolean): Modal láthatósága
- `onClose` (Function): Modal bezárása
- `favorites` (Array): Kedvenc szavak listája
- `onToggleFavorite` (Function): Kedvenc toggle callback
- `onNavigateToWord` (Function): Navigálás a szóhoz

**Funkciók**:
- Keresés angol és magyar szavak között
- Lesson filter dropdown
- Responsive grid (1 col mobile, 2 cols desktop)
- Navigálás a szó helyére
- Eltávolítás kedvencekből
- Empty state onboarding

#### 6. DarkModeToggle Komponens (v0.3.0+)

**Felelősség**: Sötét mód váltó gomb UI

**Props**:
- `darkMode` (Boolean): Aktuális állapot
- `toggleDarkMode` (Function): Váltó funkció

**Megjelenés**:
```jsx
<button
  onClick={toggleDarkMode}
  className="fixed bottom-20 right-5 w-12 h-12 rounded-full 
             bg-gradient-to-br from-yellow-400 to-yellow-500
             dark:from-slate-700 dark:to-slate-800
             text-white text-2xl shadow-lg hover:shadow-xl
             transform hover:scale-110 hover:rotate-12
             transition-all duration-300"
  title={darkMode ? 'Váltás világos módra (Ctrl/⌘+D)' : 'Váltás sötét módra (Ctrl/⌘+D)'}
>
  {darkMode ? '🌙' : '☀️'}
</button>
```

#### 7. Toast Notification

**Felelősség**: Gyors vizuális visszajelzés

**State**:
```javascript
const [toastMessage, setToastMessage] = useState('');
```

**Helper funkció**:
```javascript
const showToast = (message, duration = 2000) => {
  setToastMessage(message);
  setTimeout(() => setToastMessage(''), duration);
};
```

**Tailwind styling**:
```jsx
<div className="fixed bottom-20 right-5 z-[1000]
                bg-gradient-to-r from-primary-600 to-primary-dark
                text-white px-5 py-3 rounded-lg
                shadow-lg animate-slide-in-right
                max-w-[300px]">
  {toastMessage}
</div>
```

## Implementáció

### App.jsx Integráció (v0.7.0)

```javascript
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDarkMode } from './hooks/useDarkMode';
import { useFavorites } from './hooks/useFavorites';
import KeyboardShortcutsHelper from './components/KeyboardShortcutsHelper';
import DarkModeToggle from './components/DarkModeToggle';
import FavoritesModal from './components/FavoritesModal';

const MainApp = () => {
  // Dark mode
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  // Favorites (ÚJ v0.7.0)
  const {
    favorites,
    favoritesCount,
    toggleFavorite,
    isFavorited,
    refreshFavorites
  } = useFavorites(user?.uid, isDemo, dictionary);
  
  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [showFavoritesModal, setShowFavoritesModal] = useState(false); // ÚJ
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef(null);
  
  // Toast helper
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };
  
  // Shortcuts configuration (Frissítve v0.7.0)
  const shortcuts = useMemo(() => ({
    'mod+e': (e) => {
      e.preventDefault();
      setShowAddModal(true);
      showToast('➕ Új szó hozzáadása');
    },
    'mod+d': (e) => {
      e.preventDefault();
      toggleDarkMode();
      showToast(darkMode ? '☀️ Világos mód' : '🌙 Sötét mód');
    },
    'mod+shift+f': (e) => {  // ÚJ v0.7.0
      e.preventDefault();
      setShowFavoritesModal(true);
      showToast('⭐ Kedvencek megnyitása');
    },
    'escape': () => {  // Bővítve v0.7.0
      if (showAddModal) setShowAddModal(false);
      else if (showShortcutsHelp) setShowShortcutsHelp(false);
      else if (showFavoritesModal) setShowFavoritesModal(false);
    },
    // ... további parancsok
  }), [
    showAddModal,
    showShortcutsHelp,
    showFavoritesModal,
    dictionary,
    currentLesson,
    darkMode
  ]);
  
  // Hook inicializálása
  useKeyboardShortcuts(shortcuts, !loading);
  
  return (
    <>
      {/* Komponensek */}
      <ToastNotification />
      <KeyboardShortcutsHelper 
        isOpen={showShortcutsHelp}
        onOpen={() => setShowShortcutsHelp(true)}
        onClose={() => setShowShortcutsHelp(false)}
      />
      <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      {/* ÚJ v0.7.0 */}
      <FavoritesModal
        isOpen={showFavoritesModal}
        onClose={() => setShowFavoritesModal(false)}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onNavigateToWord={handleNavigateToWord}
      />
    </>
  );
};
```

## Platform-specifikus Viselkedés

### macOS
- `mod` → `⌘` (Command)
- Meta key használata: `event.metaKey`
- Display: `⌘`, `⇧`, `⌥`
- Favorites: `⌘⇧F` **(v0.7.0)**

### Windows/Linux
- `mod` → `Ctrl`
- Control key használata: `event.ctrlKey`
- Display: `Ctrl`, `Shift`, `Alt`
- Favorites: `Ctrl+Shift+F` **(v0.7.0)**

### Automatikus detekció

```javascript
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? event.metaKey : event.ctrlKey;
const shiftKey = event.shiftKey;
```

## Best Practices

### 1. Prevent Default Viselkedés

Mindig használj `preventDefault()`-et konfliktusok elkerülésére:

```javascript
'mod+f': (e) => {
  e.preventDefault();  // Megakadályozza a böngésző keresést
  // ...
}
```

### 2. useMemo Használata

A shortcuts objektumot memoizáld a felesleges re-render elkerülésére:

```javascript
const shortcuts = useMemo(() => ({
  // ...
}), [
  relevantDependencies,
  darkMode,
  showFavoritesModal  // ÚJ v0.7.0
]);
```

### 3. Dependency Array

Csak azokat a state-eket add hozzá a dependency array-hez, amelyeket a handlerek használnak:

```javascript
useMemo(() => ({
  'escape': () => {
    if (showAddModal) setShowAddModal(false);
    else if (showFavoritesModal) setShowFavoritesModal(false);
  },
  'mod+d': () => {
    toggleDarkMode(); // darkMode kell a dependency-be
  }
}), [showAddModal, showFavoritesModal, darkMode]); // mindhárom dependency szükséges
```

### 4. Toast Messages

Tömör, informatív üzenetek használata:
- Ikon + rövid szöveg
- Emoji a gyors felismeréshez
- Maximum 2-3 másodperc megjelenítés
- Dark mode automatikus alkalmazkodás (Tailwind)

### 5. Tailwind CSS (v0.3.0+)

Utility-first megközelítés:
- Használj Tailwind utility osztályokat inline stylesok helyett
- Dark mode: `dark:` prefix használata
- Responsive: `md:`, `lg:` breakpoint-ok
- Custom animations: `animate-` prefix

## Responsive Design & Mobil

### Desktop (≥768px)
- Teljes billentyűparancs támogatás (12 parancs)
- Keyboard Shortcuts Helper FAB látható (`md:flex`)
- Favorites modal teljes funkcionalitással
- Toast notifications jobb alsó sarokban

### Mobil (<768px)
- Billentyűparancsok nem érhetőek el
- Keyboard Shortcuts Helper FAB rejtett (`hidden md:flex`)
- Favorites elérhető navigációs gombon keresztül
- Dark mode toggle látható (🌙 gomb)
- Touch-optimalizált drag & drop
- Érintés-barát gombok és UI elemek

## Hibaelhárítás

### Probléma: Billentyűparancs nem működik

**Ellenőrzés**:
1. Hook enabled? → `useKeyboardShortcuts(shortcuts, !loading)`
2. Helyes kombináció? → Nézd meg a console.log-okat
3. preventDefault hívva? → Ellenőrizd a handler-t
4. Dependencies frissek? → Ellenőrizd a useMemo dependency array-t

### Probléma: Böngésző alapértelmezett viselkedés

Néhány kombináció (pl. `Ctrl+N`, `Ctrl+W`) nem felülírható. Használj alternatív kombinációt.

### Probléma: Toast nem jelenik meg

Ellenőrizd:
- `toastMessage` state frissül?
- `ToastNotification` komponens renderelve van?
- Tailwind animációk betöltődtek? (`animate-slide-in-right`)
- Dark mode osztályok helyesek?

### Probléma: Dark mode nem vált

Ellenőrizd:
- `useDarkMode` hook importálva?
- localStorage írható? (privacy mode)
- `<html>` elem elérhető? (`document.documentElement`)
- Tailwind `darkMode: 'class'` konfiguráció helyes?

### Probléma: Favorites modal nem nyílik meg (v0.7.0)

Ellenőrizd:
- `Ctrl+Shift+F` helyesen lenyomva?
- `showFavoritesModal` state frissül?
- `FavoritesModal` komponens renderelve van?
- `useFavorites` hook inicializálva?
- Favorites data betöltődött?

## Tailwind CSS Integráció (v0.3.0+)

### Konfiguráció

```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',  // class strategy használata
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### Custom Animations

```css
/* src/index.css */
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

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
```

### Utility Classes

- **Touch**: `.touch-none`, `.touch-auto`
- **Cursor**: `.cursor-grab`, `.cursor-grabbing`
- **Animations**: `.animate-fade-in`, `.animate-slide-in-up`, `.animate-slide-in-right`
- **Dark Mode**: `dark:bg-*`, `dark:text-*`, `dark:border-*`

## Jövőbeli Fejlesztések

- [ ] Testreszabható billentyűparancsok
- [ ] Billentyűparancsok export/import
- [ ] Globális billentyűparancsok projekten kívül
- [ ] Hangos visszajelzés opció
- [ ] Billentyűparancs történet (history)
- [ ] Konfliktus detekció és figyelmeztetés
- [ ] Több dark mode téma (gray, blue, purple)
- [ ] Scheduled dark mode (auto-switch időpont alapján)
- [ ] Favorites gyors hozzáadás (Ctrl+B jelenlegi szónál) **(v0.7.0 ötlet)**
- [ ] Favorites export (PDF, CSV, Anki)

## Kapcsolódó Fájlok

- `src/hooks/useKeyboardShortcuts.js` - Core hook
- `src/hooks/useDarkMode.js` - Dark mode hook (v0.3.0+)
- `src/hooks/useFavorites.js` - Favorites hook (v0.7.0+)
- `src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx` - UI komponens (Tailwind)
- `src/components/DarkModeToggle/DarkModeToggle.jsx` - Dark mode toggle (v0.3.0+)
- `src/components/FavoriteButton/FavoriteButton.jsx` - Favorite button (v0.7.0+)
- `src/components/FavoritesModal/FavoritesModal.jsx` - Favorites modal (v0.7.0+)
- `src/utils/favoritesHelper.js` - Favorites utilities (v0.7.0+)
- `src/App.jsx` - Integráció
- `src/index.css` - Tailwind directives + custom animations
- `tailwind.config.js` - Tailwind konfiguráció
- `CHANGELOG.md` - Verzió történet

## Verzió

- **Verzió**: 0.7.0
- **Utolsó frissítés**: 2025-10-11
- **Szerző**: Private Dictionary
- **Főbb változások**: Favorites system (Ctrl+Shift+F), unified desktop navigation, mobile layout improvements

## Changelog Hivatkozás

Részletes változások listája: [CHANGELOG.md](../../CHANGELOG.md)
