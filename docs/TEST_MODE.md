# 🧪 Test Mode Documentation

## What is Test Mode?

Test Mode is a development feature that allows you to test new components and functionality without affecting the main application flow. When enabled, it replaces the entire app with a test component.

---

## 🚀 How to Enable Test Mode

### 1. Edit your `.env` file:

```bash
# Change this line from false to true
VITE_ENABLE_TEST_MODE=true
```

### 2. Restart the development server:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### 3. Verify Test Mode is Active

You should see:
- 🧪 A red banner at the top saying "TEST MODE ACTIVE"
- The test component loaded instead of the normal app
- Console message: "Test Mode Enabled"

---

## 🔧 What Gets Tested?

Currently, Test Mode loads the **DailyProgressTest** component, which tests:

### ✅ Daily Progress Hook (`useDailyProgress`)
- Load today's stats
- Increment words learned
- Complete practice sessions
- Update daily goal
- Progress percentage calculation
- Goal achievement detection

### ✅ Streak Hook (`useStreak`)
- Load streak data
- Mark today as active
- Streak status (hot/warm/cold)
- Milestone checking (7, 14, 30, 100 days)
- Longest streak tracking

### ✅ Stats History Hook (`useStatsHistory`)
- Load historical data
- Week summary calculation
- Month summary calculation
- Total stats (all-time words, active days)

---

## 🎮 Testing Instructions

### Interactive Buttons

1. **"+5 Words"** - Adds 5 words to today's count
2. **"Complete Session"** - Simulates a practice session completion
3. **"Change Goal"** - Opens prompt to change daily goal
4. **"Mark Today Active"** - Updates streak data

### What to Check

#### Demo Mode Testing:
1. Click "+5 Words" multiple times → Check `wordsLearned` increases
2. Click "Complete Session" → Check `practiceSessionsCompleted` increases
3. Click "Change Goal" → Set new goal (e.g., 15) → Check if goal reflects
4. Click "Mark Today Active" → Check streak increments
5. Open DevTools → Application → Local Storage → Check `demoStats` key
6. Refresh page (F5) → Verify data persists

#### Firebase Mode Testing (if configured):
1. Sign in with Google
2. Repeat steps 1-4 above
3. Open Firebase Console → Firestore
4. Check documents exist:
   - `users/{userId}/stats/{today-date}`
   - `users/{userId}/streaks/current`
   - `users/{userId}/settings/preferences`
5. Refresh page → Verify data loads from Firebase

---

## 📊 Expected Results

### Daily Progress Card
```
🎯 Daily Progress
Today's Words: 15
Daily Goal: 10
Progress: 150%
Remaining: 0 words
Goal Achieved: ✅ Yes
Sessions: 2
Time Spent: 11 min
```

### Streak Card
```
🔥 Streak
Current Streak: 5 🔥
Longest Streak: 12
Total Active Days: 45
Status: 🔥 Hot
Today Active: ✅ Yes
Next Milestone: Two Week Champion (9 days)
Milestones: 7️⃣ 🔥 🏆 💯
```

### History & Stats
```
📈 History & Stats
Total Days Tracked: 7
Active Days: 5
Total Words (All Time): 85

This Week:
Words This Week: 65
Time This Week: 42.5 min
Days Active: 5/7
Avg Words/Day: 13
```

---

## ❌ How to Disable Test Mode

### 1. Edit your `.env` file:

```bash
# Change this line from true to false
VITE_ENABLE_TEST_MODE=false
```

### 2. Restart the development server:

```bash
# Stop and restart
npm run dev
```

### 3. Verify Normal Mode

You should see:
- ❌ No red test mode banner
- ✅ Normal app interface
- ✅ Login screen if not authenticated

---

## 🐛 Troubleshooting

### Test Mode won't enable

**Problem:** Changed `.env` to `true` but app still shows normal interface.

**Solutions:**
1. **Restart dev server** - Changes to `.env` require server restart
2. **Check syntax** - Make sure it's exactly `VITE_ENABLE_TEST_MODE=true` (no quotes, no spaces)
3. **Clear cache** - Run `npm run dev` with `--force` flag
4. **Check console** - Look for "Test Mode Enabled" message

### Data not persisting

**Problem:** Test data resets on page refresh.

**Solutions:**
1. **Demo Mode:** Check browser's Local Storage isn't being cleared
2. **Firebase Mode:** Verify Firebase configuration in `.env`
3. **Check console** for save errors

### Firebase not working

**Problem:** Firebase mode shows errors in console.

**Solutions:**
1. Verify Firebase config in `.env` is correct
2. Check Firestore rules allow read/write
3. Ensure user is authenticated
4. Check Firebase Console for quota limits

---

## 🔐 Security Note

**⚠️ NEVER commit `.env` with `VITE_ENABLE_TEST_MODE=true` to production!**

Test Mode is for **development only**. Always ensure:
- `.env` is in `.gitignore`
- Production builds have `VITE_ENABLE_TEST_MODE=false`
- Test components are not included in production bundle

---

## 📁 File Structure

```
src/
├── components/
│   └── Test/
│       └── DailyProgressTest.jsx    # Main test component
├── hooks/
│   ├── useDailyProgress.js          # Tested hook
│   ├── useStreak.js                 # Tested hook
│   └── useStatsHistory.js           # Tested hook
├── utils/
│   └── demoStatsHelper.js           # Demo mode storage
└── services/
    └── firebase.js                   # Firebase functions
```

---

## 🎯 Next Steps After Testing

Once testing is complete and everything works:

1. Set `VITE_ENABLE_TEST_MODE=false`
2. Restart dev server
3. Proceed to Phase 2: UI Components
4. Build actual UI using tested hooks

---

## 💡 Tips

- **Use Chrome DevTools** - Network tab for Firebase calls, Application tab for localStorage
- **Test both modes** - Demo and Firebase should work identically
- **Check raw data** - Expand the "Raw Data (Developer)" section for JSON inspection
- **Test persistence** - Always refresh to ensure data saves correctly
- **Reset demo data** - Clear localStorage to start fresh: `localStorage.clear()`

---

**Happy Testing! 🚀**
