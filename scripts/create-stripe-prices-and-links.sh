#!/bin/bash

# 🚀 Create Stripe Prices and Payment Links
# This script creates prices and payment links for existing products and updates stripe.ts

echo "💰 Creating Stripe prices and payment links for Ancient History Trivia App..."

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

# Get existing products
echo -e "${BLUE}📦 Fetching existing products...${NC}"

# Function to get product ID by name
get_product_id() {
    local product_name="$1"
    stripe products list --limit 100 | grep -A 5 "\"name\": \"$product_name\"" | grep "\"id\":" | head -1 | sed 's/.*"id": "\([^"]*\)".*/\1/'
}

# Get product IDs
echo -e "${YELLOW}🔍 Looking up product IDs...${NC}"
PRO_MONTHLY_PRODUCT=$(get_product_id "Ancient History Trivia Pro - Monthly")
PRO_ANNUAL_PRODUCT=$(get_product_id "Ancient History Trivia Pro - Annual")
EGYPT_PRODUCT=$(get_product_id "Ancient Egypt Bundle")
ROME_PRODUCT=$(get_product_id "Roman Empire Bundle")
GREECE_PRODUCT=$(get_product_id "Ancient Greece Bundle")
MESOPOTAMIA_PRODUCT=$(get_product_id "Mesopotamia Bundle")
CHINA_PRODUCT=$(get_product_id "Ancient China Bundle")

# Verify we found the products
if [[ -z "$PRO_MONTHLY_PRODUCT" || -z "$PRO_ANNUAL_PRODUCT" || -z "$EGYPT_PRODUCT" || -z "$ROME_PRODUCT" || -z "$GREECE_PRODUCT" || -z "$MESOPOTAMIA_PRODUCT" || -z "$CHINA_PRODUCT" ]]; then
    echo -e "${RED}❌ Could not find all required products. Please run the product creation script first.${NC}"
    echo "Missing products:"
    [[ -z "$PRO_MONTHLY_PRODUCT" ]] && echo "  - Ancient History Trivia Pro - Monthly"
    [[ -z "$PRO_ANNUAL_PRODUCT" ]] && echo "  - Ancient History Trivia Pro - Annual"
    [[ -z "$EGYPT_PRODUCT" ]] && echo "  - Ancient Egypt Bundle"
    [[ -z "$ROME_PRODUCT" ]] && echo "  - Roman Empire Bundle"
    [[ -z "$GREECE_PRODUCT" ]] && echo "  - Ancient Greece Bundle"
    [[ -z "$MESOPOTAMIA_PRODUCT" ]] && echo "  - Mesopotamia Bundle"
    [[ -z "$CHINA_PRODUCT" ]] && echo "  - Ancient China Bundle"
    exit 1
fi

echo -e "${GREEN}✅ Found all products!${NC}"

# Create prices
echo -e "${BLUE}💰 Creating prices...${NC}"

