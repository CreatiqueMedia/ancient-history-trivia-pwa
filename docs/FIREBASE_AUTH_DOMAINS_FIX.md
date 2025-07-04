# 🔐 Firebase Authentication Domains Configuration

## ✅ CORRECT CONFIGURATION

Your Firebase project should ONLY use:

**Primary Domain**: `ancient-history-trivia.web.app`

## 🎯 AUTHORIZED DOMAINS SHOULD BE:
- `ancient-history-trivia.firebaseapp.com` (default Firebase domain)
- `ancient-history-trivia.web.app` (your primary domain)
- `localhost` (for local development)
- `127.0.0.1` (for local development)

## 🚨 IMPORTANT: DO NOT ADD
- ❌ `ancient-history-pwa.web.app` (this domain should NOT be used)

## 🔧 HOW TO VERIFY/FIX

### Step 1: Open Firebase Console
Go to: **https://console.firebase.google.com/project/ancient-history-trivia/authentication/settings**

### Step 2: Check Authorized Domains
In the **Authorized domains** section, ensure you have:
- ✅ `ancient-history-trivia.firebaseapp.com`
- ✅ `ancient-history-trivia.web.app`
- ✅ `localhost`
- ✅ `127.0.0.1`

### Step 3: Remove Unwanted Domain (if present)
If you see `ancient-history-pwa.web.app` in the list:
1. Click the **X** next to it
2. Confirm removal

## 🎯 CORRECT APP URL
Always use: **https://ancient-history-trivia.web.app**

## ✅ AFTER CORRECT CONFIGURATION
- Authentication works on the correct domain
- No unauthorized domain errors
- Payment flow works seamlessly
- Clean, single-domain setup

---

**🎯 REMEMBER: Only use `ancient-history-trivia.web.app` - this is your primary and only domain!**
