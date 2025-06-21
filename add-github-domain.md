# Fix Firebase Authentication Domain Error

## The Problem
Firebase Authentication shows error: `auth/unauthorized-domain` when accessing from GitHub Pages because the domain `creatiquemedia.github.io` is not in the authorized domains list.

## Quick Fix - Add GitHub Pages Domain to Firebase Console

### Step 1: Open Firebase Console
1. Go to: https://console.firebase.google.com/project/ancient-history-trivia
2. Navigate to **Authentication** → **Settings** → **Authorized domains**

### Step 2: Add GitHub Pages Domain
1. Click **Add domain**
2. Enter: `creatiquemedia.github.io`
3. Click **Add**

### Current Authorized Domains Should Include:
- `localhost` (for development)
- `ancient-history-trivia.web.app` (Firebase Hosting)
- `ancient-history-trivia.firebaseapp.com` (Firebase Hosting)
- `creatiquemedia.github.io` (GitHub Pages) ← **ADD THIS**

### Alternative: Use Firebase CLI (if you have admin access)
```bash
# This would be the command if supported:
# firebase auth:domains:add creatiquemedia.github.io
```

## After Adding the Domain
1. The authentication error should disappear
2. All auth methods (Google, Facebook, Apple, Email) will work on GitHub Pages
3. No code changes needed - this is purely a Firebase configuration issue

## Testing
Once the domain is added, test authentication on:
- https://creatiquemedia.github.io/ancient-history-trivia-pwa/

The error should be resolved and authentication should work normally.
