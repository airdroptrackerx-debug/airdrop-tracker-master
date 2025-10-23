# 🪂 Airdrop Tracker

> Your Personal Crypto Task Manager - Stay organized, never miss an airdrop!

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://crypto-airdrop-tracker-b546f.web.app)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)](https://firebase.google.com/)

**Live App:** [https://crypto-airdrop-tracker-b546f.web.app](https://crypto-airdrop-tracker-b546f.web.app)

---

## 📖 Table of Contents

- [About](#about)
- [Features](#features)
- [Quick Start](#quick-start)
- [How to Use](#how-to-use)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Security](#security)
- [Contributing](#contributing)
- [Support](#support)
- [License](#license)

---

## 🎯 About

**Airdrop Tracker** is a free, open-source productivity tool designed specifically for crypto airdrop hunters. It helps you organize tasks across multiple airdrop campaigns, track deadlines, monitor progress, and stay motivated throughout your airdrop journey.

### What Problem Does It Solve?

Airdrop hunting can be chaotic:
- Multiple campaigns to track
- Different deadlines to remember
- Tasks scattered across spreadsheets and notes
- Easy to miss opportunities

Airdrop Tracker centralizes everything in one beautiful, intuitive dashboard.

### What It Is NOT

⚠️ **Important:** This is NOT a financial service. We:
- ❌ Never ask for wallet addresses
- ❌ Never request private keys or seed phrases
- ❌ Don't handle any cryptocurrency transactions
- ✅ Are purely a task management tool

---

## ✨ Features

### Core Features

- **📝 Task Management**
  - Create, edit, and delete airdrop tasks
  - Set deadlines for time-sensitive activities
  - Mark tasks as completed with visual feedback
  - Organize multiple airdrop campaigns

- **📊 Progress Tracking**
  - Daily completion statistics
  - Visual progress bars
  - "Next Due" task highlight
  - Completion percentage display

- **💪 Motivational System**
  - Dynamic motivational messages based on completion %
  - 7 different motivation levels (0%, 1-19%, 20-39%, 40-59%, 60-79%, 80-99%, 100%)
  - Keeps you engaged throughout the day

- **👤 User Profiles**
  - Personalized dashboard with name and nickname
  - Achievement badges (Beginner → Intermediate → Veteran → Master)
  - Task statistics and progress tracking
  - Profile customization

### Security Features

- **🔐 Account Security**
  - Password change functionality with current password verification
  - Account deletion with complete data removal
  - Re-authentication required for sensitive operations
  - Password visibility toggles on all password fields

- **🛡️ Data Protection**
  - Firestore security rules (users can only access their own data)
  - User data isolation
  - Secure authentication via Firebase
  - HTTPS encryption

### UI/UX Features

- **🎨 Beautiful Interface**
  - Modern, clean design
  - Dark mode optimized
  - Responsive on all devices (mobile, tablet, desktop)
  - Smooth animations and transitions

- **🎭 Personalization**
  - Welcome banners for new and returning users
  - Personalized greetings using your nickname
  - Badge system based on task completion
  - Custom motivational messages

---

## 🚀 Quick Start

### For Users (Non-Technical)

1. **Visit the App:** [https://crypto-airdrop-tracker-b546f.web.app](https://crypto-airdrop-tracker-b546f.web.app)
2. **Sign Up:** Click "Sign Up" and create an account with:
   - Email address
   - Password (minimum 6 characters)
   - Full name
   - Nickname
3. **Start Tracking:** Add your first airdrop task!
4. **Stay Organized:** Set deadlines, mark tasks complete, track your progress

### For Developers (Local Setup)

#### Prerequisites

- Node.js v16+ and npm
- Firebase account (for deployment)
- Git

#### Installation

```bash
# Clone the repository
git clone <repository-url>
cd airdrop-task-master-main

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Firebase credentials

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📱 How to Use

### Getting Started

#### 1. Create an Account

1. Click **Sign Up** on the login page
2. Enter your details:
   - **Email:** Your email address
   - **Password:** At least 6 characters
   - **Full Name:** Your real name (e.g., "John Doe")
   - **Nickname:** What you want to be called (e.g., "JohnD")
3. Click **Sign Up** to create your account
4. You'll be automatically logged in

#### 2. Add Your First Task

1. Click the **"+" button** or **"Add Task"** button
2. Fill in task details:
   - **Project Name:** Name of the airdrop (e.g., "Starknet Airdrop")
   - **Description:** What you need to do (optional)
   - **Deadline:** When it's due (optional but recommended)
3. Click **"Create Task"**
4. Your task appears in the dashboard!

#### 3. Manage Tasks

**Mark as Complete:**
- Click the checkmark icon on a task card
- Task shows green checkmark and "Completed" status
- Progress bar updates automatically

**Edit a Task:**
- Click the three-dot menu on a task card
- Select **"Edit"**
- Update details and save

**Delete a Task:**
- Click the three-dot menu
- Select **"Delete"**
- Confirm deletion

#### 4. Track Your Progress

**Daily Completion:**
- View "Today's Completion" widget
- Shows X/Y tasks completed
- Visual progress bar

**Next Due Task:**
- Highlighted in "Next Due" widget
- Shows task name and time remaining

**Motivational Messages:**
- Changes based on your completion percentage
- 0%: "Sigh 😒, here we go again!"
- 50%: "🎉 Halfway there! Keep it up!"
- 100%: "You're a real champ my gee! 😎"

### Advanced Features

#### Profile Management

1. Click your profile icon in the navigation
2. View your statistics:
   - Badge level (Beginner → Master)
   - Total projects
   - Completed today
   - Progress to next level

3. **Edit Profile:**
   - Click **"Edit Profile"**
   - Update name or nickname
   - Click **"Save"**

#### Change Password

1. Go to **Profile** page
2. Find **"Security Settings"** card
3. Click **"Change Password"**
4. Enter:
   - Current password
   - New password (min 6 characters)
   - Confirm new password
5. Click **"Change Password"**
6. You'll see a success message

**Note:** You can click the eye icon to show/hide passwords while typing.

#### Delete Account

⚠️ **Warning:** This permanently deletes ALL your data!

1. Go to **Profile** page
2. Find **"Account Management"** card (red border)
3. Click **"Delete Account"**
4. Read the warning carefully
5. Enter your password to confirm
6. Click **"Delete My Account"**
7. Your account and all data will be permanently deleted

This deletes:
- Your profile information
- All your tasks
- All your progress/statistics
- Your authentication account

#### Reset Password (Forgot Password)

1. On the login page, click **"Forgot Password?"**
2. Enter your email address
3. Click **"Send Reset Link"**
4. Check your email for the reset link
5. Click the link and set a new password
6. Return to the app and log in

### Tips & Best Practices

**🎯 Stay Organized:**
- Set deadlines for all tasks
- Check the app daily
- Complete tasks as you go
- Use descriptive task names

**⚡ Maximize Efficiency:**
- Focus on "Next Due" tasks first
- Batch similar tasks together
- Delete completed old tasks regularly
- Aim for 100% completion daily

**🏆 Level Up:**
- Complete 10+ projects → Intermediate badge
- Complete 30+ projects → Veteran badge
- Complete 50+ projects → Master badge

---

## 🛠️ Technology Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide Icons** - Beautiful icon library
- **React Router** - Client-side routing

### Backend & Services

- **Firebase Authentication** - User authentication
- **Firebase Firestore** - NoSQL database
- **Firebase Hosting** - Static site hosting
- **EmailJS** - Contact form email service

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

---

## 📁 Project Structure

```
airdrop-task-master-main/
├── public/                      # Static assets
│   ├── favicon.svg             # App icon (airdrop theme)
│   ├── favicon-coin.svg        # Alternative Bitcoin icon
│   ├── favicon-rocket.svg      # Alternative rocket icon
│   └── robots.txt              # SEO crawler instructions
│
├── src/
│   ├── components/             # React components
│   │   ├── auth/
│   │   │   └── LoginForm.tsx   # Login/signup form
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── ContactForm.tsx     # Contact form modal
│   │   ├── Footer.tsx          # App footer
│   │   ├── MotivationalMessage.tsx  # Dynamic motivation
│   │   ├── Navigation.tsx      # Top navigation bar
│   │   ├── ThemeProvider.tsx   # Dark/light theme
│   │   └── WelcomeBanner.tsx   # User welcome messages
│   │
│   ├── context/                # React Context API
│   │   ├── AuthContext.tsx     # Authentication state
│   │   └── TasksContext.tsx    # Tasks state management
│   │
│   ├── pages/                  # Page components
│   │   ├── Index.tsx           # Home/dashboard page
│   │   ├── Privacy.tsx         # Privacy policy page
│   │   ├── Profile.tsx         # User profile page
│   │   └── NotFound.tsx        # 404 page
│   │
│   ├── types/                  # TypeScript types
│   │   ├── auth.ts             # Authentication types
│   │   ├── task.ts             # Task types
│   │   └── user.ts             # User profile types
│   │
│   ├── lib/
│   │   ├── firebase.ts         # Firebase initialization
│   │   └── utils.ts            # Utility functions
│   │
│   ├── utils/
│   │   └── authUtils.ts        # Auth helper functions
│   │
│   ├── App.tsx                 # Main app component
│   ├── main.tsx                # Entry point
│   └── index.css               # Global styles
│
├── firestore.rules             # Firestore security rules
├── firebase.json               # Firebase configuration
├── .env.example                # Environment variables template
├── index.html                  # HTML template
├── package.json                # Dependencies
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite configuration
│
└── Documentation/
    ├── README.md               # This file
    ├── PROJECT_DOCUMENTATION.md  # Technical manuscript
    ├── DEPLOYMENT_CHECKLIST.md   # Deployment guide
    ├── SECURITY_FEATURES_GUIDE.md  # Security documentation
    ├── PASSWORD_VISIBILITY_FEATURE.md  # Feature docs
    ├── MOTIVATIONAL_MESSAGES.md  # Messages documentation
    ├── FAVICON_OPTIONS.md      # Favicon guide
    ├── DOMAIN_NAME_IDEAS.md    # Domain suggestions
    └── SOCIAL_MEDIA_ANNOUNCEMENT.md  # Marketing copy
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Note:** Never commit `.env` to version control! It's already in `.gitignore`.

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication** → Email/Password provider
3. Create **Firestore Database** in production mode
4. Get your Firebase config from Project Settings
5. Add values to `.env` file

### EmailJS Setup (Optional - for contact form)

1. Create account at [emailjs.com](https://www.emailjs.com/)
2. Add an email service (Gmail recommended)
3. Create an email template
4. Get Service ID, Template ID, and Public Key
5. Add to `.env` file

---

## 🚀 Deployment

### Deploy to Firebase Hosting

#### Prerequisites

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login
```

#### Deployment Steps

```bash
# 1. Deploy Firestore security rules (CRITICAL - do this first!)
firebase deploy --only firestore:rules

# 2. Build production bundle
npm run build

# 3. Deploy to Firebase Hosting
firebase deploy --only hosting

# Or deploy everything at once
firebase deploy
```

#### Verify Deployment

1. Visit your Firebase Hosting URL
2. Test key features:
   - Sign up / Login
   - Create a task
   - Mark task complete
   - Change password
   - Check profile page
3. Verify mobile responsiveness
4. Check browser console for errors

### Deploy to Other Platforms

**Vercel:**
```bash
npm i -g vercel
vercel
```

**Netlify:**
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 🔒 Security

### Firestore Security Rules

The app uses strict security rules:

```javascript
// Users can only read/write their own data
match /users/{userId} {
  allow read, write: if request.auth.uid == userId;
}

// Users can only access their own tasks
match /tasks/{taskId} {
  allow read, write: if request.auth.uid == resource.data.userId;
}
```

### Best Practices Implemented

✅ **Authentication**
- Password minimum 6 characters
- Email verification available
- Secure password reset flow

✅ **Authorization**
- User data isolation
- Role-based access control
- Re-authentication for sensitive actions

✅ **Data Protection**
- HTTPS only
- XSS protection headers
- CSRF protection
- No exposed API keys in client

✅ **Privacy**
- No wallet addresses collected
- No financial information stored
- Clear privacy policy
- User can delete all data

---

## 🤝 Contributing

### How to Contribute

1. **Report Bugs**
   - Use the in-app contact form
   - Describe the issue clearly
   - Include steps to reproduce

2. **Suggest Features**
   - Use the contact form
   - Explain the use case
   - Describe expected behavior

3. **Submit Code**
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Submit a pull request

### Development Guidelines

- Follow existing code style
- Write TypeScript (not JavaScript)
- Add comments for complex logic
- Test on mobile and desktop
- Update documentation if needed

---

## 📞 Support

### Get Help

**In-App Contact Form:**
1. Visit Privacy Policy page
2. Click "Send us a Message"
3. Fill out the form
4. We typically respond within 24 hours

**Email:**
airdrop.tracker.1.0@gmail.com

### FAQ

**Q: Is this app free?**
A: Yes! 100% free forever. No premium tiers, no hidden costs.

**Q: Do you ask for my wallet address?**
A: Never. We don't handle any crypto or financial information.

**Q: Can I use this on mobile?**
A: Yes! Fully responsive on all devices.

**Q: Is my data private?**
A: Yes. You can only see your own tasks. No one else can access your data.

**Q: Can I delete my account?**
A: Yes. Go to Profile → Account Management → Delete Account.

**Q: How do I change my password?**
A: Profile → Security Settings → Change Password.

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

See [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

**Built With:**
- [React](https://react.dev/)
- [Firebase](https://firebase.google.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide Icons](https://lucide.dev/)
- [EmailJS](https://www.emailjs.com/)

**Inspired by:**
The crypto community and the need for better airdrop organization tools.

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **Components:** 30+
- **Pages:** 4
- **Features:** 20+
- **Security Rules:** Implemented
- **Mobile Responsive:** ✅
- **Dark Mode:** ✅
- **PWA Ready:** ✅

---

## 🗺️ Roadmap

### Planned Features

- [ ] Task categories/tags
- [ ] Calendar view
- [ ] Task reminders via email
- [ ] Export tasks to CSV
- [ ] Dark/light theme toggle in UI
- [ ] Multiple task lists
- [ ] Task notes/attachments
- [ ] Search and filter tasks
- [ ] Task templates
- [ ] Mobile app (React Native)

### Future Enhancements

- [ ] Multi-language support
- [ ] Task collaboration (share with friends)
- [ ] Integration with Discord/Telegram
- [ ] Airdrop discovery feed
- [ ] Community features

---

## 📈 Changelog

### v1.0.0 (Current)

**Features:**
- Task management (create, edit, delete, complete)
- User authentication (sign up, login, password reset)
- Profile management with badges
- Progress tracking and statistics
- Motivational messages system
- Password change functionality
- Account deletion
- Password visibility toggles
- Mobile responsive design
- Dark mode support
- Contact form
- Privacy policy page

**Security:**
- Firestore security rules
- User data isolation
- Re-authentication for sensitive operations
- HTTPS encryption
- Security headers

---

<div align="center">

**Made with ❤️ for the Crypto Community**

🪂 Track Every Drop | 🎯 Never Miss an Opportunity | 💪 Stay Organized

[Live App](https://crypto-airdrop-tracker-b546f.web.app) • [Report Bug](https://crypto-airdrop-tracker-b546f.web.app/privacy) • [Request Feature](https://crypto-airdrop-tracker-b546f.web.app/privacy)

⭐ Star this repo if you find it helpful!

</div>
