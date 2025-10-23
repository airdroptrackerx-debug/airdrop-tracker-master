import { StreakData } from '../types/gamification';

const STREAK_STORAGE_KEY = 'airdrop_tracker_streak';
const HOURS_IN_DAY = 24;
const MS_IN_HOUR = 60 * 60 * 1000;
const MS_IN_DAY = HOURS_IN_DAY * MS_IN_HOUR;

export const STREAK_MILESTONES = [7, 14, 30, 60, 100];

/**
 * Initialize or get existing streak data
 */
export function getStreakData(): StreakData {
  const stored = localStorage.getItem(STREAK_STORAGE_KEY);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // If parsing fails, return default
    }
  }
  
  // Default streak data
  return {
    current: 0,
    longest: 0,
    lastLoginDate: new Date().toISOString(),
    milestones: []
  };
}

/**
 * Save streak data to localStorage
 */
export function saveStreakData(data: StreakData): void {
  localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(data));
}

/**
 * Check if user should get streak credit for today
 */
export function shouldUpdateStreak(lastLoginDate: string): {
  shouldUpdate: boolean;
  shouldReset: boolean;
  wasWithin24Hours: boolean;
} {
  const now = new Date();
  const lastLogin = new Date(lastLoginDate);
  const timeDiff = now.getTime() - lastLogin.getTime();
  const hoursDiff = timeDiff / MS_IN_HOUR;
  
  // Same day - no update needed
  if (isSameDay(now, lastLogin)) {
    return {
      shouldUpdate: false,
      shouldReset: false,
      wasWithin24Hours: true
    };
  }
  
  // Within 24 hours and different day - increment streak
  if (hoursDiff <= HOURS_IN_DAY) {
    return {
      shouldUpdate: true,
      shouldReset: false,
      wasWithin24Hours: true
    };
  }
  
  // More than 24 hours - reset streak
  return {
    shouldUpdate: false,
    shouldReset: true,
    wasWithin24Hours: false
  };
}

/**
 * Update streak on login
 */
export function updateStreakOnLogin(): {
  data: StreakData;
  didIncrease: boolean;
  didReset: boolean;
  achievedMilestone: number | null;
} {
  const currentData = getStreakData();
  const { shouldUpdate, shouldReset } = shouldUpdateStreak(currentData.lastLoginDate);
  
  let newData = { ...currentData };
  let didIncrease = false;
  let didReset = false;
  let achievedMilestone: number | null = null;
  
  if (shouldReset) {
    // Reset streak
    newData.current = 1; // Start fresh
    newData.lastLoginDate = new Date().toISOString();
    didReset = true;
  } else if (shouldUpdate) {
    // Increment streak
    newData.current += 1;
    newData.lastLoginDate = new Date().toISOString();
    didIncrease = true;
    
    // Update longest streak
    if (newData.current > newData.longest) {
      newData.longest = newData.current;
    }
    
    // Check for milestone achievement
    const previousMilestone = getLastAchievedMilestone(currentData.current);
    const currentMilestone = getLastAchievedMilestone(newData.current);
    
    if (currentMilestone && currentMilestone !== previousMilestone) {
      achievedMilestone = currentMilestone;
      if (!newData.milestones.includes(currentMilestone)) {
        newData.milestones.push(currentMilestone);
      }
    }
  }
  
  saveStreakData(newData);
  
  return {
    data: newData,
    didIncrease,
    didReset,
    achievedMilestone
  };
}

/**
 * Get the last milestone the user achieved
 */
export function getLastAchievedMilestone(streakCount: number): number | null {
  const achieved = STREAK_MILESTONES.filter(m => streakCount >= m);
  return achieved.length > 0 ? achieved[achieved.length - 1] : null;
}

/**
 * Get next milestone
 */
export function getNextMilestone(streakCount: number): number | null {
  for (const milestone of STREAK_MILESTONES) {
    if (streakCount < milestone) {
      return milestone;
    }
  }
  return null; // All milestones achieved!
}

/**
 * Get days until next milestone
 */
export function getDaysToNextMilestone(streakCount: number): number {
  const next = getNextMilestone(streakCount);
  return next ? next - streakCount : 0;
}

/**
 * Check if two dates are on the same day
 */
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

/**
 * Format streak display text
 */
export function formatStreakDisplay(streakCount: number): string {
  if (streakCount === 0) {
    return 'Start your streak today!';
  }
  
  if (streakCount === 1) {
    return '🔥 1-day streak! Come back tomorrow!';
  }
  
  return `🔥 ${streakCount}-day streak! Keep it going!`;
}

/**
 * Get streak encouragement message
 */
export function getStreakEncouragement(streakCount: number): string {
  if (streakCount === 0) {
    return 'Log in daily to build your streak!';
  }
  
  if (streakCount < 7) {
    return 'Keep going! Build that habit!';
  }
  
  if (streakCount < 14) {
    return "You're on fire! Don't break the chain!";
  }
  
  if (streakCount < 30) {
    return 'Amazing dedication! Keep it up!';
  }
  
  if (streakCount < 60) {
    return 'Incredible! You\'re unstoppable!';
  }
  
  return 'Legendary streak! You\'re a true champion!';
}

/**
 * Get streak status for display
 */
export function getStreakStatus(): {
  current: number;
  longest: number;
  displayText: string;
  encouragement: string;
  nextMilestone: number | null;
  daysToMilestone: number;
} {
  const data = getStreakData();
  
  return {
    current: data.current,
    longest: data.longest,
    displayText: formatStreakDisplay(data.current),
    encouragement: getStreakEncouragement(data.current),
    nextMilestone: getNextMilestone(data.current),
    daysToMilestone: getDaysToNextMilestone(data.current)
  };
}
