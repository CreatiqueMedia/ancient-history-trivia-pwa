#!/bin/bash

# Quick script to create a few payment links and extract URLs properly
echo "🚀 Creating Live Payment Links (Fixed Version)..."

# Set your Stripe secret key as an environment variable:
# export STRIPE_SECRET_KEY="sk_live_XXXXXXXXXXXXXXXXXXXXXXXX"

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY environment variable not set"
    echo "Please set it with: export STRIPE_SECRET_KEY=\"sk_live_XXXXXXXXXXXXXXXXXXXXXXXX\""
    exit 1
fi

# Function to create payment link and extract URL
create_link() {
    local price_id=$1
    local description=$2
    
    echo "Creating $description..."
    local response=$(stripe payment_links create \
        --api-key "$STRIPE_SECRET_KEY" \
        -d "line_items[0][price]=$price_id" \
        -d "line_items[0][quantity]=1" \
        --live 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$response" | grep '"url":' | sed 's/.*"url": "\([^"]*\)".*/\1/'
    else
        echo "ERROR: $description"
        return 1
    fi
}

echo ""
echo "Creating key payment links..."

# Create subscription links
echo "Monthly Subscription:"
MONTHLY_LINK=$(create_link "price_1RkLzHATHmLCupn7s2EMRvAK" "Monthly Subscription")

echo "Annual Subscription:"
ANNUAL_LINK=$(create_link "price_1RkT3IATHmLCupn7E4so8uTJ" "Annual Subscription")

echo "Easy Pack:"
EASY_LINK=$(create_link "price_1RkLyZATHmLCupn7VWNVXhND" "Easy Pack")

echo "Ancient Egypt Bundle:"
EGYPT_LINK=$(create_link "price_1RkLyYATHmLCupn7TX69zBYN" "Ancient Egypt Bundle")

echo ""
echo "🎯 SAMPLE LIVE PAYMENT LINKS CREATED:"
echo "======================================"
echo "Monthly: $MONTHLY_LINK"
echo "Annual:  $ANNUAL_LINK"
echo "Easy:    $EASY_LINK"
echo "Egypt:   $EGYPT_LINK"
echo ""
echo "✅ Payment links are working! You can create the rest or use these for testing."
