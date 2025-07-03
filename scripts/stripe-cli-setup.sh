#!/bin/bash

# 🚀 Stripe CLI Setup Script for Ancient History Trivia App
# Run this after: brew install stripe/stripe-cli/stripe

echo "🔑 Setting up Stripe CLI for Ancient History Trivia App..."

# Step 1: Login to Stripe CLI (will open browser)
echo "📱 Step 1: Logging into Stripe CLI..."
echo "This will open your browser to authenticate with Stripe"
stripe login

# Step 2: Get your API keys
echo "🔐 Step 2: Retrieving your API keys..."
echo "Your Publishable Key:"
stripe config --list | grep publishable_key || echo "Run: stripe config --list to see keys"

echo "Your Secret Key (keep this secure!):"
stripe config --list | grep secret_key || echo "Run: stripe config --list to see keys"

# Step 3: Create products for your bundles
echo "📦 Step 3: Creating products..."

# Create bundle products
echo "Creating Ancient Egypt Bundle..."
stripe products create \
  --name "Ancient Egypt Bundle" \
  --description "Premium questions about Ancient Egyptian civilization" \
  --metadata bundle_id=egypt

echo "Creating Roman Empire Bundle..."
stripe products create \
  --name "Roman Empire Bundle" \
  --description "Premium questions about the Roman Empire" \
  --metadata bundle_id=rome

echo "Creating Ancient Greece Bundle..."
stripe products create \
  --name "Ancient Greece Bundle" \
  --description "Premium questions about Ancient Greek civilization" \
  --metadata bundle_id=greece

echo "Creating Mesopotamia Bundle..."
stripe products create \
  --name "Mesopotamia Bundle" \
  --description "Premium questions about Mesopotamian civilizations" \
  --metadata bundle_id=mesopotamia

echo "Creating Ancient China Bundle..."
stripe products create \
  --name "Ancient China Bundle" \
  --description "Premium questions about Ancient Chinese civilization" \
  --metadata bundle_id=china

# Step 4: Create prices for bundles ($4.99 each)
echo "💰 Step 4: Creating prices..."

# You'll need to get the product IDs from the previous step and create prices
echo "Creating prices for bundles at $4.99 each..."
echo "Note: You'll need to replace PRODUCT_ID with actual IDs from above"

# Example price creation (you'll need to run these with actual product IDs):
# stripe prices create --product PRODUCT_ID --unit-amount 499 --currency usd

# Step 5: Create subscription products
echo "📅 Step 5: Creating subscription products..."

stripe products create \
  --name "Premium Monthly" \
  --description "Monthly premium subscription with unlimited access" \
  --metadata subscription_type=monthly

stripe products create \
  --name "Premium Annual" \
  --description "Annual premium subscription with unlimited access" \
  --metadata subscription_type=annual

stripe products create \
  --name "Premium Biennial" \
  --description "2-year premium subscription with unlimited access" \
  --metadata subscription_type=biennial

# Step 6: Test webhook endpoints
echo "🔗 Step 6: Testing webhook setup..."
echo "To test webhooks locally, run:"
echo "stripe listen --forward-to localhost:5001/ancient-history-trivia/us-central1/payments/webhook"

# Step 7: Display next steps
echo "✅ Stripe CLI setup complete!"
echo ""
echo "🎯 Next Steps:"
echo "1. Copy your API keys to .env.production"
echo "2. Create prices for each product using the product IDs shown above"
echo "3. Update your app configuration with the price IDs"
echo "4. Deploy your Firebase Cloud Functions"
echo "5. Set up webhooks in Stripe Dashboard"
echo ""
echo "💡 Useful Commands:"
echo "stripe products list                    # List all products"
echo "stripe prices list                      # List all prices"
echo "stripe customers list                   # List customers"
echo "stripe payment_intents list             # List payments"
echo "stripe listen --forward-to URL          # Test webhooks locally"
echo ""
echo "🚀 Your app is ready to start making money!"
