# 📧 EmailJS Setup for OTP Email Delivery

## 🎯 Quick Setup (5 Minutes)

Follow these steps to send **real OTP emails** to users:

---

## Step 1: Create EmailJS Account

1. Go to: **https://www.emailjs.com/**
2. Click **"Sign Up Free"**
3. Sign up with Google or email
4. Confirm your email

---

## Step 2: Connect Your Email Service

1. In EmailJS dashboard, click **"Email Services"** (left sidebar)
2. Click **"Add New Service"**
3. Choose **Gmail** (recommended)
4. Click **"Connect Account"**
5. Sign in with your Gmail account
6. Allow EmailJS to send emails on your behalf
7. **IMPORTANT: Copy the Service ID** (looks like `service_abc123`)

**Supported Email Providers:**
- Gmail ✅ (Easiest!)
- Outlook
- Yahoo
- Custom SMTP
- SendGrid
- Mailgun

---

## Step 3: Create OTP Email Template

1. Click **"Email Templates"** (left sidebar)
2. Click **"Create New Template"**
3. Fill in the template:

### Template Settings:
- **Template Name:** `OTP Verification Code`
- **From Name:** Your App Name (e.g., "Airdrop Tracker")
- **From Email:** Your email (e.g., `noreply@yourapp.com`)
- **Subject:** `Your Verification Code for {{app_name}}`
- **Reply To:** Your support email (optional)

### Template Content (HTML):

**Copy and paste this beautiful template:**

```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 20px;">
  <!-- Header -->
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Email Verification</h1>
  </div>
  
  <!-- Body -->
  <div style="background: #ffffff; padding: 40px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
      Hello!
    </p>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
      Thank you for signing up with <strong>{{app_name}}</strong>! To verify your email address, please use the code below:
    </p>
    
    <!-- OTP Code Box -->
    <div style="background: #f5f5f5; border: 3px dashed #667eea; border-radius: 12px; padding: 30px; text-align: center; margin: 30px 0;">
      <p style="font-size: 14px; color: #666; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">
        Your Verification Code
      </p>
      <h2 style="font-size: 42px; letter-spacing: 10px; color: #667eea; margin: 0; font-family: 'Courier New', monospace; font-weight: bold;">
        {{otp_code}}
      </h2>
    </div>
    
    <!-- Instructions -->
    <div style="background: #fff8dc; border-left: 4px solid #ffa500; padding: 15px; margin: 30px 0; border-radius: 4px;">
      <p style="font-size: 14px; color: #666; margin: 0;">
        ⏰ <strong>Important:</strong> This code will expire in <strong>{{valid_minutes}} minutes</strong>.
      </p>
    </div>
    
    <p style="font-size: 14px; color: #666; margin-bottom: 10px;">
      If you didn't request this code, you can safely ignore this email. Someone else might have entered your email address by mistake.
    </p>
    
    <!-- Security Notice -->
    <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-top: 30px;">
      <p style="font-size: 12px; color: #999; margin: 0; text-align: center;">
        🔒 For your security, never share this code with anyone.
      </p>
    </div>
    
    <!-- Footer -->
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
    
    <p style="font-size: 12px; color: #999; text-align: center; margin: 0;">
      This is an automated email. Please do not reply to this message.
    </p>
    
    <p style="font-size: 12px; color: #999; text-align: center; margin: 10px 0 0 0;">
      © 2024 {{app_name}}. All rights reserved.
    </p>
  </div>
</div>
```

4. Click **"Save"**
5. **IMPORTANT: Copy the Template ID** (looks like `template_xyz789`)

---

## Step 4: Get Your Public Key

1. Click **"Account"** in the left sidebar
2. Click **"General"** tab
3. Find **"Public Key"** section
4. **Copy your Public Key** (looks like a long string)

---

## Step 5: Add Credentials to Your Project

### Option A: If you have a `.env` file already
Open your `.env` file and add/update these lines:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
VITE_EMAILJS_OTP_TEMPLATE_ID=template_xyz789
```

### Option B: If you don't have a `.env` file
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in:
   ```env
   VITE_EMAILJS_SERVICE_ID=service_abc123
   VITE_EMAILJS_PUBLIC_KEY=YOUR_PUBLIC_KEY_HERE
   VITE_EMAILJS_OTP_TEMPLATE_ID=template_xyz789
   ```

**Replace with your actual values!**

---

## Step 6: Restart Your Dev Server

```bash
# Stop your current dev server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 7: Test It!

