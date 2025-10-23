/**
 * Testing Utilities for Airdrop Tracker
 * Use these functions in the browser console to test features
 */

import { updateStreakOnLogin } from './streakSystem';

// Make functions globally available in console
declare global {
  interface Window {
    testStreak: typeof testStreak;
    testNotifications: typeof testNotifications;
    simulateStreak: typeof simulateStreak;
    resetStreak: typeof resetStreak;
    testMilestone: typeof testMilestone;
    triggerTestNotification: typeof triggerTestNotification;
    checkStorage: typeof checkStorage;
    clearTestData: typeof clearTestData;
  }
}

/**
 * Test current streak status
 */
export function testStreak() {
  console.group('🔥 Streak System Test');
  
  const streakData = localStorage.getItem('user_streak_data');
  const lastUpdate = localStorage.getItem('last_streak_update');
  
  console.log('Current Streak Data:', streakData ? JSON.parse(streakData) : 'No data');
  console.log('Last Update:', lastUpdate);
  
  // Test streak update
  const result = updateStreakOnLogin();
  console.log('Streak Update Result:', result);
  
  if (result.didIncrease) {
    console.log('✅ Streak increased!');
  } else if (result.didReset) {
    console.log('⚠️ Streak was reset (missed a day)');
  } else {
    console.log('ℹ️ Already logged in today');
  }
  
  if (result.achievedMilestone) {
    console.log(`🎉 MILESTONE ACHIEVED: ${result.achievedMilestone} days!`);
  }
  
  console.groupEnd();
  return result;
}

/**
 * Test notifications system
 */
export function testNotifications() {
  console.group('🔔 Notifications Test');
  
  const notifications = localStorage.getItem('airdrop_tracker_notifications');
  const milestone = localStorage.getItem('streak_milestone_achieved');
  
  if (notifications) {
    const parsed = JSON.parse(notifications);
    console.log('Total Notifications:', parsed.length);
    console.log('Unread:', parsed.filter((n: any) => !n.read).length);
    console.log('All Notifications:', parsed);
  } else {
    console.log('No notifications found');
  }
  
  if (milestone) {
    console.log('Pending Milestone Notification:', JSON.parse(milestone));
  }
  
  console.groupEnd();
}

/**
 * Simulate a specific streak count
 */
export function simulateStreak(days: number) {
  console.log(`🎯 Setting streak to ${days} days...`);
  
  const streakData = {
    currentStreak: days,
    longestStreak: Math.max(days, days),
    lastLoginDate: new Date().toISOString()
  };
  
  localStorage.setItem('user_streak_data', JSON.stringify(streakData));
  localStorage.setItem('last_streak_update', new Date().toISOString());
  
  console.log('✅ Streak set! Current data:', streakData);
  console.log('ℹ️ Sign out and back in to see the effect');
}

/**
 * Test a specific milestone (6 days = will trigger 7-day milestone on next login)
 */
export function testMilestone(milestone: 7 | 30 | 100 = 7) {
  const daysBefore = milestone - 1;
  console.log(`🎯 Testing ${milestone}-day milestone...`);
  console.log(`Setting streak to ${daysBefore} days`);
  
  // Set to one day before milestone
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  const streakData = {
    currentStreak: daysBefore,
    longestStreak: daysBefore,
    lastLoginDate: yesterday.toISOString()
  };
  
  localStorage.setItem('user_streak_data', JSON.stringify(streakData));
  localStorage.setItem('last_streak_update', yesterday.toISOString());
  
  console.log('✅ Setup complete!');
  console.log(`ℹ️ Current streak: ${daysBefore} days`);
  console.log('ℹ️ Sign out and back in to trigger the milestone!');
  console.log(`🎉 You should see: "${milestone} days!" notification`);
}

/**
 * Reset streak to 0
 */
