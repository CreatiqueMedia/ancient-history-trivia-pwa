#!/bin/bash

# Script to create live Stripe payment links for Ancient History Trivia PWA
# This script requires Stripe CLI to be configured with live mode API keys

echo "🚀 Creating Live Stripe Payment Links..."
echo "======================================="

# Check if Stripe CLI is available and configured
if ! command -v stripe &> /dev/null; then
    echo "❌ Error: Stripe CLI not found. Please install it first."
    exit 1
fi

# Check if we're in live mode
if [[ $(stripe config --list | grep "livemode = 'true'") ]]; then
    echo "✅ Stripe CLI configured for live mode"
else
    echo "❌ Error: Stripe CLI not configured for live mode"
    exit 1
fi

# Create payment links for subscription plans
echo ""
echo "📋 Creating Subscription Payment Links..."
echo "----------------------------------------"

echo "Creating Monthly Subscription ($4.99/month)..."
MONTHLY_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLzHATHmLCupn7s2EMRvAK","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Annual Subscription ($39.99/year)..."  
ANNUAL_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkT3IATHmLCupn7E4so8uTJ","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Biennial Subscription ($69.99/2 years)..."
BIENNIAL_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkT3fATHmLCupn7KjRnoA8h","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

# Create payment links for bundle packs
echo ""
echo "📦 Creating Bundle Payment Links..."
echo "----------------------------------"

echo "Creating Easy Pack ($2.99)..."
EASY_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLyZATHmLCupn7VWNVXhND","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Medium Pack ($2.99)..."
MEDIUM_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLyaATHmLCupn7d185LVnL","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Hard Pack ($2.99)..."
HARD_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLybATHmLCupn7vpyYNNRU","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating All Bundles Pack ($30.49)..."
ALL_BUNDLES_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLybATHmLCupn71nEnpD5M","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Ancient Egypt Bundle ($2.99)..."
EGYPT_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLyYATHmLCupn7TX69zBYN","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Roman Empire Bundle ($2.99)..."
ROME_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLyXATHmLCupn7xMIie47d","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

echo "Creating Ancient Greece Bundle ($2.99)..."
GREECE_LINK=$(stripe payment_links create \
  --line-items '[{"price":"price_1RkLyWATHmLCupn7cI6Jv1eM","quantity":1}]' \
  --format=json 2>/dev/null | jq -r '.url' 2>/dev/null || echo "ERROR")

# Output results
echo ""
echo "🎯 LIVE PAYMENT LINKS CREATED"
echo "============================="
echo ""
echo "📋 SUBSCRIPTION PLANS:"
echo "Monthly:   $MONTHLY_LINK"
echo "Annual:    $ANNUAL_LINK"
echo "Biennial:  $BIENNIAL_LINK"
echo ""
echo "📦 BUNDLE PACKS:"
echo "Easy Pack:        $EASY_LINK"
echo "Medium Pack:      $MEDIUM_LINK"
echo "Hard Pack:        $HARD_LINK"
echo "All Bundles:      $ALL_BUNDLES_LINK"
echo "Ancient Egypt:    $EGYPT_LINK"
echo "Roman Empire:     $ROME_LINK"
echo "Ancient Greece:   $GREECE_LINK"
echo ""

# Generate TypeScript configuration
echo "📝 Generating TypeScript configuration..."
cat > "/Users/ronratzlaff/_Dev_Projects/Git Projects/Web/PWA/ancient-history-trivia-pwa/src/config/live-payment-links.ts" << EOF
// ✅ LIVE STRIPE PAYMENT LINKS - GENERATED $(date)
// These are real payment links that process actual credit card payments

export const LIVE_STRIPE_PAYMENT_LINKS = {
  // Subscription Plans - LIVE MODE
  monthly: '$MONTHLY_LINK',
  annual: '$ANNUAL_LINK', 
  biennial: '$BIENNIAL_LINK',
  
  // Bundle Packs - LIVE MODE
  bundles: {
    easy: '$EASY_LINK',
    medium: '$MEDIUM_LINK',
    hard: '$HARD_LINK',
    all_bundles: '$ALL_BUNDLES_LINK',
    egypt: '$EGYPT_LINK',
    rome: '$ROME_LINK',
    greece: '$GREECE_LINK',
  }
};

// Export function to get payment link by plan type
export function getLivePaymentLink(plan: string): string | null {
  if (plan in LIVE_STRIPE_PAYMENT_LINKS) {
    return LIVE_STRIPE_PAYMENT_LINKS[plan as keyof typeof LIVE_STRIPE_PAYMENT_LINKS];
  }
  
  if (plan in LIVE_STRIPE_PAYMENT_LINKS.bundles) {
    return LIVE_STRIPE_PAYMENT_LINKS.bundles[plan as keyof typeof LIVE_STRIPE_PAYMENT_LINKS.bundles];
  }
  
  return null;
}
EOF

echo "✅ Configuration saved to: src/config/live-payment-links.ts"
echo ""
echo "🚨 IMPORTANT: Test these links with small amounts before full deployment!"
echo "💳 These links will charge real credit cards!"
