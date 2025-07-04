#!/bin/bash

# 🔧 Simple Fix for Stripe Redirect Issue
# Updates Stripe payment links to use the correct domain

echo "🔧 Fixing Stripe Redirect Issue"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Stripe Payment Link Update Instructions${NC}"
echo ""

echo -e "${YELLOW}🎯 The Problem:${NC}"
echo "Your Stripe payment links redirect to: https://ancient-history-pwa.web.app/success"
echo "But your app is actually at: https://ancient-history-trivia.web.app/success"
echo ""

echo -e "${YELLOW}🔧 The Solution:${NC}"
echo "Update each Stripe payment link to redirect to the correct domain."
echo ""

echo -e "${BLUE}📝 Step-by-Step Instructions:${NC}"
echo ""
echo "1. Go to Stripe Dashboard:"
echo "   https://dashboard.stripe.com/payment-links"
echo ""
echo "2. For EACH payment link, click 'Edit' and update the redirect URL:"
echo ""

echo -e "${GREEN}Payment Links to Update:${NC}"
echo "✅ Pro Monthly Subscription"
echo "✅ Pro Annual Subscription"
echo "✅ Egypt Bundle"
echo "✅ Rome Bundle"
echo "✅ Greece Bundle"
echo "✅ Mesopotamia Bundle"
echo "✅ China Bundle"
echo ""

echo -e "${YELLOW}For each link:${NC}"
echo "• Click the payment link"
echo "• Click 'Edit'"
echo "• Find 'After payment' section"
echo "• Change redirect URL from:"
echo "  https://ancient-history-pwa.web.app/success"
echo "• Change redirect URL to:"
echo "  https://ancient-history-trivia.web.app/success"
echo "• Click 'Save'"
echo ""

echo -e "${GREEN}🧪 Test After Updates:${NC}"
echo "1. Go to your app: https://ancient-history-trivia.web.app"
echo "2. Click a Purchase button"
echo "3. Complete a test payment"
echo "4. Verify you're redirected to the success page correctly"
echo ""

echo -e "${BLUE}💡 Why This Works:${NC}"
echo "• No custom domain needed"
echo "• No DNS configuration required"
echo "• No additional costs"
echo "• Uses your existing, working domain"
echo "• Fixes the redirect issue completely"
echo ""

echo -e "${GREEN}✨ Benefits:${NC}"
echo "✅ Free solution (no domain costs)"
echo "✅ Immediate fix (no waiting for DNS)"
echo "✅ Zero maintenance required"
echo "✅ Uses Google's reliable infrastructure"
echo "✅ Professional .web.app domain"
echo ""

echo -e "${YELLOW}⏱️ Time Required:${NC}"
echo "• Updating Stripe links: 5-10 minutes"
echo "• Testing payment flow: 2 minutes"
echo "• Total: Under 15 minutes"
echo ""

echo -e "${GREEN}🎉 Once completed, your Stripe redirect issue will be completely solved!${NC}"
echo ""
echo -e "${BLUE}Need help? Check the Stripe documentation:${NC}"
echo "https://stripe.com/docs/payments/checkout/custom-success-page"
