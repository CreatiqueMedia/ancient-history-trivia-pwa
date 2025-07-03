#!/bin/bash

# Stripe CLI Setup Script for Ancient History Trivia
# This script creates all products, prices, and payment links automatically

echo "🏛️ Setting up Stripe products for Ancient History Trivia..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to create a product and price
create_product_and_price() {
    local name="$1"
    local description="$2"
    local amount="$3"
    local interval="$4"
    
    echo -e "${BLUE}Creating product: $name${NC}"
    
    if [ "$interval" = "one_time" ]; then
        # Create one-time product
        product_id=$(stripe products create \
            --name "$name" \
            --description "$description" \
            --format json | jq -r '.id')
        
        price_id=$(stripe prices create \
            --product "$product_id" \
            --unit-amount "$amount" \
            --currency usd \
            --format json | jq -r '.id')
    else
        # Create recurring product
        product_id=$(stripe products create \
            --name "$name" \
            --description "$description" \
            --format json | jq -r '.id')
        
        price_id=$(stripe prices create \
            --product "$product_id" \
            --unit-amount "$amount" \
            --currency usd \
            --recurring interval="$interval" \
            --format json | jq -r '.id')
    fi
    
    echo -e "${GREEN}✓ Product ID: $product_id${NC}"
    echo -e "${GREEN}✓ Price ID: $price_id${NC}"
    echo ""
    
    # Return the price ID for payment link creation
    echo "$price_id"
}

# Function to create payment link
create_payment_link() {
    local price_id="$1"
    local success_url="$2"
    local cancel_url="$3"
    
    payment_link=$(stripe payment_links create \
        --line-items '[{"price":"'$price_id'","quantity":1}]' \
        --after-completion type=redirect \
        --after-completion redirect_url="$success_url" \
        --format json | jq -r '.url')
    
    echo -e "${GREEN}✓ Payment Link: $payment_link${NC}"
    echo ""
    
    echo "$payment_link"
}

echo "🚀 Creating subscription products..."
echo ""

# Create Pro Monthly Subscription
monthly_price_id=$(create_product_and_price \
    "Ancient History Trivia Pro - Monthly" \
    "Unlock all quiz bundles and premium features with monthly billing" \
    "2999" \
    "month")

monthly_link=$(create_payment_link \
    "$monthly_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=monthly" \
    "https://ancient-history-trivia.web.app/cancel?plan=monthly")

# Create Pro Annual Subscription
annual_price_id=$(create_product_and_price \
    "Ancient History Trivia Pro - Annual" \
    "Unlock all quiz bundles and premium features with annual billing - Save \$159/year!" \
    "19999" \
    "year")

annual_link=$(create_payment_link \
    "$annual_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=annual" \
    "https://ancient-history-trivia.web.app/cancel?plan=annual")

echo "📚 Creating bundle products..."
echo ""

# Create Ancient Egypt Bundle
egypt_price_id=$(create_product_and_price \
    "Ancient Egypt Bundle" \
    "Explore the mysteries of Ancient Egypt with 50+ quiz questions" \
    "499" \
    "one_time")

egypt_link=$(create_payment_link \
    "$egypt_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=egypt" \
    "https://ancient-history-trivia.web.app/cancel?plan=egypt")

# Create Roman Empire Bundle
rome_price_id=$(create_product_and_price \
    "Roman Empire Bundle" \
    "Test your knowledge of the mighty Roman Empire with 50+ quiz questions" \
    "499" \
    "one_time")

rome_link=$(create_payment_link \
    "$rome_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=rome" \
    "https://ancient-history-trivia.web.app/cancel?plan=rome")

# Create Ancient Greece Bundle
greece_price_id=$(create_product_and_price \
    "Ancient Greece Bundle" \
    "Discover the birthplace of democracy with 50+ quiz questions" \
    "499" \
    "one_time")

greece_link=$(create_payment_link \
    "$greece_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=greece" \
    "https://ancient-history-trivia.web.app/cancel?plan=greece")

# Create Mesopotamia Bundle
mesopotamia_price_id=$(create_product_and_price \
    "Mesopotamia Bundle" \
    "Explore the cradle of civilization with 50+ quiz questions" \
    "499" \
    "one_time")

mesopotamia_link=$(create_payment_link \
    "$mesopotamia_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=mesopotamia" \
    "https://ancient-history-trivia.web.app/cancel?plan=mesopotamia")

# Create Ancient China Bundle
china_price_id=$(create_product_and_price \
    "Ancient China Bundle" \
    "Journey through Ancient China's rich history with 50+ quiz questions" \
    "499" \
    "one_time")

china_link=$(create_payment_link \
    "$china_price_id" \
    "https://ancient-history-trivia.web.app/success?plan=china" \
    "https://ancient-history-trivia.web.app/cancel?plan=china")

