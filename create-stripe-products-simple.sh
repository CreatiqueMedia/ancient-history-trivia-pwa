#!/bin/bash

# Simple Stripe CLI Setup Script for Ancient History Trivia
echo "🏛️ Setting up Stripe products for Ancient History Trivia..."
echo ""

# Check if logged in
echo "Checking Stripe login status..."
stripe config --list > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "❌ Not logged into Stripe. Please run 'stripe login' first."
    exit 1
fi

echo "✅ Stripe CLI is ready!"
echo ""

# Create products and get their IDs
echo "🚀 Creating subscription products..."

echo "Creating Pro Monthly subscription..."
stripe products create \
    --name "Ancient History Trivia Pro - Monthly" \
    --description "Unlock all quiz bundles and premium features with monthly billing"

echo ""
echo "Creating Pro Annual subscription..."
stripe products create \
    --name "Ancient History Trivia Pro - Annual" \
    --description "Unlock all quiz bundles and premium features with annual billing - Save \$159/year!"

echo ""
echo "📚 Creating bundle products..."

echo "Creating Ancient Egypt Bundle..."
stripe products create \
    --name "Ancient Egypt Bundle" \
    --description "Explore the mysteries of Ancient Egypt with 50+ quiz questions"

echo ""
echo "Creating Roman Empire Bundle..."
stripe products create \
    --name "Roman Empire Bundle" \
    --description "Test your knowledge of the mighty Roman Empire with 50+ quiz questions"

echo ""
echo "Creating Ancient Greece Bundle..."
stripe products create \
    --name "Ancient Greece Bundle" \
    --description "Discover the birthplace of democracy with 50+ quiz questions"

echo ""
echo "Creating Mesopotamia Bundle..."
stripe products create \
    --name "Mesopotamia Bundle" \
    --description "Explore the cradle of civilization with 50+ quiz questions"

echo ""
echo "Creating Ancient China Bundle..."
stripe products create \
    --name "Ancient China Bundle" \
    --description "Journey through Ancient China's rich history with 50+ quiz questions"

echo ""
echo "🎉 All products created successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Go to your Stripe Dashboard: https://dashboard.stripe.com/products"
echo "2. Create prices for each product:"
echo "   - Pro Monthly: \$29.99/month recurring"
echo "   - Pro Annual: \$199.99/year recurring"
echo "   - All Bundles: \$4.99 one-time"
echo "3. Create payment links for each price"
echo "4. Update src/config/stripe.ts with the payment links"
echo ""
echo "🚀 Or use the Stripe Dashboard to create payment links directly!"