export function resetStreak() {
  console.log('🔄 Resetting streak to 0...');
  
  // Set last login to 2 days ago (will reset on next login)
  const twoDaysAgo = new Date();
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
  
  const streakData = {
    currentStreak: 5,
    longestStreak: 10,
    lastLoginDate: twoDaysAgo.toISOString()
  };
  
  localStorage.setItem('user_streak_data', JSON.stringify(streakData));
  localStorage.setItem('last_streak_update', twoDaysAgo.toISOString());
  
  console.log('✅ Streak will reset on next login (simulated missed day)');
  console.log('ℹ️ Sign out and back in to see the reset');
}

/**
 * Trigger a test notification to appear on the page
 */
export function triggerTestNotification(type: 'streak' | 'levelup' | 'custom' = 'streak') {
  console.log(`🔔 Triggering ${type} notification...`);
  
  if (type === 'streak') {
    // Trigger a 7-day streak notification
    const milestoneData = {
      milestone: 7,
      timestamp: Date.now()
    };
    localStorage.setItem('streak_milestone_achieved', JSON.stringify(milestoneData));
    console.log('✅ Streak notification triggered!');
    console.log('👀 Check the bell icon in the navigation bar!');
    console.log('ℹ️ The notification will appear within 2 seconds');
  } else if (type === 'levelup') {
    // Trigger a level up notification
    const levelUpData = {
      newLevel: 'Airdrop Apprentice',
      newLevelIcon: '🌟',
      newLevelDescription: 'You\'re making great progress!',
      previousLevel: 'Crypto Newbie',
      timestamp: Date.now()
    };
    localStorage.setItem('level_up_achieved', JSON.stringify(levelUpData));
    console.log('✅ Level up notification triggered!');
    console.log('👀 Check the bell icon in the navigation bar!');
    console.log('ℹ️ The notification will appear within 2 seconds');
  } else {
    // Trigger a custom notification by setting a fake milestone
    const customData = {
      milestone: 100,
      timestamp: Date.now()
    };
    localStorage.setItem('streak_milestone_achieved', JSON.stringify(customData));
    console.log('✅ Custom notification triggered (100-day streak)!');
    console.log('👀 Check the bell icon in the navigation bar!');
    console.log('ℹ️ The notification will appear within 2 seconds');
  }
}

/**
 * Check all relevant localStorage data
 */
export function checkStorage() {
  console.group('💾 LocalStorage Check');
  
  const keys = [
    'user_streak_data',
    'last_streak_update',
    'airdrop_tracker_notifications',
    'streak_milestone_achieved',
    'task_completion_level',
    'last_task_count'
  ];
  
  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        console.log(`${key}:`, JSON.parse(value));
      } catch {
        console.log(`${key}:`, value);
      }
    } else {
      console.log(`${key}: (empty)`);
    }
  });
  
  console.groupEnd();
}

/**
 * Clear all test data (use with caution!)
 */
export function clearTestData() {
  if (!confirm('⚠️ This will clear streak and notification data. Continue?')) {
    console.log('❌ Cancelled');
    return;
  }
  
  console.log('🗑️ Clearing test data...');
  
  localStorage.removeItem('user_streak_data');
  localStorage.removeItem('last_streak_update');
  localStorage.removeItem('airdrop_tracker_notifications');
  localStorage.removeItem('streak_milestone_achieved');
  
  console.log('✅ Test data cleared!');
  console.log('ℹ️ Refresh the page to start fresh');
}

// Auto-expose to window in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.testStreak = testStreak;
  window.testNotifications = testNotifications;
  window.simulateStreak = simulateStreak;
  window.resetStreak = resetStreak;
  window.testMilestone = testMilestone;
  window.triggerTestNotification = triggerTestNotification;
  window.checkStorage = checkStorage;
  window.clearTestData = clearTestData;
  
  console.log('✅ Test utilities loaded! Available commands:');
  console.log('- testStreak() - Check current streak');
  console.log('- testNotifications() - Check notifications');
  console.log('- simulateStreak(days) - Set streak to X days');
  console.log('- testMilestone(7|30|100) - Test milestone notification');
  console.log('- triggerTestNotification("streak"|"levelup") - See notification on page NOW!');
  console.log('- resetStreak() - Reset streak to 0');
  console.log('- checkStorage() - View all stored data');
  console.log('- clearTestData() - Clear all test data');
}
