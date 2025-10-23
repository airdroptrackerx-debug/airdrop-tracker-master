// Gamification Types for Leveling, Streaks, and Notifications

export type UserLevel = 
  | 'Novice Explorer'
  | 'Rising Star'
  | 'Trailblazer'
  | 'Elite Champion'
  | 'Legendary Master'
  | 'Crypto Titan';

export interface LevelInfo {
  level: UserLevel;
  icon: string;
  minTasks: number;
  maxTasks: number;
  color: string;
  gradient: string;
  description: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastLoginDate: string; // ISO string
  milestones: number[]; // [7, 14, 30, 60, 100]
}

export interface NotificationData {
  id: string;
  type: 'level_up' | 'streak_milestone' | 'avatar_upgrade' | 'progress';
  title: string;
  message: string;
  icon: string;
  timestamp: number;
  read: boolean;
  data?: any; // Additional data for the notification
}

export interface UserStats {
  totalTasks: number;
  completedToday: number;
  currentStreak: number;
  longestStreak: number;
  level: UserLevel;
  progress: number; // 0-100 percentage to next level
  tasksToNextLevel: number;
}
