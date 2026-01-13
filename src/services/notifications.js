// Notification service for mantra reminders
// Uses Web Notifications API + scheduling

import { StorageService } from './storage';

const NOTIFICATION_CHECK_INTERVAL = 60000; // Check every minute

export const NotificationService = {
  // Request notification permission
  requestPermission: async () => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  },

  // Check if notifications are supported and enabled
  isEnabled: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },

  // Show a notification
  show: (title, options = {}) => {
    if (!NotificationService.isEnabled()) {
      console.log('Notifications not enabled');
      return null;
    }

    const defaultOptions = {
      icon: '/icon.svg',
      badge: '/icon.svg',
      vibrate: [200, 100, 200],
      requireInteraction: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) options.onClick();
      };

      // Auto close after 10 seconds
      setTimeout(() => notification.close(), 10000);

      return notification;
    } catch (e) {
      console.error('Error showing notification:', e);
      return null;
    }
  },

  // Schedule checker for goal reminders
  startScheduler: () => {
    // Initial check
    NotificationService.checkScheduledNotifications();

    // Set up interval
    setInterval(() => {
      NotificationService.checkScheduledNotifications();
    }, NOTIFICATION_CHECK_INTERVAL);
  },

  // Check if any goals need notifications
  checkScheduledNotifications: () => {
    const settings = StorageService.getSettings();
    if (!settings.notificationsEnabled) return;

    const goals = StorageService.getGoals();
    const now = new Date();
    const currentDay = now.getDay();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;

    // Get already notified goals for today
    const notifiedKey = `notified_${now.toISOString().split('T')[0]}`;
    const notifiedGoals = JSON.parse(localStorage.getItem(notifiedKey) || '[]');

    goals.forEach(goal => {
      // Check if goal is active today
      if (!goal.days.includes(currentDay)) return;

      // Check if already notified today
      if (notifiedGoals.includes(goal.id)) return;

      // Check if it's time for notification (within 1 minute window)
      if (goal.preferredTime === currentTime) {
        // Check if goal is not yet completed
        const progress = StorageService.getTodayGoalProgress().find(p => p.id === goal.id);
        if (progress && !progress.isCompleted) {
          NotificationService.show(
            `Time to chant ${goal.mantraName}`,
            {
              body: `Your goal: ${goal.targetCount} times. Let's begin your spiritual practice.`,
              tag: goal.id,
              data: { goalId: goal.id }
            }
          );

          // Mark as notified
          notifiedGoals.push(goal.id);
          localStorage.setItem(notifiedKey, JSON.stringify(notifiedGoals));
        }
      }
    });

    // Clean up old notification records (keep only last 7 days)
    NotificationService.cleanupNotificationRecords();
  },

  // Clean up old notification records
  cleanupNotificationRecords: () => {
    const today = new Date();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('notified_')) {
        const dateStr = key.replace('notified_', '');
        const recordDate = new Date(dateStr);
        const diffDays = Math.floor((today - recordDate) / (1000 * 60 * 60 * 24));
        if (diffDays > 7) {
          localStorage.removeItem(key);
        }
      }
    }
  },

  // Send test notification
  sendTest: () => {
    return NotificationService.show(
      'Mantra Practice Reminder',
      {
        body: 'This is a test notification. Your reminders are working!',
        tag: 'test'
      }
    );
  }
};

export default NotificationService;
