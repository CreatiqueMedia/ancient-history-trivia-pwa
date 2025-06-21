# Firebase Dynamic Links Configuration Guide

This guide explains how to set up Firebase Dynamic Links for email link authentication on mobile platforms (iOS and Android).

## Overview
Firebase Dynamic Links are required for email link authentication to work properly on mobile devices. When users click on sign-in links from their mobile email clients, Dynamic Links ensure they're directed to your mobile app (if installed) or to your web app.

## Prerequisites
- Firebase project already set up ✅
- Email link authentication enabled in Firebase Console ✅
- Mobile apps configured in Firebase Console (when ready for mobile deployment)

## Step 1: Enable Dynamic Links in Firebase Console

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project: `ancient-history-trivia`
3. Navigate to "Dynamic Links" in the left sidebar
4. Click "Get Started" if this is your first time
5. Choose a URL prefix (domain) for your Dynamic Links:
   - Suggested: `ancienthistorytrivia.page.link`
   - Or use a custom domain if you have one

## Step 2: Configure Domain
After creating your Dynamic Link domain, you'll get a domain like:
- `ancienthistorytrivia.page.link` (Firebase subdomain)
- Or your custom domain

## Step 3: Update AuthContext Configuration
Once you have your Dynamic Link domain, uncomment and update the configuration in `src/context/AuthContext.tsx`:

```typescript
const actionCodeSettings = {
  url: window.location.origin + '/auth/signin',
  handleCodeInApp: true,
  iOS: {
    bundleId: 'com.creativequemedia.ancienthistorytrivia'  // Your iOS bundle ID
  },
  android: {
    packageName: 'com.creativequemedia.ancienthistorytrivia',  // Your Android package name
    installApp: true,
    minimumVersion: '1'
  },
  dynamicLinkDomain: 'ancienthistorytrivia.page.link'  // Your Dynamic Link domain
};
```

## Step 4: Mobile App Configuration

### For iOS:
1. In your iOS app, add the Dynamic Link domain to your app's URL schemes
2. Configure Associated Domains in your app's entitlements
3. Handle incoming Dynamic Links in your app delegate

### For Android:
1. Add intent filters to your Android manifest for your Dynamic Link domain
2. Handle incoming Dynamic Links in your main activity

## Step 5: Testing

### Web Testing (Current Setup):
- Email links work on web without Dynamic Links
- Users click email links and are redirected to `/auth/signin`
- EmailLinkHandler processes the sign-in

### Mobile Testing (Future):
- Email links will open in your mobile app (if installed)
- Or fallback to web app if mobile app not installed
- Seamless user experience across platforms

## Current Status
✅ Web email link authentication configured and working
⏳ Dynamic Links setup pending (for mobile deployment)
⏳ iOS/Android app configurations pending

## When to Enable Dynamic Links
Enable Dynamic Links when you're ready to:
1. Deploy to iOS App Store
2. Deploy to Google Play Store
3. Want seamless mobile email link authentication

## Security Notes
- Dynamic Links are publicly accessible but secure
- Email links contain encrypted tokens that expire
- Always validate email link tokens on your backend
- Links expire after 1 hour for security

## Resources
- [Firebase Dynamic Links Documentation](https://firebase.google.com/docs/dynamic-links)
- [Email Link Authentication Guide](https://firebase.google.com/docs/auth/web/email-link-auth)
- [iOS Dynamic Links Setup](https://firebase.google.com/docs/dynamic-links/ios/receive)
- [Android Dynamic Links Setup](https://firebase.google.com/docs/dynamic-links/android/receive)
