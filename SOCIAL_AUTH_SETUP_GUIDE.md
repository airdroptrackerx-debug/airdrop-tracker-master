# 🔐 Social Authentication & CAPTCHA Setup Guide

## Part 1: Firebase Console Configuration

### 1.1 Enable Google Sign-In

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com
   - Select your project: `crypto-airdrop-tracker-b546f`

2. **Navigate to Authentication**
   - Click "Authentication" in left sidebar
   - Click "Sign-in method" tab

3. **Enable Google Provider**
   - Click "Add new provider"
   - Select "Google"
   - Toggle "Enable" to ON
   - **Project support email**: Choose your email from dropdown
   - Click "Save"

   ✅ **That's it for Google! No additional configuration needed.**

---

### 1.2 Enable Apple Sign-In

⚠️ **Requirements:**
- Apple Developer Account ($99/year)
- Registered bundle ID/service ID

**Steps:**

1. **Apple Developer Portal Setup**
   - Go to: https://developer.apple.com/account
   - Navigate to "Certificates, Identifiers & Profiles"
   
2. **Create Service ID**
   - Click "Identifiers" → "+" button
   - Select "Services IDs" → Continue
   - **Description**: `Airdrop Tracker Web`
   - **Identifier**: `com.airdroptracker.web` (must be unique)
   - Click "Continue" → "Register"

3. **Configure Service ID**
   - Select your new Service ID
   - Enable "Sign in with Apple"
   - Click "Configure" button next to it
   
4. **Add Web Domain and Return URLs**
   - **Primary App ID**: Select your app bundle ID
   - **Website URLs**:
     - **Domains**: `crypto-airdrop-tracker-b546f.web.app`
     - **Return URLs**: `https://crypto-airdrop-tracker-b546f.firebaseapp.com/__/auth/handler`
   - Click "Save" → "Continue" → "Register"

5. **Create Private Key**
   - Go to "Keys" → Click "+" button
   - **Key Name**: `AirdropTracker SignIn Key`
   - Enable "Sign in with Apple"
   - Click "Configure" → Select your Service ID → "Save"
   - Click "Continue" → "Register"
   - **Download the .p8 file** (you can only download once!)
   - **Save the Key ID** shown on screen

6. **Firebase Console Setup**
   - Go back to Firebase Console → Authentication → Sign-in method
   - Click "Add new provider" → "Apple"
   - Toggle "Enable" to ON
   - **Service ID**: `com.airdroptracker.web` (from step 2)
   - **Apple Team ID**: Found in Apple Developer Account (top right)
   - **Key ID**: From step 5
   - **Private Key**: Open the .p8 file in text editor, copy contents
   - Click "Save"

---

### 1.3 Enable Twitter/X Sign-In

**Steps:**

1. **Create Twitter Developer Account**
   - Go to: https://developer.twitter.com/en/portal/dashboard
   - Sign in with your Twitter/X account
   - Apply for "Elevated" access (free tier works)

2. **Create a New App**
   - Click "Projects & Apps" → "Overview"
   - Click "+ Create Project"
   - **Project Name**: `Airdrop Tracker`
   - **Use Case**: Select appropriate option
   - **Project Description**: "Crypto airdrop task management app"
   - Click "Next" through the steps

3. **Create App**
   - Click "+ Add App" in your project
   - **App Name**: `Airdrop Tracker Web`
   - **Environment**: Production
   - Click "Complete"

4. **Configure App Settings**
   - Click "App Settings" (gear icon)
   - Scroll to "User authentication settings"
   - Click "Set up"

5. **OAuth 2.0 Settings**
   - **App permissions**: Select "Read" (minimum required)
   - **Type of App**: Web App
   - **App info**:
     - **Callback URI / Redirect URL**: 
       ```
       https://crypto-airdrop-tracker-b546f.firebaseapp.com/__/auth/handler
       ```
     - **Website URL**: `https://crypto-airdrop-tracker-b546f.web.app`
     - **Organization name**: Your name
     - **Organization URL**: Your website or same as above
     - **Terms of service**: Link to your privacy page
     - **Privacy policy**: `https://crypto-airdrop-tracker-b546f.web.app/privacy`
   - Click "Save"

6. **Get API Credentials**
   - Go to "Keys and tokens" tab
   - **API Key**: Copy and save securely
   - **API Secret Key**: Copy and save securely
   - If not visible, regenerate them

7. **Firebase Console Setup**
   - Go to Firebase Console → Authentication → Sign-in method
   - Click "Add new provider" → "Twitter"
   - Toggle "Enable" to ON
   - **API Key**: Paste Twitter API Key
   - **API Secret**: Paste Twitter API Secret Key
   - **Callback URL**: Copy this URL and add it to Twitter if not already done
   - Click "Save"

---

