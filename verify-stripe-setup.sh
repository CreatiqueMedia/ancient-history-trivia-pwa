#!/bin/bash

# Stripe Live Mode Verification Script
echo "🔍 Verifying Stripe Live Mode Setup"
echo "==================================="

# Check if Firebase CLI is available
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found"
    exit 1
fi

# Check Firebase login
if ! firebase projects:list &> /dev/null; then
    echo "❌ Not logged in to Firebase"
    exit 1
fi

echo "✅ Firebase CLI ready"

# Check Functions config
echo ""
echo "🔧 Checking Firebase Functions configuration..."
firebase functions:config:get > config_check.tmp 2>/dev/null

if grep -q "stripe" config_check.tmp 2>/dev/null; then
    echo "✅ Stripe configuration found in Firebase"
    
    if grep -q "secret_key" config_check.tmp 2>/dev/null; then
        echo "✅ Stripe secret key configured"
    else
        echo "❌ Stripe secret key missing"
        echo "   Run: firebase functions:config:set stripe.secret_key=\"sk_live_YOUR_KEY\""
    fi
    
    if grep -q "webhook_secret" config_check.tmp 2>/dev/null; then
        echo "✅ Webhook secret configured"
    else
        echo "❌ Webhook secret missing"
        echo "   Run: firebase functions:config:set stripe.webhook_secret=\"whsec_YOUR_SECRET\""
    fi
else
    echo "❌ No Stripe configuration found"
    echo "   Run: firebase functions:config:set stripe.secret_key=\"sk_live_YOUR_KEY\""
    echo "   Run: firebase functions:config:set stripe.webhook_secret=\"whsec_YOUR_SECRET\""
fi

rm -f config_check.tmp

# Check environment files
echo ""
echo "📄 Checking environment files..."

if [ -f ".env.production" ]; then
    echo "✅ .env.production exists"
    
    if grep -q "VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_" .env.production; then
        echo "✅ Live publishable key found"
    elif grep -q "VITE_STRIPE_LIVE_PUBLISHABLE_KEY=pk_live_REPLACE" .env.production; then
        echo "⚠️  Publishable key needs to be replaced with real key"
    else
        echo "❌ Live publishable key missing or invalid"
    fi
else
    echo "❌ .env.production not found"
fi

# Check functions directory
echo ""
echo "⚙️  Checking Functions setup..."

if [ -d "functions" ]; then
    echo "✅ Functions directory exists"
    
    if [ -f "functions/src/index.ts" ]; then
        echo "✅ Functions source code exists"
    else
        echo "❌ Functions source code missing"
    fi
    
    if [ -f "functions/package.json" ]; then
        echo "✅ Functions package.json exists"
        
        if [ -d "functions/node_modules" ]; then
            echo "✅ Functions dependencies installed"
        else
            echo "⚠️  Functions dependencies not installed"
            echo "   Run: cd functions && yarn install"
        fi
    else
        echo "❌ Functions package.json missing"
    fi
else
    echo "❌ Functions directory missing"
fi

# Check if functions are built
if [ -d "functions/lib" ]; then
    echo "✅ Functions compiled"
else
    echo "⚠️  Functions not compiled yet"
    echo "   Run: cd functions && yarn build"
fi

echo ""
echo "🎯 Summary:"
echo "==========="

# Count checks
checks_passed=0
total_checks=6

firebase projects:list &> /dev/null && ((checks_passed++))
[ -f ".env.production" ] && ((checks_passed++))
[ -d "functions" ] && ((checks_passed++))
[ -f "functions/src/index.ts" ] && ((checks_passed++))
[ -f "functions/package.json" ] && ((checks_passed++))
[ -d "functions/node_modules" ] && ((checks_passed++))

echo "✅ $checks_passed/$total_checks basic checks passed"

if [ $checks_passed -eq $total_checks ]; then
    echo ""
    echo "🚀 Ready to deploy! Run:"
    echo "   ./deploy-stripe-live.sh"
else
    echo ""
    echo "⚠️  Please complete the setup steps first"
    echo "   See STRIPE_LIVE_SETUP.md for details"
fi

echo ""
echo "📖 For complete setup instructions, see:"
echo "   STRIPE_LIVE_SETUP.md"
