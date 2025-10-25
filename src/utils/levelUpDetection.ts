import { getLevelInfo, didLevelUp, didLevelDown } from "./levelingSystem";

const LAST_TASK_COUNT_KEY = "airdrop_tracker_last_task_count";
const LEVEL_UP_EVENT_KEY = "level_up_achieved";
const LEVEL_DOWN_EVENT_KEY = "level_down_occurred";

/**
 * Check if user leveled up/down and store event for notification
 */
export function checkAndStoreLevelUp(currentTaskCount: number): {
  leveledUp: boolean;
  leveledDown: boolean;
  newLevel: string;
  previousLevel: string;
} {
  // Get previous task count
  const storedCount = localStorage.getItem(LAST_TASK_COUNT_KEY);
  const previousTaskCount = storedCount ? parseInt(storedCount, 10) : 0;

  // Check if leveled up
  const hasLeveledUp = didLevelUp(previousTaskCount, currentTaskCount);

  if (hasLeveledUp) {
    const previousLevelInfo = getLevelInfo(previousTaskCount);
    const newLevelInfo = getLevelInfo(currentTaskCount);

    console.log(
      `🎉 LEVEL UP! ${previousLevelInfo.level} → ${newLevelInfo.level}`
    );

    // Store level-up event for notification
    localStorage.setItem(
      LEVEL_UP_EVENT_KEY,
      JSON.stringify({
        previousLevel: previousLevelInfo.level,
        newLevel: newLevelInfo.level,
        newLevelIcon: newLevelInfo.icon,
        newLevelDescription: newLevelInfo.description,
        taskCount: currentTaskCount,
        timestamp: Date.now(),
      })
    );

    // Update stored task count
    localStorage.setItem(LAST_TASK_COUNT_KEY, currentTaskCount.toString());

    return {
      leveledUp: true,
      leveledDown: false,
      newLevel: newLevelInfo.level,
      previousLevel: previousLevelInfo.level,
    };
  }

  // Check if leveled down
  const hasLeveledDown = didLevelDown(previousTaskCount, currentTaskCount);

  if (hasLeveledDown) {
    const previousLevelInfo = getLevelInfo(previousTaskCount);
    const newLevelInfo = getLevelInfo(currentTaskCount);

    console.log(
      `📉 Level decreased: ${previousLevelInfo.level} → ${newLevelInfo.level}`
    );

    // Store level-down event for notification
    localStorage.setItem(
      LEVEL_DOWN_EVENT_KEY,
      JSON.stringify({
        previousLevel: previousLevelInfo.level,
        newLevel: newLevelInfo.level,
        newLevelIcon: newLevelInfo.icon,
        previousLevelIcon: previousLevelInfo.icon,
        taskCount: currentTaskCount,
        timestamp: Date.now(),
      })
    );

    // Update stored task count
    localStorage.setItem(LAST_TASK_COUNT_KEY, currentTaskCount.toString());

    return {
      leveledUp: false,
      leveledDown: true,
      newLevel: newLevelInfo.level,
      previousLevel: previousLevelInfo.level,
    };
  }

  // Update stored task count even if no level change
  localStorage.setItem(LAST_TASK_COUNT_KEY, currentTaskCount.toString());

  return {
    leveledUp: false,
    leveledDown: false,
    newLevel: getLevelInfo(currentTaskCount).level,
    previousLevel: getLevelInfo(previousTaskCount).level,
  };
}

/**
 * Get stored level-up event
 */
export function getLevelUpEvent(): any | null {
  const stored = localStorage.getItem(LEVEL_UP_EVENT_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Clear level-up event after notification is created
 */
export function clearLevelUpEvent(): void {
  localStorage.removeItem(LEVEL_UP_EVENT_KEY);
}

/**
 * Initialize task count tracking
 */
export function initializeTaskCountTracking(initialCount: number): void {
  const stored = localStorage.getItem(LAST_TASK_COUNT_KEY);
  if (!stored) {
    localStorage.setItem(LAST_TASK_COUNT_KEY, initialCount.toString());
  }
}
