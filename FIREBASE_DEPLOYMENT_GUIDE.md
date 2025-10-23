# Firebase Hosting Deployment Guide

## 🎯 Quick Start Deployment

Your app is already configured! Follow these steps:

### 1️⃣ Install Firebase Tools (First Time Only)

```bash
npm install -g firebase-tools
```

### 2️⃣ Login to Firebase (First Time Only)

```bash
firebase login
```

This will open your browser to authenticate with Google.

### 3️⃣ Deploy Your App

**Option A - Deploy Everything (Hosting + Firestore Rules):**
```bash
npm run deploy
```

**Option B - Deploy Only Hosting:**
```bash
npm run deploy:hosting
```

**Manual Deployment:**
```bash
# Build the app
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

---

## 📋 What's Already Configured

✅ **Firebase Project:** `crypto-airdrop-tracker-b546f`  
✅ **Hosting Folder:** `dist` (Vite build output)  
✅ **Routing:** Single-page app routing enabled  
✅ **Security Headers:** X-Content-Type-Options, X-Frame-Options, etc.  
✅ **Firestore Rules:** Configured in `firestore.rules`

---

## 🌐 Your Live URLs

After deployment, your app will be available at:

- **Primary:** `https://crypto-airdrop-tracker-b546f.web.app`
- **Alternative:** `https://crypto-airdrop-tracker-b546f.firebaseapp.com`

---

## 🔄 Redeployment

Whenever you make changes:

```bash
npm run deploy
```

This will:
1. Build your React app
2. Upload to Firebase Hosting
3. Your changes go live in ~30 seconds!

---

## 🎨 Custom Domain (Optional)

To add a custom domain (e.g., `airdrops.com`):

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `crypto-airdrop-tracker-b546f`
3. Go to **Hosting** → **Add custom domain**
4. Follow the DNS configuration steps

---

## 🚀 Deployment Commands Summary

| Command | Description |
|---------|-------------|
| `npm run build` | Build the production app |
| `npm run deploy` | Build + Deploy everything |
| `npm run deploy:hosting` | Build + Deploy only hosting |
| `firebase deploy --only hosting` | Deploy only hosting (no build) |
| `firebase hosting:channel:deploy preview` | Deploy to preview channel |

---

## 📊 Monitor Your App

**Firebase Console:** https://console.firebase.google.com/project/crypto-airdrop-tracker-b546f

Monitor:
- 📈 Page views & performance
- 👥 Active users
- 🌍 Geographic distribution
- 🐛 Crash reports

---

## 🔍 Troubleshooting

### Problem: "Firebase command not found"
**Solution:** Install Firebase tools globally
```bash
npm install -g firebase-tools
```

### Problem: "Error: Not authorized"
**Solution:** Login to Firebase
```bash
firebase login
```

### Problem: "Build failed"
**Solution:** Check for TypeScript/ESLint errors
```bash
npm run build
```

### Problem: "Old version still showing"
**Solution:** Hard refresh browser
- Windows: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

---

## ⚡ Advanced: Preview Deployments

Test changes before going live:

```bash
# Deploy to preview channel
firebase hosting:channel:deploy preview

# Deploy specific version
firebase hosting:channel:deploy staging
```

---

## 🎉 That's It!

Your app is ready to deploy. Run:

```bash
npm run deploy
```

And you're live! 🚀
