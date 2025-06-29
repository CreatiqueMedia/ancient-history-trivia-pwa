# Payment Testing Guide for Ancient History Trivia

This document provides a comprehensive guide for testing the payment functionality of the Ancient History Trivia app locally on your development machine before deploying to production or submitting to app stores.

## Table of Contents

1. [Setting Up Local Development Environment](#setting-up-local-development-environment)
2. [Testing Stripe Payments (Web/PWA)](#testing-stripe-payments-webpwa)
3. [Testing PWA Functionality](#testing-pwa-functionality)
4. [Simulating RevenueCat (App Store Versions)](#simulating-revenuecat-app-store-versions)
5. [Testing Cross-Platform Synchronization](#testing-cross-platform-synchronization)
6. [Testing Firebase Integration](#testing-firebase-integration)
7. [Debugging Tips](#debugging-tips)
8. [Testing Checklist](#testing-checklist)

## Setting Up Local Development Environment

First, start your development server:

```bash
yarn dev
```

This will run the app locally, typically at http://localhost:5173 or another port if 5173 is in use.

## Testing Stripe Payments (Web/PWA)

Stripe provides excellent tools for testing payments without using real credit cards:

### Configure Stripe Test Mode

1. Create a Stripe account if you don't have one: https://dashboard.stripe.com/register
2. Get your test API keys from the Stripe Dashboard
3. Update `src/config/payment.ts` with your Stripe test publishable key:

```typescript
const STRIPE_PUBLISHABLE_KEY = 'pk_test_your_test_key_here';
```

### Use Stripe Test Cards

The app is currently configured with Stripe test mode using the test key `pk_test_51NxSampleKeyForTestingPurposesOnly`. This means **NO REAL MONEY** will be charged and you can safely test with these Stripe test card numbers:

#### **✅ Recommended for Testing - Always Successful:**
- **Card Number**: `4242 4242 4242 4242`
- **Expiration**: Any future date (e.g., `12/25`, `01/26`)
- **CVC**: Any 3 digits (e.g., `123`)
- **ZIP Code**: Any postal code (e.g., `12345`)

#### **🔐 Payment Requiring Authentication:**
- **Card Number**: `4000 0025 0000 3155`
- **Expiration**: Any future date
- **CVC**: Any 3 digits
- **ZIP Code**: Any postal code

#### **❌ Declined Payment (For Error Testing):**
- **Card Number**: `4000 0000 0000 0002`
- **Expiration**: Any future date
- **CVC**: Any 3 digits
- **ZIP Code**: Any postal code

**Important**: All transactions are simulated in test mode. No real credit cards are needed and no actual charges will occur.

### Test Web Payment Flow

1. Open your app in Chrome: http://localhost:5173
2. Navigate to the Store screen
3. Try to purchase a bundle
4. When the payment modal appears, use a test card
5. Verify the purchase completes successfully
6. Check that the content is unlocked

## Testing PWA Functionality

To test as a PWA:

1. In Chrome, open http://localhost:5173
2. Open Chrome DevTools (F12 or Right-click > Inspect)
3. Go to Application > Manifest
4. Click "Add to homescreen" or use the install prompt
5. Open the installed PWA
6. Verify the platform detection correctly identifies it as a PWA
7. Test the purchase flow again

## Simulating RevenueCat (App Store Versions)

Since you can't fully test App Store purchases locally, we'll simulate them:

### Enable RevenueCat Simulation

Add this to `src/config/payment.ts`:

```typescript
// For local testing only
export const simulateRevenueCat = true;
```

And modify the RevenueCat functions to use simulation when enabled:

```typescript
export const purchaseBundleWithRevenueCat = async (bundleId: string): Promise<boolean> => {
  if (simulateRevenueCat) {
    console.log('SIMULATING RevenueCat purchase for bundle:', bundleId);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true; // Simulate successful purchase
  }
  
  // Real implementation (will not be called during simulation)
  // ...
};
```

### Simulate iOS/Android Environment

To test platform detection, you can override the platform detection in `src/utils/platform.ts`:

```typescript
// For testing only - set to 'ios', 'android', 'pwa', or 'web'
const OVERRIDE_PLATFORM: Platform | null = 'ios';

export const isPlatform = (platform: Platform): boolean => {
  if (OVERRIDE_PLATFORM) {
    return platform === OVERRIDE_PLATFORM;
  }
  
  // Original implementation
  // ...
};
```

### Test App Store Purchase Flow

1. Set `OVERRIDE_PLATFORM = 'ios'` in platform.ts
2. Restart your development server
3. Open http://localhost:5173
4. Navigate to the Store screen
5. Try to purchase a bundle
6. Verify the RevenueCat simulation is triggered (check console logs)
7. Verify the purchase is recorded and content is unlocked

## Testing Cross-Platform Synchronization

To test if purchases sync across platforms:

1. Make a purchase in "iOS mode" (OVERRIDE_PLATFORM = 'ios')
2. Change to "web mode" (OVERRIDE_PLATFORM = null)
3. Restart the app and verify the purchase is still accessible
4. Make another purchase in "web mode"
5. Switch back to "iOS mode" and verify both purchases are accessible

## Testing Firebase Integration

For complete testing, you'll need Firebase Emulators:

```bash
# Install Firebase CLI if you haven't already
npm install -g firebase-tools

# Start Firebase emulators
firebase emulators:start
```

This will emulate Firestore and Cloud Functions locally, allowing you to test the full purchase flow including server-side components.

### Setting Up Firebase Cloud Functions Locally

To test the complete payment flow with server-side components:

1. Create a Firebase Cloud Functions project:

```bash
mkdir -p functions
cd functions
firebase init functions
```

2. Implement the payment intent creation function:

```typescript
// functions/src/index.ts
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';

admin.initializeApp();
const stripe = new Stripe('sk_test_your_test_secret_key', {
  apiVersion: '2023-10-16',
});

export const createPaymentIntent = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be logged in');
  }

  const { bundleId, amount } = data;
  
  // Create a payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      bundleId,
      userId: context.auth.uid
    }
  });
  
  return {
    clientSecret: paymentIntent.client_secret
  };
});
```

3. Deploy to the local emulator:

```bash
firebase emulators:start
```

4. Update your app to use the local emulator:

```typescript
// In src/config/firebase.ts
if (process.env.NODE_ENV === 'development') {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
```

## Debugging Tips

### Check Browser Console

The payment system logs detailed information to the console:

1. Open Chrome DevTools (F12)
2. Go to the Console tab
3. Look for logs related to platform detection and payment processing

### Inspect Network Requests

To debug Stripe API calls:

1. Open Chrome DevTools
2. Go to the Network tab
3. Filter by "stripe"
4. Make a purchase and observe the API calls

### Verify Local Storage

Check if purchases are properly stored:

1. Open Chrome DevTools
2. Go to Application > Storage > Local Storage
3. Look for keys like 'ownedBundles' and 'subscription'

### Testing Stripe Webhooks Locally

For testing Stripe webhooks locally:

1. Install the Stripe CLI: https://stripe.com/docs/stripe-cli
2. Forward webhooks to your local server:

```bash
stripe listen --forward-to http://localhost:5001/your-project/us-central1/stripeWebhook
```

3. Trigger test webhook events:

```bash
stripe trigger payment_intent.succeeded
```

## Testing Checklist

Use this checklist to ensure you've thoroughly tested the payment functionality:

- [ ] Web purchase flow works with Stripe test cards
- [ ] PWA detection works correctly
- [ ] Simulated iOS/Android purchases work
- [ ] Purchases are recorded in local storage
- [ ] Subscription status is correctly tracked
- [ ] Content unlocks properly after purchase
- [ ] Restore purchases functionality works
- [ ] Cross-platform synchronization works
- [ ] Firebase Cloud Functions work correctly
- [ ] Error handling works as expected
- [ ] Payment forms validate input correctly
- [ ] Payment modal displays and closes properly
- [ ] Platform detection correctly identifies the environment
- [ ] Stripe webhooks process events correctly

## Common Issues and Solutions

### Platform Detection Not Working

If platform detection isn't working correctly:

1. Check the user agent string:

```javascript
console.log(navigator.userAgent);
```

2. Verify the platform detection logic in `src/utils/platform.ts`
3. Use the `OVERRIDE_PLATFORM` variable for testing

### Stripe Payment Form Not Appearing

If the Stripe payment form doesn't appear:

1. Check for JavaScript errors in the console
2. Verify that Stripe is properly initialized
3. Check that the PaymentModal component is rendered in the DOM

### RevenueCat Simulation Not Working

If RevenueCat simulation isn't working:

1. Verify that `simulateRevenueCat` is set to `true`
2. Check that the platform is correctly detected as iOS or Android
3. Look for simulation logs in the console

### Firebase Cloud Functions Not Working

If Firebase Cloud Functions aren't working:

1. Verify that the emulator is running
2. Check that your app is configured to use the emulator
3. Look for errors in the Firebase emulator logs

## Conclusion

By following this testing guide, you can thoroughly test the payment functionality of the Ancient History Trivia app locally on your development machine before deploying to production or submitting to app stores. This ensures a smooth and reliable payment experience for your users across all platforms.

Remember that while local testing is valuable, it's also important to test in a staging environment that closely resembles production before final deployment.