## Part 2: Google reCAPTCHA v3 Setup

### 2.1 Register Site with reCAPTCHA

1. **Go to reCAPTCHA Admin Console**
   - Visit: https://www.google.com/recaptcha/admin
   - Sign in with your Google account

2. **Create a New Site**
   - Click "+ Add" button or "Create"
   - **Label**: `Airdrop Tracker`
   - **reCAPTCHA type**: Select "reCAPTCHA v3"
   
3. **Add Domains**
   - Add these domains:
     ```
     localhost
     crypto-airdrop-tracker-b546f.web.app
     crypto-airdrop-tracker-b546f.firebaseapp.com
     ```
   - (Add your custom domain if you have one)

4. **Owner**
   - Should be your email (already filled)

5. **Accept Terms**
   - ✅ Check "Accept the reCAPTCHA Terms of Service"
   - ✅ Check "Send alerts to owners" (recommended)
   - Click "Submit"

6. **Copy Keys**
   After creation, you'll see:
   - ✅ **Site Key**: Copy this (starts with `6L...`)
   - ✅ **Secret Key**: Copy this (starts with `6L...`)

   **Save both keys securely! You'll need them in the next step.**

### 2.2 Important Notes

**reCAPTCHA v3:**
- Runs in background (no user interaction needed)
- Returns a score (0.0 - 1.0)
- Score > 0.5 = likely human
- Score < 0.5 = likely bot

**Security:**
- ❌ Never expose Secret Key in client code
- ✅ Secret Key should only be used server-side
- ✅ Site Key is safe to use in frontend

---

## Part 3: Update Your .env File

After completing the above steps, update your `.env` file:

```env
# Existing Firebase Configuration
VITE_FIREBASE_API_KEY=your_existing_api_key
VITE_FIREBASE_AUTH_DOMAIN=crypto-airdrop-tracker-b546f.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=crypto-airdrop-tracker-b546f
VITE_FIREBASE_STORAGE_BUCKET=crypto-airdrop-tracker-b546f.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Existing EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# NEW: Google reCAPTCHA v3
VITE_RECAPTCHA_SITE_KEY=6L...your_site_key_here
```

⚠️ **Note:** We're NOT adding the reCAPTCHA Secret Key here because:
- It should NEVER be in frontend code
- We'll implement it differently (see implementation notes)

---

## Part 4: Verification Checklist

Before moving to code implementation, verify:

### Firebase Console:
- ✅ Google provider enabled
- ✅ Apple provider enabled (if you have Apple Developer account)
- ✅ Twitter provider enabled
- ✅ All callback URLs configured correctly

### reCAPTCHA Console:
- ✅ Site created with v3
- ✅ All domains added (including localhost)
- ✅ Site Key copied to .env
- ✅ Secret Key saved securely

### Environment Variables:
- ✅ `.env` file updated with reCAPTCHA Site Key
- ✅ All Firebase credentials present
- ✅ File not committed to git (in .gitignore)

---

## Part 5: Important Security Notes

### Bot Protection Strategy

Since we're using a frontend-only app (no backend server), we have two options for CAPTCHA verification:

**Option 1: Client-Side Only (Easier, Less Secure)**
- Verify reCAPTCHA score on client
- Simple to implement
- Can be bypassed by skilled attackers

**Option 2: Firebase Cloud Functions (Recommended, More Secure)**
- Use Firebase Cloud Functions as backend
- Verify reCAPTCHA Secret Key server-side
- More secure but requires Firebase Blaze plan ($)
- Can block signups below threshold score

**Recommendation:**
- Start with Option 1 for development
- Upgrade to Option 2 when you're ready to deploy for production
- I'll implement Option 1 first, with notes on how to upgrade

---

## Next Steps

Once you've completed all the console configurations above:

1. ✅ Mark Step 1 as complete
2. 🔄 Let me know you're ready for code implementation
3. 📝 I'll create all necessary code files
4. 🧪 We'll test the implementation together

**Estimated Time:**
- Firebase Console Setup: 15-30 minutes
- reCAPTCHA Setup: 5 minutes
- Code Implementation: 20 minutes (I'll do this)
- Testing: 10 minutes

---

## Questions or Issues?

**Common Issues:**

1. **Apple Sign-In**: Requires paid Apple Developer account
   - Solution: Skip Apple for now, implement later when needed

2. **Twitter API Access**: May take time for approval
   - Solution: Apply now, implement other providers first

3. **reCAPTCHA not working on localhost**: 
   - Make sure you added "localhost" to domains

**Need Help?** 
- Firebase Docs: https://firebase.google.com/docs/auth
- reCAPTCHA Docs: https://developers.google.com/recaptcha/docs/v3
- Contact me via the app's contact form

---

**Ready to proceed?** Let me know which step you've completed, and I'll help you with the next one! 🚀
