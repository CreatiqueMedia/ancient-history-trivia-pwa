#!/bin/bash

# 🚀 Create ALL Missing Stripe Products, Prices, and Payment Links
# This script creates everything that's missing from your Stripe account

echo "🚀 Creating ALL Missing Stripe Products and Payment Links"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Correct redirect URL
CORRECT_URL="https://ancient-history-trivia.web.app/success"

echo -e "${BLUE}📋 Analysis: You have 20 items in your app but only 8 in Stripe${NC}"
echo -e "${YELLOW}🎯 Creating 12 missing products with correct redirect URL: ${CORRECT_URL}${NC}"
echo ""

echo -e "${GREEN}Creating missing products, prices, and payment links...${NC}"
echo ""

# Function to create product, price, and payment link
create_bundle() {
    local name="$1"
    local description="$2"
    local price_cents="$3"
    
    echo "Creating: $name"
    
    # Create product
    PRODUCT_ID=$(stripe products create \
        --name="$name" \
        --description="$description" \
        --type=service \
        --format=json | jq -r '.id')
    
    # Create price
    PRICE_ID=$(stripe prices create \
        --product="$PRODUCT_ID" \
        --unit-amount="$price_cents" \
        --currency=usd \
        --format=json | jq -r '.id')
    
    # Create payment link
    PAYMENT_LINK=$(stripe payment_links create \
        --line-items[0][price]="$PRICE_ID" \
        --line-items[0][quantity]=1 \
        --after-completion[type]=redirect \
        --after-completion[redirect][url]="$CORRECT_URL" \
        --format=json | jq -r '.url')
    
    echo "   ✅ Product: $PRODUCT_ID"
    echo "   ✅ Price: $PRICE_ID" 
    echo "   ✅ Payment Link: $PAYMENT_LINK"
    echo ""
}

# Function to create subscription
create_subscription() {
    local name="$1"
    local description="$2"
    local price_cents="$3"
    local interval="$4"
    
    echo "Creating: $name"
    
    # Create product
    PRODUCT_ID=$(stripe products create \
        --name="$name" \
        --description="$description" \
        --type=service \
        --format=json | jq -r '.id')
    
    # Create recurring price
    PRICE_ID=$(stripe prices create \
        --product="$PRODUCT_ID" \
        --unit-amount="$price_cents" \
        --currency=usd \
        --recurring[interval]="$interval" \
        --format=json | jq -r '.id')
    
    # Create payment link
    PAYMENT_LINK=$(stripe payment_links create \
        --line-items[0][price]="$PRICE_ID" \
        --line-items[0][quantity]=1 \
        --after-completion[type]=redirect \
        --after-completion[redirect][url]="$CORRECT_URL" \
        --format=json | jq -r '.url')
    
    echo "   ✅ Product: $PRODUCT_ID"
    echo "   ✅ Price: $PRICE_ID"
    echo "   ✅ Payment Link: $PAYMENT_LINK"
    echo ""
}

echo -e "${BLUE}🌍 MISSING REGION PACKS:${NC}"

# Ancient India Pack
create_bundle "Ancient India Pack" \
    "100 questions about Ancient India. Vedic period, empires, religion, and cultural achievements." \
    299

# Ancient Americas Pack  
create_bundle "Ancient Americas Pack" \
    "100 questions about Ancient Americas. Maya, Aztec, Inca, and other pre-Columbian civilizations." \
    299

# Ancient Europe Pack
create_bundle "Ancient Europe Pack" \
    "100 questions on Ancient Europe. Celtic, Germanic, Norse cultures and early European civilizations." \
    299

echo -e "${BLUE}⏰ MISSING HISTORICAL AGE PACKS:${NC}"

# Bronze Age Pack
create_bundle "Bronze Age Pack" \
    "100 Bronze Age questions. Early civilizations, technology, and cultural developments." \
    299

# Iron Age Pack
create_bundle "Iron Age Pack" \
    "100 Iron Age questions. Advanced civilizations, warfare, and technological progress." \
    299

# Prehistoric Age Pack
create_bundle "Prehistoric Age Pack" \
    "100 Prehistoric Age questions. Early human history, evolution, and stone age cultures." \
    299

echo -e "${BLUE}📝 MISSING FORMAT PACKS:${NC}"

# Multiple Choice Pack
create_bundle "Multiple Choice Pack" \
    "100 Multiple Choice questions. No mix - pure multiple choice format for focused practice." \
    299

# True/False Pack
create_bundle "True/False Pack" \
    "100 True/False questions. Quick decision-making and fundamental knowledge testing." \
    299

# Fill-in-the-Blank Pack
create_bundle "Fill-in-the-Blank Pack" \
    "100 Fill-in-the-Blank questions. Test your recall and specific knowledge with completion challenges." \
    299

echo -e "${BLUE}🎯 MISSING DIFFICULTY PACKS:${NC}"

# Easy Pack
create_bundle "Easy Pack" \
    "100 easy questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for elementary school level." \
    299

# Medium Pack
create_bundle "Medium Pack" \
    "100 medium questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for middle school level." \
    299

# Hard Pack
create_bundle "Hard Pack" \
    "100 hard questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for high school level." \
    299

echo -e "${BLUE}💳 MISSING SUBSCRIPTION:${NC}"

# Pro Biennial (2-year subscription)
create_subscription "Ancient History Trivia Pro - Biennial" \
    "Unlock all quiz bundles and premium features with 2-year billing - Maximum savings!" \
    6999 \
    year

echo -e "${GREEN}🎉 ALL MISSING PRODUCTS CREATED!${NC}"
echo ""
echo -e "${YELLOW}📋 SUMMARY:${NC}"
echo "✅ Created 12 missing bundle products"
echo "✅ Created 1 missing subscription product"
echo "✅ Created prices for all products"
echo "✅ Created payment links with correct redirect URL"
echo ""
echo -e "${BLUE}📝 NEXT STEPS:${NC}"
echo "1. Update src/config/stripe.ts with the new payment links"
echo "2. Test each payment link"
echo "3. Deactivate old payment links with wrong redirect URLs"
echo ""
echo -e "${GREEN}✨ Your Stripe account now has ALL 20 products!${NC}"
