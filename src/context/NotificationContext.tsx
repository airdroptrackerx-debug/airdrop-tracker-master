import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { NotificationData } from '../types/gamification';

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  addNotification: (notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  clearAllNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'airdrop_tracker_notifications';
const MAX_NOTIFICATIONS = 50; // Keep last 50 notifications

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<NotificationData[]>(() => {
    const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;

  // Save to localStorage whenever notifications change
  const saveNotifications = useCallback((newNotifications: NotificationData[]) => {
    localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(newNotifications));
    setNotifications(newNotifications);
  }, []);

  // Add a new notification
  const addNotification = useCallback((
    notification: Omit<NotificationData, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: NotificationData = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      // Keep only the most recent MAX_NOTIFICATIONS
      const trimmed = updated.slice(0, MAX_NOTIFICATIONS);
      saveNotifications(trimmed);
      return trimmed;
    });
  }, [saveNotifications]);

  // Mark notification as read
  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => 
        n.id === id ? { ...n, read: true } : n
      );
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear specific notification
  const clearNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  // Watch for streak milestone achievements
  useEffect(() => {
    const checkStreakMilestone = () => {
      const milestoneData = localStorage.getItem('streak_milestone_achieved');
      if (milestoneData) {
        try {
          const { milestone, timestamp } = JSON.parse(milestoneData);
          
          // Check if notification was already created (within last 5 seconds)
          const timeSinceAchievement = Date.now() - timestamp;
          if (timeSinceAchievement < 5000) {
            // Create notification for milestone
            addNotification({
              type: 'streak_milestone',
              title: `${milestone}-Day Streak! 🔥`,
              message: `Amazing! You've logged in for ${milestone} consecutive days. Keep up the momentum!`,
              icon: '🔥'
            });
            
            // Clear the milestone flag
            localStorage.removeItem('streak_milestone_achieved');
          }
        } catch (error) {
          console.error('Error processing streak milestone:', error);
        }
      }
    };

    // Check immediately and then every 2 seconds
    checkStreakMilestone();
    const interval = setInterval(checkStreakMilestone, 2000);

    return () => clearInterval(interval);
  }, [addNotification]);

  // Watch for level-up achievements
  useEffect(() => {
    const checkLevelUp = () => {
      const levelUpData = localStorage.getItem('level_up_achieved');
      if (levelUpData) {
        try {
          const { newLevel, newLevelIcon, newLevelDescription, previousLevel, timestamp } = JSON.parse(levelUpData);
          
          // Check if notification was already created (within last 5 seconds)
          const timeSinceAchievement = Date.now() - timestamp;
          if (timeSinceAchievement < 5000) {
            // Create notification for level up
            addNotification({
              type: 'level_up',
              title: `Level Up! ${newLevelIcon}`,
              message: `Congratulations! You've advanced from ${previousLevel} to ${newLevel}! ${newLevelDescription}`,
              icon: newLevelIcon
            });
            
            // Clear the level-up flag
            localStorage.removeItem('level_up_achieved');
          }
        } catch (error) {
          console.error('Error processing level up:', error);
        }
      }
    };

    // Check immediately and then every 2 seconds
    checkLevelUp();
    const interval = setInterval(checkLevelUp, 2000);

    return () => clearInterval(interval);
  }, [addNotification]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      addNotification,
      markAsRead,
      markAllAsRead,
      clearNotification,
      clearAllNotifications
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
