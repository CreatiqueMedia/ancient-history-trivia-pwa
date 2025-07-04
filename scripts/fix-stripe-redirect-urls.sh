#!/bin/bash

# 🔧 Fix Stripe Payment Link Redirect URLs
# Updates all payment links to redirect to the correct domain

echo "🔧 Fixing Stripe payment link redirect URLs..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Stripe CLI is installed and logged in
echo -e "${BLUE}📋 Checking Stripe CLI status...${NC}"
if ! command -v stripe &> /dev/null; then
    echo -e "${RED}❌ Stripe CLI not found. Please install it first:${NC}"
    echo "brew install stripe/stripe-cli/stripe"
    exit 1
fi

# Verify login
if ! stripe config --list &> /dev/null; then
    echo -e "${RED}❌ Not logged into Stripe CLI. Please run:${NC}"
    echo "stripe login"
    exit 1
fi

echo -e "${GREEN}✅ Stripe CLI ready!${NC}"

# Define the correct redirect URL
CORRECT_URL="https://ancient-history-trivia.web.app/success"
WRONG_URL="https://ancient-history-pwa.web.app/success"

echo -e "${BLUE}🔍 Finding payment links with wrong redirect URL...${NC}"

# Get all payment links and extract IDs of those with wrong URL
PAYMENT_LINK_IDS=$(stripe payment_links list --limit 50 | jq -r --arg wrong_url "$WRONG_URL" '.data[] | select(.after_completion.redirect.url == $wrong_url) | .id')

if [ -z "$PAYMENT_LINK_IDS" ]; then
    echo -e "${GREEN}✅ No payment links found with wrong redirect URL!${NC}"
    exit 0
fi

echo -e "${YELLOW}📝 Found payment links to update:${NC}"
echo "$PAYMENT_LINK_IDS"

# Update each payment link
echo -e "${BLUE}🔧 Updating payment links...${NC}"

for LINK_ID in $PAYMENT_LINK_IDS; do
    echo "Updating payment link: $LINK_ID"
    
    # Update the payment link
    stripe payment_links update "$LINK_ID" \
        --after_completion[type]=redirect \
        --after_completion[redirect][url]="$CORRECT_URL" > /dev/null
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Updated $LINK_ID${NC}"
    else
        echo -e "${RED}❌ Failed to update $LINK_ID${NC}"
    fi
done

echo ""
echo -e "${GREEN}🎉 Payment link redirect URLs updated!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "✅ Updated redirect URLs from: $WRONG_URL"
echo "✅ Updated redirect URLs to: $CORRECT_URL"
echo ""
echo -e "${YELLOW}🧪 Test the fix:${NC}"
echo "1. Make a test purchase in your app"
echo "2. Complete payment on Stripe"
echo "3. Verify you're redirected to the correct success page"
echo ""
echo -e "${GREEN}💡 Your Stripe payment flow should now work correctly!${NC}"
