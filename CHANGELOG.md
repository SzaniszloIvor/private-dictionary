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

## [0.7.1] - 12/10/2025

### 🐛 Favorites UI Fixes

#### Fixed
- **WordTable Desktop**: Added missing ⭐ Favorites column as first column in table
  - Previously: Favorite button was not visible in desktop table view
  - Now: Dedicated ⭐ header column with star buttons for each word
  - Consistent with mobile layout design
  
- **WordTable Mobile**: Fixed favorite button positioning
  - Moved favorite star to left side of card (vertically centered)
  - Added absolute positioning for consistent placement
  - Fixed z-index layering to ensure clickability
  - Added pointer-events-auto to prevent drag conflicts

- **Touch Event Handling**
  - Added stopPropagation on touch events for favorite button
  - Prevents accidental drag activation when toggling favorites
  - Improved mobile UX with better button isolation

#### Enhanced
- **Component Props Flow**
  - Fixed `isFavorited` and `handleToggleFavorite` prop passing
  - Both SortableRow and SortableCard now properly receive and use favorite props
  - Consistent behavior between desktop table rows and mobile cards

- **Visual Consistency**
  - Desktop: ⭐ column width fixed at 48px (w-12)
  - Mobile: Star button positioned at `left-2` with vertical centering
  - Same star icon size in both layouts (via FavoriteButton size prop)

### 🧪 Testing Suite

#### Added - Complete Test Coverage (NEW)
- **Favorites Test Suite** (`test/favorites/`)
  - `testFavorites.js` - Phase 1: Backend & Data Structure
    - 7 tests covering add/get/toggle/remove favorites
    - Dictionary migration validation
    - localStorage persistence checks
    - Mock localStorage implementation for Node.js
  
  - `testUseFavorites.js` - Phase 2: Custom Hook & State Management
    - 7 tests for hook initialization and state management
    - Multiple favorites handling
    - Lesson filtering and counting
    - Memory leak prevention
    - Simulated hook state (FavoritesState class)
  
  - `testUIComponents.js` - Phase 3: UI Components (CORRECTED VERSION)
    - 8 tests for FavoriteButton and FavoritesModal
    - File existence validation
    - Syntax checking (balanced braces, JSX structure)
    - Component structure verification (imports, exports, props)
    - Dependency checks (react, lucide-react, tailwindcss)
    - Directory structure validation
    - **Fixed**: Correct path to `src/components/` (3 levels up)
    
- **Integration Tests** (`test/integration/`)
  - `testAppIntegration.js` - Phase 4: App.jsx Integration (FIXED VERSION)
    - 11 tests for complete App.jsx integration
    - Favorites imports (useFavorites, FavoritesModal, Star icon)
    - Hook usage and destructuring
    - FavoritesModal props (isOpen, onClose, favorites, handlers)
    - Props passing to LessonContent
    - Toggle and navigate handlers
    - Modal state management
    - Favorites button in header
    - Keyboard shortcut (Ctrl+Shift+F)
    - LessonContent → WordTable prop flow
    - **Architecture validation**: FavoriteButton NOT in App.jsx
    - **Separation of concerns**: App → LessonContent → WordTable → FavoriteButton

