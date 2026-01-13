import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Volume2, VolumeX, RotateCcw, TrendingUp, Award, Flame, Calendar, ChevronRight, Star, Clock, Target, Menu } from 'lucide-react';

export default function MantraApp() {
  // Core state
  const [view, setView] = useState('home');
  const [count, setCount] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [favorites, setFavorites] = useState(['n1', 'n5', 'd1', 'g1', 'm1']);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  
  // Statistics
  const [stats] = useState({
    totalChants: 1247,
    weekChants: 156,
    monthChants: 678,
    streak: 7,
    longestStreak: 21,
    weeklyGoal: 200,
    level: 5,
    totalSessions: 42
  });
  
  const [chantHistory] = useState({
    'n1': { name: 'Surya (Sun)', count: 216, lastChanted: 'Today' },
    'g1': { name: 'Gayatri Mantra', count: 324, lastChanted: 'Today' },
    'd1': { name: 'Ganesh Mantra', count: 189, lastChanted: 'Yesterday' },
    'm1': { name: 'Maha Mrityunjaya', count: 162, lastChanted: 'Today' },
    'n5': { name: 'Guru (Jupiter)', count: 135, lastChanted: '2 days ago' }
  });
  
  // Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showTimeGuide, setShowTimeGuide] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  
  // Chatbot state
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const chatEndRef = useRef(null);

  // Languages
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
  ];

  // Mantras Library
  const mantrasLibrary = [
    { 
      id: 'n1', category: 'Navagraha', name: 'Surya (Sun)', 
      text: 'ॐ सूर्याय नमः',
      transliteration: 'Om Suryaya Namah',
      meaning: 'Salutations to the Sun God',
      purpose: 'For vitality, leadership',
      benefits: ['Health', 'Leadership', 'Career success'],
      count: 108,
      deity: 'Surya',
      bestTime: 'Sunday morning',
      popular: true
    },
    { 
      id: 'n2', category: 'Navagraha', name: 'Chandra (Moon)', 
      text: 'ॐ चन्द्राय नमः',
      transliteration: 'Om Chandraya Namah',
      meaning: 'Salutations to the Moon God',
      purpose: 'For emotional balance',
      benefits: ['Mental peace', 'Emotional stability'],
      count: 108,
      deity: 'Chandra',
      bestTime: 'Monday evening',
      popular: true
    },
    { 
      id: 'n5', category: 'Navagraha', name: 'Guru (Jupiter)', 
      text: 'ॐ गुरवे नमः',
      transliteration: 'Om Gurave Namah',
      meaning: 'Salutations to Jupiter',
      purpose: 'For wisdom, prosperity',
      benefits: ['Wisdom', 'Financial prosperity'],
      count: 108,
      deity: 'Guru',
      bestTime: 'Thursday morning',
      popular: true
    },
    { 
      id: 'g1', category: 'Gayatri Mantra', name: 'Gayatri Mantra', 
      text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्',
      transliteration: 'Om Bhur Bhuvah Svah...',
      meaning: 'We meditate on the glory of the Creator',
      purpose: 'The most powerful Vedic mantra',
      benefits: ['Enlightenment', 'Mental clarity'],
      count: 108,
      deity: 'Savitri',
      bestTime: 'Sunrise',
      popular: true
    },
    { 
      id: 'm1', category: 'Maha Mantra', name: 'Maha Mrityunjaya',
      text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्',
      transliteration: 'Om Tryambakam Yajamahe...',
      meaning: 'We worship the three-eyed one',
      purpose: 'The great healing mantra',
      benefits: ['Healing', 'Longevity', 'Protection'],
      count: 108,
      deity: 'Shiva',
      bestTime: 'Monday morning',
      popular: true
    },
    { 
      id: 'd1', category: 'Ganesh Mantra', name: 'Ganesh Mantra',
      text: 'ॐ गं गणपतये नमः',
      transliteration: 'Om Gam Ganapataye Namah',
      meaning: 'Salutations to Ganesha',
      purpose: 'Invoke Ganesha for success',
      benefits: ['Obstacle removal', 'Success'],
      count: 108,
      deity: 'Ganesha',
      bestTime: 'Morning',
      popular: true
    },
    { 
      id: 'd2', category: 'Shiva Mantra', name: 'Om Namah Shivaya',
      text: 'ॐ नमः शिवाय',
      transliteration: 'Om Namah Shivaya',
      meaning: 'I bow to Shiva',
      purpose: 'Five-syllable Shiva mantra',
      benefits: ['Inner peace', 'Spiritual growth'],
      count: 108,
      deity: 'Shiva',
      bestTime: 'Monday',
      popular: true
    },
  ];

  // Load fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isLoadingChat]);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 528;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      console.log('Audio not supported');
    }
  };

  const vibrate = () => {
    if (vibrationEnabled && 'vibrate' in navigator) {
      navigator.vibrate(20);
    }
  };

  const handleCount = () => {
    if (count < selectedMantra.count) {
      setCount(count + 1);
    } else {
      setCount(0);
    }
    playSound();
    vibrate();
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Auto-suggest
  const getMantraSuggestions = (input) => {
    if (!input || input.length < 1) {
      setSuggestions([]);
      return;
    }
    const q = input.toLowerCase().trim();
    const matches = mantrasLibrary.filter(m => 
      m.name.toLowerCase().includes(q) ||
      m.text.toLowerCase().includes(q) ||
      m.transliteration.toLowerCase().includes(q) ||
      m.deity.toLowerCase().includes(q)
    ).slice(0, 5);
    setSuggestions(matches);
  };

  const handleChatInputChange = (value) => {
    setChatInput(value);
    getMantraSuggestions(value);
  };

  const selectSuggestion = (mantra) => {
    setChatInput(mantra.text);
    setSuggestions([]);
    getMantraMeaning(mantra.text);
  };

  // Get mantra meaning
  const getMantraMeaning = async (mantraText) => {
    setIsLoadingChat(true);
    const languageInfo = languages.find(l => l.code === selectedLanguage);
    const languageName = languageInfo?.name || 'English';

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 2000,
          messages: [{
            role: 'user',
            content: `You are a Vedic scholar. Explain this mantra in ${languageName} language: "${mantraText}"

Include:
1. Literal meaning
2. Spiritual significance
3. Benefits
4. Best time to chant
5. Context

Write ENTIRELY in ${languageName}.`
          }]
        })
      });

      const data = await response.json();
      const content = data.content?.[0]?.text || 'Unable to get response';

      setChatMessages(prev => [...prev, 
        { type: 'user', text: mantraText },
        { type: 'bot', text: content }
      ]);
      setSuggestions([]);
      setChatInput('');
    } catch (error) {
      setChatMessages(prev => [...prev, 
        { type: 'user', text: mantraText },
        { type: 'bot', text: 'Sorry, I cannot connect right now. Please try again. 🙏' }
      ]);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const filteredMantras = mantrasLibrary.filter(m => {
    const matchesCat = selectedCategory === 'All' || m.category === selectedCategory;
    const matchesFav = !showOnlyFavorites || favorites.includes(m.id);
    if (!searchQuery.trim()) return matchesCat && matchesFav;
    const q = searchQuery.toLowerCase();
    return matchesCat && matchesFav && (
      m.name.toLowerCase().includes(q) ||
      m.text.toLowerCase().includes(q) ||
      m.transliteration.toLowerCase().includes(q)
    );
  });

  const categories = ['All', ...new Set(mantrasLibrary.map(m => m.category))];
  const getMostChantedMantras = () => {
    return Object.entries(chantHistory)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 4)
      .map(([id, data]) => ({
        id,
        ...data,
        mantra: mantrasLibrary.find(m => m.id === id)
      }));
  };

  const progress = selectedMantra ? (count / selectedMantra.count) * 100 : 0;
  const weekProgress = (stats.weekChants / stats.weeklyGoal) * 100;

  // HOME VIEW
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#fff5f7] to-[#f0f9ff] p-4 md:p-6">
        <style>{`
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          .devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
          .poppins { font-family: 'Poppins', sans-serif; }
          .serif { font-family: 'DM Serif Display', serif; }
          .neo-card {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06);
          }
          .neo-card:hover { box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1); }
          .gradient-text {
            background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffd93d 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          .animate-in { animation: slideIn 0.6s ease-out forwards; }
          .overflow-wrap-anywhere { overflow-wrap: anywhere; word-break: break-word; }
        `}</style>

        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 poppins mb-1">Namaste 🙏</h1>
                <p className="text-gray-500 poppins text-sm">Your spiritual practice journey</p>
              </div>
              <button onClick={() => setShowMenu(!showMenu)} className="neo-card p-3 rounded-2xl hover:scale-105 transition-all">
                <Menu className="text-gray-700" size={24} />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Flame className="text-orange-500" size={20} />
                  <span className="text-xs text-gray-600 poppins">Streak</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 poppins">{stats.streak}</p>
                <p className="text-xs text-gray-500 poppins">days</p>
              </div>

              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="text-blue-500" size={20} />
                  <span className="text-xs text-gray-600 poppins">This Week</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 poppins">{stats.weekChants}</p>
                <p className="text-xs text-gray-500 poppins">chants</p>
              </div>

              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="text-purple-500" size={20} />
                  <span className="text-xs text-gray-600 poppins">Level</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 poppins">{stats.level}</p>
                <p className="text-xs text-gray-500 poppins">devotee</p>
              </div>

              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="text-green-500" size={20} />
                  <span className="text-xs text-gray-600 poppins">Total</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 poppins">{stats.totalChants}</p>
                <p className="text-xs text-gray-500 poppins">all time</p>
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="neo-card rounded-2xl p-5 mb-6 animate-in">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 poppins">Weekly Goal</h3>
                  <p className="text-sm text-gray-500 poppins">{stats.weekChants} / {stats.weeklyGoal} chants</p>
                </div>
                <p className="text-2xl font-bold gradient-text poppins">{Math.round(weekProgress)}%</p>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(weekProgress, 100)}%` }}
                />
              </div>
            </div>
          </header>

          {/* Most Chanted */}
          <section className="mb-8 animate-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 poppins">Most Chanted</h2>
              <button onClick={() => setView('library')} className="text-orange-500 text-sm poppins font-medium flex items-center gap-1">
                See all <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getMostChantedMantras().map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {setSelectedMantra(item.mantra); setCount(0); setView('counter');}}
                  className="neo-card rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-800 poppins mb-1">{item.name}</h3>
                      <p className="text-xs text-gray-500 poppins">{item.lastChanted}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text poppins">{item.count}</p>
                      <p className="text-xs text-gray-500 poppins">times</p>
                    </div>
                  </div>
                  
                  {item.mantra && (
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-3 mb-3">
                      <p className="text-lg text-gray-800 devanagari text-center">{item.mantra.text}</p>
                    </div>
                  )}
                  
                  <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-2 rounded-xl text-sm poppins font-medium hover:shadow-lg transition-all">
                    Start Chanting →
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Floating Buttons */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            <button 
              onClick={() => setShowChatbot(true)}
              className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
            >
              <span className="text-2xl">🤖</span>
            </button>
            <button 
              onClick={() => setView('library')}
              className="w-14 h-14 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <span className="text-2xl">🕉️</span>
            </button>
          </div>
        </div>

        {/* Menu Modal */}
        {showMenu && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowMenu(false)}>
            <div className="neo-card rounded-3xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 poppins">Menu</h3>
                <button onClick={() => setShowMenu(false)}><X size={24} className="text-gray-600" /></button>
              </div>
              <div className="space-y-2">
                <button onClick={() => { setShowChatbot(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium flex items-center gap-3">
                  <span className="text-2xl">🤖</span> Mantra Meanings (AI)
                </button>
                <button onClick={() => { setView('library'); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium">
                  Browse All Mantras
                </button>
                <button onClick={() => { setShowSettings(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium">
                  Settings
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Chatbot Modal */}
        {showChatbot && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
            <div className="neo-card w-full md:max-w-3xl md:rounded-3xl rounded-t-3xl h-[90vh] md:h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 poppins">🤖 Mantra Meanings</h2>
                  <p className="text-sm text-gray-600 poppins mt-1">AI-powered spiritual guide</p>
                </div>
                <button onClick={() => setShowChatbot(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Language Selector */}
              <div className="px-6 py-3 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      className={`px-4 py-2 rounded-full text-sm font-medium poppins whitespace-nowrap transition-all ${
                        selectedLanguage === lang.code
                          ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.nativeName}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl">🕉️</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 poppins mb-2">Welcome, Seeker! 🙏</h3>
                    <p className="text-gray-600 poppins max-w-md mx-auto">Type any mantra to discover its deep meaning and significance.</p>
                  </div>
                )}

                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] ${
                      msg.type === 'user'
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white'
                        : 'neo-card text-gray-800'
                    } rounded-2xl p-4 shadow-md`}>
                      {msg.type === 'user' ? (
                        <p className="devanagari text-base leading-relaxed break-words">{msg.text}</p>
                      ) : (
                        <div className="poppins text-sm leading-relaxed whitespace-pre-wrap break-words overflow-wrap-anywhere">
                          {msg.text}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isLoadingChat && (
                  <div className="flex justify-start">
                    <div className="neo-card rounded-2xl p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="px-6 py-3 border-t border-gray-200 max-h-48 overflow-y-auto">
                  <p className="text-xs text-gray-600 poppins mb-2">Suggestions:</p>
                  <div className="space-y-2">
                    {suggestions.map(mantra => (
                      <button
                        key={mantra.id}
                        onClick={() => selectSuggestion(mantra)}
                        className="w-full text-left neo-card rounded-xl p-3 hover:scale-[1.02] transition-all"
                      >
                        <p className="font-medium text-gray-800 poppins text-sm">{mantra.name}</p>
                        <p className="text-xs text-gray-600 devanagari">{mantra.text}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type a mantra in any language..."
                    value={chatInput}
                    onChange={(e) => handleChatInputChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && getMantraMeaning(chatInput)}
                    className="flex-1 neo-card px-4 py-3 rounded-xl text-gray-800 devanagari focus:outline-none focus:ring-2 focus:ring-orange-400"
                    disabled={isLoadingChat}
                  />
                  <button
                    onClick={() => chatInput.trim() && getMantraMeaning(chatInput)}
                    disabled={isLoadingChat || !chatInput.trim()}
                    className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-xl poppins font-medium hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    {isLoadingChat ? '...' : 'Ask'}
                  </button>
                </div>
                <p className="text-xs text-gray-500 poppins mt-2 text-center">
                  💡 Start typing to see suggestions
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="neo-card rounded-3xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 poppins">Settings</h2>
                <button onClick={() => setShowSettings(false)}><X size={24} /></button>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium poppins">Sound Effects</span>
                  <button onClick={() => setSoundEnabled(!soundEnabled)} className={`w-14 h-8 rounded-full transition-all ${soundEnabled ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-800 font-medium poppins">Vibration</span>
                  <button onClick={() => setVibrationEnabled(!vibrationEnabled)} className={`w-14 h-8 rounded-full transition-all ${vibrationEnabled ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-300'}`}>
                    <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${vibrationEnabled ? 'translate-x-7' : 'translate-x-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LIBRARY VIEW
  if (view === 'library') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#fff5f7] to-[#f0f9ff] p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setView('home')} className="mb-6 neo-card px-6 py-3 rounded-xl font-semibold poppins text-gray-700">
            ← Back to Home
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 poppins mb-6">All Mantras</h2>
          
          <div className="space-y-3">
            {mantrasLibrary.map(m => (
              <div
                key={m.id}
                onClick={() => {setSelectedMantra(m); setCount(0); setView('counter');}}
                className="neo-card rounded-2xl p-5 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-4"
              >
                <button onClick={(e) => {e.stopPropagation(); toggleFavorite(m.id);}} className="p-2">
                  <Star size={20} className={favorites.includes(m.id) ? 'fill-amber-500 text-amber-500' : 'text-gray-400'} />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 poppins">{m.name}</h3>
                  <p className="text-sm text-gray-600 devanagari">{m.text}</p>
                </div>
                <button className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-2 rounded-xl poppins font-medium">
                  Chant
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // COUNTER VIEW
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#fff5f7] to-[#f0f9ff] p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        <button onClick={() => setView('home')} className="mb-6 neo-card px-6 py-3 rounded-xl font-semibold poppins text-gray-700">
          ← Back to Home
        </button>
        <div className="neo-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 poppins mb-2">{selectedMantra?.name}</h2>
            <p className="text-sm text-gray-600 poppins mb-4">🕉️ {selectedMantra?.deity}</p>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6">
              <p className="text-3xl text-gray-800 devanagari leading-relaxed">{selectedMantra?.text}</p>
              <p className="text-sm text-gray-600 mt-2 italic poppins">{selectedMantra?.transliteration}</p>
            </div>
          </div>

          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="transform -rotate-90 w-80 h-80">
              <circle cx="160" cy="160" r="140" stroke="rgba(255,107,107,0.2)" strokeWidth="16" fill="none" />
              <circle cx="160" cy="160" r="140" stroke="url(#gradient)" strokeWidth="16" fill="none"
                strokeDasharray={`${2*Math.PI*140}`} strokeDashoffset={`${2*Math.PI*140*(1-progress/100)}`} strokeLinecap="round" className="transition-all duration-300" />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff6b6b" />
                  <stop offset="50%" stopColor="#ff8e53" />
                  <stop offset="100%" stopColor="#ffd93d" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-8xl font-bold text-gray-800 poppins">{count}</span>
              <span className="text-2xl text-gray-600 poppins">of {selectedMantra?.count}</span>
            </div>
          </div>

          <button onClick={handleCount} className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-8 rounded-2xl text-2xl mb-6 poppins uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
            Tap to Count
          </button>

          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-6 neo-card rounded-2xl text-gray-700">
              {soundEnabled ? <Volume2 size={28} className="mx-auto mb-2" /> : <VolumeX size={28} className="mx-auto mb-2" />}
              <span className="text-sm poppins">Sound</span>
            </button>
            <button onClick={() => setCount(0)} className="p-6 neo-card rounded-2xl text-gray-700">
              <RotateCcw size={28} className="mx-auto mb-2" />
              <span className="text-sm poppins">Reset</span>
            </button>
            <button onClick={() => setView('home')} className="p-6 neo-card rounded-2xl text-gray-700">
              <X size={28} className="mx-auto mb-2" />
              <span className="text-sm poppins">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