1. Go to your signup page
2. Click **"Sign Up"**
3. Enter a **real email address**
4. Click **"Send Verification Code"**
5. **Check your email inbox!** 📧
6. Check spam/junk folder if not in inbox
7. Enter the OTP code
8. Complete signup!

**It works!** 🎉

---

## 🎨 Template Variables Used

Your email template uses these variables (automatically filled):

- `{{to_email}}` - Recipient's email
- `{{otp_code}}` - The 6-digit verification code
- `{{app_name}}` - Your app name (currently "Airdrop Tracker")
- `{{valid_minutes}}` - How long the code is valid (10 minutes)

---

## 📊 EmailJS Free Plan Limits

- ✅ **200 emails per month** (Free)
- ✅ Unlimited templates
- ✅ Unlimited services
- ✅ Email tracking
- ✅ Auto-reply

**Need more?** Paid plans start at $7/month for 1,000 emails.

---

## 🔧 Troubleshooting

### Problem: "EmailJS is not defined"
**Solution:** Make sure `index.html` has the EmailJS script tag:
```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
```

### Problem: Email not received
**Solutions:**
1. Check spam/junk folder
2. Verify Service ID is correct
3. Verify Template ID is correct
4. Check EmailJS dashboard for sent emails
5. Make sure email service is connected

### Problem: "Invalid template"
**Solution:**
1. Double-check Template ID in `.env`
2. Make sure template is saved in EmailJS
3. Verify template has all required variables

### Problem: Still seeing console logs
**Solution:**
1. Make sure all 3 env variables are set
2. Restart dev server
3. Hard refresh browser (Ctrl+Shift+R)

---

## 🎯 Testing Checklist

- [ ] EmailJS account created
- [ ] Gmail connected as service
- [ ] OTP template created with HTML
- [ ] Service ID copied to `.env`
- [ ] Template ID copied to `.env`
- [ ] Public Key copied to `.env`
- [ ] Dev server restarted
- [ ] Test email sent successfully
- [ ] OTP received in inbox
- [ ] Signup completed with real OTP

---

## 🚀 Production Tips

### 1. Use a Professional Email
Instead of Gmail, consider:
- Custom domain email (info@yourdomain.com)
- SendGrid
- Mailgun
- AWS SES

### 2. Monitor Usage
Check EmailJS dashboard regularly for:
- Emails sent this month
- Failed deliveries
- Bounce rate

### 3. Add Branding
Customize the template with:
- Your logo
- Brand colors
- Custom footer
- Social media links

### 4. Set Up Auto-Reply
In EmailJS:
1. Go to Email Services
2. Enable "Auto-Reply"
3. Create a confirmation template

---

## 📧 Example Email Preview

When a user signs up, they'll receive:

```
Subject: Your Verification Code for Airdrop Tracker

[Beautiful gradient header with lock icon]

Hello!

Thank you for signing up with Airdrop Tracker! 
To verify your email address, please use the code below:

┌─────────────────────────┐
│  Your Verification Code │
│                         │
│      1 2 3 4 5 6       │
└─────────────────────────┘

⏰ Important: This code will expire in 10 minutes.

If you didn't request this code, you can safely 
ignore this email.

🔒 For your security, never share this code with anyone.

────────────────────────────

This is an automated email. Please do not reply.

© 2024 Airdrop Tracker. All rights reserved.
```

---

## 🎊 Success!

Once set up, your OTP system will:
- ✅ Send professional emails
- ✅ Arrive in inbox (not spam)
- ✅ Work instantly
- ✅ Be 100% free (up to 200/month)
- ✅ Look professional

**Your users will be impressed!** 🌟

---

## 📚 Resources

- **EmailJS Dashboard:** https://dashboard.emailjs.com/
- **EmailJS Docs:** https://www.emailjs.com/docs/
- **Template Editor:** https://dashboard.emailjs.com/admin/templates
- **Usage Stats:** https://dashboard.emailjs.com/admin/account

---

## 🆘 Need Help?

If you run into issues:
1. Check the troubleshooting section above
2. Review your EmailJS dashboard
3. Verify all credentials in `.env`
4. Check browser console for errors
5. Test with your own email first

---

**Happy emailing!** 🚀