- **Version-Specific Test Suites** (ADDED)
  - `test/v0.6.0/testMobileTouch.js` - Mobile Touch Optimization
    - 9 tests for @dnd-kit sensors configuration
    - TouchSensor and PointerSensor setup
    - Optimal touch settings (100ms delay, 5px tolerance)
    - Drag handle implementation
    - Touch-action CSS validation
    - Haptic feedback checks
    - Scroll conflict prevention
  
  - `test/v0.6.0/testKeyboardShortcuts.js` - Keyboard Shortcuts System
    - 9 tests for keyboard shortcuts implementation
    - Hook and helper component validation
    - Shortcut implementations (8 core shortcuts)
    - Toast notification system
    - Platform detection (Mac/Windows)
    - App.jsx integration checks
  
  - `test/v0.6.0/testDarkMode.js` - Dark Mode Implementation
    - 9 tests for dark mode functionality
    - Dark mode state and toggle
    - System preference detection
    - Keyboard shortcut (Ctrl+D)
    - CSS implementation (Tailwind dark: classes)
    - localStorage persistence
    - Component styling validation
  
  - `test/v0.5.0/testKeyboardShortcuts.js` - Enhanced Keyboard Shortcuts
    - 10 tests for v0.5.0 keyboard shortcuts
    - Hook structure and memory leak prevention
    - Modifier keys handling (Ctrl/Cmd, Shift, Alt)
    - Component structure validation
    - Shortcuts list verification (4 core + 3 optional)
    - SearchControls ref support
    - Performance optimization (useMemo)
  
  - `test/v0.5.0/dragAndDrop.js` - Enhanced Drag & Drop
    - 10 tests for mobile-optimized drag & drop
    - DnD Kit sensors import validation
    - Mobile detection implementation
    - TouchSensor configuration (150-1000ms delay)
    - PointerSensor configuration (5-10px distance)
    - Conditional sensor usage
    - Drag handlers and DndContext setup
    - Persistence logic validation
  
  - `test/v0.5.0/testDemoMode.js` - Demo Mode & localStorage
    - 10 tests for demo mode features
    - isDemo state detection
    - localStorage integration (getItem/setItem)
    - Demo dictionary state
    - Load/save from localStorage
    - Word and lesson limits (20 words, 2 lessons)
    - Demo UI indicators
    - Feature parity validation

- **PowerShell Test Runner** (`run-tests.ps1`)
  - Single progress bar showing real-time test execution
  - Automatic test file discovery (recursive)
  - Color-coded output (Red/Green/Yellow/Cyan)
  - Pass/Fail counters with percentage
  - **Enhanced failure reporting**:
    - Extracts exact failed test names using emoji byte detection
    - Shows which file and which specific tests failed
    - Manual run command suggestions for detailed debugging
  - Exit codes for CI/CD integration
  - Parallel-ready architecture

#### Test Coverage Statistics
- **Total Test Files**: 10 (all new)
- **Total Tests**: 85+ individual test cases
- **Lines of Test Code**: ~2,500 lines
- **Coverage Areas**:
  - ✅ Favorites backend (Phase 1)
  - ✅ Favorites hook (Phase 2)
  - ✅ Favorites UI (Phase 3)
  - ✅ Favorites integration (Phase 4)
  - ✅ Mobile touch (v0.6.0)
  - ✅ Keyboard shortcuts (v0.6.0 + v0.5.0)
  - ✅ Dark mode (v0.6.0)
  - ✅ Drag & drop (v0.5.0)
  - ✅ Demo mode (v0.5.0)

---

## [0.7.0] - 11/10/2025

### ⭐ Favorites System

#### Added
- **Favorites Feature**
  - Star icon on each word to mark as favorite
  - Favorites modal (Ctrl+Shift+F) with search and lesson filtering
  - Real-time counter badge on navigation button
  - Cross-device sync via Firebase (authenticated users)
  - localStorage persistence for demo mode
  - `useFavorites` custom hook for state management
  - `FavoriteButton` and `FavoritesModal` components
  - Automatic data migration for existing dictionaries

- **Desktop Navigation Redesign**
  - Unified button bar with "Kedvencek", "Sötét/Világos", "Billentyűk" buttons
  - Consistent button sizes (144px × 40px)
  - Gradient backgrounds with hover effects
  - Dark Mode and Keyboard Shortcuts moved from FAB to main menu
  - Favorites counter badge with real-time updates

- **Mobile Optimization**
  - Favorite star on left side of word card (vertically centered)
  - Drag handle relocated to top-right corner
  - Compact circular buttons in mobile header
  - Touch-optimized sizes (minimum 40px × 40px)
  - FAB button for Dark Mode remains on mobile

- **Backend Integration**
  - Firebase: `toggleFavorite()`, `getAllFavorites()`, `getFavoritesCount()`, `clearAllFavorites()`
  - localStorage: `favoritesHelper.js` with demo mode utilities
  - Extended word schema with `isFavorite` and `favoritedAt` fields

