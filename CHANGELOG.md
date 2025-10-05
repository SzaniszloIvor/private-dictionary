# 📦 Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),  
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## License

© 2025 Szaniszló Ivor. All Rights Reserved.

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

## [0.5.0] - 2025-10-06

### Added
- **🎤 Pronunciation Practice Mode** - Complete speech recognition system with Web Speech API
  - Real-time pronunciation scoring (0-100%) using Levenshtein distance algorithm
  - Live speech-to-text with waveform visualization during recording
  - 5-level performance system (Exceptional 95%+ to Needs Work <60%)
  - Auto-play word audio on card display
  - 10-second auto-stop timeout for recordings
  
- **🎨 Visual & UX Enhancements**
  - Animated waveform visualizer (20 bars, 60fps canvas animation)
  - Word difficulty badges (Easy 🟢, Medium 🟡, Hard 🔴)
  - Enhanced error display with browser-specific troubleshooting
  - Collapsible pronunciation tips with phonetic analysis (TH, R, W, V sounds)
  - Color-coded feedback cards with gradient backgrounds
  
- **🏆 Gamification (7 New Badges)**
  - Perfect Speaker 🗣️ (95%+ avg), Native-like 🎤 (90%+ first try)
  - Pronunciation Master 👑 (all 85%+), Perfect Streak 🔥 (5+ consecutive)
  - One Shot Wonder ⚡ (all first try), Persistent Learner 💪 (3+ attempts)
  - Pronunciation Champion 🏆 (20+ words, 85%+ avg)
  
- **📊 Enhanced Statistics**
  - Average accuracy, perfect/excellent score counts
  - Attempts per word tracking
  - Word-by-word score breakdown with color coding
  - Specialized pronunciation results screen
  
- **♿ Accessibility & Mobile**
  - WCAG 2.1 AA compliant (color contrast, ARIA labels)
  - Keyboard shortcuts (Space = record, Escape = cancel)
  - Screen reader announcements (aria-live regions)
  - Touch-optimized controls (44x44px minimum targets)
  - Prevented double-tap zoom and context menu on mobile
  
- **⚡ Performance Optimizations**
  - React.useCallback/useMemo for expensive operations
  - Auto-cleanup of event listeners and animations
  - Bundle impact: only +4KB gzipped
  - Memory leak prevention with proper cleanup
  
- **🛡️ Error Boundary & Recovery**
  - Graceful error handling with user-friendly fallback UI
  - Development mode: detailed stack traces
  - Production mode: generic error with recovery options

### Components Added
- `PronunciationCard.jsx`, `MicrophoneButton.jsx`, `PronunciationFeedback.jsx`
- `WaveformVisualizer.jsx`, `ErrorDisplay.jsx`, `PronunciationTips.jsx`
- `PronunciationResults.jsx`, `ErrorBoundary.jsx`
- `pronunciationHelper.js` utility with 8 helper functions

### Changed
- `PracticeSettings.jsx` - Added pronunciation mode as 4th option
- `PracticeModeModal.jsx` - Mode-aware rendering and auto-finish logic
- `PracticeResults.jsx` - Delegates to PronunciationResults for pronunciation mode
- `rewardHelper.js` - Extended with pronunciation badges and scoring
- `useSpeechRecognition.js` - Optimized with cleanup and 10s timeout

### Fixed
- **Critical: Infinite audio playback loop** - Added `hasPlayedAudio` state flag
- Pronunciation auto-finish not triggering after last word
- Stats not resetting between sessions
- Keyboard shortcuts interfering with pronunciation mode
- Swipe gestures conflicting with pronunciation UI
- Missing `<a>` tag in ErrorDisplay help link

### Browser Support
- ✅ Chrome/Edge 80+ (Full support - Recommended)
- ⚠️ Safari 14+ (Limited - Warning shown)
- ❌ Firefox (Not supported - Clear message)

### Performance Metrics
- Time to Interactive: <2s
- Waveform animation: 60fps
- Speech recognition latency: <500ms
- Score calculation: <100ms

### Known Limitations
- Requires internet connection (cloud-based speech API)
- Max recording time: 10 seconds
- Accuracy depends on microphone quality and background noise
- Limited browser support (Chrome/Edge recommended)

### Technical Details
- 10 new components (~1,200 lines)
- pronunciationHelper.js utility (~500 lines)
- 4 modified components (~300 lines)
- No breaking changes - fully backward compatible

### Security & Privacy
- No audio data stored locally
- Speech API handled by browser (Google/Microsoft)
- All data remains in browser memory/localStorage
- No third-party tracking

