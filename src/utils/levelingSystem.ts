import { LevelInfo, UserLevel, UserStats } from '../types/gamification';

// EPIC Level System - Progressive & Motivating!
export const LEVELS: LevelInfo[] = [
  {
    level: 'Novice Explorer',
    icon: '🌱',
    minTasks: 0,
    maxTasks: 5,
    color: '#10b981',
    gradient: 'from-emerald-500 to-green-600',
    description: 'Just starting your crypto journey!'
  },
  {
    level: 'Rising Star',
    icon: '⭐',
    minTasks: 6,
    maxTasks: 10,
    color: '#fbbf24',
    gradient: 'from-yellow-400 to-amber-500',
    description: 'Your potential is shining through!'
  },
  {
    level: 'Trailblazer',
    icon: '🔥',
    minTasks: 11,
    maxTasks: 20,
    color: '#f97316',
    gradient: 'from-orange-500 to-red-500',
    description: 'Blazing new paths in crypto!'
  },
  {
    level: 'Elite Champion',
    icon: '👑',
    minTasks: 21,
    maxTasks: 35,
    color: '#a855f7',
    gradient: 'from-purple-500 to-indigo-600',
    description: 'Among the elite few!'
  },
  {
    level: 'Legendary Master',
    icon: '💎',
    minTasks: 36,
    maxTasks: 50,
    color: '#3b82f6',
    gradient: 'from-blue-500 to-cyan-600',
    description: 'A true master of the craft!'
  },
  {
    level: 'Crypto Titan',
    icon: '🚀',
    minTasks: 51,
    maxTasks: Infinity,
    color: '#ec4899',
    gradient: 'from-pink-500 via-purple-500 to-indigo-500',
    description: 'Legendary status achieved!'
  }
];

/**
 * Get level information based on task count
 */
export function getLevelInfo(taskCount: number): LevelInfo {
  for (const level of LEVELS) {
    if (taskCount >= level.minTasks && taskCount <= level.maxTasks) {
      return level;
    }
  }
  // Default to highest level if somehow exceeds
  return LEVELS[LEVELS.length - 1];
}

/**
 * Get the next level information
 */
export function getNextLevelInfo(currentTaskCount: number): LevelInfo | null {
  const currentLevel = getLevelInfo(currentTaskCount);
  const currentIndex = LEVELS.findIndex(l => l.level === currentLevel.level);
  
  if (currentIndex < LEVELS.length - 1) {
    return LEVELS[currentIndex + 1];
  }
  
  return null; // Already at max level
}

/**
 * Calculate progress to next level (0-100)
 */
export function getProgressToNextLevel(taskCount: number): number {
  const currentLevel = getLevelInfo(taskCount);
  const nextLevel = getNextLevelInfo(taskCount);
  
  if (!nextLevel) {
    return 100; // Max level reached
  }
  
  const tasksInCurrentLevel = taskCount - currentLevel.minTasks;
  const tasksNeededForNextLevel = nextLevel.minTasks - currentLevel.minTasks;
  
  return Math.min(100, Math.round((tasksInCurrentLevel / tasksNeededForNextLevel) * 100));
}

/**
 * Get tasks needed to reach next level
 */
export function getTasksToNextLevel(taskCount: number): number {
  const nextLevel = getNextLevelInfo(taskCount);
  
  if (!nextLevel) {
    return 0; // Max level
  }
  
  return nextLevel.minTasks - taskCount;
}

/**
 * Check if user leveled up
 */
export function didLevelUp(previousTaskCount: number, newTaskCount: number): boolean {
  const previousLevel = getLevelInfo(previousTaskCount);
  const newLevel = getLevelInfo(newTaskCount);
  
  return previousLevel.level !== newLevel.level;
}

/**
 * Get user stats summary
 */
export function getUserStats(
  totalTasks: number,
  completedToday: number,
  currentStreak: number,
  longestStreak: number
): UserStats {
  const levelInfo = getLevelInfo(totalTasks);
  
  return {
    totalTasks,
    completedToday,
    currentStreak,
    longestStreak,
    level: levelInfo.level,
    progress: getProgressToNextLevel(totalTasks),
    tasksToNextLevel: getTasksToNextLevel(totalTasks)
  };
}

/**
 * Get level by name
 */
export function getLevelByName(levelName: UserLevel): LevelInfo | undefined {
  return LEVELS.find(l => l.level === levelName);
}

/**
 * Get all level names for dropdown/selection
 */
export function getAllLevelNames(): UserLevel[] {
  return LEVELS.map(l => l.level);
}

/**
 * Format level display text
 */
export function formatLevelDisplay(levelInfo: LevelInfo): string {
  return `${levelInfo.icon} ${levelInfo.level}`;
}