#### Enhanced
- **WordTable Component**
  - Desktop: Favorite star in dedicated first column
  - Mobile: Favorite star on left side
  - Seamless drag-and-drop integration
  
- **LessonContent Component**
  - Passes favorite props to WordTable
  - Proper component hierarchy

#### UI/UX Improvements
- Toast notifications for favorite actions
- Smooth animations and transitions
- Dark mode optimized colors
- ARIA labels and keyboard navigation
- Real-time updates across all components

### 🔧 Technical Improvements
- Proper separation of concerns (FavoriteButton only in WordTable)
- Memoized favorites list for performance
- Efficient Firebase queries sorted by timestamp
- Fixed desktop drag & drop on touch devices
- Separated sensors: PointerSensor (desktop 5px), TouchSensor (mobile 1000ms)
- Bundle size increase: ~12KB gzipped

### 🐛 Fixed
- Desktop drag & drop on touch-capable devices
- FAB button visibility (mobile-only for Dark Mode)
- Button sizing inconsistencies in navigation
- Favorite button conditional rendering
- JSX syntax errors in ternary operators
- Touch sensor conflicts on desktop
- Padding calculations for mobile cards

### 📱 Mobile Specific
- Favorite star moved to left side (matches desktop)
- Drag handle to top-right with reduced opacity
- Long-press (1000ms) for drag activation
- Touch-friendly targets throughout

### 🔐 Demo Mode
- Full favorites functionality without authentication
- localStorage persistence across sessions
- Automatic cleanup on logout

### 🎯 Keyboard Shortcuts
- `Ctrl+Shift+F` - Open favorites modal
- `Escape` - Close favorites modal

### 📊 Data Structure
- Extended word object with `isFavorite` boolean and `favoritedAt` timestamp
- Separate `demoFavorites` array in localStorage
- Automatic migration on first load (non-destructive)

### 🧪 Testing
- Unit tests for helper functions
- Integration tests for useFavorites hook
- Component tests for UI elements
- Cross-browser and mobile testing

---

**Migration Notes:**
- Automatic migration on first load
- No action required from users
- Demo mode: favorites cleared on logout
- Authenticated: favorites sync across devices

---

## [0.6.0] - 06/10/2025

### 🎮 Gamification & Progress Tracking

#### Added
- **Daily Progress System**
  - Real-time tracking of words learned, practice sessions, and study time
  - Daily goal setting (5-50 words) with customizable targets
  - Progress bar with percentage indicator
  - Visual feedback for goal achievement with confetti celebration
  - "🎉 Napi cél elérve!" toast notification when reaching daily goal
  - Practice session stats (words learned, reviewed, time spent)
  - Integration with both Firebase (auth users) and localStorage (demo mode)

- **Streak System**
  - Current streak counter with flame emoji animation (🔥)
  - Longest streak record tracking
  - Streak milestone badges:
    - 🔥 7 days: Week Warrior (Heti Harcos)
    - 🔥 14 days: Two Week Champion (Két Hét Bajnok)
    - 🏆 30 days: Month Master (Havi Mester)
    - 💯 100 days: Century Club (Century Club)
  - Confetti celebration when reaching streak milestones
  - Next milestone indicator with days remaining
  - Visual distinction between active and inactive streaks

- **Progress Calendar**
  - Monthly calendar view with color-coded activity levels
  - Day colors based on words learned (gray/blue/yellow/green)
  - Interactive day selection for detailed stats
  - Current day highlight with purple ring
  - Navigation between months
  - Legend for activity levels (0, 1-4, 5-9, 10+ words)
  - Selected day details showing words, sessions, time, and goal status

- **Progress Charts & Analytics**
  - Interactive charts using Recharts library
  - Weekly and monthly view toggle
  - Bar chart for words learned
  - Line charts for time spent and pronunciation accuracy
  - Custom tooltip with detailed daily breakdown
  - Summary statistics (total words, time, active days, daily average)
  - Dark mode compatible color schemes

