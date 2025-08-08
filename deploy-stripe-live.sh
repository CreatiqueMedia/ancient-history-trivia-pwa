#!/bin/bash

# Secure Stripe Live Mode Deployment Script
# This script helps you securely deploy Stripe in live mode

echo "🔒 Setting up Stripe Live Mode with Firebase Functions"
echo "=================================================="

# Check if Yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn not found. Please install it first:"
    echo "npm install -g yarn"
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in to Firebase
if ! firebase projects:list &> /dev/null; then
    echo "❌ Please login to Firebase first:"
    echo "firebase login"
    exit 1
fi

echo ""
echo "⚠️  IMPORTANT SECURITY STEPS:"
echo "================================"
echo ""

echo "1. 📋 Get your Stripe LIVE keys from:"
echo "   https://dashboard.stripe.com/apikeys (make sure you're in LIVE mode!)"
echo ""

echo "2. 🔐 Set your LIVE Stripe secret key (NEVER commit this!):"
echo "   firebase functions:config:set stripe.secret_key=\"sk_live_YOUR_SECRET_KEY\""
echo ""

echo "3. 🎯 Create a webhook endpoint in Stripe Dashboard:"
echo "   URL: https://us-central1-ancient-history-trivia.cloudfunctions.net/stripeWebhook"
echo "   Events: checkout.session.completed, customer.subscription.*, invoice.payment_*"
echo ""

echo "4. 🔑 Set your webhook secret:"
echo "   firebase functions:config:set stripe.webhook_secret=\"whsec_YOUR_WEBHOOK_SECRET\""
echo ""

echo "5. ✏️  Update your .env.production file with your LIVE publishable key:"
echo "   VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY"
echo ""

echo "6. 🚀 Deploy everything:"
echo "   npm run build && firebase deploy"
echo ""

echo "⚠️  SECURITY REMINDERS:"
echo "======================"
echo "✅ Never commit .env files with real keys"
echo "✅ Use Firebase environment config for secrets"
echo "✅ Test with small amounts first"
echo "✅ Monitor Stripe Dashboard for webhooks"
echo "✅ Set up proper error monitoring"
echo ""

read -p "Have you completed steps 1-5 above? (y/N): " -n 1 -r
echo
if [[ ! $REPLYCASE =~ ^[Yy]$ ]]; then
    echo "❌ Please complete the setup steps first!"
    exit 1
fi

echo ""
echo "🏗️  Building and deploying..."

# Build the functions
echo "📦 Building Firebase Functions..."
cd functions && yarn build && cd ..

# Build the frontend
echo "📦 Building frontend..."
yarn build

# Deploy everything
echo "🚀 Deploying to Firebase..."
firebase deploy

echo ""
echo "✅ Deployment complete!"
echo ""
echo "🔍 Next steps:"
echo "1. Test a small purchase to verify everything works"
echo "2. Monitor Stripe Dashboard for webhook delivery"
echo "3. Check Firebase Functions logs if needed: firebase functions:log"
echo "4. Test user access to purchased content"
echo ""
echo "🎉 Your app is now live with Stripe payments!"
