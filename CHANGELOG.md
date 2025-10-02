# 📦 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 

---

## [0.2.0] - 2025-10-02

### Added
- **Comprehensive Keyboard Shortcuts System**
  - Implemented 11 productivity keyboard shortcuts for efficient navigation and actions.
  - Cross-platform support: automatic detection of Windows/Linux (Ctrl) vs macOS (⌘).
  - Custom `useKeyboardShortcuts` hook for global shortcut management.
  - KeyboardShortcutsHelper component with floating action button and modal.
  - Shortcuts help modal accessible via `Ctrl/⌘+K` or floating ⌨️ button.
  - Complete keyboard shortcuts documentation in `docs/` directory.

- **Keyboard Shortcuts List**
  - `Ctrl/⌘+E` - Open add words modal (replaces Ctrl+N due to browser conflicts).
  - `Ctrl/⌘+F` - Focus and select search input.
  - `Ctrl/⌘+S` - Show save notification status.
  - `Ctrl/⌘+K` - Toggle keyboard shortcuts help modal.
  - `Ctrl/⌘+→` or `]` - Navigate to next lesson.
  - `Ctrl/⌘+←` or `[` - Navigate to previous lesson.
  - `Ctrl/⌘+Home` - Jump to first lesson.
  - `Ctrl/⌘+End` - Jump to last lesson.
  - `ESC` - Close active modal (add words, shortcuts help).

- **Visual Feedback System**
  - Toast notifications for all navigation actions (2-second duration).
  - Toast messages display lesson titles when navigating.
  - Boundary warnings when at first/last lesson.
  - Save notification component with 3-second auto-hide.
  - Toast positioned at bottom-right (80px from bottom) to avoid FAB overlap.

- **Documentation**
  - `docs/KEYBOARD_SHORTCUTS.md` - Comprehensive feature documentation.
  - `docs/INSTALLATION.md` - Step-by-step installation guide.
  - `docs/QUICK_REFERENCE.md` - Quick installation reference with checklist.
  - `docs/ARCHITECTURE.md` - Technical architecture and design documentation.
  - `docs/keyboard-shortcuts-cheatsheet.html` - Interactive HTML cheat sheet with platform toggle.

- **Full-Featured Demo Mode**
  - Demo mode now includes all authenticated user features with storage limits.
  - Maximum 2 lessons available in demo mode.
  - Maximum 20 words per lesson in demo mode.
  - Demo-specific UI indicators showing word count limits and lesson restrictions.
  - Full keyboard shortcuts support in demo mode.

- **localStorage Persistence for Demo Mode**
  - Demo dictionary data now persists across page refreshes using browser localStorage.
  - Automatic save functionality for demo changes.
  - Demo data is cleared on logout for privacy.

- **Production Build Optimization**
  - Configured Vite with terser to automatically remove console.log statements in production builds.
  - Cleaner production code with reduced bundle size.

- **Mobile Drag & Drop Enhancements**
  - Added visual drag handle indicator (⋮⋮) on mobile word cards for better UX.
  - Implemented `DragOverlay` component for improved visual feedback during drag operations.
  - Added haptic vibration feedback on drag start and successful drop (when supported).
  - Usage hint tooltip for first-time mobile users explaining drag & drop functionality.
  - Enhanced shadow effects and scale animation during active drag state.

### Changed
- SearchControls component now accepts `searchInputRef` prop for keyboard focus support.
- App.jsx refactored with `useMemo` for shortcuts configuration to prevent unnecessary re-renders.
- Keyboard shortcuts are disabled during initial data loading for safety.
- Save notification now uses `useEffect` cleanup to prevent memory leaks.
- Demo mode now has feature parity with authenticated mode (drag & drop, delete, rename, keyboard shortcuts).
- Improved error handling for localStorage operations.
- Updated README.md with comprehensive keyboard shortcuts section and documentation links.
- **Drag & Drop Sensor Configuration**
  - Separated sensor logic for desktop (`PointerSensor`) and mobile (`TouchSensor`).
  - Desktop uses 8px distance activation constraint for precise control.
  - Mobile uses 200ms delay + 8px tolerance to prevent accidental drags while scrolling.
  - Both sensors now work simultaneously without conflicts.

### Fixed
- **Drag & Drop Persistence**
  - Fixed drag & drop position changes not being saved to database/localStorage.
  - Word reordering now properly persists across page refreshes in both demo and authenticated modes.
  - Improved drag & drop read speed to ≤1.2s for better performance.
  - **CRITICAL FIX: Mobile drag & drop now works on touch devices.**
  - Fixed touch events being captured by scroll instead of drag gesture.
  - Resolved conflict between native scroll and drag activation on mobile devices.

- **Word Deletion**
  - Fixed word deletion functionality in both demo and authenticated modes.
  - Added proper validation and confirmation dialogs for delete actions.

- **Lesson Management**
  - Added validation to prevent deletion of demo lessons.
  - Fixed lesson deletion edge cases in authenticated mode.

- **Keyboard Shortcuts**
  - Prevented `Ctrl+N` browser conflict by using `Ctrl+E` for new words.
  - Added `preventDefault()` and `stopPropagation()` to all shortcut handlers.
  - Fixed ESC key handling to work with multiple modals (add words, shortcuts help).
  - Implemented proper timeout cleanup for toast notifications to prevent memory leaks.

### Performance
- **Optimization**
  - Used `useMemo` for shortcuts object to prevent recreation on every render.
  - Used `useCallback` for event handlers in keyboard shortcuts hook.
  - Single global event listener instead of multiple listeners.
  - Proper cleanup of event listeners on component unmount.
  - Toast timeout cleanup to prevent memory leaks.
  - No performance impact from drag & drop sensors - they only activate when needed.
  - Touch delay (200ms) prevents unnecessary drag calculations during scroll operations.

### Technical Details
- **New Files**
  - `src/hooks/useKeyboardShortcuts.js` - Custom hook for keyboard shortcut handling (~80 lines).
  - `src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx` - UI component (~220 lines).
  - Complete documentation suite in `docs/` directory (~1500 lines).

- **Modified Files**
  - `src/App.jsx` - Added keyboard shortcuts integration (~150 lines modified).
  - `src/components/SearchControls/SearchControls.jsx` - Added ref support.
  - `src/components/WordTable/WordTable.jsx` - Enhanced drag & drop with mobile support (~100 lines modified).
  - `src/index.css` - Added animations for toast notifications.
  - `README.md` - Added keyboard shortcuts section and updated features list.

- **New Dependencies**
  - `TouchSensor` from `@dnd-kit/core` - Native touch event handling for mobile drag & drop.

### Breaking Changes
- Demo mode behavior changed: now includes full features with storage limits instead of read-only access.
- **BREAKING**: SearchControls component now requires `searchInputRef` prop for keyboard focus functionality.

---

## [0.1.0] - 2025-09-30

### Added
- **Drag & Drop for Words and Lessons**
  - Words and lessons can now be reordered intuitively via drag-and-drop UI.
  - Improves lesson organization and word prioritization.

- **Pronunciation Speed Control**
  - UI now displays and allows adjustment of speech synthesis speed.
  - Users can fine-tune playback speed for better listening practice.

### Fixed
- Minor UI alignment issues in lesson navigation.
- Improved responsiveness of word table on smaller screens.

### Changed
- Updated README with planned UI enhancements roadmap.
- Refined component structure for better maintainability.

---

[Unreleased]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.2.0...HEAD
[0.2.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/SzaniszloIvor/private-dictionary/releases/tag/v0.1.0