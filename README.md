# 🎧 Private Dictionary

A modern, interactive English-Hungarian dictionary application designed for personalized language learning with dynamic lesson management.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-12.x-FFCA28?style=flat&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Version](https://img.shields.io/badge/Version-0.2.0-blue.svg)

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo Mode](#-demo-mode)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Contributing](#-contributing)
- [Changelog](#-changelog)
- [Planned UI Enhancements](#-planned-ui-enhancements)
- [License](#-license)
- [Contact](#-contact)

## 🎯 About

Private Dictionary is a comprehensive language learning platform that provides a dynamic, customizable English curriculum with Hungarian translations. The application supports both demo mode for trying out features and Google authentication for unlimited personalized learning experiences with cloud synchronization.

### Key Highlights:
- **Full-Featured Demo Mode**: Try all features with 2 lessons (max 20 words each)
- **Dynamic Learning Path**: Create unlimited custom lessons (registered users)
- **Dual Authentication**: Demo mode with localStorage and Google Sign-in with Firebase
- **Real-time Sync**: Cloud-based storage with automatic saving
- **Phonetic API**: Automatic IPA phonetic generation via Datamuse API
- **Speech Synthesis**: Native pronunciation for all words with speed control
- **Drag & Drop**: Intuitive word and lesson reordering with persistence
- **Responsive Design**: Optimized for mobile and desktop devices

## ✨ Features

### Core Features
- 📖 **Dynamic Lesson System** - Create unlimited custom lessons (registered users)
- 🎯 **Full-Featured Demo Mode** - Try all features with 2 lessons (max 20 words/lesson)
- 🔊 **Text-to-Speech** - Native English pronunciation with adjustable speed (0.3x - 1.5x)
- 🎵 **Automatic Phonetics** - IPA phonetic transcription via Datamuse API
- 🔍 **Smart Search** - Filter by English or Hungarian words
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Auto-Save** - Automatic cloud synchronization for Google users, localStorage for demo
- ✏️ **Lesson Management** - Rename and delete lessons (authenticated users)
- 🗑️ **Word Management** - Add, delete, and organize words
- 🖱️ **Drag & Drop** – Intuitive reordering with database/localStorage persistence
- 🎚️ **Pronunciation Speed Control** – Adjustable speech synthesis speed (0.3x - 1.5x)
- 🌐 **Offline Support** - Demo mode works offline with localStorage

## 🎮 Demo Mode

### What is Demo Mode?
Demo mode allows you to **try all features** of Private Dictionary without creating an account. Your data is stored locally in your browser and persists across sessions.

### Demo Mode Features:
✅ **Full Feature Access**
- Add, edit, and delete words
- Drag & drop to reorder words
- Rename lessons
- Adjust pronunciation speed
- Use text-to-speech
- Access automatic phonetic generation

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
| Add/Edit Words | ✅ | ✅ |
| Delete Words | ✅ | ✅ |
| Drag & Drop | ✅ | ✅ |
| Rename Lessons | ✅ | ✅ |
| Delete Lessons | ❌ | ✅ |
| Cross-device Sync | ❌ | ✅ |
| Data Persistence | localStorage | Firebase Cloud |
| Offline Mode | ✅ | ❌ (requires connection) |

### Authentication Modes

#### **Demo Mode**: 
- Instant access without registration
- Access to 2 fully functional lessons
- Can add up to 20 words per lesson
- Can modify, delete, and reorder words
- Can rename lessons
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

#### Phonetic Generation
- **Primary Source**: Datamuse API for accurate IPA transcription
- **ARPAbet Conversion**: Converts ARPAbet to IPA notation
- **Fallback Algorithm**: Local generation for common patterns
- **Batch Processing**: Automatic phonetics for bulk imports
- **Manual Override**: Edit phonetics manually if needed

#### Word Organization
- **Drag & Drop**: Reorder words within lessons
- **Persistent Ordering**: Changes saved to database/localStorage
- **Visual Feedback**: Real-time UI updates during drag operations
- **Mobile Support**: Touch-friendly drag & drop on mobile devices

#### Lesson Operations
- **Create**: Add new lessons dynamically (authenticated users)
- **Rename**: Edit lesson titles inline
- **Delete**: Remove empty lessons (authenticated users only)
- **Navigate**: Quick lesson switching
- **Progress Tracking**: Visual indicators for completed lessons
- **Drag & Drop**: Reorder lessons (coming soon)

## 🚀 Demo

### Try Demo Mode

1. Open the application
2. Click "Demó fiók használata" (Use Demo Account)
3. Explore 2 fully-featured lessons
4. Add up to 20 words per lesson
5. Test all features: drag & drop, delete, rename, speech synthesis
6. Your changes persist in localStorage
7. Logout clears demo data

### Full Features with Google

1. Click "Belépés Google fiókkal" (Sign in with Google)
2. Authorize the application
3. Create unlimited custom lessons
4. Add unlimited words per lesson
5. Access from any device with cloud sync
6. Long-term data persistence

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
The project uses Tailwind CSS for styling. Configuration file:
```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
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
export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Removes console.log in production
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
- Minify and bundle assets
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

#### Drag & Drop
Simply click and hold a word or lesson, then drag it to its new position. Changes are automatically saved to database (authenticated) or localStorage (demo).

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
│   │   │   └── Header.jsx
│   │   ├── ProgressSection/
│   │   │   └── ProgressSection.jsx
│   │   ├── SearchControls/
│   │   │   └── SearchControls.jsx
│   │   ├── LessonNavigation/
│   │   │   └── LessonNavigation.jsx
│   │   ├── LessonContent/
│   │   │   └── LessonContent.jsx
│   │   ├── WordTable/
│   │   │   └── WordTable.jsx
│   │   ├── SearchResults/
│   │   │   └── SearchResults.jsx
│   │   ├── AddWordsModal/
│   │   │   └── AddWordsModal.jsx
│   │   └── LoginScreen/
│   │       └── LoginScreen.jsx
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── firebase.js
│   ├── hooks/
│   │   ├── useSpeechSynthesis.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   └── phoneticHelper.js
│   ├── data/
│   │   └── dictionary.js
│   ├── styles/
│   │   └── styles.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
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
- **App.jsx** - Main application logic, state management, and auto-save
- **AuthContext.jsx** - Authentication state and methods (Google + Demo)
- **AddWordsModal.jsx** - Word addition interface with API integration
- **LessonContent.jsx** - Lesson display with edit/delete capabilities
- **WordTable.jsx** - Word list with drag & drop, pronunciation, and deletion
- **phoneticHelper.js** - Phonetic generation and Datamuse API integration

### Key Utilities
- **firebase.js** - Firebase initialization and CRUD operations
- **phoneticHelper.js** - Datamuse API integration and IPA conversion
- **useSpeechSynthesis.js** - Browser speech synthesis hook with speed control
- **useLocalStorage.js** - Local storage management hook (demo mode)

## 🔧 Technologies

### Frontend
- **React 19** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Vite 7** - Build tool and dev server with terser optimization
- **Lucide React** - Icon library
- **@dnd-kit** - Drag and drop library

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

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes using conventional commits (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages using Conventional Commits
- Add tests for new features
- Update documentation as needed
- Test both demo and authenticated modes
- Ensure drag & drop persistence works correctly
- Test on mobile devices

### Conventional Commit Examples
```bash
feat(demo): add new demo feature
fix(drag-drop): resolve position persistence issue
docs(readme): update installation instructions
chore(deps): update dependencies
```

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

### Recent Updates (v0.2.0)
- ✅ Full-featured demo mode with localStorage persistence
- ✅ Fixed drag & drop position saving
- ✅ Fixed word deletion functionality
- ✅ Production build optimization (console.log removal)
- ✅ Demo mode restrictions (2 lessons, 20 words/lesson)

## 🎨 Planned UI Enhancements

The following improvements are planned to enhance usability, learning efficiency, and overall user experience:

### 🎯 Quick Wins
- **Keyboard Shortcuts** – Ctrl/Cmd + N (new word), F (search), S (save notification)
- **Dark Mode** – Toggle with local storage persistence, optional automatic time-based switching
- **Undo/Redo** – Step back accidental deletions or edits

### 📊 Learning Aids
- **Practice Mode** – Quiz cards with "show/hide answer" flow
- **Daily Goal & Streaks** – Track words per day and visualize learning progress
- **Favorites** – Mark difficult or favorite words for quick access
- **Spaced Repetition** – Smart review system based on learning algorithms

### 🎨 Visual Improvements
- **Smooth Animations** – Card hover transitions, page transitions
- **Loading States** – Skeleton screens, optimistic updates
- **Empty States** – Friendly SVG illustrations for no data / no results
- **Toast Notifications** – Non-intrusive feedback for user actions

### 🔧 Usability
- **Bulk Actions** – Multi-select for delete, copy, move
- **Import/Export** – CSV, JSON backup/restore, Anki deck export, printable flashcards
- **Smart Search** – Fuzzy search with suggestions and typo tolerance
- **Lesson Categories** – Organize lessons by topic/difficulty

### 📱 Mobile Specific
- **Swipe Gestures** – Left = delete, right = favorite, double-tap = pronounce
- **PWA Support** – Offline mode, install prompt, app-like experience
- **Haptic Feedback** – Vibration feedback on actions
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

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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