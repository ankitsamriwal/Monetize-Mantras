# 🕉️ Mantra Practice App

A beautiful, modern web application for daily mantra practice with AI-powered insights, habit tracking, and multilingual support.

## ✨ Features

### 🏠 Dashboard
- **Smart Stats**: Track your streak, weekly chants, level, and total practice
- **Weekly Goals**: Set and monitor your chanting goals with progress bars
- **Most Chanted**: Quick access to your frequently practiced mantras
- **Insights**: Monthly comparisons and best practice time analysis
- **Achievements**: Gamified milestones and badges

### 🤖 AI-Powered Chatbot
- **Multilingual Support**: Get mantra meanings in 7 languages:
  - English, Hindi (हिन्दी), Sanskrit (संस्कृतम्)
  - Tamil (தமிழ்), Malayalam (മലയാളം)
  - Bengali (বাংলা), Gujarati (ગુજરાતી)
- **Auto-Suggestions**: Type to get instant mantra suggestions
- **Deep Meanings**: Detailed explanations of spiritual significance
- **Benefits & Timing**: Best practices and recommended times

### 📿 Mantra Library
- 50+ authentic Vedic mantras
- Navagraha (Planetary) mantras
- Beej mantras, Gayatri mantras
- Deity-specific mantras (Ganesha, Shiva, Vishnu, etc.)
- Search and filter functionality
- Favorites system

### 🔄 Counter Features
- Tap or voice counting
- Visual progress ring
- Sound effects (528 Hz healing frequency)
- Haptic feedback
- Session tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd mantra-app-project
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

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **Claude AI API** - Mantra meaning chatbot
- **Web APIs**: Speech Recognition, Audio Context, Vibration

## 📁 Project Structure

```
mantra-app-project/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Entry point
│   └── index.css        # Base styles
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
└── README.md           # This file
```

## 🎨 Features in Detail

### Home Dashboard
- Quick stats cards with icons
- Animated progress bars
- Most chanted mantras with beautiful cards
- Monthly insights and comparisons
- Achievement badges

### AI Chatbot
The chatbot uses Claude AI to provide deep spiritual insights:
- Select your preferred language
- Type any mantra or search from suggestions
- Get comprehensive explanations including:
  - Literal word-by-word translation
  - Deeper spiritual meaning
  - Benefits and effects
  - Best time to chant
  - Historical context

### Mantra Counter
- Large visual progress ring
- Tap button for counting
- Voice commands (say "count" or "next")
- Sound feedback at healing frequency
- Haptic vibration
- Reset and control buttons

## 🌐 Browser Support

- Chrome/Edge (recommended)
- Firefox
- Safari
- Mobile browsers (iOS Safari, Chrome Android)

## 🔐 Privacy

- All practice data stored locally in your browser
- No account required
- AI chatbot queries are sent to Claude API
- No personal data collected or shared

## 📝 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Vedic scriptures and traditional wisdom
- Anthropic Claude AI for chatbot capabilities
- The open-source community

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check existing issues for solutions

---

**Made with 🙏 for spiritual seekers worldwide**
