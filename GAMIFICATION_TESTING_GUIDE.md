# 🎮 Gamification System Testing Guide

## ✅ What Was Just Implemented

### 1. **Enhanced Profile Page**
- 🌱 → 🚀 6-Tier Leveling System (Novice Explorer to Crypto Titan)
- 🔥 Streak Display with current and best streaks
- 📊 Animated Stats Cards
- 💰 Donate via Crypto button
- 🔗 Share App functionality
- 🐦 Social links (Twitter, Discord)

### 2. **Automatic Streak Tracking**
- Tracks consecutive login days
- Updates on every login automatically
- Saves to Firestore and localStorage
- Triggers notifications on milestones (7, 14, 30, 60, 100 days)
- Resets if you miss a day (>24 hours gap)

### 3. **Notification System**
- Animated notification bell
- Automatic streak milestone notifications
- Beautiful pop-up with message history

---

## 🧪 How to Test Everything

### **Test 1: View Enhanced Profile Page**

1. **Navigate to Profile:**
   ```
   Click on your profile icon → Profile
   OR
   Visit http://localhost:5173/profile
   ```

2. **What You Should See:**
   - ✨ Animated level badge spinning in
   - 📊 Your current level with icon and description
   - 🔥 Streak display (if you have one)
   - 📈 Progress bar to next level
   - 💰 Orange "Donate via Crypto" button
   - 🔗 "Share App" button
   - 🐦 Twitter and Discord buttons

---

### **Test 2: Check Your Current Level**

Your level depends on task count:

| Tasks | Level | Icon |
|-------|-------|------|
| 0-5 | Novice Explorer | 🌱 |
| 6-10 | Rising Star | ⭐ |
| 11-20 | Trailblazer | 🔥 |
| 21-35 | Elite Champion | 👑 |
| 36-50 | Legendary Master | 💎 |
| 51+ | Crypto Titan | 🚀 |

**To test level progression:**
1. Go to Home page
2. Add new tasks
3. Go back to Profile
4. Watch level update and progress bar move!

---

### **Test 3: Streak System (THIS IS THE BIG ONE!)**

#### **How Streaks Work:**
- Login today → Streak starts at 1
- Login tomorrow (within 24 hours) → Streak increases to 2
- Keep logging in daily → Streak keeps growing!
- Miss a day (>24 hours) → Streak resets to 1

#### **Testing Streak Tracking:**

**Method 1: Fresh Start**
```
1. Clear your browser data (localStorage)
2. Log out and log back in
3. Check console - should see: "Streak updated: current: 1"
4. Go to Profile - you should see "1 Day" streak display
```

**Method 2: Simulate Next Day Login** (Advanced)
```javascript
// Open browser console (F12)
// Manually set last login to yesterday
const streakData = JSON.parse(localStorage.getItem('airdrop_tracker_streak'));
const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);
streakData.lastLoginDate = yesterday.toISOString();
localStorage.setItem('airdrop_tracker_streak', JSON.stringify(streakData));

// Now refresh the page or log out and back in
// Your streak should increase!
```

#### **What to Check:**
1. **Console Logs:**
   - Open F12 Developer Tools → Console
   - On login, you should see: `Streak updated: {...}`
   - Current streak number should show

2. **Profile Page:**
   - 🔥 Streak display should show current days
   - "Best" should show longest streak ever
   - If streak is 0, display won't show (expected)

3. **Firestore:**
   - Open Firebase Console → Firestore Database
   - Check your user document
   - Should have `streakData` field with:
     ```json
     {
       "current": 1,
       "longest": 1,
       "lastLoginDate": "2025-10-21T...",
       "milestones": []
     }
     ```

---

### **Test 4: Streak Milestone Notifications**

**Milestones:** 7, 14, 30, 60, 100 days

**How to Test:**

**Method 1: Manually Trigger (For Testing)**
```javascript
// Open console (F12)
// Manually trigger a 7-day milestone notification
localStorage.setItem('streak_milestone_achieved', JSON.stringify({
  milestone: 7,
  timestamp: Date.now()
}));

// Wait 2-3 seconds
// Check notification bell - should have a badge!
// Click bell - you should see "7-Day Streak! 🔥" notification
```

**Method 2: Actually Achieve It (Real Way)**
- Keep logging in daily
- When you hit 7, 14, 30, 60, or 100 days
- Notification automatically appears!
- Bell icon animates with shake
- Badge shows unread count

**What to Expect:**
1. **Bell Animation:**
   - Shakes when new notification arrives
   - Red badge appears with count

2. **Notification Message:**
   ```
   Title: "7-Day Streak! 🔥"
   Message: "Amazing! You've logged in for 7 consecutive days. Keep up the momentum!"
   ```

3. **Notification Actions:**
   - Click notification → Marks as read
   - Blue dot disappears
   - Badge count decreases
   - Can delete individual notifications