echo ""
echo -e "${YELLOW}🎉 All products and payment links created successfully!${NC}"
echo ""
echo -e "${BLUE}📋 PAYMENT LINKS SUMMARY:${NC}"
echo ""
echo -e "${GREEN}Subscriptions:${NC}"
echo "Monthly: $monthly_link"
echo "Annual:  $annual_link"
echo ""
echo -e "${GREEN}Bundles:${NC}"
echo "Egypt:       $egypt_link"
echo "Rome:        $rome_link"
echo "Greece:      $greece_link"
echo "Mesopotamia: $mesopotamia_link"
echo "China:       $china_link"
echo ""

# Generate the updated stripe.ts file
echo -e "${BLUE}📝 Generating updated stripe.ts configuration...${NC}"

cat > src/config/stripe.ts << EOF
// Stripe Hosted Checkout Configuration
// Auto-generated by setup-stripe-products.sh

export const STRIPE_PAYMENT_LINKS = {
  // Subscription Plans
  monthly: '$monthly_link',
  annual: '$annual_link',
  
  // Individual Bundles
  bundles: {
    egypt: '$egypt_link',
    rome: '$rome_link',
    greece: '$greece_link',
    mesopotamia: '$mesopotamia_link',
    china: '$china_link'
  }
};

// Pricing information for display
export const PRICING = {
  monthly: {
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    description: 'Unlock all quiz bundles and premium features'
  },
  annual: {
    price: 199.99,
    currency: 'USD',
    interval: 'year',
    description: 'Unlock all quiz bundles and premium features - Save \$159/year!'
  },
  bundles: {
    egypt: { price: 4.99, currency: 'USD', name: 'Ancient Egypt Bundle' },
    rome: { price: 4.99, currency: 'USD', name: 'Roman Empire Bundle' },
    greece: { price: 4.99, currency: 'USD', name: 'Ancient Greece Bundle' },
    mesopotamia: { price: 4.99, currency: 'USD', name: 'Mesopotamia Bundle' },
    china: { price: 4.99, currency: 'USD', name: 'Ancient China Bundle' }
  }
};

// Redirect to Stripe Checkout
export const redirectToStripeCheckout = (plan: string) => {
  let link: string | undefined;
  
  if (plan === 'monthly' || plan === 'annual') {
    link = STRIPE_PAYMENT_LINKS[plan];
  } else if (plan in STRIPE_PAYMENT_LINKS.bundles) {
    link = STRIPE_PAYMENT_LINKS.bundles[plan as keyof typeof STRIPE_PAYMENT_LINKS.bundles];
  }
  
  if (link) {
    // Add user ID to the checkout URL for tracking
    const userId = localStorage.getItem('userId') || 'anonymous';
    const urlWithParams = \`\${link}?client_reference_id=\${userId}\`;
    window.location.href = urlWithParams;
  } else {
    console.error('Payment link not configured for plan:', plan);
    alert('Payment link not configured. Please contact support.');
  }
};

// Check if payment links are configured
export const arePaymentLinksConfigured = (): boolean => {
  return STRIPE_PAYMENT_LINKS.monthly.startsWith('https://buy.stripe.com/');
};

// Customer Portal URL (to be configured after setting up Stripe Customer Portal)
export const CUSTOMER_PORTAL_URL = 'https://billing.stripe.com/p/login/YOUR_PORTAL_LINK';

// Open customer portal for subscription management
export const openCustomerPortal = () => {
  if (CUSTOMER_PORTAL_URL !== 'https://billing.stripe.com/p/login/YOUR_PORTAL_LINK') {
    window.open(CUSTOMER_PORTAL_URL, '_blank');
  } else {
    alert('Customer portal not configured yet. Please contact support.');
  }
};

// Track subscription events for analytics
export const trackSubscriptionEvent = (plan: string, event: 'started' | 'completed' | 'cancelled') => {
  // Get price for the plan
  let price = 0;
  if (plan === 'monthly') {
    price = PRICING.monthly.price;
  } else if (plan === 'annual') {
    price = PRICING.annual.price;
  } else if (plan in PRICING.bundles) {
    price = PRICING.bundles[plan as keyof typeof PRICING.bundles].price;
  }

  // Google Analytics tracking (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', event === 'completed' ? 'purchase' : 'subscription_' + event, {
      transaction_id: \`\${plan}_\${Date.now()}\`,
      value: price,
      currency: 'USD',
      items: [{
        item_id: plan,
        item_name: plan === 'monthly' ? 'Pro Monthly' : plan === 'annual' ? 'Pro Annual' : \`\${plan} Bundle\`,
        category: plan === 'monthly' || plan === 'annual' ? 'subscription' : 'bundle',
        quantity: 1,
        price: price
      }]
    });
  }
  
  // Console log for debugging
  console.log(\`Subscription \${event}:\`, plan, \`\$\${price}\`);
};
EOF

echo -e "${GREEN}✓ Updated src/config/stripe.ts with your payment links!${NC}"
echo ""
echo -e "${YELLOW}🚀 Next steps:${NC}"
echo "1. Review the generated src/config/stripe.ts file"
echo "2. Test the payment links in test mode"
echo "3. Deploy your app"
echo "4. Activate your Stripe account to go live"
echo ""
echo -e "${GREEN}🎯 You're ready to start accepting payments!${NC}"
EOF

chmod +x setup-stripe-products.sh
