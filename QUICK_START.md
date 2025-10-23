# 🚀 Quick Start - Social Auth & reCAPTCHA

## What You Need To Do RIGHT NOW:

### 1️⃣ Add reCAPTCHA Site Key to .env

Open your `.env` file and add this line:

```env
VITE_RECAPTCHA_SITE_KEY=your_site_key_here
```

**Where to get it:**
1. Go to: https://www.google.com/recaptcha/admin
2. If you haven't created a site yet:
   - Click "+ Create" or "+"
   - Label: `Airdrop Tracker`
   - Type: reCAPTCHA v3
   - Domains: `localhost`, `crypto-airdrop-tracker-b546f.web.app`
   - Submit
3. Copy the **Site Key** (starts with `6L...`)
4. Paste it in your `.env` file

### 2️⃣ Enable Google Sign-In in Firebase

1. Go to: https://console.firebase.google.com
2. Select your project: `crypto-airdrop-tracker-b546f`
3. Click **Authentication** → **Sign-in method**
4. Click **Add new provider** → **Google**
5. Toggle **Enable** to ON
6. Choose your support email
7. Click **Save**

✅ **That's it for Google! It's ready to use.**

### 3️⃣ Enable Twitter Sign-In (Optional but Recommended)

1. Go to: https://developer.twitter.com/en/portal/dashboard
2. Create a project and app (if you haven't)
3. Get your **API Key** and **API Secret**
4. In Firebase Console:
   - Authentication → Sign-in method
   - Add new provider → Twitter
   - Enable and paste your Twitter API credentials
   - Copy the callback URL and add it to Twitter app settings

### 4️⃣ Restart Your Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ Test It Out!

1. Open http://localhost:5173
2. You should see **3 social login buttons** (Google, Apple, Twitter icons)
3. Try signing up with Google - it should work!
4. Check that the welcome banner says "Welcome aboard, [YourName]!"

---

## 📚 Need More Details?

- **Full Setup Guide:** See `SOCIAL_AUTH_SETUP_GUIDE.md`
- **Testing Guide:** See `IMPLEMENTATION_TESTING_GUIDE.md`
- **Troubleshooting:** Check the "Common Issues" section in testing guide

---

## 🆘 Quick Troubleshooting

**"reCAPTCHA not loaded"**
→ Make sure you added `VITE_RECAPTCHA_SITE_KEY` to `.env` and restarted server

**"Popup was blocked"**
→ Allow popups in your browser settings for localhost

**Google Sign-In doesn't work**
→ Make sure you enabled Google provider in Firebase Console

**TypeScript errors**
→ Run `npm install` and restart your IDE

---

## 🎯 What's Implemented

✅ Google Sign-In  
✅ Apple Sign-In (needs Apple Developer account)  
✅ Twitter/X Sign-In  
✅ reCAPTCHA v3 bot protection  
✅ Welcome banners (already working!)  
✅ Beautiful UI with social buttons  
✅ Loading states and error handling  

**You're all set!** 🎉
