# EmailJS Setup Guide for Contact Form

Your contact form is now ready to send emails! Follow these simple steps to configure EmailJS:

## 📧 What You Get

- ✅ Email display in Privacy Policy with copy button
- ✅ Professional contact form for user feedback/reviews
- ✅ Automatic email delivery to: **airdrop.tracker.1.0@gmail.com**
- ✅ Beautiful UI that matches your app's design
- ✅ Fallback to mailto: link if EmailJS isn't configured

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Click **"Sign Up"** (it's FREE - 200 emails/month)
3. Verify your email address

### Step 2: Add Email Service

1. In EmailJS dashboard, click **"Add New Service"**
2. Choose **Gmail** (or your preferred email provider)
3. Click **"Connect Account"** and sign in with **airdrop.tracker.1.0@gmail.com**
4. Give it a name like "Airdrop Tracker Contact"
5. Click **"Create Service"**
6. **Copy the Service ID** (looks like: `service_xxxxxxx`)

### Step 3: Create Email Template

1. Click **"Email Templates"** in the sidebar
2. Click **"Create New Template"**
3. Use this template:

```
Subject: New Contact Form Message from {{from_name}}

From: {{from_name}}
Email: {{from_email}}

Message:
{{message}}

---
This message was sent via Airdrop Tracker Contact Form
Reply to: {{reply_to}}
```

4. Set these template variables:
   - `from_name` - Sender's name
   - `from_email` - Sender's email
   - `message` - Message content
   - `reply_to` - Reply email address
   - `to_email` - Your email (airdrop.tracker.1.0@gmail.com)

5. Click **"Save"**
6. **Copy the Template ID** (looks like: `template_xxxxxxx`)

### Step 4: Get Your Public Key

1. Click **"Account"** in the sidebar
2. Find **"Public Key"** section
3. **Copy the Public Key** (looks like: `your_public_key_here`)

### Step 5: Configure Environment Variables

Create a `.env` file in your project root (if it doesn't exist):

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Replace the values** with your actual IDs from Steps 2, 3, and 4.

### Step 6: Restart Your Dev Server

```bash
npm run dev
```

---

## 🎉 You're Done!

Test your contact form:
1. Go to Privacy Policy page
2. Click **"Send us a Message"**
3. Fill out the form
4. Submit!

You should receive the email at **airdrop.tracker.1.0@gmail.com** within seconds!

---

## 🔧 Troubleshooting

### Form shows "Email service not configured"
- Make sure your `.env` file exists
- Check that variable names start with `VITE_`
- Restart your dev server after creating `.env`

### Emails not being received
- Check EmailJS dashboard for failed sends
- Verify your Gmail account is properly connected
- Check spam folder
- Ensure you're under the free tier limit (200/month)

### Alternative: Mailto Fallback
If you don't want to set up EmailJS right now, the form will automatically show a mailto: link that opens the user's email client.

---

## 📊 EmailJS Free Tier

- ✅ 200 emails per month
- ✅ No credit card required
- ✅ Perfect for small projects
- ✅ Easy to upgrade if needed

---

## 🎨 Features Added

### Privacy Policy Page
- Email display with copy button
- "Send us a Message" button
- Professional contact section with icons

### Contact Form
- Name, Email, and Message fields
- Validation and error handling
- Success/error notifications
- Mobile-responsive design
- Matches your app's theme

---

## 📧 Email Template Customization

You can customize the email template in EmailJS dashboard:
- Add more fields
- Change formatting
- Add company branding
- Include auto-responders

---

## 🔐 Security Notes

- ✅ Public key is safe to expose (it's meant to be public)
- ✅ Service ID and Template ID are also safe to expose
- ✅ EmailJS handles rate limiting automatically
- ✅ No backend code needed
- ✅ No sensitive credentials in frontend

---

## Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all IDs are correct in `.env`
3. Test your EmailJS service in their dashboard
4. Contact EmailJS support (they're very responsive!)

**Happy coding! 🚀**
