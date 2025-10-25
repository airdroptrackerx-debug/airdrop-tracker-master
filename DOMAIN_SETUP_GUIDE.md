# 🌐 Complete Domain Setup Guide: GoDaddy → Firebase

**Last Updated:** October 25, 2025  
**Your Domains:** airdrop.site or airdrop.live

---

## 📦 **STEP 1: PURCHASE DOMAIN FROM GODADDY**

### A. Go to GoDaddy

1. Visit https://www.godaddy.com
2. Search for your domain:
   - `airdrop.site`
   - `airdrop.live`

### B. Complete Purchase

1. Add domain to cart
2. **IMPORTANT:** Decline all upsells (you don't need them):
   - ❌ Email hosting (you have Gmail)
   - ❌ Website builder (you have your app)
   - ❌ SSL certificate (Firebase provides free SSL)
   - ❌ Privacy protection (optional, costs ~$10/year)
3. Complete payment
4. Check email for confirmation

### C. What You'll Get

- **Email:** Order confirmation with domain details
- **GoDaddy Account:** Domain listed in "My Domains"
- **Access:** Ability to manage DNS settings

**Cost:**

- `.site` domain: ~$20-30/year
- `.live` domain: ~$25-35/year

---

## 🔗 **STEP 2: CONNECT DOMAIN TO FIREBASE**

### A. Open Firebase Console

1. Go to https://console.firebase.google.com
2. Select your project: **crypto-airdrop-tracker-b546f**
3. Click **Hosting** in left sidebar
4. Click **Add custom domain** button

### B. Enter Your Domain

1. Type your domain (e.g., `airdrop.site`)
2. Click **Continue**

### C. Firebase Shows You DNS Records

Firebase will display something like:

```
ADD THESE RECORDS TO YOUR DNS:

Type: A
Name: @
Value: 151.101.1.195
TTL: 3600

Type: A
Name: @
Value: 151.101.65.195
TTL: 3600

Type: TXT (for verification)
Name: @
Value: firebase-hosting=some-long-code-here
TTL: 3600
```

**IMPORTANT:** Don't close this window! You'll need these values.

---

## ⚙️ **STEP 3: UPDATE DNS IN GODADDY**

### A. Access GoDaddy DNS Settings

1. Log in to GoDaddy
2. Go to **My Products** → **Domains**
3. Find your domain (airdrop.site or airdrop.live)
4. Click **DNS** button (or three dots → **Manage DNS**)

### B. Clear Existing Records (Important!)

You'll see default records. You need to:

1. **Delete** or **Edit** the existing A records:
   - Usually shows GoDaddy's parking page IP
   - Click the pencil/edit icon
2. **Delete** the default CNAME if present:
   - May point to `@` or `www`

### C. Add Firebase A Records

**Add First A Record:**

```
Type: A
Name: @ (means root domain)
Value: 151.101.1.195
TTL: 1 Hour (or Custom: 3600 seconds)
```

Click **Save**

**Add Second A Record:**

```
Type: A
Name: @ (means root domain)
Value: 151.101.65.195
TTL: 1 Hour (or Custom: 3600 seconds)
```

Click **Save**

### D. Add TXT Record (Verification)

```
Type: TXT
Name: @ (means root domain)
Value: firebase-hosting=YOUR-VERIFICATION-CODE-HERE
TTL: 1 Hour (or Custom: 3600 seconds)
```

Click **Save**

### E. Optional: Add WWW Subdomain

If you want `www.airdrop.site` to also work:

**Add CNAME Record:**

```
Type: CNAME
Name: www
Value: airdrop.site (your root domain)
TTL: 1 Hour
```

Click **Save**

---

## ⏳ **STEP 4: WAIT FOR DNS PROPAGATION**

### What Happens Now?

DNS changes take time to spread globally.

**Timeline:**

- **Minimum:** 10-30 minutes
- **Average:** 1-4 hours
- **Maximum:** 24-48 hours (rare)

### How to Check Progress

**1. Firebase Console:**

- Go back to Firebase Hosting
- You'll see status: "Pending" or "Connected"
- Wait for checkmark: ✅ "Connected"

**2. Online DNS Checker:**

- Visit: https://dnschecker.org
- Enter your domain: `airdrop.site`
- Check if A records show Firebase IPs globally

**3. Terminal/Command Line:**

```bash
# Windows PowerShell
nslookup airdrop.site

# Should show:
# Address: 151.101.1.195 or 151.101.65.195
```

**4. Browser Test:**

- Try visiting: `http://airdrop.site` (may show SSL warning initially)
- Try: `https://airdrop.site` (should work after SSL provisioning)

---

## 🔒 **STEP 5: SSL CERTIFICATE (Automatic)**

### What Happens:

Firebase automatically provisions a **free SSL certificate** from Let's Encrypt.

**Timeline:**

- Usually: 15 minutes - 2 hours after DNS propagation
- Maximum: 24 hours

### Status Check:

1. Go to Firebase Console → Hosting
2. Look for your domain
3. Check SSL status:
   - ⏳ "Provisioning SSL..." → Wait
   - ✅ "Active" → Ready!

### When SSL is Active:

- `https://airdrop.site` works securely
- Green padlock 🔒 in browser
- Automatic HTTPS redirect

---

## ✅ **STEP 6: VERIFY EVERYTHING WORKS**

### Checklist:

**DNS Verification:**

- [ ] `airdrop.site` resolves to Firebase IPs
- [ ] `www.airdrop.site` redirects to root (if you added CNAME)
- [ ] DNS checker shows green checkmarks globally

**SSL Verification:**

- [ ] `https://airdrop.site` loads with green padlock
- [ ] No certificate warnings
- [ ] `http://airdrop.site` redirects to `https://`

**App Verification:**

- [ ] Homepage loads correctly
- [ ] Login/signup works
- [ ] Task manager functions
- [ ] All pages accessible
- [ ] Admin panel works

**Performance Check:**

- [ ] Fast load times (<3 seconds)
- [ ] Mobile responsive
- [ ] Images load properly
- [ ] Animations smooth

---

## 🔧 **TROUBLESHOOTING COMMON ISSUES**

### Issue 1: "Domain Not Connecting After 24 Hours"

**Solution:**

1. Verify A records in GoDaddy:
   - Should be `151.101.1.195` and `151.101.65.195`
   - No typos, no extra spaces
2. Check @ symbol is used for Name (not blank)
3. Delete any conflicting records (old A records, CNAME @)
4. Try removing and re-adding domain in Firebase

### Issue 2: "SSL Certificate Not Provisioning"

**Solution:**

1. Ensure DNS is fully propagated (check dnschecker.org)
2. Verify TXT record exists and matches Firebase code
3. Wait full 24 hours before contacting support
4. Check Firebase status: https://status.firebase.google.com

### Issue 3: "Works on Desktop but Not Mobile"

**Solution:**

- DNS may not be propagated to mobile carrier
- Try switching from mobile data to WiFi or vice versa
- Wait a few more hours for global propagation
- Clear browser cache on mobile

### Issue 4: "www Subdomain Not Working"

**Solution:**

1. In Firebase Console, add both domains:
   - `airdrop.site`
   - `www.airdrop.site`
2. Follow the same DNS setup for both
3. Or add CNAME: `www` → `airdrop.site`

### Issue 5: "Old GoDaddy Parking Page Still Shows"

**Solution:**

- Clear browser cache: Ctrl+Shift+Delete (or Cmd+Shift+Delete)
- Try incognito/private browsing mode
- DNS may not be fully propagated yet - wait longer
- Check DNS with online tools

---

## 📊 **DNS CONFIGURATION SUMMARY**

### Final GoDaddy DNS Should Look Like:

| Type  | Name | Value                      | TTL    |
| ----- | ---- | -------------------------- | ------ |
| A     | @    | 151.101.1.195              | 1 Hour |
| A     | @    | 151.101.65.195             | 1 Hour |
| TXT   | @    | firebase-hosting=code-here | 1 Hour |
| CNAME | www  | airdrop.site               | 1 Hour |

**Note:** Some records may remain (like MX for email) - that's fine!

---

## 🎯 **WHAT HAPPENS AFTER SETUP**

### Your App Will Be Available At:

- ✅ `https://airdrop.site` (primary)
- ✅ `https://www.airdrop.site` (if you set up www)
- ✅ `https://crypto-airdrop-tracker-b546f.web.app` (original Firebase URL still works)

### Benefits of Custom Domain:

- 🎨 Professional branding
- 🔍 Better SEO ranking
- 💪 Increased trust/credibility
- 📈 Easier to remember and share
- 📱 Better for social media sharing

---

## 💰 **COSTS BREAKDOWN**

### One-Time:

- Domain purchase: $20-35 (first year)

### Annual Renewal:

- Domain renewal: $20-35/year (auto-renews)
- Firebase Hosting: FREE (for your usage level)
- SSL Certificate: FREE (auto-renewed by Firebase)

### Optional Add-ons (Not Needed):

- ❌ Domain privacy: $10/year (optional)
- ❌ Email hosting: $5-10/month (you have Gmail)
- ❌ Website builder: $10-20/month (you have your app)

**Total Cost:** ~$25-35/year (domain only)

---

## 🔄 **UPDATING YOUR APP**

After domain is connected, deployments work the same:

```bash
# Build and deploy
npm run build
firebase deploy --only hosting

# Your app updates automatically at:
# - https://airdrop.site
# - https://www.airdrop.site
# - https://crypto-airdrop-tracker-b546f.web.app
```

All domains update simultaneously!

---

## 📧 **UPDATE APP REFERENCES (Optional)**

### Update These Files:

**1. package.json** (for reference):

```json
{
  "name": "airdrop-site",
  "homepage": "https://airdrop.site"
}
```

**2. public/manifest.json**:

```json
{
  "name": "Airdrop Tracker",
  "start_url": "https://airdrop.site"
}
```

**3. Social Media Tags** (in index.html):

```html
<meta property="og:url" content="https://airdrop.site" />
<meta property="twitter:url" content="https://airdrop.site" />
```

---

## ✅ **FINAL CHECKLIST**

### Before Going Live:

**Domain Setup:**

- [ ] Domain purchased from GoDaddy
- [ ] DNS records added correctly
- [ ] DNS propagated globally
- [ ] SSL certificate active
- [ ] Both http and https work
- [ ] www redirect works (if applicable)

**App Testing:**

- [ ] All pages load correctly
- [ ] Login/signup functional
- [ ] Database connections work
- [ ] Admin panel accessible
- [ ] Mobile responsive
- [ ] Fast performance

**SEO & Marketing:**

- [ ] Update social media links
- [ ] Submit to Google Search Console
- [ ] Update any promotional materials
- [ ] Share new domain with users

---

## 🎉 **SUCCESS!**

Once everything is set up, you'll have:

✅ Professional custom domain  
✅ Free SSL certificate (HTTPS)  
✅ Fast global CDN delivery  
✅ Automatic deployments  
✅ 99.9% uptime guarantee

**Your app will be live at:** `https://airdrop.site` 🚀

---

## 📞 **NEED HELP?**

### Firebase Support:

- Documentation: https://firebase.google.com/docs/hosting/custom-domain
- Status Page: https://status.firebase.google.com
- Community: https://firebase.google.com/support

### GoDaddy Support:

- Help Center: https://www.godaddy.com/help
- Phone: Check your country's support number
- Chat: Available 24/7 in GoDaddy account

### DNS Tools:

- DNS Checker: https://dnschecker.org
- WHOIS Lookup: https://www.whois.com
- SSL Checker: https://www.ssllabs.com/ssltest

---

**Good luck with your domain! 🎊**
