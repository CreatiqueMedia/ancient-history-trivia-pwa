# 🔒 Stripe Live Mode Security Setup Guide

## Overview
This guide helps you securely configure Stripe live mode with proper key management and Firebase Functions backend.

## ⚠️ Security First!

### 🔐 Environment Variables Security
- **NEVER commit `.env` files with real keys to Git**
- Use Firebase Functions config for server-side secrets
- Frontend only gets publishable keys (safe to expose)
- All secret keys stay on the server

## 🚀 Step-by-Step Setup

### 1. Get Your Stripe Live Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to LIVE mode** (toggle in top-right)
3. Go to **Developers > API Keys**
4. Copy your **Publishable key** (starts with `pk_live_`)
5. Copy your **Secret key** (starts with `sk_live_`)

### 2. Configure Firebase Functions (Server-Side Secrets)

```bash
# Set your LIVE secret key (NEVER commit this!)
firebase functions:config:set stripe.secret_key="sk_live_YOUR_ACTUAL_SECRET_KEY"

# You'll set the webhook secret after step 4
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

### 3. Update Frontend Environment

Edit `.env.production`:
```bash
# Replace with your actual live publishable key
VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_PUBLISHABLE_KEY
```

### 4. Create Stripe Webhook

1. In Stripe Dashboard (LIVE mode), go to **Developers > Webhooks**
2. Click **Add endpoint**
3. URL: `https://us-central1-ancient-history-trivia.cloudfunctions.net/stripeWebhook`
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Webhook signing secret** (starts with `whsec_`)

### 5. Set Webhook Secret

```bash
firebase functions:config:set stripe.webhook_secret="whsec_YOUR_WEBHOOK_SECRET"
```

### 6. Deploy Everything

```bash
# Run the secure deployment script
./deploy-stripe-live.sh

# OR manually:
cd functions && yarn build && cd ..
yarn build
firebase deploy
```

## 🧪 Testing

### Test with Small Amounts First!
1. Create a test purchase for $0.50
2. Verify webhook delivery in Stripe Dashboard
3. Check user gets access in your app
4. Monitor Firebase Functions logs

### Monitoring Commands
```bash
# Check Functions logs
firebase functions:log

# Check Stripe webhook deliveries
# (Go to Stripe Dashboard > Developers > Webhooks)

# Test Functions locally
firebase emulators:start --only functions

# Build functions
yarn functions:build
```

## 🔍 Security Checklist

### ✅ Before Going Live
- [ ] All test keys removed from code
- [ ] Live secret key set in Firebase config only
- [ ] Webhook endpoint configured and tested
- [ ] Small test purchase completed successfully
- [ ] User access granted correctly after purchase
- [ ] Environment files added to `.gitignore`

### ✅ After Going Live
- [ ] Monitor Stripe Dashboard for failed webhooks
- [ ] Set up error alerts in Firebase
- [ ] Regular backup of user purchase data
- [ ] Monitor for failed payments

## 🚨 Emergency Procedures

### If Keys Are Compromised
1. **Immediately** rotate keys in Stripe Dashboard
2. Update Firebase Functions config with new keys
3. Redeploy: `firebase deploy --only functions`
4. Update frontend environment and redeploy

### If Webhooks Fail
1. Check Firebase Functions logs: `firebase functions:log`
2. Verify webhook endpoint URL in Stripe
3. Check webhook signing secret matches
4. Manually retry failed webhooks in Stripe Dashboard

## 📞 Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Firebase Functions**: https://firebase.google.com/docs/functions
- **Your App Logs**: `firebase functions:log`
- **Stripe Dashboard**: https://dashboard.stripe.com

## 🎯 Key Files Structure

```
your-app/
├── .env.production              # Frontend environment (publishable key)
├── functions/
│   ├── src/index.ts            # Secure backend functions
│   └── package.json            # Functions dependencies
├── firebase.json               # Firebase configuration
└── deploy-stripe-live.sh       # Deployment script
```

## 💡 Best Practices

1. **Always test first** with small amounts
2. **Monitor webhook deliveries** regularly
3. **Keep backups** of user purchase data
4. **Use proper error handling** in all payment flows
5. **Set up monitoring alerts** for failed payments
6. **Review Stripe logs** weekly for issues

---

**Remember**: Real money is involved in live mode. Always test thoroughly and monitor closely! 💰
