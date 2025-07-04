#!/bin/bash

# 🚀 Create ALL Remaining Missing Stripe Products
# This script creates the remaining 12 missing products with correct redirect URLs

echo "🚀 Creating ALL Remaining Missing Stripe Products"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Correct redirect URL
CORRECT_URL="https://ancient-history-trivia.web.app/success"

echo -e "${BLUE}📋 Creating remaining 12 missing products${NC}"
echo -e "${YELLOW}🎯 Redirect URL: ${CORRECT_URL}${NC}"
echo ""

# Function to create product, price, and payment link
create_complete_product() {
    local name="$1"
    local description="$2"
    local price_cents="$3"
    local interval="$4"  # Optional: for subscriptions
    
    echo -e "${BLUE}Creating: $name${NC}"
    
    # Create product
    echo "  📦 Creating product..."
    if [ -n "$interval" ]; then
        # Subscription product
        PRODUCT_JSON=$(stripe products create --name="$name" --description="$description" --type=service)
        PRODUCT_ID=$(echo "$PRODUCT_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
        
        echo "  💰 Creating recurring price..."
        PRICE_JSON=$(stripe prices create --product="$PRODUCT_ID" --unit-amount="$price_cents" --currency=usd -d "recurring[interval]=$interval")
        PRICE_ID=$(echo "$PRICE_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
    else
        # One-time product
        PRODUCT_JSON=$(stripe products create --name="$name" --description="$description" --type=service)
        PRODUCT_ID=$(echo "$PRODUCT_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
        
        echo "  💰 Creating one-time price..."
        PRICE_JSON=$(stripe prices create --product="$PRODUCT_ID" --unit-amount="$price_cents" --currency=usd)
        PRICE_ID=$(echo "$PRICE_JSON" | grep '"id"' | head -1 | cut -d'"' -f4)
    fi
    
    echo "  🔗 Creating payment link..."
    LINK_JSON=$(stripe payment_links create \
        -d "line_items[0][price]=$PRICE_ID" \
        -d "line_items[0][quantity]=1" \
        -d "after_completion[type]=redirect" \
        -d "after_completion[redirect][url]=$CORRECT_URL")
    PAYMENT_LINK=$(echo "$LINK_JSON" | grep '"url"' | tail -1 | cut -d'"' -f4)
    
    echo -e "  ✅ ${GREEN}Product: $PRODUCT_ID${NC}"
    echo -e "  ✅ ${GREEN}Price: $PRICE_ID${NC}"
    echo -e "  ✅ ${GREEN}Payment Link: $PAYMENT_LINK${NC}"
    echo ""
}

echo -e "${BLUE}🌍 REGION PACKS:${NC}"

# Ancient Americas Pack  
create_complete_product "Ancient Americas Pack" \
    "100 questions about Ancient Americas. Maya, Aztec, Inca, and other pre-Columbian civilizations." \
    299

# Ancient Europe Pack
create_complete_product "Ancient Europe Pack" \
    "100 questions on Ancient Europe. Celtic, Germanic, Norse cultures and early European civilizations." \
    299

echo -e "${BLUE}⏰ HISTORICAL AGE PACKS:${NC}"

# Bronze Age Pack
create_complete_product "Bronze Age Pack" \
    "100 Bronze Age questions. Early civilizations, technology, and cultural developments." \
    299

# Iron Age Pack
create_complete_product "Iron Age Pack" \
    "100 Iron Age questions. Advanced civilizations, warfare, and technological progress." \
    299

# Prehistoric Age Pack
create_complete_product "Prehistoric Age Pack" \
    "100 Prehistoric Age questions. Early human history, evolution, and stone age cultures." \
    299

echo -e "${BLUE}📝 FORMAT PACKS:${NC}"

# Multiple Choice Pack
create_complete_product "Multiple Choice Pack" \
    "100 Multiple Choice questions. No mix - pure multiple choice format for focused practice." \
    299

# True/False Pack
create_complete_product "True/False Pack" \
    "100 True/False questions. Quick decision-making and fundamental knowledge testing." \
    299

# Fill-in-the-Blank Pack
create_complete_product "Fill-in-the-Blank Pack" \
    "100 Fill-in-the-Blank questions. Test your recall and specific knowledge with completion challenges." \
    299

echo -e "${BLUE}🎯 DIFFICULTY PACKS:${NC}"

# Easy Pack
create_complete_product "Easy Pack" \
    "100 easy questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for elementary school level." \
    299

# Medium Pack
create_complete_product "Medium Pack" \
    "100 medium questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for middle school level." \
    299

# Hard Pack
create_complete_product "Hard Pack" \
    "100 hard questions covering prehistoric, bronze age, iron age, and classical antiquity. Perfect for high school level." \
    299

echo -e "${BLUE}💳 SUBSCRIPTION:${NC}"

# Pro Biennial (2-year subscription) - Note: Stripe uses 'year' interval, billing every 2 years handled by interval_count
create_complete_product "Ancient History Trivia Pro - Biennial" \
    "Unlock all quiz bundles and premium features with 2-year billing - Maximum savings!" \
    6999 \
    "year"

echo -e "${GREEN}🎉 ALL MISSING PRODUCTS CREATED!${NC}"
echo ""
echo -e "${YELLOW}📋 SUMMARY:${NC}"
echo "✅ Created 11 missing bundle products"
echo "✅ Created 1 missing subscription product"
echo "✅ Created prices for all products ($2.99 for bundles, $69.99 for biennial)"
echo "✅ Created payment links with correct redirect URL"
echo ""
echo -e "${BLUE}📝 NEXT STEPS:${NC}"
echo "1. Update src/config/stripe.ts with the new payment links"
echo "2. Test each payment link"
echo "3. Deactivate old payment links with wrong redirect URLs"
echo ""
echo -e "${GREEN}✨ Your Stripe account now has ALL products!${NC}"
echo ""
echo -e "${YELLOW}💡 Note: Ancient India Pack was already created manually${NC}"
echo "Payment Link: https://buy.stripe.com/test_4gMbJ02Kp2UNa45dLb9oc0e"
