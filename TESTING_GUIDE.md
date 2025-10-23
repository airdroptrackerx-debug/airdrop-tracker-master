# 🧪 Testing Guide - Airdrop Tracker

## Quick Start

Open your browser console (F12) after running `npm run dev`. Test utilities will be automatically loaded!

---

## 🔥 Streak System Testing

### Check Current Streak
```javascript
testStreak()
```
Shows:
- Current streak count
- Last update time
- Whether streak increased/reset
- Any achieved milestones

### Simulate a Specific Streak
```javascript
simulateStreak(15)  // Set streak to 15 days
```
Then sign out and back in to see the effect.

### Test Milestone Notifications
```javascript
testMilestone(7)   // Test 7-day milestone
testMilestone(30)  // Test 30-day milestone
testMilestone(100) // Test 100-day milestone
```
This sets your streak to 1 day before the milestone. Sign out and back in to trigger the notification!

### Reset Streak
```javascript
resetStreak()
```
Simulates missing a day. Next login will reset streak to 0.

---

## 🔔 Notifications Testing

### 🆕 Trigger a Notification RIGHT NOW (Instant Visual Feedback!)
```javascript
triggerTestNotification('streak')   // Trigger 7-day streak notification
triggerTestNotification('levelup')  // Trigger level up notification
triggerTestNotification('custom')   // Trigger 100-day streak notification
```
**This is the easiest way to test!** Within 2 seconds:
- Bell icon gets a red badge with unread count
- Click bell to see the notification
- Notification appears in the dropdown

### Check All Notifications
```javascript
testNotifications()
```
Shows:
- Total notification count
- Unread count
- Full notification list
- Pending milestone notifications

### View Notification Bell
After testing, look at the navigation bar:
- Bell icon should show a badge with unread count
- Click bell to see notification dropdown
- Notifications include:
  - Streak milestones (🔥)
  - Level ups (⭐)
  - Task completions (🎯)

---

## 💾 Storage Inspection

### View All Stored Data
```javascript
checkStorage()
```
Shows all localStorage data:
- Streak data
- Notifications
- Level progress
- Task counts

---

## 🗑️ Clear Test Data

### Reset Everything
```javascript
clearTestData()
```
⚠️ **Warning**: This clears all streak and notification data!

---

## 📝 Complete Testing Workflow

### Test Streak Milestones:

1. **Setup 7-day milestone:**
   ```javascript
   testMilestone(7)
   ```

2. **Sign out:**
   - Click "Sign Out" button in navigation

3. **Sign back in:**
   - You should see console logs about streak update
   - Notification bell should show a badge
   - Check notifications to see "🔥 7 Days Streak!"

4. **Verify:**
   ```javascript
   testStreak()
   testNotifications()
   ```

### Test Streak Reset:

1. **Reset streak:**
   ```javascript
   resetStreak()
   ```

2. **Sign out and back in**

3. **Verify reset:**
   ```javascript
   testStreak()  // Should show currentStreak: 1
   ```

### Test Notifications System:

1. **Create a test notification manually:**
   ```javascript
   // In console, access the notification context
   // (if React DevTools available)
   ```

2. **Check notification bell:**
   - Should show unread badge
   - Click to see dropdown
   - Click notification to mark as read

3. **Verify:**
   ```javascript
   testNotifications()
   ```

---

## 🎯 Expected Behavior

### Streak Milestones:
- **7 days**: "🔥 7 Days Streak! You're on fire!"
- **30 days**: "🔥 30 Days Streak! Incredible dedication!"
- **100 days**: "🔥 100 Days Streak! You're a legend!"

### Notifications:
- Appear in notification bell (top navigation)
- Show unread count badge
- Auto-dismiss after being read
- Stored in localStorage
- Limited to 50 most recent

### Streak Behavior:
- Increases by 1 when logging in on a new day
- Stays same if already logged in today
- Resets to 1 if you miss a day (no login for 2+ days)
- Longest streak is always tracked

---

## 🐛 Troubleshooting

### Utilities Not Loading?
Make sure you're running in development mode:
```bash
npm run dev
```

### Notifications Not Appearing?
1. Check console for errors
2. Run `testNotifications()` to inspect data
3. Verify NotificationBell component is rendered
4. Check browser's localStorage

### Streak Not Updating?
1. Clear test data: `clearTestData()`
2. Refresh page
3. Sign out and back in
4. Run `testStreak()` to verify

---

## 📊 Console Commands Summary

| Command | Description |
|---------|-------------|
| `testStreak()` | Check current streak status |
| `testNotifications()` | View all notifications |
| `simulateStreak(days)` | Set streak to specific number |
| `testMilestone(7\|30\|100)` | Test milestone notification |
| `resetStreak()` | Reset streak to 0 |
| `checkStorage()` | View all localStorage data |
| `clearTestData()` | Clear all test data |

---

## 🎓 Tips

1. **Test in Incognito**: Use incognito mode for fresh state testing
2. **Console Logs**: Watch console for detailed streak/notification logs
3. **React DevTools**: Use React DevTools to inspect component state
4. **Network Tab**: Monitor Firestore calls for streak updates
5. **Time Travel**: Use `simulateStreak()` to jump to any day count

---

## ✅ Production Testing Checklist

Before deploying:

- [ ] Test 7-day milestone
- [ ] Test 30-day milestone  
- [ ] Test streak reset (missed day)
- [ ] Test notification bell badge
- [ ] Test notification click (mark as read)
- [ ] Test notification auto-dismiss
- [ ] Verify streak persists after logout/login
- [ ] Verify longest streak is tracked correctly
- [ ] Test on mobile (responsive design)
- [ ] Clear test data before deploy

---

Happy Testing! 🚀
