# ⚡ Quick Deploy Commands - Airdrop Tracker

**Copy-paste these commands for instant deployment!**

---

## 🚀 **Deploy to Production**

```bash
# 1. Install dependencies (clean)
npm ci

# 2. Build for production
npm run build

# 3. Test build locally
npm run preview

# 4. Deploy to Firebase
firebase deploy

# OR deploy only hosting
firebase deploy --only hosting
```

---

## 🔥 **Firebase Commands**

```bash
# Login to Firebase
firebase login

# Initialize Firebase in project
firebase init

# Deploy everything
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes

# View deployment history
firebase hosting:channel:list

# Rollback (via console)
# Go to: https://console.firebase.google.com → Hosting → Rollback
```

---

## 🧪 **Testing Commands**

```bash
# Run development server
npm run dev

# Build and preview production
npm run build && npm run preview

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .
```

---

## 📦 **Dependency Management**

```bash
# Update all dependencies
npm update

# Check for outdated packages
npm outdated

# Install specific package
npm install package-name

# Remove package
npm uninstall package-name
```

---

## 🔐 **Environment Setup**

**Create `.env` file:**

```bash
# Firebase
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_here
VITE_FIREBASE_STORAGE_BUCKET=your_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here

# reCAPTCHA
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_key_here

# EmailJS (optional)
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

---

## 📊 **Useful Links**

### **Firebase Console:**

- Project: https://console.firebase.google.com
- Authentication: https://console.firebase.google.com/project/_/authentication
- Firestore: https://console.firebase.google.com/project/_/firestore
- Hosting: https://console.firebase.google.com/project/_/hosting

### **Testing Tools:**

- Lighthouse: https://pagespeed.web.dev/
- Facebook Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

### **Analytics:**

- Google Analytics: https://analytics.google.com

---

## 🆘 **Quick Fixes**

### **If build fails:**

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **If Firebase deploy fails:**

```bash
firebase logout
firebase login
firebase use --add
firebase deploy
```

### **If Firestore rules error:**

```bash
firebase deploy --only firestore:rules
```

### **If indexes error:**

```bash
firebase deploy --only firestore:indexes
```

---

## 🎯 **One-Command Deploy**

```bash
npm ci && npm run build && firebase deploy
```

**That's it! Your app is live!** 🎉

---

_Quick reference for Airdrop Tracker deployment_
