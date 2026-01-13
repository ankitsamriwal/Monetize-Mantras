# Mantra Practice App

A beautiful, modern web and mobile application for daily mantra practice with AI-powered insights, habit tracking, and multilingual support.

## Features

### Dashboard
- **Smart Stats**: Track your streak, weekly chants, level, and total practice
- **Weekly Goals**: Set and monitor your chanting goals with progress bars
- **Most Chanted**: Quick access to your frequently practiced mantras
- **Insights**: Monthly comparisons and best practice time analysis
- **Achievements**: Gamified milestones and badges

### AI-Powered Chatbot
- **Multilingual Support**: Get mantra meanings in 7 languages:
  - English, Hindi, Sanskrit, Tamil, Malayalam, Bengali, Gujarati
- **Auto-Suggestions**: Type to get instant mantra suggestions
- **Deep Meanings**: Detailed explanations of spiritual significance
- **Benefits & Timing**: Best practices and recommended times

### Mantra Library
- 50+ authentic Vedic mantras
- Navagraha (Planetary) mantras
- Beej mantras, Gayatri mantras
- Deity-specific mantras (Ganesha, Shiva, Vishnu, etc.)
- Search and filter functionality
- Favorites system

### Counter Features
- Tap or voice counting
- Visual progress ring
- Sound effects (528 Hz healing frequency)
- Haptic feedback
- Session tracking

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager
- For Android APK: Java JDK 17+, Android SDK

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Monetize-Mantras
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Building Android APK

### Option 1: Using Build Scripts

**Debug APK (for testing):**
```bash
./build-apk.sh
```

**Release APK (for production):**
```bash
./build-apk-release.sh
```

### Option 2: Manual Build

1. **Build the web app:**
```bash
npm run build
```

2. **Sync with Capacitor:**
```bash
npx cap sync android
```

3. **Build the APK:**
```bash
cd android
./gradlew assembleDebug    # For debug APK
./gradlew assembleRelease  # For release APK
```

4. **Find the APK:**
- Debug: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release: `android/app/build/outputs/apk/release/app-release-unsigned.apk`

### Option 3: Using Android Studio

1. Build the web app: `npm run build`
2. Sync: `npx cap sync android`
3. Open in Android Studio: `npx cap open android`
4. Build > Build Bundle(s) / APK(s) > Build APK(s)

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **Capacitor** - Native mobile wrapper
- **Lucide React** - Icon library
- **Claude AI API** - Mantra meaning chatbot
- **Web APIs**: Speech Recognition, Audio Context, Vibration

## Project Structure

```
Monetize-Mantras/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Base styles with Tailwind
├── public/
│   ├── manifest.json    # PWA manifest
│   └── icon.svg         # App icon
├── android/             # Android native project
│   ├── app/
│   │   └── src/main/
│   │       ├── res/     # Android resources
│   │       └── assets/  # Web assets (after sync)
│   └── build.gradle     # Android build config
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── capacitor.config.json # Capacitor configuration
├── build-apk.sh         # Debug APK build script
└── build-apk-release.sh # Release APK build script
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run build:android` | Build web + sync Android |
| `npm run cap:sync` | Sync web assets to native |
| `npm run cap:open:android` | Open in Android Studio |

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

## Privacy

- All practice data stored locally in your browser
- No account required
- AI chatbot queries are sent to Claude API
- No personal data collected or shared

## License

This project is open source and available under the MIT License.

## Acknowledgments

- Vedic scriptures and traditional wisdom
- Anthropic Claude AI for chatbot capabilities
- The open-source community

---

**Made with love for spiritual seekers worldwide**
