# 🔐 Firebase Authentication Domains Fix

## ❌ PROBLEM
Getting `auth/unauthorized-domain` error when trying to sign in.

## ✅ SOLUTION
Add the missing domains to Firebase Authentication authorized domains.

## 🚀 IMMEDIATE ACTION REQUIRED

### Step 1: Open Firebase Console
The Firebase Console should have opened automatically. If not, go to:
**https://console.firebase.google.com/project/ancient-history-trivia/authentication/settings**

### Step 2: Navigate to Authorized Domains
1. In the Firebase Console, go to **Authentication**
2. Click on **Settings** tab
3. Scroll down to **Authorized domains** section

### Step 3: Add These Domains
Click **"Add domain"** for each of these domains:

#### ✅ REQUIRED DOMAINS TO ADD:
1. **`ancient-history-pwa.web.app`** ← This is the main one causing the error
2. **`ancient-history-trivia.web.app`** ← Your primary domain
3. **`localhost`** ← For local development
4. **`127.0.0.1`** ← For local development

### Step 4: Save Changes
After adding all domains, the changes take effect immediately.

## 🎯 CURRENT DOMAINS THAT SHOULD BE AUTHORIZED:
- `ancient-history-trivia.firebaseapp.com` (default)
- `ancient-history-pwa.web.app` ← ADD THIS
- `ancient-history-trivia.web.app` ← ADD THIS  
- `localhost` ← ADD THIS
- `127.0.0.1` ← ADD THIS

## ⚡ QUICK VERIFICATION
After adding the domains:
1. Go to your app: `https://ancient-history-pwa.web.app`
2. Try to sign in with Google
3. The `auth/unauthorized-domain` error should be gone!

## 🔧 WHY THIS HAPPENED
Your app is deployed to `ancient-history-pwa.web.app` but Firebase Authentication was only configured for `ancient-history-trivia.firebaseapp.com`. When users try to sign in from the `.web.app` domain, Firebase blocks it because it's not in the authorized domains list.

## ✅ AFTER FIXING
- Authentication will work on all your domains
- Users can sign in from any authorized domain
- Payment flow will work seamlessly
- No more authentication errors

---

**🚨 URGENT: This must be done in the Firebase Console as the Firebase CLI doesn't support managing auth domains programmatically.**
