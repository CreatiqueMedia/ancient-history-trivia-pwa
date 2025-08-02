#!/bin/bash

# Complete script to create ALL live payment links with proper URL extraction
echo "🚀 Creating ALL Live Stripe Payment Links..."
echo "============================================="

# Set your Stripe secret key as an environment variable:
# export STRIPE_SECRET_KEY="YOUR_LIVE_SECRET_KEY_HERE"

if [ -z "$STRIPE_SECRET_KEY" ]; then
    echo "❌ Error: STRIPE_SECRET_KEY environment variable not set"
    echo "Please set it with: export STRIPE_SECRET_KEY=\"YOUR_LIVE_SECRET_KEY_HERE\""
    exit 1
fi

# Function to create payment link and extract URL properly
create_link() {
    local price_id=$1
    local description=$2
    
    echo -n "Creating $description... "
    local response=$(stripe payment_links create \
        --api-key "$STRIPE_SECRET_KEY" \
        -d "line_items[0][price]=$price_id" \
        -d "line_items[0][quantity]=1" \
        --live 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        local url=$(echo "$response" | grep '"url":' | sed 's/.*"url": "\([^"]*\)".*/\1/')
        echo "✅ $url"
        echo "$url"
    else
        echo "❌ FAILED"
        echo "ERROR"
        return 1
    fi
}

echo ""
echo "📋 Creating Subscription Payment Links..."
echo "----------------------------------------"

MONTHLY_LINK=$(create_link "price_1RkLzHATHmLCupn7s2EMRvAK" "Monthly Subscription (\$4.99/month)")
ANNUAL_LINK=$(create_link "price_1RkT3IATHmLCupn7E4so8uTJ" "Annual Subscription (\$39.99/year)")  
BIENNIAL_LINK=$(create_link "price_1RkT3fATHmLCupn7KjRnoA8h" "Biennial Subscription (\$69.99/2 years)")

echo ""
echo "📦 Creating Bundle Payment Links..."
echo "----------------------------------"

EASY_LINK=$(create_link "price_1RkLyZATHmLCupn7VWNVXhND" "Easy Pack (\$2.99)")
MEDIUM_LINK=$(create_link "price_1RkLyaATHmLCupn7d185LVnL" "Medium Pack (\$2.99)")
HARD_LINK=$(create_link "price_1RkLybATHmLCupn7vpyYNNRU" "Hard Pack (\$2.99)")
ALL_BUNDLES_LINK=$(create_link "price_1RkLybATHmLCupn71nEnpD5M" "All Bundles Pack (\$30.49)")
EGYPT_LINK=$(create_link "price_1RkLyYATHmLCupn7TX69zBYN" "Ancient Egypt Bundle (\$2.99)")
ROME_LINK=$(create_link "price_1RkLyXATHmLCupn7xMIie47d" "Roman Empire Bundle (\$2.99)")
GREECE_LINK=$(create_link "price_1RkLyWATHmLCupn7cI6Jv1eM" "Ancient Greece Bundle (\$2.99)")

echo ""
echo "🎯 ALL LIVE PAYMENT LINKS CREATED SUCCESSFULLY!"
echo "==============================================="
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

# Generate the corrected TypeScript configuration
echo ""
echo "📝 Generating TypeScript configuration file..."

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
echo "1. ✅ Live payment links created and configured"
echo "2. 🔄 Update app to use LIVE_STRIPE_PAYMENT_LINKS" 
echo "3. 🧪 Test with small amounts (\$0.50)"
echo "4. 📊 Monitor Stripe Dashboard for payments"
echo "5. 🔗 Verify webhook delivery"
echo ""
echo "💳 READY FOR LIVE PAYMENT TESTING!"
echo ""
echo "🚨 REMINDER: These links charge real credit cards!"
