# 🍎 Apple Sign-In Setup Guide

Apple Sign-In is currently disabled due to the `auth/operation-not-allowed` error. This guide will help you enable it properly.

## 🚫 Current Status
- **Status**: Disabled
- **Error**: `auth/operation-not-allowed`
- **Reason**: Apple Sign-In provider not enabled in Firebase Console

## 🔧 How to Enable Apple Sign-In

### ⚠️ Important Note: Firebase Console Required
**The Firebase CLI does not support configuring authentication providers.** You must use the Firebase Console web interface to enable Apple Sign-In.

### Step 1: Firebase Console Configuration (REQUIRED)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/project/ancient-history-trivia/authentication/providers
   - Navigate to: Authentication → Sign-in method

2. **Enable Apple Provider**
   - Click on "Apple" in the Sign-in providers list
   - Toggle "Enable" to ON
   - You'll need to configure the following:

### 🚫 Why Not Firebase CLI?
- Firebase CLI focuses on deployment and data management
- Authentication provider configuration requires OAuth credentials and certificates
- Firebase Console provides the secure interface for managing sensitive auth data
- No current CLI commands exist for: `firebase auth:providers:enable` or similar

### Step 2: Apple Developer Account Setup

**Prerequisites:**
- Apple Developer Account ($99/year)
- Access to Apple Developer Console

**Required Steps:**

1. **Create App ID**
   - Go to: https://developer.apple.com/account/resources/identifiers/list
   - Create new App ID for your app
   - Enable "Sign In with Apple" capability

2. **Create Service ID**
   - Create a new Service ID (this will be your OAuth client ID)
   - Configure it for "Sign In with Apple"
   - Add your domains:
     - `ancient-history-trivia.firebaseapp.com`
     - `ancient-history-trivia.web.app`
     - Any other domains you use

3. **Create Private Key**
   - Generate a private key for "Sign In with Apple"
   - Download the .p8 file (keep it secure!)
   - Note the Key ID

### Step 3: Firebase Configuration

Back in Firebase Console, you'll need to provide:

1. **Service ID**: The Service ID you created in Apple Developer Console
2. **Apple Team ID**: Found in Apple Developer Account membership details
3. **Key ID**: From the private key you created
4. **Private Key**: Contents of the .p8 file

### Step 4: Code Configuration (Already Done)

The code is already configured for Apple Sign-In:

```typescript
// Firebase config (src/config/firebase.ts)
export const appleProvider = new OAuthProvider('apple.com');
appleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.setCustomParameters({
  locale: 'en'
});

// Auth context (src/context/AuthContext.tsx)
const signInWithApple = async () => {
  const result = await signInWithPopup(auth, appleProvider);
  // Handle success...
};
```

### Step 5: Enable in UI

Once Apple Sign-In is configured in Firebase, update the code:

1. **Enable in AuthModal.tsx**:
   ```typescript
   // Change this line:
   {false && (
   // To this:
   {true && (
   ```

2. **Enable in FirebaseAuthUI.tsx**:
   ```typescript
   // Uncomment these lines:
   {
     provider: 'apple.com'
   },
   ```

## 🧪 Testing Apple Sign-In

### Development Testing
- Apple Sign-In only works on HTTPS domains
- Test on Firebase Hosting: `https://ancient-history-trivia.web.app`
- Cannot test on localhost

### Production Testing
- Test on all configured domains
- Verify email and name scopes work correctly
- Test on both desktop and mobile Safari

## 🔒 Security Considerations

1. **Private Key Security**
   - Never commit the .p8 file to version control
   - Store securely in Firebase Console only
   - Rotate keys periodically

2. **Domain Verification**
   - Only add trusted domains to Apple configuration
   - Verify all domains are under your control

3. **Scope Limitations**
   - Apple provides limited user data
   - Email may be hidden/proxied by Apple
   - Name is only provided on first sign-in

## 🚨 Common Issues

### "operation-not-allowed" Error
- **Cause**: Apple provider not enabled in Firebase
- **Solution**: Complete Steps 1-3 above

### "Unable to find a team with the given Team ID" Error
- **Cause**: Incorrect Team ID or new Apple Developer Account not fully activated
- **Solutions**:
  1. **Find your correct Team ID**:
     - Go to: https://developer.apple.com/account#MembershipDetailsCard
     - Look for "Team ID" in Membership Details (10-character string)
  2. **Wait for account activation**:
     - New Apple Developer Accounts can take 24-48 hours to fully activate
     - All services may not be immediately available
  3. **Check account status**:
     - Ensure payment has been processed
     - Verify account is in good standing
     - Contact Apple Developer Support if needed

### "unauthorized-domain" Error
- **Cause**: Domain not configured in Apple Developer Console
- **Solution**: Add domain to Service ID configuration

### "popup-blocked" Error
- **Cause**: Browser blocking popup
- **Solution**: Already handled with fallback to redirect

### New Apple Developer Account Issues
- **Account Activation**: Can take 24-48 hours
- **Team ID Assignment**: May be delayed for new accounts
- **Service Availability**: Some features may not be immediately accessible
- **Payment Processing**: Ensure payment has been fully processed

## 💰 Cost Considerations

- **Apple Developer Account**: $99/year
- **Firebase**: No additional cost for Apple Sign-In
- **Maintenance**: Periodic key rotation and domain updates

## 🎯 Alternative Solutions

If you don't want to set up Apple Sign-In:

1. **Keep it disabled** (current state)
2. **Focus on Google + Email authentication**
3. **Add other providers** (GitHub, Microsoft, etc.)

## 📝 Current Implementation Status

- ✅ Code implementation complete
- ✅ Error handling implemented
- ✅ UI temporarily disabled
- ❌ Firebase Console configuration needed
- ❌ Apple Developer Account setup needed

## 🔄 Re-enabling Process

Once Apple Sign-In is properly configured:

1. Update Firebase Console settings
2. Change `{false &&` to `{true &&` in AuthModal.tsx
3. Uncomment Apple provider in FirebaseAuthUI.tsx
4. Test on Firebase Hosting domain
5. Deploy updated code

---

**Note**: Apple Sign-In is currently disabled to prevent the `auth/operation-not-allowed` error. Users can still authenticate using Google Sign-In, email/password, or anonymous sign-in.