- **Comprehensive Statistics**
  - Lifetime stats (total days, active days, total words, total time)
  - Current week summary (words, time, active days, average per day)
  - Best streaks display (current and longest)
  - Achievement badges showcase with visual indicators
  - Four badge types: Week Warrior, Two Week Champion, Month Master, Century Club
  - "Elérve" status for unlocked badges

- **Pronunciation Mode Integration**
  - Pronunciation accuracy tracking in daily stats
  - Average pronunciation score calculation
  - Pronunciation-specific badges:
    - 🗣️ Perfect Speaker (95%+ average)
    - 🎤 Native-like (90%+ first attempt)
    - 👑 Pronunciation Master (all words 85%+)
    - 🔥 Perfect Streak (5+ consecutive perfect)
    - ⚡ One Shot Wonder (all first attempt)
    - 💪 Persistent Learner (3+ attempts)
    - 🏆 Pronunciation Champion (20+ words 85%+)
  - Pronunciation attempts counter
  - Visual feedback for pronunciation performance

- **UI Components**
  - `DailyProgressCard`: Main progress card with goal tracking
  - `StreakDisplay`: Streak visualization with milestones
  - `DailyGoalSettings`: Modal for goal customization
  - `ProgressCalendar`: Monthly activity calendar
  - `ProgressChart`: Interactive multi-metric charts
  - `StatsOverview`: Comprehensive statistics dashboard
  - Collapsible detailed stats section
  - "Részletes statisztikák megjelenítése/elrejtése" toggle button

- **New Hooks**
  - `useDailyProgress`: Core progress tracking and goal management
  - `useStatsHistory`: Historical data and chart generation
  - `useStreak`: Streak calculation and milestone tracking

- **Milestone Notifications**
  - Toast notifications at 25%, 50%, 75% practice completion
  - Encouraging messages during practice sessions
  - Visual feedback with emojis (🚀, 💪, 🎯)

#### Enhanced
- **Practice Mode**
  - Automatic daily stats update after practice sessions
  - Session tracking with words learned, reviewed, and time
  - Pronunciation session data collection
  - Goal achievement check after each session
  - Confetti celebration for high-performance sessions

- **Firebase Integration**
  - New `dailyStats` collection for daily progress data
  - New `userSettings` collection for user preferences
  - Automatic date-based document creation
  - Real-time sync of progress data
  - Optimized batch updates for session completion

- **Demo Mode**
  - Full progress tracking in localStorage
  - Demo stats helper utilities
  - Persistent goal settings in demo mode
  - Calendar and chart support for demo users

#### UI/UX Improvements
- Gradient backgrounds for progress cards
- Smooth animations for progress bars
- Color-coded progress indicators (blue/yellow/green)
- Responsive grid layouts for stats
- Dark mode support across all progress components
- Animate-slide-in-up effect for collapsible sections
- Hover effects with shadow and scale transforms
- Professional card designs with borders and shadows

#### Performance
- Memoized chart data calculations
- Optimized Firebase queries
- Lazy loading of chart components
- Efficient state management for large datasets

### 🐛 Bug Fixes
- Fixed goal achievement detection timing
- Corrected pronunciation stats aggregation
- Resolved calendar navigation boundary issues
- Fixed streak calculation for timezone differences

### 🔧 Technical
- Added Recharts library for data visualization
- Implemented date-based document structure in Firebase
- Created modular stats calculation utilities
- Added comprehensive error handling for stats loading
- Implemented demo mode compatibility layer

### 📝 Documentation
- Added inline documentation for progress hooks
- Documented badge system requirements
- Added examples for stats calculation
- Documented Firebase schema for daily stats

---

**Migration Notes:**
- Users upgrading to 0.6.0 will see progress tracking start from upgrade date
- Previous practice session data is not retroactively tracked
- Daily goal defaults to 10 words (customizable)
- No action required - features work automatically for all users

