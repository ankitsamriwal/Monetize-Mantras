// Storage service for persistent data using localStorage
// This can be upgraded to IndexedDB for larger datasets

const STORAGE_KEYS = {
  GOALS: 'mantra_goals',
  SESSIONS: 'mantra_sessions',
  STATS: 'mantra_stats',
  SETTINGS: 'mantra_settings',
  NOTIFICATIONS: 'mantra_notifications'
};

// Helper to get today's date as string
export const getTodayString = () => {
  return new Date().toISOString().split('T')[0];
};

// Helper to get date string
export const getDateString = (date) => {
  return new Date(date).toISOString().split('T')[0];
};

// Initialize default data structure
const getDefaultData = () => ({
  goals: [],
  sessions: [],
  stats: {
    totalChants: 0,
    totalSessions: 0,
    currentStreak: 0,
    longestStreak: 0,
    level: 1,
    lastActiveDate: null
  },
  settings: {
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true
  }
});

// Storage Service
export const StorageService = {
  // Goals Management
  getGoals: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GOALS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading goals:', e);
      return [];
    }
  },

  saveGoals: (goals) => {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
      return true;
    } catch (e) {
      console.error('Error saving goals:', e);
      return false;
    }
  },

  addGoal: (goal) => {
    const goals = StorageService.getGoals();
    if (goals.length >= 10) {
      return { success: false, message: 'Maximum 10 goals allowed' };
    }
    const newGoal = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...goal
    };
    goals.push(newGoal);
    StorageService.saveGoals(goals);
    return { success: true, goal: newGoal };
  },

  updateGoal: (goalId, updates) => {
    const goals = StorageService.getGoals();
    const index = goals.findIndex(g => g.id === goalId);
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      StorageService.saveGoals(goals);
      return true;
    }
    return false;
  },

  deleteGoal: (goalId) => {
    const goals = StorageService.getGoals();
    const filtered = goals.filter(g => g.id !== goalId);
    StorageService.saveGoals(filtered);
    return true;
  },

  // Sessions Management
  getSessions: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Error reading sessions:', e);
      return [];
    }
  },

  saveSessions: (sessions) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
      return true;
    } catch (e) {
      console.error('Error saving sessions:', e);
      return false;
    }
  },

  addSession: (session) => {
    const sessions = StorageService.getSessions();
    const newSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      dateString: getTodayString(),
      ...session
    };
    sessions.push(newSession);
    StorageService.saveSessions(sessions);

    // Update stats after adding session
    StorageService.updateStatsAfterSession(newSession);

    return newSession;
  },

  getSessionsByDate: (dateString) => {
    const sessions = StorageService.getSessions();
    return sessions.filter(s => s.dateString === dateString);
  },

  getSessionsByMantra: (mantraId) => {
    const sessions = StorageService.getSessions();
    return sessions.filter(s => s.mantraId === mantraId);
  },

  // Stats Management
  getStats: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : getDefaultData().stats;
    } catch (e) {
      console.error('Error reading stats:', e);
      return getDefaultData().stats;
    }
  },

  saveStats: (stats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
      return true;
    } catch (e) {
      console.error('Error saving stats:', e);
      return false;
    }
  },

  updateStatsAfterSession: (session) => {
    const stats = StorageService.getStats();
    const today = getTodayString();

    // Update total chants and sessions
    stats.totalChants += session.count || 0;
    stats.totalSessions += 1;

    // Update streak
    if (stats.lastActiveDate) {
      const lastDate = new Date(stats.lastActiveDate);
      const todayDate = new Date(today);
      const diffDays = Math.floor((todayDate - lastDate) / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Same day, streak continues
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        stats.currentStreak += 1;
      } else {
        // Streak broken, reset to 1
        stats.currentStreak = 1;
      }
    } else {
      stats.currentStreak = 1;
    }

    // Update longest streak
    if (stats.currentStreak > stats.longestStreak) {
      stats.longestStreak = stats.currentStreak;
    }

    // Update level (every 500 chants = 1 level)
    stats.level = Math.floor(stats.totalChants / 500) + 1;

    // Update last active date
    stats.lastActiveDate = today;

    StorageService.saveStats(stats);
    return stats;
  },

  // Calculate weekly stats
  getWeeklyStats: () => {
    const sessions = StorageService.getSessions();
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const weeklySessions = sessions.filter(s => new Date(s.date) >= weekAgo);
    const weeklyChants = weeklySessions.reduce((sum, s) => sum + (s.count || 0), 0);

    return {
      sessions: weeklySessions.length,
      chants: weeklyChants
    };
  },

  // Calculate monthly stats
  getMonthlyStats: () => {
    const sessions = StorageService.getSessions();
    const today = new Date();
    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const monthlySessions = sessions.filter(s => new Date(s.date) >= monthAgo);
    const monthlyChants = monthlySessions.reduce((sum, s) => sum + (s.count || 0), 0);

    return {
      sessions: monthlySessions.length,
      chants: monthlyChants
    };
  },

  // Get chant history by mantra
  getChantHistory: () => {
    const sessions = StorageService.getSessions();
    const history = {};

    sessions.forEach(session => {
      if (!history[session.mantraId]) {
        history[session.mantraId] = {
          count: 0,
          sessions: 0,
          lastChanted: null
        };
      }
      history[session.mantraId].count += session.count || 0;
      history[session.mantraId].sessions += 1;
      history[session.mantraId].lastChanted = session.date;
    });

    return history;
  },

  // Get goal progress for today
  getTodayGoalProgress: () => {
    const goals = StorageService.getGoals();
    const today = getTodayString();
    const todaySessions = StorageService.getSessionsByDate(today);
    const dayOfWeek = new Date().getDay(); // 0 = Sunday, 6 = Saturday

    return goals.map(goal => {
      // Check if goal is active today
      const isActiveToday = goal.days.includes(dayOfWeek);

      // Calculate progress
      const mantraSessions = todaySessions.filter(s => s.mantraId === goal.mantraId);
      const completedCount = mantraSessions.reduce((sum, s) => sum + (s.count || 0), 0);
      const targetCount = goal.targetCount || 108;
      const progress = Math.min((completedCount / targetCount) * 100, 100);

      return {
        ...goal,
        isActiveToday,
        completedCount,
        targetCount,
        progress,
        isCompleted: completedCount >= targetCount
      };
    });
  },

  // Settings Management
  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : getDefaultData().settings;
    } catch (e) {
      console.error('Error reading settings:', e);
      return getDefaultData().settings;
    }
  },

  saveSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
      return true;
    } catch (e) {
      console.error('Error saving settings:', e);
      return false;
    }
  },

  // Clear all data (for testing/reset)
  clearAllData: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};

export default StorageService;
