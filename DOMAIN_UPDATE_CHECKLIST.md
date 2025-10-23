# 🌐 Domain Update Checklist

**Use this when you get your custom domain!**

---

## 📝 **Quick Reference**

### **Current Placeholder:**
```
your-domain.com
```

### **Replace With:**
```
[YOUR-ACTUAL-DOMAIN.com]
```

---

## 🔧 **Files to Update (3 files)**

### **1. index.html** (15 occurrences)
```bash
Location: /index.html

Search for: your-domain.com
Replace with: airdroptrackerx.com (or your domain)

Lines to update:
- Line 29: <link rel="canonical" href="https://your-domain.com/" />
- Line 33: <meta property="og:url" content="https://your-domain.com/" />
- Line 47: <meta name="twitter:url" content="https://your-domain.com/" />
- Lines 80-180: JSON-LD structured data (multiple places)

Quick method:
Ctrl + H (Find & Replace)
Find: your-domain.com
Replace: airdroptrackerx.com
Replace All
```

---

### **2. sitemap.xml** (7 occurrences)
```bash
Location: /public/sitemap.xml

Replace all <loc> tags:
<loc>https://your-domain.com/</loc>
→ <loc>https://airdroptrackerx.com/</loc>

Pages to update:
- Homepage (/)
- Login (/login)
- Explorer (/explorer)
- About (/about)
- Profile (/profile)
- Donate (/donate)
- Privacy (/privacy)
```

---

### **3. robots.txt** (2 occurrences)
```bash
Location: /public/robots.txt

Update lines:
Line 49: Sitemap: https://your-domain.com/sitemap.xml
Line 52: Host: https://your-domain.com

Replace with your actual domain
```

---

## ⚡ **Quick Update Script**

### **Option 1: Search & Replace (Recommended)**

**VS Code / Any Editor:**
```
1. Press Ctrl + Shift + F (Find in Files)
2. Search: your-domain.com
3. Replace: [YOUR-DOMAIN]
4. Click "Replace All"
5. Save all files
```

### **Option 2: Command Line**

**Windows (PowerShell):**
```powershell
$domain = "airdroptrackerx.com"
(Get-Content index.html) -replace 'your-domain.com', $domain | Set-Content index.html
(Get-Content public/sitemap.xml) -replace 'your-domain.com', $domain | Set-Content public/sitemap.xml
(Get-Content public/robots.txt) -replace 'your-domain.com', $domain | Set-Content public/robots.txt
Write-Host "✅ Domain updated to $domain"
```

**Mac/Linux:**
```bash
DOMAIN="airdroptrackerx.com"
sed -i '' "s/your-domain.com/$DOMAIN/g" index.html
sed -i '' "s/your-domain.com/$DOMAIN/g" public/sitemap.xml
sed -i '' "s/your-domain.com/$DOMAIN/g" public/robots.txt
echo "✅ Domain updated to $DOMAIN"
```

---

## ✅ **Verification Checklist**

After updating, verify:

- [ ] **index.html** - All URLs updated (15 places)
- [ ] **sitemap.xml** - All URLs updated (7 pages)
- [ ] **robots.txt** - Sitemap & Host updated
- [ ] **No "your-domain.com" remaining** (search files)
- [ ] **Test locally** (npm run dev)
- [ ] **Deploy to Firebase** (firebase deploy)
- [ ] **Test live site** (check meta tags)

---

## 🔍 **How to Check You Got Everything**

```bash
# Search all files for placeholder
grep -r "your-domain.com" .

# Should return NO results after update!
# (except in this checklist file)
```

---

## 🚀 **After Domain Update**

### **1. Submit to Search Engines (Same Day)**

**Google Search Console:**
```
https://search.google.com/search-console
→ Add property
→ Verify domain
→ Submit sitemap: [YOUR-DOMAIN]/sitemap.xml
```

**Bing Webmaster:**
```
https://www.bing.com/webmasters
→ Add site
→ Verify
→ Submit sitemap
```

### **2. Update Social Media (Week 1)**

**Update index.html lines 45-46:**
```html
<meta name="twitter:site" content="@YourActualTwitter" />
<meta name="twitter:creator" content="@YourActualTwitter" />
```

**Update JSON-LD lines 144-146:**
```json
"sameAs": [
  "https://twitter.com/YourActualTwitter",
  "https://github.com/your-actual-repo"
]
```

### **3. Set Up Analytics (Week 1)**

**Google Analytics:**
```
1. Get GA4 Measurement ID
2. Add to index.html before </head>
3. Track conversions
```

---

## 📊 **Expected Timeline**

### **Day 1:** Domain Update
- Update files
- Deploy to Firebase
- Connect custom domain

### **Day 2-3:** Search Engine Submission
- Google Search Console
- Bing Webmaster Tools
- Submit sitemaps

### **Week 1:** Initial Indexing
- Pages start appearing in search
- Social previews work

### **Week 2-4:** Rankings Begin
- Long-tail keywords rank
- Organic traffic starts

### **Month 2-3:** Growth
- Main keywords ranking
- Consistent traffic
- Featured snippets possible

---

## ⚠️ **Common Mistakes to Avoid**

❌ **Forgetting to update sitemap.xml**
→ Search engines won't find pages

❌ **Not submitting to Search Console**
→ Slow indexing (weeks instead of days)

❌ **Leaving "your-domain.com" in JSON-LD**
→ Structured data won't work

❌ **Not updating robots.txt**
→ Sitemap not found by crawlers

❌ **Missing social media handles**
→ Rich previews won't attribute to you

---

## 🎯 **Final Verification**

Before going live:

```bash
# 1. Check all files
grep -r "your-domain.com" index.html public/

# 2. Check build
npm run build

# 3. Test preview
npm run preview

# 4. Check meta tags
curl https://[YOUR-DOMAIN] | grep "og:url"

# 5. Test social previews
# Paste your URL in:
https://cards-dev.twitter.com/validator
https://developers.facebook.com/tools/debug/
```

---

## 💡 **Pro Tips**

### **SEO-Friendly Domain Names:**
✅ Short & memorable (10-15 chars max)
✅ Include keyword if possible ("airdrop" or "crypto")
✅ Easy to spell & pronounce
✅ .com, .app, or .io preferred
✅ Avoid hyphens & numbers

### **Examples:**
- ✅ airdroptrackerx.com
- ✅ cryptoairdroptracker.com
- ✅ airdrophunter.app
- ✅ trackairdrops.io

---

## 📞 **Need Help?**

If something doesn't work:

1. **Check this checklist** ✓
2. **Search files for "your-domain.com"**
3. **Validate HTML** (W3C Validator)
4. **Test structured data** (Google Rich Results Test)
5. **Check console logs** (F12 Developer Tools)

---

## 🎊 **You're Ready!**

✅ Files identified (3 files)
✅ Locations marked (24 places)
✅ Update methods provided
✅ Verification checklist ready
✅ Search engine submission guide ready
✅ Timeline expectations set

**Just replace the domain and dominate search results!** 🚀

---

**Last Updated:** October 23, 2025  
**Files to Update:** 3  
**Total Replacements:** 24  
**Time Required:** 5-10 minutes  
**Difficulty:** Easy ✅
