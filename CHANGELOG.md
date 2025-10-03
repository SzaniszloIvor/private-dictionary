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

## [0.3.0] - 2025-10-04

### Added
- **Dark Mode Support**
  - Full dark mode implementation with system preference detection.
  - Toggle dark mode via `Ctrl/⌘+D` keyboard shortcut.
  - Dark mode toggle button in the UI (🌙 icon).
  - Persistent dark mode preference saved to localStorage.
  - All components fully styled for both light and dark themes.
  - Enhanced contrast and readability in dark mode.
  - Smooth transitions between light and dark themes.

- **Tailwind CSS Integration**
  - Complete migration from inline styles to Tailwind CSS utility classes.
  - Implemented Tailwind v3.4.1 with PostCSS and Autoprefixer.
  - Custom animations: `fade-in`, `slide-in-up`, `slide-in-right`, `pulse`.
  - Responsive design utilities for mobile, tablet, and desktop.
  - Custom color palette with dark mode variants.
  - Optimized production builds with CSS purging.

- **Enhanced Mobile Touch Support**
  - Optimized TouchSensor configuration for mobile drag & drop.
  - Reduced touch delay from 200ms to 100ms for faster response.
  - Improved touch tolerance from 8px to 5px for better sensitivity.
  - Added `touch-action: none` CSS property for drag handles.
  - Separate drag handle (⋮⋮) with dedicated touch area on mobile.
  - Prevention of scroll conflicts during drag operations.

- **Keyboard Shortcuts Enhancement**
  - Added `Ctrl/⌘+D` for dark mode toggle.
  - Keyboard shortcuts modal hidden on mobile devices.
  - Improved keyboard shortcuts visibility in dark mode.

### Changed
- **Complete UI Refactor with Tailwind CSS**
  - All components converted from inline styles to Tailwind utility classes.
  - Removed `src/styles/styles.js` (no longer needed).
  - Standardized spacing, colors, and typography across the application.
  - Improved code maintainability with utility-first CSS approach.
  - Reduced bundle size with Tailwind's CSS purging.

- **Component Updates**
  - `App.jsx`: Full Tailwind conversion, added dark mode state management.
  - `WordTable.jsx`: Tailwind classes, optimized touch sensors (100ms delay, 5px tolerance).
  - `AddWordsModal.jsx`: Tailwind styles with dark mode support.
  - `LoginScreen.jsx`: Modern gradient backgrounds with Tailwind.
  - `SearchResults.jsx`: Clean Tailwind layout with dark mode colors.
  - `KeyboardShortcutsHelper.jsx`: Enhanced contrast in dark mode, hidden on mobile.
  - All other components: Converted to Tailwind CSS with dark mode variants.

- **Mobile Drag & Drop Improvements**
  - Drag handle now has visual feedback (increased opacity and size).
  - Content area (text and buttons) separated from drag listeners.
  - Improved haptic feedback timing and intensity.
  - Better visual indicators during drag operations.

- **index.css Restructure**
  - Added `@tailwind` directives (base, components, utilities).
  - Custom `@layer` definitions for base styles and utilities.
  - Touch-action utilities (`.touch-none`, `.touch-auto`).
  - Cursor utilities (`.cursor-grab`, `.cursor-grabbing`).
  - Enhanced scrollbar styling for both light and dark modes.
  - Smooth scroll behavior and focus-visible styles.

### Fixed
- **Mobile Drag & Drop Critical Fixes**
  - Fixed drag & drop not working on mobile touch devices.
  - Resolved scroll vs. drag conflict on mobile.
  - Fixed touch events being captured by scroll instead of drag.
  - Improved drag activation consistency across iOS and Android.

- **Dark Mode Fixes**
  - Fixed low contrast text in dark mode modals.
  - Enhanced keyboard shortcuts readability in dark mode.
  - Fixed button visibility issues in dark mode.
  - Improved gradient colors for better dark mode aesthetics.

- **Build and Configuration**
  - Resolved Tailwind v4 vs v3 plugin conflicts.
  - Fixed `vite.config.js` to work with Tailwind v3 via PostCSS.
  - Fixed build errors related to PostCSS configuration.
  - Removed conflicting `@tailwindcss/vite` plugin.

### Removed
- **Deprecated Code**
  - Removed `src/styles/styles.js` (replaced by Tailwind classes).
  - Removed `src/App.css` (no longer needed with Tailwind).
  - Removed alternative keyboard shortcuts (`]` and `[` keys).
  - Removed redundant inline style definitions.

### Performance
- **Optimization**
  - Tailwind CSS purging reduces final CSS bundle size by ~70%.
  - Faster mobile drag & drop activation (100ms vs 200ms).
  - Improved rendering performance with utility classes.
  - Reduced CSS specificity conflicts.
  - Better tree-shaking with Tailwind's JIT compiler.

### Technical Details
- **Configuration Files**
  - `tailwind.config.js`: Configured for dark mode with `class` strategy.
  - `postcss.config.js`: Setup for Tailwind and Autoprefixer.
  - `vite.config.js`: Cleaned up, removed Tailwind v4 plugin conflicts.
  - `src/index.css`: Restructured with `@tailwind` directives and custom layers.

- **Dependencies**
  - Updated to `tailwindcss@3.4.1`.
  - Updated to `postcss@8.4.35`.
  - Updated to `autoprefixer@10.4.17`.
  - Removed `@tailwindcss/vite` (incompatible with v3).

- **Modified Files**
  - `src/App.jsx`: Dark mode state + Tailwind classes (~200 lines modified).
  - `src/components/WordTable/WordTable.jsx`: Touch sensor optimization (~50 lines modified).
  - `src/components/KeyboardShortcutsHelper/KeyboardShortcutsHelper.jsx`: Dark mode + mobile hiding (~30 lines modified).
  - `src/index.css`: Complete restructure with Tailwind directives (~180 lines).
  - All component files: Converted to Tailwind CSS (~1500 lines total).

### Breaking Changes
- **BREAKING**: Removed `src/styles/styles.js` - all inline styles replaced with Tailwind.
- **BREAKING**: Dark mode requires `class` attribute on root element (handled automatically).
- **BREAKING**: Custom CSS animations now defined in `index.css` instead of component files.

### Migration Guide
For developers updating from v0.2.0:
1. Ensure Tailwind CSS v3.4.1 is installed: `npm install -D tailwindcss@3.4.1`
2. Remove old `src/styles/styles.js` imports from components.
3. Update `vite.config.js` to remove Tailwind v4 plugin if present.
4. Clear all build caches: `rm -rf node_modules/.vite dist`
5. Rebuild: `npm run build`

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
  - `Ctrl/⌘+→` - Navigate to next lesson.
  - `Ctrl/⌘+←` - Navigate to previous lesson.
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

[Unreleased]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/SzaniszloIvor/private-dictionary/releases/tag/v0.1.0