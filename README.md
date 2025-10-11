# 🎧 Private Dictionary

A modern, interactive English-Hungarian dictionary application designed for personalized language learning with dynamic lesson management, comprehensive keyboard shortcuts, pronunciation practice, and dark mode support.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-All_Rights_Reserved-red.svg)
![Version](https://img.shields.io/badge/Version-0.6.0-blue.svg)

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Demo Mode](#-demo-mode)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [By invitation only](#-by-invitation-only)
- [Changelog](#-changelog)
- [License](#-license)
- [Contact](#-contact)

## 🎯 About

Private Dictionary is a comprehensive language learning platform that provides a dynamic, customizable English curriculum with Hungarian translations. The application supports both demo mode for trying out features and Google authentication for unlimited personalized learning experiences with cloud synchronization.

### Key Highlights:
- **Favorites System**: Mark and manage important words for focused learning (NEW in v0.7.0)
- **Pronunciation Practice**: Real-time speech recognition with instant feedback (Chrome/Edge)
- **Practice Modes**: Flashcards, pronunciation, and gamification system
- **Progress Tracking**: Daily goals, streaks, and comprehensive statistics
- **Dark Mode Support**: Eye-friendly interface with automatic theme switching
- **Full-Featured Demo Mode**: Try all features with 2 lessons (max 20 words each)
- **Keyboard Shortcuts**: 12 productivity shortcuts for efficient navigation
- **Tailwind CSS Design**: Modern, responsive UI built with utility-first CSS
- **Dynamic Learning Path**: Create unlimited custom lessons (registered users)
- **Dual Authentication**: Demo mode with localStorage and Google Sign-in with Firebase
- **Real-time Sync**: Cloud-based storage with automatic saving
- **Phonetic API**: IPA phonetic transcription via [DictionaryAPI](https://dictionaryapi.dev/)
- **Speech Synthesis**: Native pronunciation for all words with speed control
- **Drag & Drop**: Intuitive word and lesson reordering with persistence (optimized for mobile)
- **Responsive Design**: Optimized for mobile and desktop devices

## ✨ Features

### Core Features
- ⭐ **Favorites System (NEW v0.7.0)** - Mark important words for quick access
  - One-click star toggle on each word
  - Dedicated favorites modal with search and filtering (Ctrl+Shift+F)
  - Cross-device sync (Firebase) or localStorage (demo)
  - Real-time counter badge
  - Navigate to word's original location
- 🌙 **Dark Mode** - Toggle dark theme with Ctrl/⌘+D, persisted preference
- 📖 **Dynamic Lesson System** - Create unlimited custom lessons (registered users)
- ⌨️ **Keyboard Shortcuts** - 12 shortcuts for rapid navigation and actions
- 🎨 **Tailwind CSS UI** - Modern, responsive design with utility-first approach
- 🎯 **Full-Featured Demo Mode** - Try all features with 2 lessons (max 20 words/lesson)
- 🔊 **Text-to-Speech** - Native English pronunciation with adjustable speed (0.3x - 1.5x)
- 🎵 **Automatic Phonetics** - IPA phonetic transcription via DictionaryAPI
- 🔍 **Smart Search** - Filter by English or Hungarian words
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Auto-Save** - Automatic cloud synchronization for Google users, localStorage for demo
- ✏️ **Lesson Management** - Rename and delete lessons (authenticated users)
- 🗑️ **Word Management** - Add, delete, edit and organize words
- 🖱️ **Drag & Drop** - Intuitive reordering with optimized mobile touch support
- 🎚️ **Pronunciation Speed Control** - Adjustable speech synthesis speed (0.3x - 1.5x)
- 🌐 **Offline Support** - Demo mode works offline with localStorage

### Favorites Features (v0.7.0)
- **Mark & Manage** - Star icon on each word (desktop: first column, mobile: left side)
- **Favorites Modal** - Full-screen browser with advanced features (Ctrl+Shift+F)
  - Search across English and Hungarian words
  - Filter by lesson with dropdown
  - Responsive grid layout (1 col mobile, 2 cols desktop)
  - One-click removal with trash icon
  - Navigate to word's location in lesson
  - Sort by most recently favorited
- **Desktop Navigation** - Unified button bar with Favorites, Dark Mode, Shortcuts
- **Mobile Optimized** - Touch-friendly buttons and favorite star placement
- **Dual Storage** - Firebase sync (authenticated) or localStorage (demo)
- **Real-time Updates** - Counter badge updates instantly
- **Keyboard Shortcut** - Ctrl+Shift+F to open favorites modal

### Practice Mode Features
- 🎴 **Flashcard Learning** - Interactive 3D flip cards with smooth animations
- 🎤 **Pronunciation Practice** - Real-time speech recognition with scoring (Chrome/Edge only)
  - Live waveform visualization during recording
  - Pronunciation accuracy scoring (0-100%)
  - Instant feedback with phonetic tips
  - Word difficulty indicators (Easy/Medium/Hard)
  - Context-aware pronunciation coaching
- 🎲 **Multiple Modes**:
  - **Sequential**: Practice in original order
  - **Random**: Shuffle cards for varied practice
  - **Reverse**: Hungarian → English direction
  - **Pronunciation**: Speech recognition with real-time feedback
- 🏆 **Gamification System**:
  - 5-star performance rating
  - 12 achievement badges (7 pronunciation-specific)
  - Confetti celebrations on completion
  - Dynamic encouraging messages
  - Motivational quotes
  - Pronunciation streaks and mastery tracking
- 📊 **Progress Tracking**: Visual progress bar with card indicators
- ⌨️ **Keyboard Shortcuts**: Space (flip/record), ←/→ (navigate), Esc (exit)
- 📱 **Swipe Gestures**: Left/right swipe navigation on mobile (flashcards only)
- 📈 **Session Statistics**: 
  - Time spent, cards viewed, flip count, completion percentage
  - Average pronunciation accuracy and perfect score count
  - Attempts per word and score breakdown
- 🎯 **Milestone Notifications**: Encouragement at 25%, 50%, 75% progress

### Progress Tracking & Gamification
- 📊 **Daily Progress Tracking** - Real-time tracking of learning activity
  - Words learned counter with daily goal
  - Practice sessions completed
  - Time spent studying (minutes)
  - Visual progress bar with percentage
  - Goal achievement celebrations (🎉 Napi cél elérve!)
- 🔥 **Streak System** - Motivational consecutive days tracking
  - Current streak with flame animation
  - Longest streak record
  - Streak milestones: 7, 14, 30, 100 days
  - Milestone badges (7️⃣ 🔥 🏆 💯)
  - Confetti celebrations on milestone achievements
  - Next milestone indicator
- 🎯 **Daily Goal Settings** - Customizable learning targets
  - Adjustable goals (5-50 words/day)
  - Quick presets (5, 10, 15, 20, 30, 50)
  - Visual slider with real-time preview
  - Goal achievement tracking
- 📅 **Progress Calendar** - Monthly activity visualization
  - Color-coded days (gray/blue/yellow/green)
  - Activity levels (0, 1-4, 5-9, 10+ words)
  - Interactive day selection for details
  - Month navigation with today shortcut
  - Selected day stats (words, sessions, time, goal status)
- 📈 **Progress Charts** - Interactive data visualization
  - Weekly and monthly views
  - Bar chart for words learned
  - Line charts for time and pronunciation accuracy
  - Custom tooltips with detailed breakdowns
  - Summary statistics (totals, averages, active days)
  - Dark mode compatible colors
- 📊 **Comprehensive Statistics** - Lifetime learning metrics
  - Total days tracked and active days
  - Total words learned all-time
  - Total study time (minutes)
  - Current week summary
  - Best streaks (current and longest)
  - Achievement badges showcase
- 🎖️ **Achievement Badges** - Unlock learning milestones
  - Week Warrior (7 days)
  - Two Week Champion (14 days)
  - Month Master (30 days)
  - Century Club (100 days)
- 💾 **Dual Mode Support** - Works everywhere
  - Firebase integration for authenticated users
  - localStorage for demo mode
  - Automatic data sync
  - Cross-device progress (authenticated)
- 🎉 **Celebration System** - Visual rewards
  - Toast notifications for goal achievements
  - Confetti animations for milestones
  - Milestone notifications during practice (25%, 50%, 75%)
  - Encouraging messages and emojis
- 📱 **Responsive Design** - Optimized for all devices
  - Collapsible detailed stats section
  - Mobile-friendly charts and calendar
  - Touch-optimized interactions

### Pronunciation Practice Features
- 🎤 **Real-time Speech Recognition** - Web Speech API integration (Chrome/Edge)
- 🔊 **Forced English Voice** - Explicitly sets `utterance.lang = 'en-US'` to prevent browser using non-English voices
- 🗂️ **Voice Selection Priority** - en-US > en-GB > any English variant
- ♻️ **Improved Fallbacks** - Handles missing or unavailable English voices gracefully
- 📝 **Enhanced Maintainability** - Detailed inline comments added for critical code paths
- 📊 **Accuracy Scoring** - 0-100% similarity scoring with Levenshtein algorithm
- 🌊 **Waveform Visualizer** - Animated audio bars during recording
- 💡 **Smart Tips** - Context-aware pronunciation coaching (TH, R, W, V sounds)
- 🎯 **Difficulty Levels** - Automatic word difficulty calculation (Easy/Medium/Hard)
- 🏆 **7 New Badges**: Perfect Speaker, Native-like, Pronunciation Master, Perfect Streak, One Shot Wonder, Persistent Learner, Pronunciation Champion
- ⚠️ **Enhanced Error Handling** - Browser-specific troubleshooting with detailed tips
- ♿ **Full Accessibility** - WCAG 2.1 AA compliant with keyboard and screen reader support
- 📱 **Mobile Optimized** - Touch-friendly controls with haptic feedback

### Design Features
- **Light & Dark Modes**: Automatic system preference detection with manual toggle
- **Smooth Animations**: Fade-in, slide-in, and pulse effects
- **Custom Scrollbars**: Styled scrollbars for both themes
- **Focus Indicators**: Clear keyboard navigation feedback
- **Toast Notifications**: Real-time feedback for user actions
- **Mobile-Optimized Touch**: 100ms delay, 5px tolerance for better drag & drop

## ⌨️ Keyboard Shortcuts

Private Dictionary includes a comprehensive keyboard shortcut system for efficient navigation and productivity. All shortcuts work on both Windows/Linux (Ctrl) and macOS (⌘).

### Quick Reference

| Shortcut | Windows/Linux | macOS | Action |
|----------|---------------|-------|--------|
| **Basic Actions** | | | |
| New Word | `Ctrl+E` | `⌘E` | Open add words modal |
| Search | `Ctrl+F` | `⌘F` | Focus search input |
| Save Status | `Ctrl+S` | `⌘S` | Show save notification |
| Dark Mode | `Ctrl+D` | `⌘D` | Toggle dark/light theme |
| Help | `Ctrl+K` | `⌘K` | Toggle shortcuts help |
| Favorites | `Ctrl+Shift+F` | `⌘⇧F` | Open favorites modal |
| Close | `ESC` | `ESC` | Close active modal |
| **Navigation** | | | |
| Next Lesson | `Ctrl+→` | `⌘→` | Navigate to next lesson |
| Previous Lesson | `Ctrl+←` | `⌘←` | Navigate to previous lesson |
| First Lesson | `Ctrl+Home` | `⌘Home` | Jump to first lesson |
| Last Lesson | `Ctrl+End` | `⌘End` | Jump to last lesson |
| **Practice Mode** | | | |
| Flip Card | `Space` | `Space` | Flip flashcard or toggle recording |
| Navigate | `←` `→` | `←` `→` | Previous/Next card (flashcards only) |
| Exit | `ESC` | `ESC` | Close practice mode |

### Features
- **Cross-platform**: Automatic detection of Windows/Linux (Ctrl) vs macOS (⌘)
- **Visual Feedback**: Toast notifications for all navigation actions
- **Help Modal**: Press `Ctrl/⌘+K` to view all available shortcuts (desktop only)
- **Floating Button**: Click the ⌨️ icon in the bottom-right corner for help (desktop only)
- **Practice Mode**: Context-aware shortcuts (Space for flip or record)

For complete documentation, see [docs/KEYBOARD_SHORTCUTS.md](docs/KEYBOARD_SHORTCUTS.md)

## 🎮 Demo Mode

### What is Demo Mode?
Demo mode allows you to **try all features** of Private Dictionary without creating an account. Your data is stored locally in your browser and persists across sessions.

### Demo Mode Features:
✅ **Full Feature Access**
- Add, edit, and delete words
- Drag & drop to reorder words (optimized touch support)
- Rename lessons
- Adjust pronunciation speed
- Use text-to-speech
- Access automatic phonetic generation
- Practice with flashcards and pronunciation mode (Chrome/Edge)
- Use all keyboard shortcuts
- Toggle dark mode

⚠️ **Demo Limitations**
- Maximum **2 lessons** available
- Maximum **20 words per lesson**
- Data stored in browser localStorage (not synchronized across devices)
- Demo lessons cannot be deleted (protection against accidental data loss)
- Data cleared on logout

### Demo vs Authenticated Mode:

| Feature | Demo Mode | Authenticated Mode |
|---------|-----------|-------------------|
| Number of Lessons | 2 | Unlimited |
| Words per Lesson | 20 | Unlimited |
| Flashcard Practice | ✅ | ✅ |
| Pronunciation Practice | ✅ (Chrome/Edge) | ✅ (Chrome/Edge) |
| Add/Edit Words | ✅ | ✅ |
| Delete Words | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ |
| Keyboard Shortcuts | ✅ | ✅ |
| Dark Mode | ✅ | ✅ |
| Rename Lessons | ✅ | ✅ |
| Delete Lessons | ❌ | ✅ |
| Cross-device Sync | ❌ | ✅ |
| Data Persistence | localStorage | Firebase Cloud |
| Offline Mode | ✅ | ❌ (requires connection) |

## 📁 Project Structure

### Authentication Modes

#### **Demo Mode**: 
- Instant access without registration
- Access to 2 fully functional lessons
- Can add up to 20 words per lesson
- Can modify, delete, and reorder words
- Can rename lessons
- Full keyboard shortcuts support
- Dark mode support
- Data persists in browser localStorage
- Data cleared on logout
- Perfect for trying the app or offline use

#### **Google Authentication**:
- Unlimited lesson creation
- Unlimited words per lesson
- Full CRUD operations on lessons and words
- Personal dictionary storage in Firebase
- Cross-device synchronization
- Automatic cloud backup
- Import/export capabilities
- Long-term progress tracking

### Word Management Features

#### Adding Words
- **Single Word Entry**: Add words individually with automatic phonetic generation
- **Bulk Import**: Add up to 20 words at once from a list
- **API Phonetics**: Automatic IPA transcription from Datamuse API
- **Fallback System**: Local phonetic generation if API fails
- **Format**: "english word - magyar jelentés"
- **Keyboard Shortcut**: Press `Ctrl/⌘+E` to quickly open the add words modal

#### Phonetic Generation
- **Old API**: Datamuse (replaced in v0.5.1)
- **New API**: [DictionaryAPI](https://dictionaryapi.dev/) for precise IPA transcription
- **Benefits**: More accurate phonetic results and consistent pronunciation across word list and practice mode
- **Fallback Algorithm**: Local generation for common patterns
- **Batch Processing**: Automatic phonetics for bulk imports
- **Manual Override**: Edit phonetics manually if needed

#### Word Organization
- **Drag & Drop**: Reorder words within lessons
- **Persistent Ordering**: Changes saved to database/localStorage
- **Visual Feedback**: Real-time UI updates during drag operations
- **Mobile Support**: Optimized touch-friendly drag & drop (100ms delay, 5px tolerance)
- **Haptic Feedback**: Vibration feedback on mobile devices (when supported)

#### Lesson Operations
- **Create**: Add new lessons dynamically (authenticated users)
- **Rename**: Edit lesson titles inline
- **Delete**: Remove empty lessons (authenticated users only)
- **Navigate**: Quick lesson switching with keyboard shortcuts
- **Progress Tracking**: Visual indicators for completed lessons
- **Keyboard Navigation**: Use `Ctrl+→/←` to navigate between lessons

## 🚀 Demo

### Try Demo Mode

1. Open the application
2. Click "Demó fiók használata" (Use Demo Account)
3. Explore 2 fully-featured lessons
4. Add up to 20 words per lesson
5. Test all features: drag & drop, delete, rename, speech synthesis, keyboard shortcuts
6. Toggle dark mode with the 🌙 button or `Ctrl/⌘+D`
7. Your changes persist in localStorage
8. Press `Ctrl/⌘+K` to see all keyboard shortcuts
9. Logout clears demo data

### Full Features with Google

1. Click "Belépés Google fiókkal" (Sign in with Google)
2. Authorize the application
3. Create unlimited custom lessons
4. Add unlimited words per lesson
5. Access from any device with cloud sync
6. Long-term data persistence
7. Full keyboard shortcuts support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)
- **Firebase Project** (for authenticated mode)

## 🛠 Installation

### 1. Clone the repository
```bash
git clone https://github.com/SzaniszloIvor/private-dictionary.git
cd private-dictionary
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env` file in the root directory:
```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: OpenAI API for future features
# VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

**Note:** Demo mode works without Firebase configuration, but Google authentication requires proper Firebase setup.

## ⚙️ Configuration

### Firebase Setup

#### 1. Create a Firebase Project
   - Go to https://console.firebase.google.com
   - Create a new project
   - Enable Google Authentication
   - Create a Firestore database
   - Copy configuration to `.env` file

#### 2. Enable Authentication
   - Firebase Console → Authentication → Sign-in method → Google → Enable

#### 3. Configure Firestore
   - Firebase Console → Firestore Database → Create database → Start in production mode

#### 4. Set Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dictionaries/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Tailwind CSS Configuration
The project uses Tailwind CSS v3.4.1 for styling with dark mode support:

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

### Build Configuration
The project uses Vite with production optimizations:
```javascript
// vite.config.js
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

## 🌐 API Integration

### Datamuse API for Phonetics
The application uses the Datamuse API for accurate phonetic transcription:

- **Endpoint**: `https://api.datamuse.com/words`
- **Parameters**:
  - `sp`: spelling (the word to look up)
  - `md=r`: metadata flag for pronunciation
  - `max=1`: return only the best match

**Example Request:**
```javascript
fetch('https://api.datamuse.com/words?sp=hello&md=r&max=1')
```

**Response Processing:**
- Extract ARPAbet pronunciation from response
- Convert ARPAbet to IPA notation
- Display in the phonetic field

**Features:**
- No API key required
- Free to use
- Rate limit friendly
- Automatic fallback to local generation
- Batch processing for bulk imports

## 💻 Usage

### Running in Development
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```
This will:
- Create optimized production build
- Remove all `console.log` statements
- Minify and bundle assets with Tailwind CSS purging
- Output to `dist/` directory

### Preview Production Build
```bash
npm run preview
```

### Running Tests
```bash
npm run test
```

### Linting
```bash
npm run lint
```

### Key Features Usage

#### Dark Mode
- Toggle with the 🌙 button in the UI
- Use `Ctrl/⌘+D` keyboard shortcut
- Automatic system preference detection
- Preference saved to localStorage

#### Keyboard Shortcuts
- Press `Ctrl/⌘+K` to view all available shortcuts (desktop only)
- Use `Ctrl/⌘+E` to quickly add new words
- Navigate lessons with `Ctrl/⌘+→/←` keys
- Press `ESC` to close any modal
- See [docs/KEYBOARD_SHORTCUTS.md](docs/KEYBOARD_SHORTCUTS.md) for complete documentation

#### Drag & Drop
- **Desktop**: Click and hold, then drag to new position
- **Mobile**: Press and hold the ⋮⋮ handle for 100ms, then drag
- Changes automatically saved to database (authenticated) or localStorage (demo)
- Optimized touch sensors: 100ms delay, 5px tolerance
- Haptic feedback on supported mobile devices

#### Pronunciation Speed Control
Use the slider in the word table to adjust playback speed from 0.3x (slow) to 1.5x (fast). Default speed is 0.7x. Speed preference is saved across sessions.

#### Bulk Word Import
In the "Add Words" modal, switch to "List Upload" mode and paste words in format:
```
english word - magyar jelentés
another word - másik jelentés
```
Up to 20 words can be processed at once with automatic API phonetic generation.

## 📁 Project Structure

```
private-dictionary/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Header/
│   │   ├── ProgressSection/
│   │   ├── SearchControls/
│   │   ├── LessonNavigation/
│   │   ├── LessonContent/
│   │   ├── WordTable/
│   │   ├── SearchResults/
│   │   ├── AddWordsModal/
│   │   ├── KeyboardShortcutsHelper/
│   │   ├── DarkModeToggle/
│   │   ├── FavoriteButton/
│   │   ├── FavoritesModal/
│   │   ├── DailyProgress/
│   │   │   ├── DailyProgressCard.jsx
│   │   │   ├── StreakDisplay.jsx
│   │   │   ├── DailyGoalSettings.jsx
│   │   │   ├── ProgressCalendar.jsx
│   │   │   ├── ProgressChart.jsx
│   │   │   └── StatsOverview.jsx
│   │   ├── PracticeMode/
│   │   │   ├── PracticeModeModal.jsx
│   │   │   ├── FlashCard.jsx
│   │   │   ├── PracticeControls.jsx
│   │   │   ├── PracticeProgress.jsx
│   │   │   ├── PracticeSettings.jsx
│   │   │   ├── PracticeResults.jsx
│   │   │   ├── ConfettiReward.jsx
│   │   │   ├── StarRating.jsx
│   │   │   ├── PronunciationCard.jsx
│   │   │   ├── MicrophoneButton.jsx
│   │   │   ├── PronunciationFeedback.jsx
│   │   │   ├── WaveformVisualizer.jsx
│   │   │   ├── ErrorDisplay.jsx
│   │   │   ├── PronunciationTips.jsx
│   │   │   └── PronunciationResults.jsx
│   │   ├── ErrorBoundary.jsx
│   │   └── LoginScreen/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── firebase.js
│   ├── hooks/
│   │   ├── useSpeechSynthesis.js
│   │   ├── useSpeechRecognition.js
│   │   ├── useLocalStorage.js
│   │   ├── useKeyboardShortcuts.js
│   │   ├── useDarkMode.js
│   │   ├── useFavorites.js
│   │   ├── usePracticeMode.js
│   │   ├── useSwipeGesture.js
│   │   ├── useDailyProgress.js
│   │   ├── useStatsHistory.js
│   │   └── useStreak.js
│   ├── utils/
│   │   ├── phoneticHelper.js
│   │   ├── pronunciationHelper.js
│   │   ├── practiceHelper.js
│   │   ├── rewardHelper.js
│   │   ├── favoritesHelper.js
│   │   ├── migration.js
│   │   └── demoStatsHelper.js
│   ├── data/
│   │   └── dictionary.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── docs/
│   ├── KEYBOARD_SHORTCUTS.md
│   ├── INSTALLATION.md
│   ├── QUICK_REFERENCE.md
│   ├── ARCHITECTURE.md
│   └── keyboard-shortcuts-cheatsheet.html
├── .env
├── .env.example
├── .gitignore
├── CHANGELOG.md
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

### Key Components

#### Favorites Components (v0.7.0)
- **FavoriteButton.jsx** - Reusable star button with 3 size variants (sm/md/lg)
- **FavoritesModal.jsx** - Full-featured favorites browser with search and filtering

#### Progress Tracking Components (v0.6.0)
- **DailyProgressCard.jsx** - Main daily progress display with goal tracking
- **StreakDisplay.jsx** - Streak visualization with flame animation and milestones
- **DailyGoalSettings.jsx** - Modal for customizing daily learning goals
- **ProgressCalendar.jsx** - Monthly calendar with color-coded activity levels
- **ProgressChart.jsx** - Interactive charts with Recharts (bar + line charts)
- **StatsOverview.jsx** - Comprehensive statistics dashboard with lifetime metrics

#### Progress Tracking Utilities (v0.6.0)
- **useDailyProgress.js** - Core hook for daily stats and goal management
- **useStatsHistory.js** - Historical data retrieval and chart data generation
- **useStreak.js** - Streak calculation, milestone tracking, and badge logic
- **demoStatsHelper.js** - localStorage-based stats for demo mode

#### Practice Mode (v0.4.0 + v0.5.0)
- **PracticeModeModal.jsx** - Main practice orchestrator, mode selection and session management
- **FlashCard.jsx** - 3D flip card component for flashcard practice
- **PracticeControls.jsx** - Navigation controls (previous/next/flip buttons)
- **PracticeProgress.jsx** - Visual progress bar with card indicators
- **PracticeSettings.jsx** - Mode selection (Sequential, Random, Reverse, Pronunciation)
- **PracticeResults.jsx** - Results screen with statistics and badges
- **ConfettiReward.jsx** - Canvas-based confetti animation for celebrations
- **StarRating.jsx** - Animated star rating component (1-5 stars)

#### Pronunciation Practice (v0.5.0)
- **PronunciationCard.jsx** - Main pronunciation practice UI with speech recognition
- **MicrophoneButton.jsx** - Audio recording control with visual feedback
- **PronunciationFeedback.jsx** - Score display with accessibility (ARIA)
- **WaveformVisualizer.jsx** - Real-time audio visualization (Canvas API)
- **ErrorDisplay.jsx** - Enhanced error messages with browser-specific tips
- **PronunciationTips.jsx** - Context-aware phonetic coaching system
- **PronunciationResults.jsx** - Pronunciation-specific results screen
- **ErrorBoundary.jsx** - Application-wide error recovery component

#### Core Components
- **App.jsx** - Main application logic, dark mode state, keyboard shortcuts
- **AuthContext.jsx** - Authentication state and methods (Google + Demo)
- **AddWordsModal.jsx** - Word addition interface with API integration
- **LessonContent.jsx** - Lesson display with edit/delete capabilities and practice mode entry
- **WordTable.jsx** - Word list with optimized drag & drop, pronunciation
- **KeyboardShortcutsHelper.jsx** - Floating button and modal for keyboard shortcuts
- **DarkModeToggle.jsx** - Dark mode toggle component

### Key Utilities

#### Favorites Utilities (v0.7.0)
- **useFavorites.js** - Custom hook for favorites state management (Firebase + localStorage)
- **favoritesHelper.js** - localStorage utilities for demo mode favorites
- **migration.js** - Automatic data migration for existing dictionaries

#### Practice Mode Utilities
- **usePracticeMode.js** - Practice session state management (word progression, flips, timer)
- **useSwipeGesture.js** - Mobile swipe detection for card navigation
- **practiceHelper.js** - Practice utilities (shuffle, stats calculation, time formatting)
- **rewardHelper.js** - Gamification logic (stars, badges, messages, confetti intensity)

#### Pronunciation Utilities (v0.5.0)
- **useSpeechRecognition.js** - Web Speech API hook with 10s auto-stop timeout
- **pronunciationHelper.js** - Complete pronunciation system:
  - Scoring algorithm (Levenshtein distance)
  - Feedback generation (5 performance levels)
  - Error handling (6 error types with browser-specific tips)
  - Advanced tips (phonetic analysis for TH, R, W, V sounds)
  - Difficulty calculation (Easy/Medium/Hard)

#### Core Utilities
- **useSpeechSynthesis.js** - Browser speech synthesis hook with speed control
- **useLocalStorage.js** - Local storage management hook (demo mode)
- **useKeyboardShortcuts.js** - Custom hook for keyboard shortcut handling
- **useDarkMode.js** - Dark mode state management with localStorage persistence
- **phoneticHelper.js** - Datamuse API integration and IPA conversion
- **firebase.js** - Firebase initialization and CRUD operations

## 🔧 Technologies

### Frontend
- **React 19** - UI library with hooks
- **Tailwind CSS 3.4.1** - Utility-first CSS framework with dark mode support
- **Vite 7** - Build tool and dev server with terser optimization
- **Lucide React** - Icon library
- **@dnd-kit** - Drag and drop library with optimized touch sensors
- **Recharts 2.x** - Composable charting library for data visualization

### Backend & Services
- **Firebase Authentication** - Google OAuth integration
- **Firebase Firestore** - NoSQL database for cloud storage
- **localStorage** - Browser storage for demo mode
- **Datamuse API** - Phonetic transcription service
- **Web Speech API** - Text-to-speech functionality

### Development Tools
- **ESLint** - Code linting
- **Terser** - Production build optimization (console.log removal)
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

### UI/UX Features
- **Dark Mode** - System preference detection with manual toggle
- **Custom Animations** - Fade-in, slide-in-up, pulse effects
- **Responsive Design** - Mobile-first approach with Tailwind breakpoints
- **Touch Optimization** - 100ms delay, 5px tolerance for mobile drag & drop
- **Haptic Feedback** - Vibration on mobile devices (when supported)
- **Canvas Animations** - Waveform visualizer and confetti effects
- **WCAG 2.1 AA** - Full accessibility compliance (v0.5.0)

### Browser Support (Pronunciation Mode)
- ✅ **Chrome 80+** - Full support (recommended)
- ✅ **Edge 80+** - Full support (recommended)
- ⚠️ **Safari 14+** - Limited (warning shown)
- ❌ **Firefox** - Not supported (clear message)

## 🤝 By invitation only

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style (Tailwind CSS utility classes)
- Write meaningful commit messages using Conventional Commits
- Add tests for new features
- Update documentation as needed
- Test both demo and authenticated modes
- Ensure drag & drop persistence works correctly
- Test keyboard shortcuts on both Windows and macOS
- Test on mobile devices (especially touch interactions)
- Test both light and dark modes
- Test pronunciation mode on Chrome/Edge browsers
- Ensure accessibility standards (WCAG 2.1 AA)

### Conventional Commit Examples
```bash
feat(dark-mode): add dark mode toggle
fix(mobile): optimize touch sensor activation delay
docs(readme): update dark mode documentation
style(tailwind): convert inline styles to utility classes
chore(deps): update tailwindcss to v3.4.1
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## 🎨 Planned UI Enhancements

The following improvements are planned to enhance usability, learning efficiency, and overall user experience:

### 📊 Learning Aids
- **OpenAI API Integration** – Supports (prioritized for Private Dictionary):  
  1. Querying Hungarian meanings  
  2. Practicing spelling (iPad integration)  
  3. Generating example sentences  
  4. Explaining grammar rules  
  5. Vocabulary expansion (personalized word lists with synonyms, idioms, and usage examples)  
  6. Adding words via image recognition (photo-based word capture)  
  7. Adaptive quizzes and mini-games (fill-in-the-blank, multiple choice, error correction)  
  8. Pronunciation feedback (analyzing learner's spoken sentences)  
  9. Writing assistance (short texts, emails, exercises with grammar and style corrections)  
  10. Personalized learning plans (based on learner's strengths and weaknesses)  
  11. Context-aware sentence generation (e.g., situational examples like travel, school, restaurant)  
  12. Contextual translations with synonyms, antonyms, and word collocations  
  13. Conversation simulations (interactive chatbot for practicing dialogues)  
  14. Cultural and usage tips (formal/informal usage, slang, idioms, collocations)

### 🎨 Visual Improvements
- **Loading States** – Skeleton screens, optimistic updates  
- **Empty States** – Friendly SVG illustrations for no data / no results  
- **Progress Indicators** – Visual feedback for lesson completion  

### 🔧 Usability
- **Bulk Actions** – Multi-select for delete, copy, move  
- **Import/Export** – CSV, JSON backup/restore, Anki deck export, printable flashcards  
- **Smart Search** – Fuzzy search with suggestions and typo tolerance  
- **Lesson Categories** – Organize lessons by topic/difficulty  

### 📱 Mobile Specific
- **Swipe Gestures** – Left = delete, right = favorite, double-tap = pronounce  
- **PWA Support** – Offline mode, install prompt, app-like experience  
- **Pull to Refresh** – Sync data with gesture  

### 🚀 Performance
- **Virtual Scrolling** – Efficient rendering of large word lists (1000+ words)  
- **Lazy Loading** – Lessons, images, and code splitting  
- **Service Worker** – Advanced offline capabilities and caching  

### 🌐 Internationalization
- **Multi-language Support** – Interface localization  
- **Additional Language Pairs** – Beyond English-Hungarian  
- **Custom Phonetic Systems** – Support for different notation systems

## 📜 License

**© 2025 Szaniszló Ivor. All Rights Reserved.**

This software and associated documentation files (the "Software") are the proprietary property of Szaniszló Ivor. Unauthorized copying, modification, distribution, or use of this Software, via any medium, is strictly prohibited without express written permission from the copyright holder.

For licensing inquiries, please contact: info@ivor.hu

## 📞 Contact

**Szaniszló Ivor**
- Email: info@ivor.hu
- GitHub: [@SzaniszloIvor](https://github.com/SzaniszloIvor)
- LinkedIn: [SzaniszloIvor](https://linkedin.com/in/SzaniszloIvor)

**Project Link:** https://github.com/SzaniszloIvor/private-dictionary

## 🙏 Acknowledgments

- [Datamuse API](https://www.datamuse.com/api/) for phonetic transcriptions
- [Firebase](https://firebase.google.com/) for authentication and database
- [dnd-kit](https://dndkit.com/) for drag and drop functionality
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling

---

<div align="center">
  <p>Made with ❤️ by Szaniszló Ivor</p>
  <p>⭐ Star this repo if you find it helpful!</p>
</div>
