# 🚀 Stripe Hosted Checkout Setup Guide

## 🎯 Overview
This guide will help you set up Stripe Hosted Checkout for your Ancient History Trivia app. This approach costs **$0/month** in infrastructure and can be implemented in **30 minutes**.

## 💰 Cost Breakdown
- **Infrastructure**: $0/month
- **Stripe fees**: 2.9% + $0.30 per transaction
- **Example**: $29.99 subscription = $28.82 profit ($1.17 to Stripe)

## 📋 Step 1: Create Stripe Payment Links

### 1.1 Go to Stripe Dashboard
- Visit: https://dashboard.stripe.com
- Navigate to: **Products** → **Payment Links**

### 1.2 Create Your Subscription Plans

#### Pro Monthly ($29.99/month)
1. Click **"Create payment link"**
2. **Product name**: "Ancient History Trivia Pro - Monthly"
3. **Price**: $29.99
4. **Billing**: Recurring monthly
5. **Description**: "Unlock all quiz bundles and premium features"
6. **Success URL**: `https://ancient-history-trivia.web.app/success?plan=monthly`
7. **Cancel URL**: `https://ancient-history-trivia.web.app/cancel`
8. Click **"Create link"**
9. **Copy the payment link** (starts with `https://buy.stripe.com/`)

#### Pro Annual ($199.99/year)
1. Click **"Create payment link"**
2. **Product name**: "Ancient History Trivia Pro - Annual"
3. **Price**: $199.99
4. **Billing**: Recurring yearly
5. **Description**: "Unlock all quiz bundles and premium features - Save $159/year!"
6. **Success URL**: `https://ancient-history-trivia.web.app/success?plan=annual`
7. **Cancel URL**: `https://ancient-history-trivia.web.app/cancel`
8. Click **"Create link"**
9. **Copy the payment link**

#### Individual Bundles ($4.99 each)
Create payment links for each bundle:
- Ancient Egypt Bundle
- Roman Empire Bundle
- Ancient Greece Bundle
- Mesopotamia Bundle
- Ancient China Bundle

## 📋 Step 2: Update Your App

### 2.1 Create Stripe Configuration
```typescript
// src/config/stripe.ts
export const STRIPE_PAYMENT_LINKS = {
  monthly: 'https://buy.stripe.com/YOUR_MONTHLY_LINK',
  annual: 'https://buy.stripe.com/YOUR_ANNUAL_LINK',
  bundles: {
    egypt: 'https://buy.stripe.com/YOUR_EGYPT_LINK',
    rome: 'https://buy.stripe.com/YOUR_ROME_LINK',
    greece: 'https://buy.stripe.com/YOUR_GREECE_LINK',
    mesopotamia: 'https://buy.stripe.com/YOUR_MESOPOTAMIA_LINK',
    china: 'https://buy.stripe.com/YOUR_CHINA_LINK'
  }
};

export const redirectToStripeCheckout = (plan: string) => {
  const link = STRIPE_PAYMENT_LINKS[plan as keyof typeof STRIPE_PAYMENT_LINKS];
  if (link) {
    window.location.href = link;
  }
};
```

### 2.2 Update Subscription Screen
```typescript
// In your SubscriptionScreen component
import { redirectToStripeCheckout } from '../config/stripe';

const handleSubscribe = (plan: 'monthly' | 'annual') => {
  redirectToStripeCheckout(plan);
};
```

### 2.3 Handle Return Users
```typescript
// Create src/screens/SuccessScreen.tsx
import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const SuccessScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan');

  useEffect(() => {
    // Grant premium access
    localStorage.setItem('isPremium', 'true');
    localStorage.setItem('subscriptionPlan', plan || 'monthly');
    localStorage.setItem('subscriptionDate', new Date().toISOString());
    
    // Redirect to home after 3 seconds
    setTimeout(() => {
      window.location.href = '/';
    }, 3000);
  }, [plan]);

  return (
    <div className="success-screen">
      <h1>🎉 Welcome to Pro!</h1>
      <p>Your subscription is now active. Redirecting...</p>
    </div>
  );
};
```

## 📋 Step 3: Customer Portal Setup

### 3.1 Create Customer Portal
1. In Stripe Dashboard: **Settings** → **Customer portal**
2. **Enable customer portal**
3. **Configure settings**:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Allow customers to view invoices
4. **Copy the portal URL**

### 3.2 Add Portal Link to Your App
```typescript
// Add to your user settings/profile page
const openCustomerPortal = () => {
  window.open('https://billing.stripe.com/p/login/YOUR_PORTAL_LINK', '_blank');
};
```

## 📋 Step 4: Test the Flow

### 4.1 Test Mode
1. Use Stripe test card: `4242 4242 4242 4242`
2. Any future expiry date
3. Any 3-digit CVC
4. Test the complete flow

### 4.2 Go Live
1. **Activate your Stripe account** (complete business verification)
2. **Switch to live mode** in Stripe Dashboard
3. **Update payment links** to live versions
4. **Test with real card** (small amount first)

## 🔧 Advanced Features

### Webhook Integration (Optional)
If you want real-time subscription updates:

1. **Create webhook endpoint**: `https://your-domain.com/webhook`
2. **Listen for events**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
3. **Update user status** in your database

### Analytics Integration
Track subscription events:
```typescript
// When user subscribes
gtag('event', 'purchase', {
  transaction_id: 'subscription_id',
  value: 29.99,
  currency: 'USD',
  items: [{
    item_id: 'pro_monthly',
    item_name: 'Pro Monthly Subscription',
    category: 'subscription',
    quantity: 1,
    price: 29.99
  }]
});
```

## 🎉 Benefits of This Approach

### ✅ Advantages
- **$0/month infrastructure cost**
- **30-minute setup time**
- **PCI compliant automatically**
- **Mobile optimized**
- **Stripe handles everything**
- **Professional checkout experience**
- **Built-in fraud protection**
- **Automatic receipt emails**
- **Customer portal included**

### ❌ Limitations
- **Users leave your site during payment**
- **Less customization options**
- **Can't capture additional data during checkout**

## 🚀 Next Steps

1. **Create payment links** in Stripe Dashboard
2. **Update your app** with the payment links
3. **Test the flow** thoroughly
4. **Go live** and start earning!

## 💡 Pro Tips

1. **Use descriptive product names** for better conversion
2. **Set up email receipts** in Stripe settings
3. **Monitor failed payments** in Stripe Dashboard
4. **Set up alerts** for successful payments
5. **Use Stripe's analytics** to track revenue

**You'll be accepting real payments within the hour!** 🎯💰
