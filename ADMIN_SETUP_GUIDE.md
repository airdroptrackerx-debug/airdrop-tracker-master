# 👑 Admin Access Setup Guide

## 🎯 Overview

Your app now has **role-based admin access**. Only users with `isAdmin: true` in their Firestore profile can access admin pages.

---

## 🚀 How to Make Yourself Admin

### **Option 1: Manually in Firebase Console (Recommended)**

1. **Go to Firebase Console**
   - Open [Firebase Console](https://console.firebase.google.com/)
   - Select your project
   - Click **Firestore Database**

2. **Find Your User Document**
   - Open the `users` collection
   - Find your user document (search by your email or UID)
   - Click on your document

3. **Add the Admin Field**
   - Click **"Add field"** button
   - Field name: `isAdmin`
   - Field type: `boolean`
   - Value: `true` ✅
   - Click **"Add"**

4. **Done!**
   - Refresh your app
   - You can now access `/admin/donations`

---

### **Option 2: Via Firebase Admin SDK (For Multiple Admins)**

If you need to programmatically set admin roles, create a Cloud Function:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.makeAdmin = functions.https.onCall(async (data, context) => {
  // Security: Only allow if caller is already admin
  const callerDoc = await admin.firestore()
    .collection('users')
    .doc(context.auth.uid)
    .get();
    
  if (!callerDoc.data().isAdmin) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Only admins can create other admins'
    );
  }

  // Set target user as admin
  await admin.firestore()
    .collection('users')
    .doc(data.userId)
    .update({ isAdmin: true });

  return { success: true };
});
```

---

## 🔐 How It Works

### **1. User Profile Structure**
```typescript
{
  uid: "abc123",
  email: "you@example.com",
  nickname: "YourName",
  isAdmin: true,  // ← This field makes you admin
  createdAt: "2025-10-22...",
  // ... other fields
}
```

### **2. Admin Route Protection**
```typescript
// Only renders content if user.isAdmin === true
<AdminRoute>
  <DonationConfirmations />
</AdminRoute>
```

### **3. Access Control Flow**
1. User visits `/admin/donations`
2. `AdminRoute` checks if user is logged in
3. `AdminRoute` checks if `userProfile.isAdmin === true`
4. ✅ If admin: Shows page
5. ❌ If not admin: Shows "Access Denied" message

---

## 📋 Protected Admin Pages

Currently protected:
- ✅ `/admin/donations` - View all donation confirmations

**To add more admin pages:**
1. Create new page component
2. Add route in `App.tsx`
3. Wrap with `<AdminRoute>` component

Example:
```tsx
<Route 
  path="/admin/users" 
  element={
    <AdminRoute>
      <UserManagement />
    </AdminRoute>
  } 
/>
```

---

## 🎨 What Non-Admins See

If a regular user tries to access `/admin/donations`, they'll see:

```
🚫 Access Denied

You don't have permission to access this admin page.

[Go Back Button]
```

---

## 🔒 Firestore Security Rules

Make sure your Firestore rules protect the `isAdmin` field:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                      request.auth.uid == userId &&
                      // Prevent users from setting themselves as admin
                      (!request.resource.data.keys().hasAny(['isAdmin']) ||
                       request.resource.data.isAdmin == resource.data.isAdmin);
    }
  }
}
```

**This prevents users from setting `isAdmin: true` on themselves!**

---

## 🚢 Deployment Checklist

### **Before Deploying:**

1. ✅ **Set yourself as admin in Firestore**
   - Go to Firebase Console
   - Find your user document
   - Add `isAdmin: true`

2. ✅ **Update Firestore security rules**
   - Protect the `isAdmin` field
   - Prevent self-promotion to admin

3. ✅ **Test admin access**
   - Visit `/admin/donations` while logged in
   - Should see the dashboard ✅
   - Log out or use incognito
   - Should see "Access Denied" ❌

4. ✅ **Document admin emails**
   - Keep a list of admin user emails
   - Store securely (not in code!)

---

## 🎯 Managing Multiple Admins

### **Making Other Users Admin:**

1. **Find their UID**
   - Firebase Console → Authentication
   - Find user by email
   - Copy their UID

2. **Update their profile**
   - Firestore Database → users collection
   - Find document by UID
   - Add field: `isAdmin: true`

3. **Notify them**
   - Tell them they now have admin access
   - They'll see admin pages on next login

### **Revoking Admin Access:**

1. Go to their user document in Firestore
2. Change `isAdmin: true` to `isAdmin: false` (or delete the field)
3. They'll lose access immediately

---

## 📊 Checking Who's Admin

Create a simple admin user list page:

```typescript
// AdminUsers.tsx
const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  
  useEffect(() => {
    const q = query(
      collection(db, 'users'),
      where('isAdmin', '==', true)
    );
    
    getDocs(q).then(snapshot => {
      setAdmins(snapshot.docs.map(doc => doc.data()));
    });
  }, []);
  
  return (
    <div>
      <h1>Admin Users</h1>
      {admins.map(admin => (
        <div key={admin.uid}>
          {admin.email} - {admin.nickname}
        </div>
      ))}
    </div>
  );
};
```

---

## 🛠️ Troubleshooting

### **"Access Denied" even though I'm admin:**
- Check Firestore: Is `isAdmin: true` on your user document?
- Clear browser cache and reload
- Log out and log back in
- Check browser console for errors

### **Can't add isAdmin field in Firestore:**
- Firestore rules might be blocking it
- Temporarily set rules to allow writes from console
- Use Firebase Admin SDK instead

### **Admin access not persisting:**
- Check if field type is boolean (not string "true")
- Verify the field name is exactly `isAdmin` (case-sensitive)
- Make sure you're editing the right user document

---

## 💡 Best Practices

1. **Limit Admins**: Only give admin access to trusted team members
2. **Use Real Emails**: Don't use temporary/throwaway emails for admin accounts
3. **Regular Audits**: Periodically check who has admin access
4. **Revoke When Leaving**: Remove admin access when team members leave
5. **Separate Super Admin**: Consider a `superAdmin` role for the owner

---

## 🎉 Summary

| Step | Action | Status |
|------|--------|--------|
| 1 | Add `isAdmin: true` to your Firestore user document | ⏳ Pending |
| 2 | Update Firestore security rules | ✅ Done in code |
| 3 | Test admin access at `/admin/donations` | ⏳ Test after step 1 |
| 4 | Add admin field to other trusted users | Optional |

**Your account becomes admin as soon as you add `isAdmin: true` to your Firestore user document!**

---

## 🔗 Quick Links

- **Your User Document**: Firebase Console → Firestore → users → [Your UID]
- **Admin Dashboard**: `http://yourdomain.com/admin/donations`
- **Local Testing**: `http://localhost:5173/admin/donations`

**Need help?** The `AdminRoute` component handles all the security logic automatically!
