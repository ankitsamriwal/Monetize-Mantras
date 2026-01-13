import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, RotateCcw, TrendingUp, Award, Flame, ChevronRight, Star, Target, Menu, Plus, Trash2, Bell, BellOff, Check, Settings } from 'lucide-react';
import { StorageService, getTodayString } from './services/storage';
import { NotificationService } from './services/notifications';

export default function MantraApp() {
  const [view, setView] = useState('home');
  const [count, setCount] = useState(0);
  const [selectedMantra, setSelectedMantra] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [stats, setStats] = useState({ totalChants: 0, weekChants: 0, monthChants: 0, currentStreak: 0, longestStreak: 0, weeklyGoal: 500, level: 1, totalSessions: 0 });
  const [chantHistory, setChantHistory] = useState({});
  const [goals, setGoals] = useState([]);
  const [goalProgress, setGoalProgress] = useState([]);

  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showGoalConfig, setShowGoalConfig] = useState(false);
  const [showAddGoal, setShowAddGoal] = useState(false);

  const [newGoal, setNewGoal] = useState({ mantraId: '', mantraName: '', mantraText: '', targetCount: 108, days: [0,1,2,3,4,5,6], preferredTime: '06:00' });

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isLoadingChat, setIsLoadingChat] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const audioContextRef = useRef(null);
  const chatEndRef = useRef(null);

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' }
  ];

  const mantrasLibrary = [
    { id: 'n1', category: 'Navagraha', name: 'Surya (Sun)', text: 'ॐ सूर्याय नमः', transliteration: 'Om Suryaya Namah', meaning: 'Salutations to the Sun God', count: 108, deity: 'Surya', bestTime: 'Sunday morning', popular: true },
    { id: 'n2', category: 'Navagraha', name: 'Chandra (Moon)', text: 'ॐ चन्द्राय नमः', transliteration: 'Om Chandraya Namah', meaning: 'Salutations to the Moon God', count: 108, deity: 'Chandra', bestTime: 'Monday evening', popular: true },
    { id: 'n3', category: 'Navagraha', name: 'Mangal (Mars)', text: 'ॐ मंगलाय नमः', transliteration: 'Om Mangalaya Namah', meaning: 'Salutations to Mars', count: 108, deity: 'Mangal', bestTime: 'Tuesday morning', popular: false },
    { id: 'n4', category: 'Navagraha', name: 'Budh (Mercury)', text: 'ॐ बुधाय नमः', transliteration: 'Om Budhaya Namah', meaning: 'Salutations to Mercury', count: 108, deity: 'Budh', bestTime: 'Wednesday morning', popular: false },
    { id: 'n5', category: 'Navagraha', name: 'Guru (Jupiter)', text: 'ॐ गुरवे नमः', transliteration: 'Om Gurave Namah', meaning: 'Salutations to Jupiter', count: 108, deity: 'Guru', bestTime: 'Thursday morning', popular: true },
    { id: 'n6', category: 'Navagraha', name: 'Shukra (Venus)', text: 'ॐ शुक्राय नमः', transliteration: 'Om Shukraya Namah', meaning: 'Salutations to Venus', count: 108, deity: 'Shukra', bestTime: 'Friday morning', popular: false },
    { id: 'n7', category: 'Navagraha', name: 'Shani (Saturn)', text: 'ॐ शनैश्चराय नमः', transliteration: 'Om Shanaischaraya Namah', meaning: 'Salutations to Saturn', count: 108, deity: 'Shani', bestTime: 'Saturday evening', popular: true },
    { id: 'g1', category: 'Gayatri', name: 'Gayatri Mantra', text: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्', transliteration: 'Om Bhur Bhuvah Svah...', meaning: 'We meditate on the glory of the Creator', count: 108, deity: 'Savitri', bestTime: 'Sunrise', popular: true },
    { id: 'm1', category: 'Maha Mantra', name: 'Maha Mrityunjaya', text: 'ॐ त्र्यम्बकं यजामहे सुगन्धिं पुष्टिवर्धनम् उर्वारुकमिव बन्धनान् मृत्योर्मुक्षीय माऽमृतात्', transliteration: 'Om Tryambakam Yajamahe...', meaning: 'We worship the three-eyed one', count: 108, deity: 'Shiva', bestTime: 'Monday morning', popular: true },
    { id: 'd1', category: 'Deity', name: 'Ganesh Mantra', text: 'ॐ गं गणपतये नमः', transliteration: 'Om Gam Ganapataye Namah', meaning: 'Salutations to Ganesha', count: 108, deity: 'Ganesha', bestTime: 'Morning', popular: true },
    { id: 'd2', category: 'Deity', name: 'Om Namah Shivaya', text: 'ॐ नमः शिवाय', transliteration: 'Om Namah Shivaya', meaning: 'I bow to Shiva', count: 108, deity: 'Shiva', bestTime: 'Monday', popular: true },
    { id: 'd3', category: 'Deity', name: 'Om Namo Narayanaya', text: 'ॐ नमो नारायणाय', transliteration: 'Om Namo Narayanaya', meaning: 'I bow to Narayana', count: 108, deity: 'Vishnu', bestTime: 'Thursday', popular: true },
    { id: 'd4', category: 'Deity', name: 'Lakshmi Mantra', text: 'ॐ श्रीं महालक्ष्म्यै नमः', transliteration: 'Om Shreem Mahalakshmyai Namah', meaning: 'Salutations to Goddess Lakshmi', count: 108, deity: 'Lakshmi', bestTime: 'Friday', popular: true },
    { id: 'd5', category: 'Deity', name: 'Saraswati Mantra', text: 'ॐ ऐं सरस्वत्यै नमः', transliteration: 'Om Aim Saraswatyai Namah', meaning: 'Salutations to Goddess Saraswati', count: 108, deity: 'Saraswati', bestTime: 'Morning', popular: true },
    { id: 'd6', category: 'Deity', name: 'Hanuman Mantra', text: 'ॐ हनुमते नमः', transliteration: 'Om Hanumate Namah', meaning: 'Salutations to Hanuman', count: 108, deity: 'Hanuman', bestTime: 'Tuesday/Saturday', popular: true },
  ];

  useEffect(() => {
    loadAllData();
    NotificationService.requestPermission();
    NotificationService.startScheduler();
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Poppins:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => { if (document.head.contains(link)) document.head.removeChild(link); };
  }, []);

  const loadAllData = () => {
    const storedStats = StorageService.getStats();
    const weeklyStats = StorageService.getWeeklyStats();
    const monthlyStats = StorageService.getMonthlyStats();
    const history = StorageService.getChantHistory();
    const storedGoals = StorageService.getGoals();
    const progress = StorageService.getTodayGoalProgress();
    const settings = StorageService.getSettings();
    setStats({ ...storedStats, weekChants: weeklyStats.chants, monthChants: monthlyStats.chants, weeklyGoal: 500 });
    setChantHistory(history);
    setGoals(storedGoals);
    setGoalProgress(progress);
    setSoundEnabled(settings.soundEnabled);
    setVibrationEnabled(settings.vibrationEnabled);
    setNotificationsEnabled(settings.notificationsEnabled);
    setFavorites(storedGoals.map(g => g.mantraId));
  };

  useEffect(() => { if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages, isLoadingChat]);

  const playSound = () => {
    if (!soundEnabled) return;
    try {
      if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
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
    } catch (e) { console.log('Audio not supported'); }
  };

  const vibrate = () => { if (vibrationEnabled && 'vibrate' in navigator) navigator.vibrate(20); };

  const handleCount = () => {
    const newCount = count + 1;
    setCount(newCount);
    playSound();
    vibrate();
    if (newCount >= selectedMantra.count) {
      StorageService.addSession({ mantraId: selectedMantra.id, mantraName: selectedMantra.name, count: newCount, targetCount: selectedMantra.count, completed: true });
      loadAllData();
      setTimeout(() => { alert(`Completed ${selectedMantra.count} chants of ${selectedMantra.name}!`); setCount(0); }, 300);
    }
  };

  const saveSession = () => {
    if (count > 0 && selectedMantra) {
      StorageService.addSession({ mantraId: selectedMantra.id, mantraName: selectedMantra.name, count: count, targetCount: selectedMantra.count, completed: count >= selectedMantra.count });
      loadAllData();
      setCount(0);
      setView('home');
    }
  };

  const toggleFavorite = (id) => { setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]); };

  const handleAddGoal = () => {
    if (!newGoal.mantraId) { alert('Please select a mantra'); return; }
    const result = StorageService.addGoal(newGoal);
    if (result.success) { loadAllData(); setShowAddGoal(false); setNewGoal({ mantraId: '', mantraName: '', mantraText: '', targetCount: 108, days: [0,1,2,3,4,5,6], preferredTime: '06:00' }); }
    else { alert(result.message); }
  };

  const handleDeleteGoal = (goalId) => { if (confirm('Delete this goal?')) { StorageService.deleteGoal(goalId); loadAllData(); } };
  const selectMantraForGoal = (mantra) => { setNewGoal({ ...newGoal, mantraId: mantra.id, mantraName: mantra.name, mantraText: mantra.text }); };
  const toggleDay = (dayIndex) => { setNewGoal(prev => ({ ...prev, days: prev.days.includes(dayIndex) ? prev.days.filter(d => d !== dayIndex) : [...prev.days, dayIndex].sort() })); };

  const saveSettings = () => { StorageService.saveSettings({ soundEnabled, vibrationEnabled, notificationsEnabled }); };
  useEffect(() => { saveSettings(); }, [soundEnabled, vibrationEnabled, notificationsEnabled]);

  const getMantraSuggestions = (input) => {
    if (!input || input.length < 1) { setSuggestions([]); return; }
    const q = input.toLowerCase().trim();
    const matches = mantrasLibrary.filter(m => m.name.toLowerCase().includes(q) || m.text.toLowerCase().includes(q) || m.transliteration.toLowerCase().includes(q) || m.deity.toLowerCase().includes(q)).slice(0, 5);
    setSuggestions(matches);
  };

  const handleChatInputChange = (value) => { setChatInput(value); getMantraSuggestions(value); };

  const selectSuggestion = (mantra) => { setChatInput(mantra.text); setSuggestions([]); getMantraMeaning(mantra.text); };

  const getMantraMeaning = async (mantraText) => {
    setIsLoadingChat(true);
    const languageInfo = languages.find(l => l.code === selectedLanguage);
    const languageName = languageInfo?.name || 'English';
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 2000, messages: [{ role: 'user', content: `You are a Vedic scholar. Explain this mantra in ${languageName} language: "${mantraText}"\n\nInclude:\n1. Literal meaning\n2. Spiritual significance\n3. Benefits\n4. Best time to chant\n5. Context\n\nWrite ENTIRELY in ${languageName}.` }] })
      });
      const data = await response.json();
      const content = data.content?.[0]?.text || 'Unable to get response';
      setChatMessages(prev => [...prev, { type: 'user', text: mantraText }, { type: 'bot', text: content }]);
      setSuggestions([]);
      setChatInput('');
    } catch (error) {
      setChatMessages(prev => [...prev, { type: 'user', text: mantraText }, { type: 'bot', text: 'Sorry, I cannot connect right now. Please try again.' }]);
    } finally { setIsLoadingChat(false); }
  };

  const getMostChantedMantras = () => {
    return Object.entries(chantHistory).sort((a, b) => b[1].count - a[1].count).slice(0, 4).map(([id, data]) => ({ id, ...data, mantra: mantrasLibrary.find(m => m.id === id) }));
  };

  const getRelativeTime = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const progress = selectedMantra ? (count / selectedMantra.count) * 100 : 0;
  const weekProgress = stats.weeklyGoal > 0 ? (stats.weekChants / stats.weeklyGoal) * 100 : 0;

  const styles = `
    @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
    .devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
    .poppins { font-family: 'Poppins', sans-serif; }
    .neo-card { background: rgba(255, 255, 255, 0.7); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.8); box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06); }
    .neo-card:hover { box-shadow: 0 12px 48px rgba(0, 0, 0, 0.1); }
    .gradient-text { background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 50%, #ffd93d 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  `;

  // GOAL CONFIGURATION VIEW
  if (showGoalConfig) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#fff5f7] to-[#f0f9ff] p-4 md:p-6">
        <style>{styles}</style>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setShowGoalConfig(false)} className="neo-card px-4 py-2 rounded-xl font-semibold poppins text-gray-700">← Back</button>
            <h2 className="text-xl font-bold text-gray-800 poppins">My Goals</h2>
            <button onClick={() => setShowAddGoal(true)} className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-4 py-2 rounded-xl poppins font-medium flex items-center gap-2" disabled={goals.length >= 10}><Plus size={18} /> Add</button>
          </div>

          {goals.length === 0 ? (
            <div className="neo-card rounded-2xl p-8 text-center">
              <Target size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 poppins mb-2">No Goals Yet</h3>
              <p className="text-gray-500 poppins text-sm mb-4">Add up to 10 mantras to your daily practice</p>
              <button onClick={() => setShowAddGoal(true)} className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-xl poppins font-medium">Add Your First Goal</button>
            </div>
          ) : (
            <div className="space-y-4">
              {goalProgress.map(goal => (
                <div key={goal.id} className="neo-card rounded-2xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 poppins">{goal.mantraName}</h3>
                        {goal.isCompleted && <Check size={18} className="text-green-500" />}
                      </div>
                      <p className="text-sm text-gray-600 devanagari">{goal.mantraText}</p>
                    </div>
                    <button onClick={() => handleDeleteGoal(goal.id)} className="p-2 text-red-400 hover:text-red-600"><Trash2 size={18} /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                    <div><span className="text-gray-500 poppins">Target:</span><span className="ml-2 font-medium text-gray-700 poppins">{goal.targetCount} times</span></div>
                    <div><span className="text-gray-500 poppins">Time:</span><span className="ml-2 font-medium text-gray-700 poppins">{goal.preferredTime}</span></div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {dayNames.map((day, i) => (<span key={i} className={`px-2 py-1 rounded text-xs poppins ${goal.days.includes(i) ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>{day}</span>))}
                  </div>
                  {goal.isActiveToday && (
                    <div>
                      <div className="flex justify-between text-sm mb-1"><span className="text-gray-600 poppins">Today's Progress</span><span className="font-medium text-gray-700 poppins">{goal.completedCount}/{goal.targetCount}</span></div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full transition-all ${goal.isCompleted ? 'bg-green-400' : 'bg-gradient-to-r from-orange-400 to-pink-400'}`} style={{ width: `${goal.progress}%` }} /></div>
                    </div>
                  )}
                </div>
              ))}
              <p className="text-center text-gray-500 text-sm poppins">{goals.length}/10 goals configured</p>
            </div>
          )}
        </div>

        {showAddGoal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="neo-card rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold text-gray-800 poppins">Add New Goal</h3><button onClick={() => setShowAddGoal(false)}><X size={24} className="text-gray-600" /></button></div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 poppins mb-2">Select Mantra</label>
                {newGoal.mantraId ? (
                  <div className="neo-card rounded-xl p-3 flex items-center justify-between">
                    <div><p className="font-medium text-gray-800 poppins">{newGoal.mantraName}</p><p className="text-sm text-gray-600 devanagari">{newGoal.mantraText}</p></div>
                    <button onClick={() => setNewGoal({...newGoal, mantraId: '', mantraName: '', mantraText: ''})} className="text-gray-400"><X size={18} /></button>
                  </div>
                ) : (
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {mantrasLibrary.map(m => (<button key={m.id} onClick={() => selectMantraForGoal(m)} className="w-full text-left neo-card rounded-xl p-3 hover:bg-orange-50 transition-all"><p className="font-medium text-gray-800 poppins text-sm">{m.name}</p><p className="text-xs text-gray-600 devanagari">{m.text}</p></button>))}
                  </div>
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 poppins mb-2">Target Count</label>
                <select value={newGoal.targetCount} onChange={(e) => setNewGoal({...newGoal, targetCount: parseInt(e.target.value)})} className="w-full neo-card rounded-xl px-4 py-3 poppins">
                  <option value={27}>27 times</option><option value={54}>54 times</option><option value={108}>108 times (1 mala)</option><option value={216}>216 times (2 malas)</option><option value={324}>324 times (3 malas)</option><option value={540}>540 times (5 malas)</option><option value={1008}>1008 times</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 poppins mb-2">Active Days</label>
                <div className="flex gap-2 flex-wrap">{dayNames.map((day, i) => (<button key={i} onClick={() => toggleDay(i)} className={`px-4 py-2 rounded-xl poppins text-sm font-medium transition-all ${newGoal.days.includes(i) ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white' : 'neo-card text-gray-600'}`}>{day}</button>))}</div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 poppins mb-2">Reminder Time</label>
                <input type="time" value={newGoal.preferredTime} onChange={(e) => setNewGoal({...newGoal, preferredTime: e.target.value})} className="w-full neo-card rounded-xl px-4 py-3 poppins" />
              </div>
              <button onClick={handleAddGoal} className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-4 rounded-xl poppins font-semibold text-lg">Add Goal</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // HOME VIEW
  if (view === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f8f9ff] via-[#fff5f7] to-[#f0f9ff] p-4 md:p-6">
        <style>{styles}</style>
        <div className="max-w-6xl mx-auto">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div><h1 className="text-3xl md:text-4xl font-bold text-gray-800 poppins mb-1">Namaste</h1><p className="text-gray-500 poppins text-sm">Your spiritual practice journey</p></div>
              <button onClick={() => setShowMenu(!showMenu)} className="neo-card p-3 rounded-2xl hover:scale-105 transition-all"><Menu className="text-gray-700" size={24} /></button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all"><div className="flex items-center gap-2 mb-1"><Flame className="text-orange-500" size={20} /><span className="text-xs text-gray-600 poppins">Streak</span></div><p className="text-2xl font-bold text-gray-800 poppins">{stats.currentStreak}</p><p className="text-xs text-gray-500 poppins">days</p></div>
              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all"><div className="flex items-center gap-2 mb-1"><TrendingUp className="text-blue-500" size={20} /><span className="text-xs text-gray-600 poppins">This Week</span></div><p className="text-2xl font-bold text-gray-800 poppins">{stats.weekChants}</p><p className="text-xs text-gray-500 poppins">chants</p></div>
              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all"><div className="flex items-center gap-2 mb-1"><Award className="text-purple-500" size={20} /><span className="text-xs text-gray-600 poppins">Level</span></div><p className="text-2xl font-bold text-gray-800 poppins">{stats.level}</p><p className="text-xs text-gray-500 poppins">devotee</p></div>
              <div className="neo-card rounded-2xl p-4 hover:scale-105 transition-all"><div className="flex items-center gap-2 mb-1"><Target className="text-green-500" size={20} /><span className="text-xs text-gray-600 poppins">Total</span></div><p className="text-2xl font-bold text-gray-800 poppins">{stats.totalChants}</p><p className="text-xs text-gray-500 poppins">all time</p></div>
            </div>

            <div className="neo-card rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-3"><div><h3 className="text-lg font-semibold text-gray-800 poppins">Weekly Goal</h3><p className="text-sm text-gray-500 poppins">{stats.weekChants} / {stats.weeklyGoal} chants</p></div><p className="text-2xl font-bold gradient-text poppins">{Math.round(weekProgress)}%</p></div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 rounded-full transition-all duration-500" style={{ width: `${Math.min(weekProgress, 100)}%` }} /></div>
            </div>

            {goalProgress.filter(g => g.isActiveToday).length > 0 && (
              <div className="neo-card rounded-2xl p-5 mb-6">
                <div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold text-gray-800 poppins">Today's Goals</h3><button onClick={() => setShowGoalConfig(true)} className="text-orange-500 text-sm poppins font-medium">Manage</button></div>
                <div className="space-y-3">
                  {goalProgress.filter(g => g.isActiveToday).map(goal => (
                    <div key={goal.id} className="flex items-center gap-3 p-3 bg-white/50 rounded-xl cursor-pointer hover:bg-white/80 transition-all" onClick={() => { const mantra = mantrasLibrary.find(m => m.id === goal.mantraId); if (mantra) { setSelectedMantra({...mantra, count: goal.targetCount}); setCount(0); setView('counter'); } }}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${goal.isCompleted ? 'bg-green-100' : 'bg-orange-100'}`}>{goal.isCompleted ? <Check size={20} className="text-green-600" /> : <Target size={20} className="text-orange-600" />}</div>
                      <div className="flex-1"><p className="font-medium text-gray-800 poppins text-sm">{goal.mantraName}</p><div className="flex items-center gap-2"><div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden"><div className={`h-full rounded-full ${goal.isCompleted ? 'bg-green-400' : 'bg-orange-400'}`} style={{ width: `${goal.progress}%` }} /></div><span className="text-xs text-gray-500 poppins">{goal.completedCount}/{goal.targetCount}</span></div></div>
                      <ChevronRight size={18} className="text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </header>

          <section className="mb-8">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-bold text-gray-800 poppins">{Object.keys(chantHistory).length > 0 ? 'Most Chanted' : 'Popular Mantras'}</h2><button onClick={() => setView('library')} className="text-orange-500 text-sm poppins font-medium flex items-center gap-1">See all <ChevronRight size={16} /></button></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(chantHistory).length > 0 ? getMostChantedMantras() : mantrasLibrary.filter(m => m.popular).slice(0, 4).map(m => ({ id: m.id, name: m.name, count: 0, lastChanted: null, mantra: m }))).map((item) => (
                <div key={item.id} onClick={() => {setSelectedMantra(item.mantra); setCount(0); setView('counter');}} className="neo-card rounded-2xl p-5 hover:scale-[1.02] transition-all cursor-pointer">
                  <div className="flex items-start justify-between mb-3"><div><h3 className="font-semibold text-gray-800 poppins mb-1">{item.name || item.mantra?.name}</h3><p className="text-xs text-gray-500 poppins">{item.lastChanted ? getRelativeTime(item.lastChanted) : 'Not chanted yet'}</p></div>{item.count > 0 && (<div className="text-right"><p className="text-2xl font-bold gradient-text poppins">{item.count}</p><p className="text-xs text-gray-500 poppins">times</p></div>)}</div>
                  {item.mantra && (<div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-3 mb-3"><p className="text-lg text-gray-800 devanagari text-center">{item.mantra.text}</p></div>)}
                  <button className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white py-2 rounded-xl text-sm poppins font-medium hover:shadow-lg transition-all">Start Chanting</button>
                </div>
              ))}
            </div>
          </section>

          <div className="fixed bottom-6 right-6 flex flex-col gap-3">
            <button onClick={() => setShowChatbot(true)} className="w-14 h-14 bg-gradient-to-r from-purple-400 to-pink-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-2xl">?</button>
            <button onClick={() => setView('library')} className="w-14 h-14 bg-gradient-to-r from-orange-400 to-pink-400 text-white rounded-full shadow-2xl hover:scale-110 transition-all flex items-center justify-center text-2xl" style={{ animation: 'float 3s ease-in-out infinite' }}>+</button>
          </div>
        </div>

        {showMenu && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowMenu(false)}>
            <div className="neo-card rounded-3xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4"><h3 className="text-xl font-bold text-gray-800 poppins">Menu</h3><button onClick={() => setShowMenu(false)}><X size={24} className="text-gray-600" /></button></div>
              <div className="space-y-2">
                <button onClick={() => { setShowGoalConfig(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium flex items-center gap-3"><Target size={20} /> Configure Goals</button>
                <button onClick={() => { setShowChatbot(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium flex items-center gap-3"><span className="text-xl">?</span> Mantra Meanings</button>
                <button onClick={() => { setView('library'); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium flex items-center gap-3"><Star size={20} /> Browse All Mantras</button>
                <button onClick={() => { setShowSettings(true); setShowMenu(false); }} className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 text-gray-700 poppins font-medium flex items-center gap-3"><Settings size={20} /> Settings</button>
              </div>
            </div>
          </div>
        )}

        {showChatbot && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4 z-50">
            <div className="neo-card w-full md:max-w-3xl md:rounded-3xl rounded-t-3xl h-[90vh] md:h-[85vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200"><div><h2 className="text-2xl font-bold text-gray-800 poppins">Mantra Meanings</h2><p className="text-sm text-gray-600 poppins mt-1">AI-powered guide</p></div><button onClick={() => setShowChatbot(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X size={24} className="text-gray-600" /></button></div>
              <div className="px-6 py-3 border-b border-gray-200"><div className="flex gap-2 overflow-x-auto pb-2">{languages.map(lang => (<button key={lang.code} onClick={() => setSelectedLanguage(lang.code)} className={`px-4 py-2 rounded-full text-sm font-medium poppins whitespace-nowrap transition-all ${selectedLanguage === lang.code ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-md' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>{lang.nativeName}</button>))}</div></div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.length === 0 && (<div className="text-center py-12"><div className="w-20 h-20 mx-auto bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center mb-4 text-white text-3xl font-bold">OM</div><h3 className="text-xl font-bold text-gray-800 poppins mb-2">Welcome, Seeker!</h3><p className="text-gray-600 poppins max-w-md mx-auto">Type any mantra to discover its meaning.</p></div>)}
                {chatMessages.map((msg, i) => (<div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] ${msg.type === 'user' ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white' : 'neo-card text-gray-800'} rounded-2xl p-4 shadow-md`}>{msg.type === 'user' ? (<p className="devanagari text-base leading-relaxed break-words">{msg.text}</p>) : (<div className="poppins text-sm leading-relaxed whitespace-pre-wrap break-words">{msg.text}</div>)}</div></div>))}
                {isLoadingChat && (<div className="flex justify-start"><div className="neo-card rounded-2xl p-4"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div></div></div>)}
                <div ref={chatEndRef} />
              </div>
              {suggestions.length > 0 && (<div className="px-6 py-3 border-t border-gray-200 max-h-48 overflow-y-auto"><p className="text-xs text-gray-600 poppins mb-2">Suggestions:</p><div className="space-y-2">{suggestions.map(mantra => (<button key={mantra.id} onClick={() => selectSuggestion(mantra)} className="w-full text-left neo-card rounded-xl p-3 hover:scale-[1.02] transition-all"><p className="font-medium text-gray-800 poppins text-sm">{mantra.name}</p><p className="text-xs text-gray-600 devanagari">{mantra.text}</p></button>))}</div></div>)}
              <div className="p-6 border-t border-gray-200"><div className="flex gap-3"><input type="text" placeholder="Type a mantra..." value={chatInput} onChange={(e) => handleChatInputChange(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && chatInput.trim() && getMantraMeaning(chatInput)} className="flex-1 neo-card px-4 py-3 rounded-xl text-gray-800 devanagari focus:outline-none focus:ring-2 focus:ring-orange-400" disabled={isLoadingChat} /><button onClick={() => chatInput.trim() && getMantraMeaning(chatInput)} disabled={isLoadingChat || !chatInput.trim()} className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-3 rounded-xl poppins font-medium hover:shadow-lg transition-all disabled:opacity-50">{isLoadingChat ? '...' : 'Ask'}</button></div></div>
            </div>
          </div>
        )}

        {showSettings && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="neo-card rounded-3xl p-8 max-w-md w-full">
              <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-bold text-gray-800 poppins">Settings</h2><button onClick={() => setShowSettings(false)}><X size={24} /></button></div>
              <div className="space-y-4">
                <div className="flex justify-between items-center"><div className="flex items-center gap-3"><Volume2 size={20} className="text-gray-600" /><span className="text-gray-800 font-medium poppins">Sound Effects</span></div><button onClick={() => setSoundEnabled(!soundEnabled)} className={`w-14 h-8 rounded-full transition-all ${soundEnabled ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${soundEnabled ? 'translate-x-7' : 'translate-x-1'}`} /></button></div>
                <div className="flex justify-between items-center"><div className="flex items-center gap-3"><span className="text-gray-600 text-xl">~</span><span className="text-gray-800 font-medium poppins">Vibration</span></div><button onClick={() => setVibrationEnabled(!vibrationEnabled)} className={`w-14 h-8 rounded-full transition-all ${vibrationEnabled ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${vibrationEnabled ? 'translate-x-7' : 'translate-x-1'}`} /></button></div>
                <div className="flex justify-between items-center"><div className="flex items-center gap-3">{notificationsEnabled ? <Bell size={20} className="text-gray-600" /> : <BellOff size={20} className="text-gray-600" />}<span className="text-gray-800 font-medium poppins">Notifications</span></div><button onClick={async () => { if (!notificationsEnabled) { const granted = await NotificationService.requestPermission(); if (granted) { setNotificationsEnabled(true); NotificationService.sendTest(); } } else { setNotificationsEnabled(false); } }} className={`w-14 h-8 rounded-full transition-all ${notificationsEnabled ? 'bg-gradient-to-r from-orange-400 to-pink-400' : 'bg-gray-300'}`}><div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform ${notificationsEnabled ? 'translate-x-7' : 'translate-x-1'}`} /></button></div>
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
        <style>{styles}</style>
        <div className="max-w-6xl mx-auto">
          <button onClick={() => setView('home')} className="mb-6 neo-card px-6 py-3 rounded-xl font-semibold poppins text-gray-700">← Back to Home</button>
          <h2 className="text-2xl font-bold text-gray-800 poppins mb-6">All Mantras</h2>
          <div className="space-y-3">
            {mantrasLibrary.map(m => (
              <div key={m.id} onClick={() => {setSelectedMantra(m); setCount(0); setView('counter');}} className="neo-card rounded-2xl p-5 hover:scale-[1.01] transition-all cursor-pointer flex items-center gap-4">
                <button onClick={(e) => {e.stopPropagation(); toggleFavorite(m.id);}} className="p-2"><Star size={20} className={favorites.includes(m.id) ? 'fill-amber-500 text-amber-500' : 'text-gray-400'} /></button>
                <div className="flex-1"><h3 className="font-semibold text-gray-800 poppins">{m.name}</h3><p className="text-sm text-gray-600 devanagari">{m.text}</p></div>
                <button className="bg-gradient-to-r from-orange-400 to-pink-400 text-white px-6 py-2 rounded-xl poppins font-medium">Chant</button>
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
      <style>{styles}</style>
      <div className="max-w-2xl w-full">
        <button onClick={() => { if (count > 0) saveSession(); else setView('home'); }} className="mb-6 neo-card px-6 py-3 rounded-xl font-semibold poppins text-gray-700">← {count > 0 ? 'Save & Exit' : 'Back to Home'}</button>
        <div className="neo-card rounded-3xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 poppins mb-2">{selectedMantra?.name}</h2>
            <p className="text-sm text-gray-600 poppins mb-4">{selectedMantra?.deity}</p>
            <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-2xl p-6"><p className="text-3xl text-gray-800 devanagari leading-relaxed">{selectedMantra?.text}</p><p className="text-sm text-gray-600 mt-2 italic poppins">{selectedMantra?.transliteration}</p></div>
          </div>
          <div className="relative w-80 h-80 mx-auto mb-8">
            <svg className="transform -rotate-90 w-80 h-80"><circle cx="160" cy="160" r="140" stroke="rgba(255,107,107,0.2)" strokeWidth="16" fill="none" /><circle cx="160" cy="160" r="140" stroke="url(#gradient)" strokeWidth="16" fill="none" strokeDasharray={`${2*Math.PI*140}`} strokeDashoffset={`${2*Math.PI*140*(1-progress/100)}`} strokeLinecap="round" className="transition-all duration-300" /><defs><linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#ff6b6b" /><stop offset="50%" stopColor="#ff8e53" /><stop offset="100%" stopColor="#ffd93d" /></linearGradient></defs></svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-8xl font-bold text-gray-800 poppins">{count}</span><span className="text-2xl text-gray-600 poppins">of {selectedMantra?.count}</span></div>
          </div>
          <button onClick={handleCount} className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-8 rounded-2xl text-2xl mb-6 poppins uppercase shadow-xl hover:scale-[1.02] active:scale-95 transition-all">Tap to Count</button>
          <div className="grid grid-cols-3 gap-4">
            <button onClick={() => setSoundEnabled(!soundEnabled)} className="p-6 neo-card rounded-2xl text-gray-700">{soundEnabled ? <Volume2 size={28} className="mx-auto mb-2" /> : <VolumeX size={28} className="mx-auto mb-2" />}<span className="text-sm poppins">Sound</span></button>
            <button onClick={() => setCount(0)} className="p-6 neo-card rounded-2xl text-gray-700"><RotateCcw size={28} className="mx-auto mb-2" /><span className="text-sm poppins">Reset</span></button>
            <button onClick={() => { if (count > 0) saveSession(); else setView('home'); }} className="p-6 neo-card rounded-2xl text-gray-700"><X size={28} className="mx-auto mb-2" /><span className="text-sm poppins">{count > 0 ? 'Save' : 'Close'}</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