### License
Copyright © 2025 Szaniszló Ivor  
All Rights Reserved.

This software and associated documentation files (the "Software") are the proprietary property of Szaniszló Ivor.

Unauthorized copying, modification, distribution, or use of this Software, via any medium, is strictly prohibited without express written permission from the copyright holder.

For licensing inquiries, please contact:  
Email: info@ivor.hu  
GitHub: @SzaniszloIvor

---

## [0.4.0] - 2025-10-05

### Added
- **Practice Mode** - Interactive flashcard learning system with gamification
  - Sequential, Random, and Reverse practice modes
  - 3D flip card animations with smooth 600ms transitions
  - Show/Hide answer toggle with Space bar shortcut
  - Keyboard navigation: ←/→ arrows, Space, Escape
  - Swipe gestures for mobile (left/right navigation)
  - Progress tracking with visual progress bar and dots
  - Session statistics (cards viewed, time spent, flip count)
  - **Reward System** - Complete gamification experience:
    - Confetti animation on session completion (epic mode for 5-star performances)
    - 5-star rating system based on completion and speed
    - Dynamic encouraging messages (5 achievement levels)
    - Badge system: Speed Demon ⚡, Perfectionist 🎯, Marathon Learner 🏃, Quick Learner 🧠, Dedicated 💪
    - Milestone toast notifications at 25%, 50%, 75% progress
    - Random motivational quotes on results screen
    - Animated star reveal with sequential bounce effects
  - Practice results summary screen with detailed analytics
  - Auto-play pronunciation integration
  - Full dark mode support with gradient themes
  - Responsive design optimized for mobile and desktop
  - ARIA labels for accessibility
  - "Practice" button added to each lesson (only visible when lesson has words)
  - Auto-completion detection (shows results when all cards viewed)

### Changed
- **Keyboard Shortcuts**: Extended with practice mode controls (arrows, space, escape)
- **LessonContent**: New practice mode entry point with gradient green button
- **README.md**: Updated with comprehensive Practice Mode documentation
- **Project Structure**: Added PracticeMode components, hooks, and utilities

### Technical Details
- **New Components** (8 files):
  - `src/components/PracticeMode/PracticeModeModal.jsx` - Main orchestrator (~220 lines)
  - `src/components/PracticeMode/FlashCard.jsx` - 3D flip card (~80 lines)
  - `src/components/PracticeMode/PracticeControls.jsx` - Navigation (~70 lines)
  - `src/components/PracticeMode/PracticeProgress.jsx` - Progress bar (~50 lines)
  - `src/components/PracticeMode/PracticeSettings.jsx` - Mode selection (~90 lines)
  - `src/components/PracticeMode/PracticeResults.jsx` - Results screen (~200 lines)
  - `src/components/PracticeMode/ConfettiReward.jsx` - Canvas animation (~100 lines)
  - `src/components/PracticeMode/StarRating.jsx` - Star component (~40 lines)

- **New Hooks** (2 files):
  - `src/hooks/usePracticeMode.js` - Practice logic (~100 lines)
  - `src/hooks/useSwipeGesture.js` - Mobile swipe detection (~40 lines)

- **New Utilities** (2 files):
  - `src/utils/practiceHelper.js` - Helper functions (~60 lines)
  - `src/utils/rewardHelper.js` - Gamification logic (~100 lines)

- **CSS Updates**:
  - Added FlashCard 3D flip animation styles to `index.css`
  - `.perspective-1000`, `.flip-card-inner`, `.flip-card-front/back` classes

### Performance
- Canvas-based confetti animation with 60fps target
- Optimized particle count: 100 (normal), 150 (high), 200 (epic)
- Smooth 600ms 3D flip transitions
- Efficient swipe detection with 50px threshold
- Auto-cleanup of animations and timers

### Accessibility
- ARIA labels for all interactive elements
- Keyboard-only navigation support
- Focus indicators on all buttons
- Screen reader friendly progress announcements
- Semantic HTML structure

---

## [0.3.3] - 2025-10-04

### Fixed
- **Mobile Drag & Drop UX Critical Fix**
  - Fixed mobile scroll being blocked when touching word cards
  - Increased TouchSensor activation delay from 150ms to 1000ms (1 second) for better scroll vs drag distinction
  - Removed `touch-none` CSS class from mobile word cards that was preventing natural scrolling
  - Disabled PointerSensor on mobile devices to prevent conflict with TouchSensor
  - Mobile users can now scroll freely by touching anywhere on the screen, including word cards
  - Drag activation requires 1 second hold + 5px movement tolerance

