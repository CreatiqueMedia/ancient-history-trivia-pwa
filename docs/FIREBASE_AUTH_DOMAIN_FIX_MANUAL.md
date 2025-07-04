# Firebase Authentication Domain Fix - Manual Steps

## 🚨 URGENT: Fix Authentication Domain Error

The error `Firebase: Error (auth/unauthorized-domain)` occurs because the domain `ancient-history-pwa.web.app` is not authorized for OAuth operations.

## 📋 **MANUAL FIX STEPS:**

### 1. Go to Firebase Console
- Open: https://console.firebase.google.com/project/ancient-history-trivia/authentication/settings
- Or navigate: Firebase Console → Authentication → Settings

### 2. Find "Authorized domains" Section
- Scroll down to the "Authorized domains" section
- You should see existing domains like:
  - `localhost`
  - `ancient-history-trivia.web.app`
  - `ancient-history-trivia.firebaseapp.com`

### 3. Add the Missing Domain
- Click **"Add domain"** button
- Enter: `ancient-history-pwa.web.app`
- Click **"Add"** to save

### 4. Verify the Domain List
After adding, you should see all these domains:
- ✅ `localhost`
- ✅ `ancient-history-trivia.web.app`
- ✅ `ancient-history-trivia.firebaseapp.com`
- ✅ `ancient-history-pwa.web.app` ← **NEW**

## 🔧 **ALTERNATIVE: Firebase CLI Method**

If you prefer using the command line:

```bash
# Get current project info
firebase use ancient-history-trivia

# This will open the Firebase Console to the right page
firebase open auth
```

Then manually add the domain in the console.

## ✅ **VERIFICATION:**

After adding the domain:

1. **Clear browser cache** (important!)
2. **Go to**: https://ancient-history-pwa.web.app/store
3. **Click "Purchase"** on any bundle
4. **Click "Continue with Google"** in the AuthModal
5. **Authentication should now work** without the domain error

## 🚀 **WHY THIS HAPPENS:**

Firebase requires all domains that use OAuth authentication to be explicitly authorized. The app is deployed to `ancient-history-pwa.web.app` but this domain wasn't in the authorized list, causing the authentication to fail.

## 📞 **NEED HELP?**

If you're still having issues:
1. Double-check the domain spelling: `ancient-history-pwa.web.app`
2. Make sure you're in the correct Firebase project: `ancient-history-trivia`
3. Clear browser cache and try again
4. Check browser console for any other errors

## 🎯 **EXPECTED RESULT:**

After fixing this, users should be able to:
- ✅ Click "Purchase" on bundles
- ✅ See the beautiful AuthModal
- ✅ Click "Continue with Google" successfully
- ✅ Complete authentication without errors
- ✅ Return to the store to complete their purchase
