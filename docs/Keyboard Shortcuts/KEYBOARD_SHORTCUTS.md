# Billentyűparancsok Dokumentáció

## Áttekintés

A Private Dictionary alkalmazás teljes billentyűparancs-kezelő rendszert tartalmaz, amely lehetővé teszi a gyors navigációt és műveletvégzést billentyűzet segítségével.

## Elérhető Billentyűparancsok

### Alapvető Műveletek

| Parancs | Windows/Linux | macOS | Funkció |
|---------|---------------|-------|---------|
| Új szó | `Ctrl+E` | `⌘E` | Új szó hozzáadása modal megnyitása |
| Keresés | `Ctrl+F` | `⌘F` | Keresési mező fókuszálása |
| Mentés állapot | `Ctrl+S` | `⌘S` | Mentési értesítés megjelenítése |
| Súgó | `Ctrl+K` | `⌘K` | Billentyűparancsok listája (toggle) |
| Bezárás | `ESC` | `ESC` | Aktív modal bezárása |

### Navigáció (Órák között)

| Parancs | Windows/Linux | macOS | Funkció |
|---------|---------------|-------|---------|
| Következő óra | `Ctrl+→` vagy `]` | `⌘→` vagy `]` | Ugrás a következő órára |
| Előző óra | `Ctrl+←` vagy `[` | `⌘←` vagy `[` | Ugrás az előző órára |
| Első óra | `Ctrl+Home` | `⌘Home` | Ugrás az első órára |
| Utolsó óra | `Ctrl+End` | `⌘End` | Ugrás az utolsó órára |

## Visual Feedback

### Toast Notifications

Minden navigációs parancs vizuális visszajelzést ad toast notification formájában:

- **Következő/Előző óra**: `➡️ 2. óra címe` vagy `⬅️ 1. óra címe`
- **Első óra**: `⏮️ 1. óra címe`
- **Utolsó óra**: `⏭️ 5. óra címe`
- **Határok**: `⚠️ Ez az első/utolsó óra` (ha nincs több óra)
- **Új szó**: `➕ Új szó hozzáadása`
- **Keresés**: `🔍 Keresés aktiválva`

### Toast Stílus

- **Pozíció**: Jobb alsó sarok (80px a lap aljától)
- **Időtartam**: 2000ms (2 másodperc)
- **Animáció**: Slide in jobbról
- **Szín**: Gradient (lila árnyalatok)

## Architektúra

### Fájlstruktúra

```
src/
├── hooks/
│   └── useKeyboardShortcuts.js    # Core hook a billentyűparancsok kezeléséhez
├── components/
│   └── KeyboardShortcutsHelper/
│       └── KeyboardShortcutsHelper.jsx  # Súgó UI komponens
└── App.jsx                         # Főalkalmazás integrációval
```

### Komponensek

#### 1. useKeyboardShortcuts Hook

**Felelősség**: Event listener kezelés és billentyűkombinációk felismerése

**Paraméterek**:
- `shortcuts` (Object): Billentyűkombináció → callback párok
- `enabled` (Boolean): Hook engedélyezése/letiltása

**Működés**:
```javascript
const shortcuts = {
  'mod+e': (event) => { /* handler */ },
  'mod+arrowright': (event) => { /* handler */ }
};

useKeyboardShortcuts(shortcuts, !loading);
```

#### 2. KeyboardShortcutsHelper Komponens

**Felelősség**: Billentyűparancsok vizuális megjelenítése

**Props**:
- `isOpen` (Boolean): Modal láthatósága
- `onOpen` (Function): Modal megnyitása
- `onClose` (Function): Modal bezárása

**Jellemzők**:
- Floating action button (⌨️)
- Modal overlay teljes listával
- Platform-függő billentyűk megjelenítése

#### 3. Toast Notification

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

## Implementáció

### App.jsx Integráció

```javascript
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const MainApp = () => {
  // States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const searchInputRef = useRef(null);
  
  // Toast helper
  const showToast = (message, duration = 2000) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(''), duration);
  };
  
  // Shortcuts configuration
  const shortcuts = useMemo(() => ({
    'mod+e': (e) => {
      e.preventDefault();
      setShowAddModal(true);
      showToast('➕ Új szó hozzáadása');
    },
    // ... további parancsok
  }), [showAddModal, showShortcutsHelp, dictionary, currentLesson]);
  
  // Hook inicializálása
  useKeyboardShortcuts(shortcuts, !loading);
  
  return (
    <>
      {/* Komponensek */}
      <ToastNotification />
      <KeyboardShortcutsHelper />
    </>
  );
};
```

## Platform-specifikus Viselkedés

### macOS
- `mod` → `⌘` (Command)
- Meta key használata: `event.metaKey`
- Display: `⌘`, `⇧`, `⌥`

### Windows/Linux
- `mod` → `Ctrl`
- Control key használata: `event.ctrlKey`
- Display: `Ctrl`, `Shift`, `Alt`

### Automatikus detekció

```javascript
const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
const modKey = isMac ? event.metaKey : event.ctrlKey;
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
}), [relevantDependencies]);
```

### 3. Dependency Array

Csak azokat a state-eket add hozzá a dependency array-hez, amelyeket a handlerek használnak:

```javascript
useMemo(() => ({
  'escape': () => {
    if (showAddModal) setShowAddModal(false);
  }
}), [showAddModal]); // showAddModal szükséges
```

### 4. Toast Messages

Tömör, informatív üzenetek használata:
- Ikon + rövid szöveg
- Emoji a gyors felismeréshez
- Maximum 2-3 másodperc megjelenítés

## Hibaelhárítás

### Probléma: Billentyűparancs nem működik

**Ellenőrzés**:
1. Hook enabled? → `useKeyboardShortcuts(shortcuts, !loading)`
2. Helyes kombináció? → Nézd meg a console.log-okat
3. preventDefault hívva? → Ellenőrizd a handler-t

### Probléma: Böngésző alapértelmezett viselkedés

Néhány kombináció (pl. `Ctrl+N`, `Ctrl+W`) nem felülírható. Használj alternatív kombinációt.

### Probléma: Toast nem jelenik meg

Ellenőrizd:
- `toastMessage` state frissül?
- `ToastNotification` komponens renderelve van?
- CSS animációk betöltődtek?

## Jövőbeli Fejlesztések

- [ ] Testreszabható billentyűparancsok
- [ ] Billentyűparancsok export/import
- [ ] Globális billentyűparancsok projekten kívül
- [ ] Hangos visszajelzés opció
- [ ] Billentyűparancs történet (history)
- [ ] Konfliktus detekció és figyelmeztetés

## Kapcsolódó Fájlok

- `src/hooks/useKeyboardShortcuts.js` - Core hook
- `src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx` - UI komponens
- `src/App.jsx` - Integráció
- `src/index.css` - Animációk és stílusok

## Verzió

- **Verzió**: 1.0.1
- **Utolsó frissítés**: 2025-10-02
- **Szerző**: Private Dictionary