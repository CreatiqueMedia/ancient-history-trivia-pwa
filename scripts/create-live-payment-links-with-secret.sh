#!/bin/bash

# Script to create live Stripe payment links using secret key
# Usage: 
#   export STRIPE_SECRET_KEY="sk_live_YOUR_SECRET_KEY"
#   ./scripts/create-live-payment-links-with-secret.sh

echo "🚀 Creating Live Stripe Payment Links with Secret Key..."
echo "======================================================"

# Check if secret key is provided
if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY environment variable not set"
    echo ""
    echo "Usage:"
    echo "  export STRIPE_SECRET_KEY=\"sk_live_YOUR_ACTUAL_SECRET_KEY\""
    echo "  ./scripts/create-live-payment-links-with-secret.sh"
    echo ""
    echo "Get your secret key from: https://dashboard.stripe.com/apikeys"
    exit 1
fi

# Verify secret key format
if [[ ! $STRIPE_SECRET_KEY =~ ^sk_live_ ]]; then
    echo "⚠️  Warning: Key doesn't start with 'sk_live_' - are you sure this is a live secret key?"
    echo "Current key starts with: ${STRIPE_SECRET_KEY:0:8}..."
    read -p "Continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo "✅ Using secret key: ${STRIPE_SECRET_KEY:0:12}..."
echo ""

# Function to create payment link
create_payment_link() {
    local price_id=$1
    local description=$2
    
    echo "Creating $description..."
    local result=$(stripe payment_links create \
        --api-key "$STRIPE_SECRET_KEY" \
        -d "line_items[0][price]=$price_id" \
        -d "line_items[0][quantity]=1" \
        --live \
        2>/dev/null)
    
    if [ $? -eq 0 ]; then
        echo "$result" | grep -o '"url":"[^"]*"' | cut -d'"' -f4
    else
        echo "ERROR: Failed to create $description"
        echo "$result" | grep -o '"message":"[^"]*"' | cut -d'"' -f4
        return 1
    fi
}

# Create subscription payment links
echo "📋 Creating Subscription Payment Links..."
echo "----------------------------------------"

MONTHLY_LINK=$(create_payment_link "price_1RkLzHATHmLCupn7s2EMRvAK" "Monthly Subscription (\$4.99/month)")
ANNUAL_LINK=$(create_payment_link "price_1RkT3IATHmLCupn7E4so8uTJ" "Annual Subscription (\$39.99/year)")
BIENNIAL_LINK=$(create_payment_link "price_1RkT3fATHmLCupn7KjRnoA8h" "Biennial Subscription (\$69.99/2 years)")

echo ""

# Create bundle payment links  
echo "📦 Creating Bundle Payment Links..."
echo "----------------------------------"

EASY_LINK=$(create_payment_link "price_1RkLyZATHmLCupn7VWNVXhND" "Easy Pack (\$2.99)")
MEDIUM_LINK=$(create_payment_link "price_1RkLyaATHmLCupn7d185LVnL" "Medium Pack (\$2.99)")
HARD_LINK=$(create_payment_link "price_1RkLybATHmLCupn7vpyYNNRU" "Hard Pack (\$2.99)")
ALL_BUNDLES_LINK=$(create_payment_link "price_1RkLybATHmLCupn71nEnpD5M" "All Bundles Pack (\$30.49)")
EGYPT_LINK=$(create_payment_link "price_1RkLyYATHmLCupn7TX69zBYN" "Ancient Egypt Bundle (\$2.99)")
ROME_LINK=$(create_payment_link "price_1RkLyXATHmLCupn7xMIie47d" "Roman Empire Bundle (\$2.99)")
GREECE_LINK=$(create_payment_link "price_1RkLyWATHmLCupn7cI6Jv1eM" "Ancient Greece Bundle (\$2.99)")

echo ""

# Check if any links failed
failed_count=0
for link in "$MONTHLY_LINK" "$ANNUAL_LINK" "$BIENNIAL_LINK" "$EASY_LINK" "$MEDIUM_LINK" "$HARD_LINK" "$ALL_BUNDLES_LINK" "$EGYPT_LINK" "$ROME_LINK" "$GREECE_LINK"; do
    if [[ $link == ERROR* ]] || [[ $link == "" ]]; then
        ((failed_count++))
    fi
done

if [ $failed_count -gt 0 ]; then
    echo "❌ $failed_count payment link(s) failed to create"
    echo "Check the errors above and verify your API key permissions"
    exit 1
fi

# Output results
echo "🎯 SUCCESS: ALL LIVE PAYMENT LINKS CREATED!"
echo "=========================================="
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
cat > "src/config/live-payment-links.ts" << EOF
// ✅ LIVE STRIPE PAYMENT LINKS - GENERATED $(date)
// These are real payment links that process actual credit card payments
// 🚨 WARNING: These links will charge real money!

export const LIVE_STRIPE_PAYMENT_LINKS = {
  // Subscription Plans - LIVE MODE (\$USD)
  monthly: '$MONTHLY_LINK',      // \$4.99/month
  annual: '$ANNUAL_LINK',        // \$39.99/year
  biennial: '$BIENNIAL_LINK',    // \$69.99/2 years
  
  // Bundle Packs - LIVE MODE (\$USD)
  bundles: {
    easy: '$EASY_LINK',          // \$2.99 - Easy Pack
    medium: '$MEDIUM_LINK',      // \$2.99 - Medium Pack  
    hard: '$HARD_LINK',          // \$2.99 - Hard Pack
    all_bundles: '$ALL_BUNDLES_LINK', // \$30.49 - All Bundle Packs
    egypt: '$EGYPT_LINK',        // \$2.99 - Ancient Egypt
    rome: '$ROME_LINK',          // \$2.99 - Roman Empire
    greece: '$GREECE_LINK',      // \$2.99 - Ancient Greece
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

// Export all payment links as an array for validation
export const ALL_LIVE_PAYMENT_LINKS = [
  ...Object.values(LIVE_STRIPE_PAYMENT_LINKS).filter(link => typeof link === 'string'),
  ...Object.values(LIVE_STRIPE_PAYMENT_LINKS.bundles)
];

export default LIVE_STRIPE_PAYMENT_LINKS;
EOF

echo "✅ Configuration saved to: src/config/live-payment-links.ts"
echo ""
echo "🎯 NEXT STEPS:"
echo "1. Update your app to import and use LIVE_STRIPE_PAYMENT_LINKS"
echo "2. Test with small amounts first (\$0.50 test purchases)"
echo "3. Verify webhook delivery and content unlocking"
echo "4. Update production configuration"
echo ""
echo "🚨 IMPORTANT REMINDERS:"
echo "• These links charge real credit cards!"
echo "• Test thoroughly with small amounts first"
echo "• Monitor Stripe Dashboard for successful payments"
echo "• Verify webhook endpoints are working"
echo ""
echo "💳 Ready for live payment testing!"
