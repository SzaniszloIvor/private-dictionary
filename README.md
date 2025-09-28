# 🎧 Private Dictionary

A modern, interactive English-Hungarian dictionary application designed for personalized language learning with dynamic lesson management.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28?style=flat&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Demo](#-demo)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Technologies](#-technologies)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

## 🎯 About

Private Dictionary is a comprehensive language learning platform that provides a dynamic, customizable English curriculum with Hungarian translations. The application supports both demo mode for trying out features (limited to 2 lessons) and Google authentication for unlimited personalized learning experiences with cloud synchronization.

### Key Highlights:
- **Dynamic Learning Path**: Create unlimited custom lessons (registered users)
- **Demo Mode**: Try the first 2 lessons without registration
- **Dual Authentication**: Demo mode and Google Sign-in
- **Real-time Sync**: Cloud-based storage with Firebase
- **Phonetic API**: Automatic IPA phonetic generation via Datamuse API
- **Speech Synthesis**: Native pronunciation for all words
- **Responsive Design**: Optimized for mobile and desktop devices

## ✨ Features

### Core Features
- 📖 **Dynamic Lesson System** - Create unlimited custom lessons (registered users)
- 🎯 **Demo Mode** - First 2 lessons available without registration
- 🔊 **Text-to-Speech** - Native English pronunciation for every word
- 🎵 **Automatic Phonetics** - IPA phonetic transcription via Datamuse API
- 🔍 **Smart Search** - Filter by English or Hungarian words
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Auto-Save** - Automatic cloud synchronization for Google users
- ✏️ **Lesson Management** - Rename and delete lessons
- 🗑️ **Word Management** - Add, delete, and organize words

### Authentication Modes

#### **Demo Mode**: 
- Instant access without registration
- Access to first 2 lessons only
- Can add/modify words in existing lessons
- Session-based storage (not saved)
- Cannot create new lessons
- Cannot delete words or rename lessons
- Perfect for trying the app

#### **Google Authentication**:
- Unlimited lesson creation
- Full CRUD operations on lessons and words
- Personal dictionary storage
- Cross-device synchronization
- Automatic phonetic generation
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

#### Lesson Operations
- **Create**: Add new lessons dynamically
- **Rename**: Edit lesson titles inline
- **Delete**: Remove empty lessons
- **Navigate**: Quick lesson switching
- **Progress Tracking**: Visual indicators for completed lessons

## 🚀 Demo

### Try Demo Mode

```
1. Open the application
2. Click "Demó fiók használata" (Use Demo Account)
3. Explore the first 2 lessons
4. Add words to existing lessons
5. Test speech synthesis
```

### Full Features with Google

```
1. Click "Belépés Google fiókkal" (Sign in with Google)
2. Authorize the application
3. Create unlimited custom lessons
4. Add/edit/delete words and lessons
5. Access from any device
```

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v8.0.0 or higher) or **yarn**
- **Git**
- **Modern web browser** (Chrome, Firefox, Safari, Edge)

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
VITE_OPENAI_API_KEY=your_openai_api_key
```

### 4. Start the development server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173`

## ⚙️ Configuration

### Firebase Setup

1. **Create a Firebase Project**
   ```
   1. Go to https://console.firebase.google.com
   2. Create a new project
   3. Enable Google Authentication
   4. Create a Firestore database
   5. Copy configuration to .env file
   ```

2. **Enable Authentication**
   ```
   Firebase Console → Authentication → Sign-in method → Google → Enable
   ```

3. **Configure Firestore**
   ```
   Firebase Console → Firestore Database → Create database → Start in production mode
   ```

4. **Set Firestore Rules**
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

## 🌐 API Integration

### Datamuse API for Phonetics

The application uses the Datamuse API for accurate phonetic transcription:

**Endpoint**: `https://api.datamuse.com/words`

**Parameters**:
- `sp`: spelling (the word to look up)
- `md=r`: metadata flag for pronunciation
- `max=1`: return only the best match

**Example Request**:
```javascript
fetch('https://api.datamuse.com/words?sp=hello&md=r&max=1')
```

**Response Processing**:
1. Extract ARPAbet pronunciation from response
2. Convert ARPAbet to IPA notation
3. Display in the phonetic field

**Features**:
- No API key required
- Free to use
- Rate limit friendly
- Automatic fallback to local generation

## 💻 Usage

### Running in Development

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

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
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

### Key Components

- **`App.jsx`** - Main application logic and state management
- **`AuthContext.jsx`** - Authentication state and methods
- **`AddWordsModal.jsx`** - Word addition interface with API integration
- **`LessonContent.jsx`** - Lesson display with edit/delete capabilities
- **`WordTable.jsx`** - Word list with pronunciation and deletion
- **`phoneticHelper.js`** - Phonetic generation and API integration

### Key Utilities

- **`firebase.js`** - Firebase initialization and CRUD operations
- **`phoneticHelper.js`** - Datamuse API integration and IPA conversion
- **`useSpeechSynthesis.js`** - Browser speech synthesis hook
- **`useLocalStorage.js`** - Local storage management hook

## 🔧 Technologies

### Frontend
- **React 18** - UI library with hooks
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

### Backend & Services
- **Firebase Authentication** - Google OAuth integration
- **Firebase Firestore** - NoSQL database
- **Datamuse API** - Phonetic transcription service
- **Web Speech API** - Text-to-speech functionality

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Test both demo and authenticated modes

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Szaniszló Ivor**
- Email: info@ivor.hu
- GitHub: [@SzaniszloIvor](https://github.com/SzaniszloIvor)
- LinkedIn: [SzaniszloIvor](https://www.linkedin.com/in/ivorszaniszlo/)

**Project Link**: [https://github.com/SzaniszloIvor/private-dictionary](https://github.com/SzaniszloIvor/private-dictionary)

---

<div align="center">
  Made with ❤️ by Szaniszló Ivor
</div>
