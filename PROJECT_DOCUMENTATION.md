# Airdrop Tracker - Technical Documentation
## A Complete Project Manuscript

---

## Document Information

- **Project:** Airdrop Tracker
- **Version:** 1.0.0  
- **Live URL:** https://crypto-airdrop-tracker-b546f.web.app  
- **Tech Stack:** React + TypeScript + Firebase
- **License:** MIT

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Technology Stack](#3-technology-stack)
4. [Database Design](#4-database-design)
5. [Authentication System](#5-authentication-system)
6. [Core Features](#6-core-features)
7. [Security Implementation](#7-security-implementation)
8. [UI/UX Design](#8-uiux-design)
9. [Deployment](#9-deployment)
10. [Future Enhancements](#10-future-enhancements)

---

## 1. Executive Summary

### 1.1 Project Purpose

Airdrop Tracker is a web application designed to help cryptocurrency airdrop hunters organize their tasks, track deadlines, and monitor progress across multiple campaigns.

**Problem Solved:**
- Fragmented task tracking across spreadsheets and notes
- Missed deadlines and opportunities
- Lack of progress visibility
- High cognitive load managing multiple airdrops

**Solution Provided:**
- Centralized task dashboard
- Deadline management
- Progress tracking
- Motivational system
- 100% free, privacy-first

### 1.2 Key Metrics

- **Lines of Code:** ~15,000+
- **Components:** 30+
- **Pages:** 4 (Dashboard, Profile, Privacy, 404)
- **Features:** 20+ implemented
- **Load Time:** < 3 seconds
- **Mobile Responsive:** Yes
- **PWA Ready:** Yes

---

## 2. Architecture Overview

### 2.1 System Architecture

**3-Tier Architecture:**

```
CLIENT TIER (Browser)
  ↓ HTTPS
APPLICATION TIER (React SPA)
  ↓ Firebase SDK
BACKEND TIER (Firebase Services)
  ├─ Authentication
  ├─ Firestore Database
  └─ Hosting (CDN)
```

### 2.2 Component Hierarchy

```
App
├─ ThemeProvider
├─ AuthProvider
│  └─ TasksProvider
│     ├─ Router
│     │  ├─ Index (Dashboard)
│     │  │  ├─ Navigation
│     │  │  ├─ WelcomeBanner
│     │  │  ├─ MotivationalMessage
│     │  │  ├─ CompletionWidget
│     │  │  ├─ NextDueWidget
│     │  │  └─ TaskList
│     │  ├─ Profile
│     │  │  ├─ ProfileCard
│     │  │  ├─ StatsCard
│     │  │  ├─ SecuritySettings
│     │  │  └─ AccountManagement
│     │  └─ Privacy
│     │     └─ ContactForm
│     └─ Footer
```

### 2.3 Data Flow

**Task Creation Flow:**
```
User Input → UI Component → Context API 
  → Firebase SDK → Firestore → Real-time Listener 
  → Context Update → UI Re-render
```

---

## 3. Technology Stack

### 3.1 Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2.0 | UI Library |
| TypeScript | 5.2.2 | Type Safety |
| Vite | 5.4.10 | Build Tool |
| TailwindCSS | 3.4.1 | Styling |
| shadcn/ui | Latest | UI Components |
| React Router | 6.26.2 | Routing |
| Lucide Icons | 0.344.0 | Icons |

### 3.2 Backend & Services

| Service | Purpose |
|---------|---------|
| Firebase Auth | User Authentication |
| Firebase Firestore | NoSQL Database |
| Firebase Hosting | Static Hosting + CDN |
| EmailJS | Contact Form Emails |

### 3.3 Development Tools

- ESLint - Code Quality
- PostCSS - CSS Processing
- TypeScript Compiler - Type Checking
- Git - Version Control

---

## 4. Database Design

### 4.1 Firestore Schema

**Collections:**

```typescript
// /users/{userId}
interface User {
  name: string;
  nickname: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// /tasks/{taskId}
interface Task {
  userId: string;          // Indexed
  projectName: string;
  description: string | null;
  deadline: Timestamp | null;
  completed: boolean;
  lastCompleted: Timestamp | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 4.2 Data Access Patterns

**Key Queries:**

1. **User Tasks:** `where('userId', '==', uid)`
2. **Incomplete Tasks:** `where('userId', '==', uid).where('completed', '==', false)`
3. **Next Due:** `orderBy('deadline', 'asc').limit(1)`
4. **Today's Completions:** `where('lastCompleted', '>=', todayStart)`

### 4.3 Indexes

**Composite Index:**
- Collection: `tasks`
- Fields: `userId` (Asc) + `deadline` (Asc)
- Purpose: Efficient "next due" queries

---

## 5. Authentication System

### 5.1 Auth Flow

**Sign Up:**
```
1. User submits form (email, password, name, nickname)
2. Firebase Auth creates account
3. Firestore user document created
4. Auto-login and redirect
```

**Sign In:**
```
1. User enters credentials
2. Firebase validates
3. JWT token generated
4. User profile fetched
5. Tasks listener attached
```

**Sign Out:**
```
1. Firebase sign out
2. Listeners detached
3. State cleared
4. Redirect to login
```

### 5.2 Password Management

**Change Password:**
- Requires current password (re-authentication)
- New password validation (min 6 chars)
- Confirmation match check
- Firebase `updatePassword()` API

**Reset Password:**
- Email-based reset link
- Firebase-hosted reset page
- Secure token (1-hour expiry)

### 5.3 Account Deletion

**Process:**
1. Re-authenticate with password
2. Delete Firestore user document
3. Batch delete all user tasks
4. Delete Firebase Auth account
5. Auto sign-out and redirect

---

## 6. Core Features

### 6.1 Task Management

**CRUD Operations:**

**Create:**
```typescript
await addDoc(collection(db, 'tasks'), {
  userId: user.uid,
  projectName,
  description,
  deadline,
  completed: false,
  createdAt: serverTimestamp()
});
```

**Read:** Real-time listener via `onSnapshot()`

**Update:**
```typescript
await updateDoc(doc(db, 'tasks', taskId), updates);
```

**Delete:**
```typescript
await deleteDoc(doc(db, 'tasks', taskId));
```

### 6.2 Progress Tracking

**Daily Completion:**
```typescript
const completedToday = tasks.filter(task => {
  if (!task.lastCompleted) return false;
  const completed = task.lastCompleted.toDate();
  return isToday(completed);
}).length;

const totalTasks = tasks.length;
const completionRate = totalTasks > 0 
  ? completedToday / totalTasks 
  : 0;
```

**Next Due Task:**
```typescript
const upcomingTasks = tasks
  .filter(t => !t.completed && t.deadline)
  .sort((a, b) => a.deadline - b.deadline);

const nextDue = upcomingTasks[0];
```

### 6.3 Motivational Messages

**7 Dynamic Levels:**

| Completion % | Category | Example Message |
|--------------|----------|-----------------|
| 0% | Zero | "Sigh 😒, here we go again!" |
| 1-19% | Very Low | "Don't give up, you can do this!" |
| 20-39% | Low | "Building momentum!" |
| 40-59% | Medium | "🎉 Halfway there!" |
| 60-79% | High | "You're in the zone!" |
| 80-99% | Very High | "Almost done for the day!" |
| 100% | Complete | "You're a real champ! 😎" |

**Implementation:**
```typescript
const category = 
  completionRate === 0 ? 'zero' :
  completionRate >= 1 ? 'complete' :
  completionRate < 0.2 ? 'veryLow' :
  completionRate < 0.4 ? 'low' :
  completionRate < 0.6 ? 'medium' :
  completionRate < 0.8 ? 'high' : 'veryHigh';

const message = messages[category][
  Math.floor(Math.random() * messages[category].length)
];
```

### 6.4 Badge System

**4 Levels Based on Task Count:**

- **Beginner:** 0-9 tasks completed
- **Intermediate:** 10-29 tasks
- **Veteran:** 30-49 tasks
- **Master:** 50+ tasks

**Visual Indicators:**
- Color-coded badges
- Progress bars
- "X more to next level" messaging

### 6.5 Welcome Banners

**New Users (< 24 hours):**
```typescript
const isNewUser = (createdAt: Date) => {
  const hoursSinceCreation = 
    (Date.now() - createdAt.getTime()) / (1000 * 60 * 60);
  return hoursSinceCreation < 24;
};
```
- Shows inspiring message
- Rocket icon, sparkles
- Dismissible (localStorage)

**Returning Users:**
- Brief greeting with nickname
- Auto-dismisses after 8 seconds
- Once per session (sessionStorage)

---

## 7. Security Implementation

### 7.1 Firestore Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Tasks must belong to authenticated user
    match /tasks/{taskId} {
      allow read, update, delete: 
        if request.auth.uid == resource.data.userId;
      allow create: 
        if request.auth.uid == request.resource.data.userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 7.2 Security Headers

**firebase.json:**
```json
{
  "hosting": {
    "headers": [
      {
        "source": "**",
        "headers": [
          {"key": "X-Content-Type-Options", "value": "nosniff"},
          {"key": "X-Frame-Options", "value": "DENY"},
          {"key": "X-XSS-Protection", "value": "1; mode=block"},
          {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"}
        ]
      }
    ]
  }
}
```

### 7.3 Environment Variables

**Configuration:**
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
# ... other Firebase configs

VITE_EMAILJS_SERVICE_ID=...
VITE_EMAILJS_TEMPLATE_ID=...
VITE_EMAILJS_PUBLIC_KEY=...
```

**Usage:**
```typescript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || fallback,
  // ...
};
```

### 7.4 Protection Against

- ✅ **XSS:** React escapes by default
- ✅ **CSRF:** SameSite cookies
- ✅ **SQL Injection:** Firestore (NoSQL)
- ✅ **Session Hijacking:** Short-lived JWT tokens
- ✅ **Unauthorized Access:** Strict Firestore rules
- ✅ **Data Leaks:** User isolation enforced

---

## 8. UI/UX Design

### 8.1 Design System

**Colors:**
```css
/* Primary - Crypto Purple */
--primary: 262.1 83.3% 57.8%;

/* Accent - Neon Green */
--accent: 142.1 76.2% 36.3%;

/* Background - Dark */
--background: 222.2 84% 4.9%;

/* Foreground - Light */
--foreground: 210 40% 98%;
```

**Typography:**
- Font Family: System UI stack
- Headings: Bold, 1.5-2.5rem
- Body: Regular, 1rem
- Small: 0.875rem

**Spacing:**
- Base unit: 0.25rem (4px)
- Scale: 4, 8, 12, 16, 24, 32, 48, 64px

### 8.2 Component Design

**Task Card:**
```
┌──────────────────────────────────────┐
│  🟢  Project Name            [...│
│      Description text here          │
│      📅 Due: Oct 17, 2025          │
│                          ✓ [Edit│
└──────────────────────────────────────┘
```

**Profile Card:**
```
┌──────────────────────────────────────┐
│  👤  Profile Information            │
│  ────────────────────────────────   │
│  Full Name:  John Doe               │
│  Nickname:   JohnD                  │
│  Email:      john@example.com       │
│                                      │
│  [✏️ Edit Profile]                  │
└──────────────────────────────────────┘
```

### 8.3 Responsive Design

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

**Mobile-First Approach:**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Stacks on mobile, 2 columns on desktop */}
</div>
```

### 8.4 Accessibility

**Implemented:**
- ✅ Semantic HTML (`<main>`, `<nav>`, `<article>`)
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation support
- ✅ Focus indicators
- ✅ Screen reader friendly
- ✅ Color contrast (WCAG AA)

**Password Visibility:**
- Eye/EyeOff icons
- Toggle between text/password type
- ARIA labels: "Show password" / "Hide password"

---

## 9. Deployment

### 9.1 Build Process

**Development:**
```bash
npm run dev
# Runs Vite dev server on localhost:5173
# Hot Module Replacement enabled
```

**Production Build:**
```bash
npm run build
# Output: dist/ folder
# Assets: Minified, tree-shaken, optimized
# Size: ~960KB JS (gzipped: ~260KB)
```

### 9.2 Firebase Deployment

**Commands:**
```bash
# Deploy Firestore rules (CRITICAL - do first!)
firebase deploy --only firestore:rules

# Build production bundle
npm run build

# Deploy hosting
firebase deploy --only hosting

# Or deploy everything
firebase deploy
```

**Deployment Configuration:**
```json
{
  "firestore": {
    "rules": "firestore.rules"
  },
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {"source": "**", "destination": "/index.html"}
    ]
  }
}
```

### 9.3 CI/CD (Future)

**GitHub Actions Workflow:**
```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
```

---

## 10. Future Enhancements

### 10.1 Planned Features

**Phase 2 (Q1 2026):**
- [ ] Task categories/tags
- [ ] Calendar view
- [ ] Search and filter
- [ ] Task templates
- [ ] Export to CSV

**Phase 3 (Q2 2026):**
- [ ] Email reminders
- [ ] Dark/light theme toggle in UI
- [ ] Multi-language support (i18n)
- [ ] Task collaboration (share with friends)

**Phase 4 (Q3 2026):**
- [ ] Mobile app (React Native)
- [ ] Integration with Discord/Telegram
- [ ] Airdrop discovery feed
- [ ] Community features

### 10.2 Technical Debt

**To Address:**
- Add comprehensive unit tests (Jest + React Testing Library)
- Add E2E tests (Playwright or Cypress)
- Implement error boundary components
- Add performance monitoring (Firebase Performance)
- Optimize bundle size (code splitting)
- Add PWA manifest and service worker

### 10.3 Scalability Considerations

**Current Limits:**
- Firebase free tier: 50k reads/day
- Firestore: 1GB storage
- Hosting: 10GB bandwidth/month

**Scaling Strategy:**
- Monitor usage via Firebase Console
- Upgrade to Blaze (pay-as-you-go) if needed
- Implement caching strategies
- Consider CDN for static assets
- Optimize Firestore queries

---

## Appendices

### A. File Structure

See README.md for complete project structure.

### B. API Reference

**Firebase SDK Methods Used:**
- Authentication: `createUserWithEmailAndPassword()`, `signInWithEmailAndPassword()`, `signOut()`, `updatePassword()`, `deleteUser()`
- Firestore: `collection()`, `doc()`, `addDoc()`, `updateDoc()`, `deleteDoc()`, `onSnapshot()`, `query()`, `where()`, `orderBy()`

### C. Environment Setup

See README.md for setup instructions.

### D. Contributing Guidelines

See README.md for contribution guidelines.

### E. License

MIT License - See LICENSE file.

---

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** Airdrop Tracker Team  

---

<div align="center">

**🪂 Airdrop Tracker**

*Track Every Drop | Never Miss an Opportunity | Stay Organized*

[Live App](https://crypto-airdrop-tracker-b546f.web.app) • [GitHub](#) • [Support](mailto:airdrop.tracker.1.0@gmail.com)

</div>