### Changed
- **WordTable Component**
  - Platform-specific sensor configuration: PointerSensor for desktop only, TouchSensor for mobile only
  - Removed cursor-grab classes from mobile cards (desktop-only feature)
  - Updated mobile drag instruction: "Hold any card for 1 second, then drag to new position"

### Technical Details
- **Sensor Configuration (WordTable.jsx)**
  - Desktop: PointerSensor with 8px distance activation
  - Mobile: TouchSensor with 1000ms delay + 5px tolerance
  - KeyboardSensor remains active on both platforms
  - Conditional sensor initialization based on `isMobile` state

- **CSS Changes**
  - Removed `touch-none` and `cursor-grab` classes from SortableCard component
  - Natural touch scrolling restored on all mobile elements
  - Buttons retain `touch-auto pointer-events-auto` for immediate response

### UX Improvements
- Mobile scrolling now works naturally on word cards
- Accidental drag operations prevented by 1 second hold requirement
- Clear separation between scroll (quick swipe) and drag (long press) gestures
- Desktop drag & drop unchanged: immediate activation with 8px movement

### Breaking Changes
- **BREAKING**: Mobile drag activation delay increased from 150ms to 1000ms
  - Users must hold cards for 1 full second before dragging
  - Trade-off: Better scroll UX vs slightly slower drag activation

## [0.3.2] - 2025-10-04

---

### Changed
- **Mobile UI Improvements**
  - Moved Dark Mode toggle from FAB to top navigation bar on mobile
  - Moved Keyboard Shortcuts button from FAB to top navigation bar on mobile
  - All control buttons now grouped together in header (Profile, Dark Mode, Shortcuts, Logout)
  - Desktop: FAB buttons remain unchanged (bottom-right corner)
  - Mobile: Cleaner UI with fewer floating elements

### Technical Details
- **DarkModeToggle Component**
  - Added `isMobile` prop to switch between FAB (desktop) and compact button (mobile)
  - Mobile button: 9x9 size with shadow-md
  - Desktop button: 12x12 FAB with shadow-lg and hover effects
  
- **App.jsx User Navigation Bar**
  - Mobile: 3 action buttons (Dark Mode, Shortcuts, Logout) aligned right
  - Desktop: Unchanged layout
  - FAB buttons rendered only on desktop (`!isMobile` condition)
  
- **KeyboardShortcutsHelper**
  - FAB button hidden on mobile (existing: `hidden md:flex`)
  - Modal accessible from top menu bar button on mobile
  - Modal works on both mobile and desktop

### UX Improvements
- Mobile users can now access dark mode and shortcuts from natural top position
- Better ergonomics: top buttons easier to reach than bottom FABs on mobile
- Consistent control grouping: all user actions in one place
- Desktop experience unchanged: FAB buttons still available for power users

---

## [0.3.1] - 2025-10-04

### Fixed
- **Mobile & Desktop Drag & Drop UX Improvements**
  - Fixed mobile drag & drop not working properly with only small icon draggable.
  - Entire card/row now draggable instead of just the handle icon (⋮⋮).
  - Buttons (🔊, ⋮, 🗑️) now protected with `stopPropagation` on both touch and mouse events.
  - Optimized touch sensor: `delay: 150ms` (was 100ms), `tolerance: 5px` (was 8px).
  - Drag handle icon (⋮⋮) now visual indicator only with `pointer-events-none`.
  - Buttons use `touch-auto pointer-events-auto` to prevent drag activation.
  - Desktop rows fully draggable with `cursor-grab/cursor-grabbing` visual feedback.
  - Demo mode protection: drag disabled with `disabled: isDemo` prop.

### Changed
- **WordTable Component**
  - `SortableCard`: Entire card area now draggable on mobile (not just handle).
  - `SortableRow`: Entire row draggable on desktop (except Actions column).
  - `handleButtonInteraction` helper added for all buttons to prevent drag conflicts.
  - Updated usage hint: "Hold any card (on the text) and drag to new position".

### Technical Details
- Touch sensor activation: 150ms delay with 5px tolerance for better accuracy.
- Buttons protected with `onTouchStart`, `onTouchEnd`, and `onClick` handlers.
- Haptic feedback preserved on drag start (50ms) and end ([30,50,30]ms).
- All changes tested on mobile (iOS/Android) and desktop browsers.

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

[Unreleased]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.5.0...HEAD
[0.5.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/SzaniszloIvor/private-dictionary/releases/tag/v0.1.0
