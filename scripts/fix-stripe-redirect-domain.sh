#!/bin/bash

# Fix Stripe Payment Links to use correct redirect domain
# Update payment links to use the correct domain: ancient-history-trivia.web.app

echo "🔧 FIXING STRIPE PAYMENT LINK REDIRECT DOMAINS"
echo "=============================================="
echo ""

echo "❌ PROBLEM: Some payment links redirect to removed domain"
echo "✅ SOLUTION: Update to ancient-history-trivia.web.app/success"
echo ""

# Payment links that need to be updated (redirecting to old domain)
OLD_PAYMENT_LINKS=(
    "plink_1RgoetATHmLCupn7HqGxJZtE"
    "plink_1Rgof3ATHmLCupn7GjAqUdcQ" 
    "plink_1RgofHATHmLCupn791eWxV9a"
)

echo "🔄 UPDATING PAYMENT LINKS..."
echo ""

for payment_link in "${OLD_PAYMENT_LINKS[@]}"; do
    echo "Updating payment link: $payment_link"
    
    # Note: Stripe doesn't allow updating payment link redirect URLs after creation
    # We need to create new payment links with correct redirect URLs
    echo "⚠️  Cannot update existing payment links - Stripe doesn't allow redirect URL changes"
    echo "   Payment link $payment_link needs to be recreated manually"
    echo ""
done

echo "📋 MANUAL ACTION REQUIRED:"
echo ""
echo "Unfortunately, Stripe doesn't allow updating payment link redirect URLs after creation."
echo "The old payment links with wrong redirect URLs need to be:"
echo ""
echo "1. DEACTIVATED (set to inactive)"
echo "2. RECREATED with correct redirect URL"
echo ""
echo "🎯 CORRECT REDIRECT URL TO USE:"
echo "https://ancient-history-trivia.web.app/success"
echo ""

echo "🚀 ALTERNATIVE SOLUTION:"
echo "Since you have many payment links already working with the correct domain,"
echo "you can simply use those and ignore/deactivate the old ones."
echo ""

echo "✅ WORKING PAYMENT LINKS (correct domain):"
echo "- plink_1Rh85TATHmLCupn7OxxOATT6 (Pro Annual)"
echo "- plink_1Rh85FATHmLCupn7tAyjT6a8 (Pro Monthly)" 
echo "- plink_1Rh6lhATHmLCupn7IxM8MyjZ (Pro Biennial)"
echo "- And several bundle payment links"
echo ""

echo "🎯 RECOMMENDATION:"
echo "Focus on using the payment links that already have the correct redirect URL."
echo "Your app authentication will work perfectly once Firebase domains are configured!"