**Database Schema:**
```javascript
// dailyStats/{userId}/stats/{YYYY-MM-DD}
{
  date: "2025-01-09",
  wordsLearned: 15,
  wordsReviewed: 8,
  practiceSessionsCompleted: 2,
  pronunciationAttempts: 10,
  avgPronunciationScore: 87.5,
  timeSpentMinutes: 23.4,
  lessonsCompleted: [1, 2],
  goalAchieved: true
}

// userSettings/{userId}
{
  dailyGoal: 20,
  theme: "dark",
  // ... other preferences
}

---


## [0.5.2] - 06/10/2025

### Added
- **Pronunciation Practice Meaning Toggle**
  - Added "Jelentés megjelenítése" (Show Meaning) button in pronunciation practice mode
  - Button positioned below microphone, above helper text for better UX flow
  - Hungarian translation displayed in green card with smooth animation
  - Automatic hiding when navigating to next word
  - Toggle functionality: "Jelentés megjelenítése" ↔ "Jelentés elrejtése"

### Fixed
- **CRITICAL: Desktop drag & drop bug on word deletion**
  - Fixed drag-and-drop activation when canceling delete confirmation dialog
  - Replaced `onMouseDown` events with `onClick` for delete, edit, and play buttons
  - Issue: When clicking "Mégse" (Cancel) in delete dialog, `onMouseUp` event never fired, causing permanent drag state
  - Solution: Using `onClick` ensures complete click cycle before dialog appears
  - Affected buttons: 🔊 Play audio, ✏️ Edit word, 🗑️ Delete word (desktop view only)

### Technical Details
- **Modified Files**
  - `src/components/WordTable/WordTable.jsx` – Fixed button event handlers (~30 lines)
  - `src/components/PracticeMode/PronunciationCard.jsx` – Added meaning toggle feature (~50 lines)

### Impact
This update eliminates frustrating drag-and-drop lock on desktop when canceling delete operations and improves learning experience by allowing quick meaning reference during pronunciation practice.

### Browser Compatibility
- Tested on Chrome, Edge, Safari
- Desktop and mobile layouts work consistently
- All interactive elements respond correctly to user input

---


## [0.5.1] - 06/10/2025

### Fixed
- **Mobile view layout for added words**
  - Fixed the English word input being too small in mobile view.
  - Phonetic transcription now displays correctly below the word instead of overflowing the container.

- **Word list pronunciation**
  - Previously, clicking the speaker icon in the list used Hungarian pronunciation while the practice mode used English.
  - Now, the English pronunciation is used consistently in both the word list and practice mode.

- **Word editing in list**
  - Words added to the list could previously only be deleted.
  - Now users can edit words after adding them, allowing corrections for mistakes.

- **Phonetic transcription API**
  - The previous Datamuse API did not provide accurate phonetics.
  - Replaced with [DictionaryAPI](https://dictionaryapi.dev/) for more precise phonetic results.

### Technical Details
- **Modified Files**
  - `src/components/AddWordsModal.jsx` – Mobile input and phonetic layout fixes
  - `src/components/WordTable.jsx` – Word list pronunciation update and word editing added
  - `src/hooks/useSpeechSynthesis.jsx` – Unified speech synthesis for word list and practice mode
  - `src/helpers/phoneticHelper.js` – Integrated DictionaryAPI for phonetic data

### Impact
This update improves the mobile user experience, ensures consistent English pronunciation across the app, and enhances word list management with editable entries and more accurate phonetics.

### Browser Compatibility
- Tested on Chrome, Edge, Safari
- Mobile and desktop layouts are responsive and consistent
- English voice synthesis works reliably across all supported platforms

---

## [0.5.0] - 06/10/2025

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

## [0.4.0] - 05/10/2025

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

## [0.3.3] - 04/10/2025

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

## [0.3.2] - 04/10/2025

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

## [0.3.1] - 04/10/2025

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

## [0.3.0] - 04/10/2025

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

## [0.2.0] - 02/10/2025

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

## [0.1.0] - 30/09/2025

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
[0.7.1]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.6.0...v0.7.1
[0.7.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.5.0...v0.6.0
[0.5.1]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/SzaniszloIvor/private-dictionary/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/SzaniszloIvor/private-dictionary/releases/tag/v0.1.0
