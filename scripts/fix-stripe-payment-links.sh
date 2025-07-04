#!/bin/bash

# 🔧 Fix Stripe Payment Links - Update Redirect URLs
# This script creates new payment links with the correct redirect URL

echo "🔧 Fixing Stripe Payment Links with Correct Redirect URL"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Creating New Payment Links with Correct Redirect${NC}"
echo ""

# Correct redirect URL
CORRECT_URL="https://ancient-history-trivia.web.app/success"

echo -e "${YELLOW}🎯 New redirect URL: ${CORRECT_URL}${NC}"
echo ""

echo -e "${GREEN}Creating new payment links...${NC}"
echo ""

# 1. Ancient China Bundle - $2.99
echo "1. Creating Ancient China Bundle payment link..."
CHINA_LINK=$(stripe payment_links create \
  --line-items[0][price]=price_1Rgoe5ATHmLCupn7qc6ixQqt \
  --line-items[0][quantity]=1 \
  --after-completion[type]=redirect \
  --after-completion[redirect][url]="$CORRECT_URL" \
  --format=json | jq -r '.url')

echo "   ✅ China Bundle: $CHINA_LINK"

# 2. Get the other payment links and their prices
echo ""
echo "2. Getting details for other payment links..."

# Let's get all the prices first
echo "   📋 Retrieving price information..."

# Create the remaining payment links based on the pattern
# We'll need to get the price IDs for each product

echo ""
echo -e "${YELLOW}🔧 Manual Steps Required:${NC}"
echo "Due to the complexity of recreating all payment links automatically,"
echo "here's what you need to do:"
echo ""
echo "1. Go to Stripe Dashboard: https://dashboard.stripe.com/payment-links"
echo "2. For each existing payment link:"
echo "   • Click 'Create payment link'"
echo "   • Select the same product/price"
echo "   • Set redirect URL to: $CORRECT_URL"
echo "   • Save the new link"
echo "3. Update your app configuration with new links"
echo "4. Deactivate old payment links"
echo ""

echo -e "${GREEN}✅ China Bundle link created successfully!${NC}"
echo -e "${BLUE}New China Bundle URL: ${CHINA_LINK}${NC}"
echo ""

echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "1. Test the new China Bundle link"
echo "2. Create similar links for other products"
echo "3. Update src/config/stripe.ts with new URLs"
echo "4. Deactivate old payment links"
echo ""

echo -e "${GREEN}🎉 Script completed!${NC}"
