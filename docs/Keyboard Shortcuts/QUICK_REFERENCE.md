# Billentyűparancsok - Gyors Referencia

## 🚀 Alapműveletek

| 🎯 Művelet | ⌨️ Windows/Linux | 🍎 macOS |
|-----------|-----------------|---------|
| Új szó | `Ctrl+E` | `⌘E` |
| Keresés | `Ctrl+F` | `⌘F` |
| Mentés | `Ctrl+S` | `⌘S` |
| Sötét mód | `Ctrl+D` | `⌘D` |
| **Kedvencek** | **`Ctrl+Shift+F`** | **`⌘⇧F`** |
| Súgó | `Ctrl+K` | `⌘K` |
| Bezárás | `ESC` | `ESC` |

## 🧭 Navigáció

| 🎯 Művelet | ⌨️ Windows/Linux | 🍎 macOS |
|-----------|-----------------|---------|
| Következő óra | `Ctrl+→` | `⌘→` |
| Előző óra | `Ctrl+←` | `⌘←` |
| Első óra | `Ctrl+Home` | `⌘Home` |
| Utolsó óra | `Ctrl+End` | `⌘End` |

## 💡 Tippek

- **Toast Notifications**: Minden navigációs műveletnél megjelenik egy értesítés
- **Kedvencek**: Jelöld meg fontos szavakat a ⭐ ikonnal, majd nyisd meg őket gyorsan `Ctrl+Shift+F`-fel
- **Keresés Kedvencekben**: A Kedvencek modal-ban kereshetsz angol és magyar szavak között
- **Sötét mód**: Automatikusan érzékeli a rendszer beállítását, manuálisan is váltható
- **Súgó Toggle**: `Ctrl+K` újbóli lenyomásával bezárható a súgó
- **Gyors tanulás**: Nyomd meg `Ctrl+K`-t a teljes lista megtekintéséhez
- **Platform-független**: Az alkalmazás automatikusan érzékeli az operációs rendszert

## 🎨 Új funkciók (v0.7.0)

- **⭐ Favorites System**: Kedvenc szavak jelölése és kezelése `Ctrl+Shift+F` billentyűparanccsal
- **Keresés & Szűrés**: Keresés angol/magyar szavak között, lecke szerinti szűrés
- **Gyors Navigáció**: Ugrás a kedvenc szó eredeti helyére egy kattintással
- **Cross-device Sync**: Kedvencek szinkronizálása Firebase-en keresztül (auth mode)
- **Unified Navigation**: Desktop navigációs sáv egységes gombokkal (144px × 40px)
- **Mobile Layout**: Kedvenc csillag bal oldalon, érintésbarát elrendezés

## 🎨 Korábbi funkciók

**v0.3.0+**:
- **Dark Mode Support**: Teljes sötét mód támogatás `Ctrl/⌘+D` billentyűparanccsal
- **Tailwind CSS**: Modern, reszponzív design mindkét témában
- **Optimalizált Touch**: Javított drag & drop mobil eszközökön
- **Enhanced Contrast**: Jobb olvashatóság sötét módban

## ⚠️ Fontos

- **Ctrl+N** nem használható (böngésző ütközés) → Használd helyette **Ctrl+E**-t
- **ESC** mindig bezár bármilyen modal-t (Add Words, Shortcuts, Favorites)
- A billentyűparancsok csak betöltött állapotban működnek
- Sötét mód és kedvencek beállítások localStorage-ban tárolódnak (demo mode)
- Kedvencek Firebase-ben szinkronizálódnak (authenticated mode)

## 📱 Mobil

Mobil eszközökön a billentyűparancsok nem érhetők el. Használd a képernyőn megjelenő gombokat:
- ⭐ gomb (fejléc) - Kedvencek megnyitása
- 🌙 gomb - Sötét mód váltás
- ⌨️ gomb - Billentyűparancsok súgó
- ⭐ ikon (minden szó mellett) - Kedvencekhez adás/eltávolítás
- ⋮⋮ ikon vagy teljes kártya - Drag & Drop átrendezéshez

## 🔄 Drag & Drop Tippek

**Desktop**: Fogd meg a sort bárhol (kivéve Műveletek oszlop) és húzd az új pozícióra.

**Mobil**: Tartsd nyomva bármelyik kártyát (a szövegen) 1 másodpercig, majd húzd az új pozícióba! A gombokra kattintva azok működése aktiválódik.

## ⭐ Kedvencek Gyors Útmutató

1. **Jelölés**: Kattints a ⭐ ikonra bármelyik szó mellett
2. **Megnyitás**: Nyomd meg `Ctrl+Shift+F`-et vagy kattints a "Kedvencek" gombra
3. **Keresés**: Írj be szavakat az angol vagy magyar keresőmezőbe
4. **Szűrés**: Válassz egy leckét a dropdown menüből
5. **Navigálás**: Kattints a "📍 Megnyitás" gombra az eredeti helyre ugráshoz
6. **Eltávolítás**: Kattints a "🗑️" gombra a kedvencekből való törléshez

## 🎯 Összes Billentyűparancs (12 db)

### Alapműveletek (7)
- `Ctrl/⌘+E` - Új szó hozzáadása
- `Ctrl/⌘+F` - Keresés aktiválása
- `Ctrl/⌘+S` - Mentési állapot mutatása
- `Ctrl/⌘+D` - Sötét/Világos mód váltása
- `Ctrl/⌘+Shift+F` - **Kedvencek megnyitása (ÚJ v0.7.0)**
- `Ctrl/⌘+K` - Billentyűparancsok súgója
- `ESC` - Aktív modal bezárása

### Navigáció (4)
- `Ctrl/⌘+→` - Következő lecke
- `Ctrl/⌘+←` - Előző lecke
- `Ctrl/⌘+Home` - Első lecke
- `Ctrl/⌘+End` - Utolsó lecke

---

## Verzió

- **Verzió**: 0.7.0
- **Utolsó frissítés**: 2025-10-11
- **Szerző**: Private Dictionary
- **Főbb változások**: Favorites system (Ctrl+Shift+F), unified desktop navigation, mobile improvements
- **Changelog**: [CHANGELOG.md](../../CHANGELOG.md)
