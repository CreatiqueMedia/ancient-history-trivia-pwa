#!/bin/bash

# 🚀 Automated Stripe Setup - Runs after CLI installation
echo "🎉 Stripe CLI installation detected! Starting automated setup..."

# Step 1: Verify installation
echo "📋 Step 1: Verifying Stripe CLI installation..."
stripe --version

# Step 2: Login to Stripe (will open browser)
echo "🔐 Step 2: Logging into your Stripe account..."
echo "This will open your browser for authentication..."
stripe login

# Step 3: Verify login worked
echo "✅ Step 3: Verifying login status..."
stripe config --list

# Step 4: Run the full setup script
echo "🚀 Step 4: Creating products and prices..."
./scripts/stripe-cli-setup.sh

# Step 5: Display API keys
echo "🔑 Step 5: Your API keys:"
echo "Copy these to your .env.production file:"
echo ""
echo "Publishable Key (safe for frontend):"
stripe config --list | grep publishable_key
echo ""
echo "Secret Key (keep secure - for backend only):"
stripe config --list | grep secret_key
echo ""

# Step 6: Show next steps
echo "🎯 Next Steps:"
echo "1. Copy your publishable key to .env.production"
echo "2. Deploy your app: npm run build && firebase deploy"
echo "3. Start making money! 💰"
echo ""
echo "✅ Stripe setup complete! Your app is ready for live payments!"
