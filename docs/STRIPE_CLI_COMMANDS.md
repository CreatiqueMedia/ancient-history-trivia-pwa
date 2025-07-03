# 💻 **STRIPE CLI QUICK REFERENCE**

## 🚀 **SETUP COMMANDS**

### **Initial Setup**
```bash
# Install Stripe CLI (already running)
brew install stripe/stripe-cli/stripe

# Login to your Stripe account
stripe login

# Run automated setup script
./scripts/stripe-cli-setup.sh
```

### **Get Your API Keys**
```bash
# View all configuration
stripe config --list

# Get just your publishable key
stripe config --list | grep publishable_key

# Get just your secret key (keep secure!)
stripe config --list | grep secret_key
```

## 📦 **PRODUCT MANAGEMENT**

### **Create Products**
```bash
# Create a bundle product
stripe products create \
  --name "Ancient Egypt Bundle" \
  --description "Premium questions about Ancient Egyptian civilization" \
  --metadata bundle_id=egypt

# List all products
stripe products list

# Get specific product
stripe products retrieve prod_XXXXXXXXXX
```

### **Create Prices**
```bash
# Create $4.99 price for a product
stripe prices create \
  --product prod_XXXXXXXXXX \
  --unit-amount 499 \
  --currency usd

# Create recurring price (subscription)
stripe prices create \
  --product prod_XXXXXXXXXX \
  --unit-amount 499 \
  --currency usd \
  --recurring interval=month

# List all prices
stripe prices list
```

## 💳 **PAYMENT TESTING**

### **Create Test Payment**
```bash
# Create a payment intent
stripe payment_intents create \
  --amount 499 \
  --currency usd \
  --metadata bundle_id=egypt

# List recent payments
stripe payment_intents list --limit 10
```

### **Customer Management**
```bash
# Create a customer
stripe customers create \
  --email customer@example.com \
  --name "Test Customer"

# List customers
stripe customers list

# Get customer details
stripe customers retrieve cus_XXXXXXXXXX
```

## 🔗 **WEBHOOK TESTING**

### **Local Webhook Testing**
```bash
# Forward webhooks to local development
stripe listen --forward-to localhost:5001/ancient-history-trivia/us-central1/payments/webhook

# Forward specific events only
stripe listen \
  --events payment_intent.succeeded,invoice.payment_succeeded \
  --forward-to localhost:5001/ancient-history-trivia/us-central1/payments/webhook

# Test a specific webhook event
stripe trigger payment_intent.succeeded
```

## 📊 **MONITORING & ANALYTICS**

### **View Recent Activity**
```bash
# Recent events
stripe events list --limit 10

# Recent charges
stripe charges list --limit 10

# Recent subscriptions
stripe subscriptions list --limit 10

# Balance and payouts
stripe balance retrieve
stripe payouts list --limit 5
```

## 🛠 **USEFUL UTILITIES**

### **Data Export**
```bash
# Export products to JSON
stripe products list --limit 100 > products.json

# Export customers to JSON
stripe customers list --limit 100 > customers.json

# Export payments to JSON
stripe payment_intents list --limit 100 > payments.json
```

### **Account Information**
```bash
# View account details
stripe accounts retrieve

# Check API version
stripe --version

# View current configuration
stripe config --list
```

## 🎯 **QUICK SETUP FOR YOUR APP**

### **1. After CLI Installation**
```bash
# Login and setup
stripe login
./scripts/stripe-cli-setup.sh
```

### **2. Copy Keys to Environment**
```bash
# Get your keys
stripe config --list

# Add to .env.production
echo "VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_YOUR_KEY" >> .env.production
```

### **3. Test Webhook Integration**
```bash
# Start local webhook forwarding
stripe listen --forward-to localhost:5001/ancient-history-trivia/us-central1/payments/webhook

# In another terminal, trigger test payment
stripe trigger payment_intent.succeeded
```

## 🚨 **IMPORTANT SECURITY NOTES**

- **Never commit secret keys** to version control
- **Use test keys** in development
- **Use live keys** only in production
- **Rotate keys** if compromised
- **Monitor webhook endpoints** for security

## 💰 **REVENUE TRACKING**

### **Daily Revenue Check**
```bash
# Today's payments
stripe payment_intents list \
  --created[gte]=$(date -d "today 00:00" +%s) \
  --limit 100

# This month's revenue
stripe payment_intents list \
  --created[gte]=$(date -d "$(date +%Y-%m-01)" +%s) \
  --limit 100
```

### **Subscription Metrics**
```bash
# Active subscriptions
stripe subscriptions list --status active

# Canceled subscriptions
stripe subscriptions list --status canceled

# Trial subscriptions
stripe subscriptions list --status trialing
```

## 🎉 **SUCCESS INDICATORS**

When everything is working:
- ✅ `stripe login` succeeds
- ✅ `stripe products list` shows your bundles
- ✅ `stripe prices list` shows $4.99 prices
- ✅ `stripe listen` receives webhook events
- ✅ Test payments complete successfully

**Your Stripe CLI is now ready to manage your revenue-generating app!** 🚀💰