---

### **Test 5: Share Functionality**

1. **Click "Share App" button on Profile**
2. **Share dialog should open with:**
   - WhatsApp button
   - Telegram button
   - Twitter button
   - Facebook button
   - Copy link option

3. **Test Each Share Method:**
   - Click WhatsApp → Opens WhatsApp with pre-filled message
   - Click Telegram → Opens Telegram share dialog
   - Click Twitter → Opens Twitter compose with message
   - Click Facebook → Opens Facebook share dialog
   - Click Copy → Copies link to clipboard, shows checkmark

---

### **Test 6: Donate Button**

1. **Click "Donate via Crypto" button**
2. **Should navigate to** `/donate` page
3. **Donate page should show:**
   - Crypto wallet addresses
   - QR codes
   - Copy buttons
   - Multiple coin options

---

### **Test 7: Social Links**

1. **Click "Follow on Twitter":**
   - Opens: `https://twitter.com/airdroptracker`
   - (Note: Update URL to your actual Twitter)

2. **Click "Join Discord":**
   - Opens: `https://discord.gg/airdroptracker`
   - (Note: Update URL to your actual Discord)

---

### **Test 8: Animations**

1. **Navigate to Profile page**
2. **Watch for animations:**
   - Level badge should spin in from nothing
   - Streak display slides in from left
   - Stat cards fade up one by one
   - Hover over level badge → Scales up slightly

---

### **Test 9: Responsive Design**

**Test on different screen sizes:**

1. **Mobile (< 640px):**
   - Donate and Share buttons stack vertically
   - Stats grid stays 2 columns
   - Everything remains readable

2. **Tablet (640px - 768px):**
   - Buttons side by side
   - Cards arrange properly

3. **Desktop (> 768px):**
   - Profile info and stats side by side
   - Full layout visible

**How to Test:**
- Chrome DevTools (F12) → Toggle device toolbar
- Or manually resize browser window

---

## 🐛 Troubleshooting

### **Streak Not Showing?**

**Check:**
1. Do you have any tasks? (needed for the system to track)
2. Have you logged in at least once?
3. Check console for errors
4. Check localStorage: `airdrop_tracker_streak`
5. Check Firestore: user document should have `streakData`

**Fix:**
```javascript
// Reset streak system
localStorage.removeItem('airdrop_tracker_streak');
// Log out and back in
```

### **Notifications Not Appearing?**

**Check:**
1. Open console - any errors?
2. Check localStorage: `streak_milestone_achieved`
3. Check localStorage: `airdrop_tracker_notifications`
4. Try manually triggering (see Test 4 above)

**Fix:**
```javascript
// Clear notification storage
localStorage.removeItem('airdrop_tracker_notifications');
localStorage.removeItem('streak_milestone_achieved');
// Refresh page
```

### **Level Not Updating?**

**Check:**
1. Add a new task
2. Refresh Profile page
3. Level is based on total task count
4. Check console for level info

### **Animations Not Working?**

**Check:**
1. GSAP library loaded? (check console)
2. Try hard refresh: Ctrl+Shift+R
3. Clear browser cache

---

## 📊 Expected Console Logs

When you log in, you should see:

```
Streak updated: {
  current: 1,
  longest: 1,
  lastLoginDate: "2025-10-21T22:00:00.000Z",
  milestones: []
}
```

On milestone achievement:
```
🎉 Milestone achieved: 7 days!
```

---

## 🎯 Quick Verification Checklist

After implementation, verify:

- [ ] Profile page loads without errors
- [ ] Level badge shows correct level
- [ ] Streak display appears (if streak > 0)
- [ ] Donate button navigates to /donate
- [ ] Share button opens dialog
- [ ] Social buttons open correct URLs
- [ ] Animations play smoothly
- [ ] Responsive on mobile
- [ ] Console shows streak updates on login
- [ ] Notifications appear on milestones

---

## 🚀 Next Steps

1. **Test everything above**
2. **Report any issues you find**
3. **Customize social URLs** (Twitter, Discord)
4. **Deploy and test on production**
5. **Share with users!**

---

## 💡 Tips for Real-World Use

1. **First 7 Days:** Most critical for user retention
2. **Milestones:** Celebrate them with your users
3. **Streak Resets:** Consider adding a "streak freeze" feature later
4. **Levels:** Adjust thresholds based on your user behavior
5. **Notifications:** Don't overdo it - keep them meaningful

---

## 📝 Notes

- Streaks are tracked in **localStorage** (client-side) and **Firestore** (server-side)
- Notifications are stored in **localStorage only**
- Milestone achievements are one-time events
- Streak logic uses 24-hour windows (not calendar days)
- Everything is timezone-aware

---

**Happy Testing! 🎉**

If you encounter any issues or have questions, just let me know!
