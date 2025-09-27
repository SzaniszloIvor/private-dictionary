# 📚 Private Dictionary App

A modern, interactive English-Hungarian dictionary application designed for structured language learning with 60 lesson modules.

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=flat&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-06B6D4?style=flat&logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-9.x-FFCA28?style=flat&logo=firebase)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## 🎯 About

Private Dictionary App is a comprehensive language learning platform that provides a structured 60-hour English curriculum with Hungarian translations. The application supports both demo mode for trying out features and Google authentication for personalized learning experiences with cloud synchronization.

### Key Highlights:
- **Structured Learning Path**: 60 pre-designed lesson modules
- **Dual Authentication**: Demo mode and Google Sign-in
- **Real-time Sync**: Cloud-based storage with Firebase
- **Speech Synthesis**: Native pronunciation for all words
- **Responsive Design**: Optimized for mobile and desktop devices

## ✨ Features

### Core Features
- 📖 **60-Hour Curriculum** - Structured lessons from basics to advanced
- 🔊 **Text-to-Speech** - Native English pronunciation for every word
- 🔍 **Smart Search** - Filter by English or Hungarian words
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Auto-Save** - Automatic cloud synchronization for Google users
- 🎯 **Progress Tracking** - Visual indicators for learning progress

### Authentication Modes
- **Demo Mode**: 
  - Instant access without registration
  - Pre-loaded sample lessons
  - Session-based storage
  - Perfect for trying the app

- **Google Authentication**:
  - Personal dictionary storage
  - Cross-device synchronization
  - Unlimited word additions
  - Long-term progress tracking

### Word Management
- Add words individually with phonetic transcription
- Bulk import word lists
- Edit existing entries
- Organize words by lessons

## 🚀 Demo

Try the application in demo mode without any registration:

```
1. Open the application
2. Click "Demo fiók használata" (Use Demo Account)
3. Explore the features with sample data
```

For full features, sign in with Google:

```
1. Click "Belépés Google fiókkal" (Sign in with Google)
2. Authorize the application
3. Start building your personal dictionary
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
git clone https://github.com/SzaniszloIvor/private-dictionary-app.git
cd private-dictionary-app
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
   Firebase Console → Firestore Database → Create database → Start in test mode
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
private-dictionary-app/
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
│   │   └── LoginScreen/
│   ├── contexts/
│   │   └── AuthContext.jsx
│   ├── services/
│   │   └── firebase.js
│   ├── hooks/
│   │   ├── useSpeechSynthesis.js
│   │   └── useLocalStorage.js
│   ├── data/
│   │   └── dictionary.js
│   ├── styles/
│   │   └── styles.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .gitignore
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

### Key Directories

- **`/src/components`** - Reusable React components
- **`/src/contexts`** - React Context providers (Authentication)
- **`/src/services`** - External service integrations (Firebase, AI)
- **`/src/hooks`** - Custom React hooks
- **`/src/data`** - Initial dictionary data

## 🔧 Technologies

### Frontend
- **React 18** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library

### Backend & Services
- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
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

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Your Name**
- Email: info@ivor.hu
- GitHub: [@SzaniszloIvor](https://github.com/SzaniszloIvor)
- LinkedIn: [Szaniszlo Ivor](https://www.linkedin.com/in/ivorszaniszlo)

**Project Link**: [https://github.com/SzaniszloIvor/private-dictionary-app](https://github.com/SzaniszloIvor/private-dictionary-app)

---

<div align="center">
  Made with ❤️ by [Your Name]
</div>
