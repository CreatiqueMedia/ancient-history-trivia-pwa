# 🚀 **STRIPE LIVE PAYMENT SETUP GUIDE**

## **STEP 1: ACTIVATE YOUR STRIPE ACCOUNT**

### **1.1 Complete Stripe Account Setup**
1. **Go to**: https://dashboard.stripe.com
2. **Complete Business Information**:
   - Business type and details
   - Tax information (EIN/SSN)
   - Bank account for payouts
   - Identity verification

### **1.2 Get Your Live API Keys**
1. **In Stripe Dashboard**:
   - Click "Developers" → "API keys"
   - Toggle from "Test data" to "Live data" (top right)
   - Copy your **Live Publishable Key** (starts with `pk_live_`)
   - Copy your **Live Secret Key** (starts with `sk_live_`)

## **STEP 2: UPDATE YOUR APP CONFIGURATION**

### **2.1 Add Live Keys to Production Environment**
1. **Open**: `.env.production` (already created for you)
2. **Replace**: `pk_live_YOUR_ACTUAL_LIVE_PUBLISHABLE_KEY_HERE` with your real live publishable key
3. **Save the file**

### **2.2 Set Up Firebase Environment Variables**
```bash
# Set your live Stripe secret key in Firebase
firebase functions:config:set stripe.secret_key="sk_live_YOUR_ACTUAL_SECRET_KEY"
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

## **STEP 3: CREATE FIREBASE CLOUD FUNCTIONS**

### **3.1 Initialize Firebase Functions**
```bash
# In your project root
firebase init functions
# Choose TypeScript
# Install dependencies
```

### **3.2 Install Required Dependencies**
```bash
cd functions
npm install stripe cors express
npm install --save-dev @types/cors
```

### **3.3 Create Payment Processing Functions**

**File: `functions/src/index.ts`**
```typescript
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import Stripe from 'stripe';
import * as cors from 'cors';
import * as express from 'express';

admin.initializeApp();

const stripe = new Stripe(functions.config().stripe.secret_key, {
  apiVersion: '2023-10-16',
});

const app = express();
app.use(cors({ origin: true }));

// Create Payment Intent for Bundle Purchase
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { bundleId, amount, userId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        bundleId,
        userId,
        type: 'bundle_purchase'
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Create Subscription
app.post('/create-subscription', async (req, res) => {
  try {
    const { priceId, userId } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: await getOrCreateCustomer(userId),
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// Webhook Handler
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, functions.config().stripe.webhook_secret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error');
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
      break;
    case 'invoice.payment_succeeded':
      await handleSubscriptionPayment(event.data.object as Stripe.Invoice);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

async function getOrCreateCustomer(userId: string): Promise<string> {
  // Check if customer exists in Firestore
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  
  if (userDoc.exists && userDoc.data()?.stripeCustomerId) {
    return userDoc.data()!.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    metadata: { userId }
  });

  // Save customer ID to Firestore
  await admin.firestore().collection('users').doc(userId).set({
    stripeCustomerId: customer.id
  }, { merge: true });

  return customer.id;
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { bundleId, userId } = paymentIntent.metadata;
  
  // Grant access to bundle
  await admin.firestore().collection('users').doc(userId).set({
    purchasedBundles: admin.firestore.FieldValue.arrayUnion(bundleId)
  }, { merge: true });
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  
  // Find user by customer ID
  const usersQuery = await admin.firestore()
    .collection('users')
    .where('stripeCustomerId', '==', customerId)
    .get();

  if (!usersQuery.empty) {
    const userId = usersQuery.docs[0].id;
    
    // Grant premium access
    await admin.firestore().collection('users').doc(userId).set({
      isPremium: true,
      premiumExpiresAt: new Date(invoice.period_end * 1000)
    }, { merge: true });
  }
}

export const payments = functions.https.onRequest(app);
```

## **STEP 4: CREATE STRIPE PRODUCTS AND PRICES**

### **4.1 Create Products in Stripe Dashboard**
1. **Go to**: Products → Add product
2. **Create these products**:
   - Ancient Egypt Bundle ($4.99)
   - Roman Empire Bundle ($4.99)
   - Ancient Greece Bundle ($4.99)
   - Mesopotamia Bundle ($4.99)
   - Ancient China Bundle ($4.99)
   - Monthly Premium ($4.99/month)
   - Annual Premium ($39.99/year)
   - Biennial Premium ($69.99/2 years)

### **4.2 Copy Price IDs**
After creating products, copy the Price IDs (start with `price_`) and update your app configuration.

## **STEP 5: DEPLOY AND TEST**

### **5.1 Deploy Firebase Functions**
```bash
firebase deploy --only functions
```

### **5.2 Update Your App's API Endpoints**
Update your `createPaymentIntent` and `createSubscription` functions to call your Firebase Cloud Functions instead of the mock implementations.

### **5.3 Set Up Webhooks**
1. **In Stripe Dashboard**: Developers → Webhooks
2. **Add endpoint**: `https://YOUR_PROJECT.cloudfunctions.net/payments/webhook`
3. **Select events**:
   - `payment_intent.succeeded`
   - `invoice.payment_succeeded`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## **STEP 6: GO LIVE!**

### **6.1 Final Checklist**
- ✅ Stripe account fully activated
- ✅ Live API keys configured
- ✅ Firebase Cloud Functions deployed
- ✅ Products and prices created in Stripe
- ✅ Webhooks configured
- ✅ App deployed with production environment

### **6.2 Test Live Payments**
1. **Use real credit card** (start with small amounts)
2. **Verify webhook delivery** in Stripe Dashboard
3. **Check Firestore** for user access updates
4. **Test subscription flows**

## **🎉 CONGRATULATIONS!**

Your app is now processing **REAL PAYMENTS** and generating **REAL REVENUE**!

### **Revenue Tracking**
- **Stripe Dashboard**: Real-time revenue analytics
- **Firebase Analytics**: User behavior and conversion tracking
- **Your Bank Account**: Automatic payouts from Stripe

### **Next Steps**
1. **Monitor payments** daily for the first week
2. **Set up alerts** for failed payments
3. **Launch marketing campaigns** to drive traffic
4. **Scale up** based on demand

**You're now officially in business!** 💰🚀
