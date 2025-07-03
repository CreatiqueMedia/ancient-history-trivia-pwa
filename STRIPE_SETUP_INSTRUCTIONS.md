# 🚀 **STRIPE CLI SETUP - READY TO RUN**

## ⏳ **CURRENT STATUS**
- ✅ Stripe CLI installation in progress (`brew install stripe/stripe-cli/stripe`)
- ✅ Setup script created and ready (`scripts/stripe-cli-setup.sh`)
- ✅ CLI commands reference created (`docs/STRIPE_CLI_COMMANDS.md`)

## 🎯 **ONCE BREW INSTALLATION COMPLETES**

### **Step 1: Verify Installation**
```bash
stripe --version
```

### **Step 2: Login to Stripe**
```bash
stripe login
```
*This will open your browser to authenticate with your existing Stripe account*

### **Step 3: Run the Automated Setup**
```bash
./scripts/stripe-cli-setup.sh
```

### **Step 4: Get Your API Keys**
```bash
stripe config --list
```

## 💰 **WHAT THE SCRIPT WILL CREATE**

### **Products ($4.99 each):**
- Ancient Egypt Bundle
- Roman Empire Bundle  
- Ancient Greece Bundle
- Mesopotamia Bundle
- Ancient China Bundle

### **Subscriptions:**
- Premium Monthly ($4.99/month)
- Premium Annual ($39.99/year)
- Premium Biennial ($69.99/2 years)

## 🔑 **NEXT STEPS AFTER SETUP**

1. **Copy your live publishable key** from `stripe config --list`
2. **Update `.env.production`** with your real key
3. **Deploy your app** with live payment processing
4. **Start making money!** 💰

## ⚡ **QUICK COMMANDS TO REMEMBER**

```bash
# Check installation status
which stripe

# Login to your account
stripe login

# Run full setup
./scripts/stripe-cli-setup.sh

# Get your keys
stripe config --list

# List your products
stripe products list

# Test a payment
stripe trigger payment_intent.succeeded
```

## 🎉 **YOU'RE ALMOST READY!**

Once the brew installation finishes, you're just 3 commands away from live payments:

1. `stripe login`
2. `./scripts/stripe-cli-setup.sh`  
3. Update your `.env.production` file

**Your Ancient History Trivia app will be generating real revenue within minutes!** 🏛️💰
