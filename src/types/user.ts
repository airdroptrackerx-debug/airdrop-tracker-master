import { StreakData } from "./gamification";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  nickname: string;
  photoURL?: string; // Profile picture from Google/Twitter or uploaded
  emailVerified?: boolean; // Email verification status
  provider?: string; // 'password', 'google.com', 'twitter.com', etc.
  linkedProviders?: string[]; // Array of linked auth providers
  isAdmin?: boolean; // Admin role flag for accessing admin pages
  streakData?: StreakData; // User's login streak data
  lastStreakUpdate?: Date; // Last time streak was checked
  hasCompletedOnboarding?: boolean; // Whether user has visited About page after first sign-up
  createdAt: Date;
  updatedAt: Date;
}

export type BadgeLevel = "Beginner" | "Intermediate" | "Veteran" | "Master";

export interface UserStats {
  totalTasks: number;
  completedToday: number;
  completionRate: number;
  badgeLevel: BadgeLevel;
}