# Monthly subscription - $29.99/month
echo "Creating monthly subscription price..."
MONTHLY_PRICE=$(stripe prices create \
    --product "$PRO_MONTHLY_PRODUCT" \
    --unit-amount 2999 \
    --currency usd \
    --recurring interval=month \
    --metadata plan=monthly | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

# Annual subscription - $199.99/year
echo "Creating annual subscription price..."
ANNUAL_PRICE=$(stripe prices create \
    --product "$PRO_ANNUAL_PRODUCT" \
    --unit-amount 19999 \
    --currency usd \
    --recurring interval=year \
    --metadata plan=annual | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

# Bundle prices - $4.99 each
echo "Creating bundle prices..."
EGYPT_PRICE=$(stripe prices create \
    --product "$EGYPT_PRODUCT" \
    --unit-amount 499 \
    --currency usd \
    --metadata bundle=egypt | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

ROME_PRICE=$(stripe prices create \
    --product "$ROME_PRODUCT" \
    --unit-amount 499 \
    --currency usd \
    --metadata bundle=rome | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

GREECE_PRICE=$(stripe prices create \
    --product "$GREECE_PRODUCT" \
    --unit-amount 499 \
    --currency usd \
    --metadata bundle=greece | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

MESOPOTAMIA_PRICE=$(stripe prices create \
    --product "$MESOPOTAMIA_PRODUCT" \
    --unit-amount 499 \
    --currency usd \
    --metadata bundle=mesopotamia | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

CHINA_PRICE=$(stripe prices create \
    --product "$CHINA_PRODUCT" \
    --unit-amount 499 \
    --currency usd \
    --metadata bundle=china | grep '"id":' | sed 's/.*"id": "\([^"]*\)".*/\1/')

echo -e "${GREEN}✅ All prices created!${NC}"

# Create payment links
echo -e "${BLUE}🔗 Creating payment links...${NC}"

# Function to create payment link
create_payment_link() {
    local price_id="$1"
    local description="$2"
    stripe payment_links create \
        --line-items[0][price]="$price_id" \
        --line-items[0][quantity]=1 \
        --after_completion[type]=redirect \
        --after_completion[redirect][url]="https://ancient-history-pwa.web.app/success" \
        --metadata source=ancient_history_app | grep '"url":' | sed 's/.*"url": "\([^"]*\)".*/\1/'
}

echo "Creating payment links..."
MONTHLY_LINK=$(create_payment_link "$MONTHLY_PRICE" "Pro Monthly Subscription")
ANNUAL_LINK=$(create_payment_link "$ANNUAL_PRICE" "Pro Annual Subscription")
EGYPT_LINK=$(create_payment_link "$EGYPT_PRICE" "Ancient Egypt Bundle")
ROME_LINK=$(create_payment_link "$ROME_PRICE" "Roman Empire Bundle")
GREECE_LINK=$(create_payment_link "$GREECE_PRICE" "Ancient Greece Bundle")
MESOPOTAMIA_LINK=$(create_payment_link "$MESOPOTAMIA_PRICE" "Mesopotamia Bundle")
CHINA_LINK=$(create_payment_link "$CHINA_PRICE" "Ancient China Bundle")

echo -e "${GREEN}✅ All payment links created!${NC}"

# Update stripe.ts configuration
echo -e "${BLUE}📝 Updating stripe.ts configuration...${NC}"

# Create backup
cp src/config/stripe.ts src/config/stripe.ts.backup

# Update the file with actual payment links
cat > src/config/stripe.ts << EOF
// Stripe Hosted Checkout Configuration
// Auto-generated by create-stripe-prices-and-links.sh

export const STRIPE_PAYMENT_LINKS = {
  // Subscription Plans
  monthly: '$MONTHLY_LINK',
  annual: '$ANNUAL_LINK',
  
  // Individual Bundles
  bundles: {
    egypt: '$EGYPT_LINK',
    rome: '$ROME_LINK',
    greece: '$GREECE_LINK',
    mesopotamia: '$MESOPOTAMIA_LINK',
    china: '$CHINA_LINK'
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

echo -e "${GREEN}✅ stripe.ts updated successfully!${NC}"

# Display summary
echo ""
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "✅ Created prices for all products"
echo "✅ Created payment links for all products"
echo "✅ Updated src/config/stripe.ts with actual links"
echo ""
echo -e "${BLUE}💰 Payment Links Created:${NC}"
echo "Monthly Subscription: $MONTHLY_LINK"
echo "Annual Subscription: $ANNUAL_LINK"
echo "Egypt Bundle: $EGYPT_LINK"
echo "Rome Bundle: $ROME_LINK"
echo "Greece Bundle: $GREECE_LINK"
echo "Mesopotamia Bundle: $MESOPOTAMIA_LINK"
echo "China Bundle: $CHINA_LINK"
echo ""
echo -e "${YELLOW}🚀 Next Steps:${NC}"
echo "1. Test the payment links in your app"
echo "2. Set up webhooks for payment processing"
echo "3. Configure customer portal for subscription management"
echo "4. Deploy your app to production"
echo ""
echo -e "${GREEN}💡 Your app is now ready to accept payments!${NC}"
