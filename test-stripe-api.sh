#!/bin/bash

echo "🧪 Testing Stripe API connection..."
echo ""

# Prompt for API key
echo "Please paste your Stripe secret key (starts with sk_test_):"
read -s STRIPE_API_KEY

echo ""
echo "Testing API connection..."

# Test with a simple product creation
stripe products create \
    --api-key "$STRIPE_API_KEY" \
    --name "Test Product - Ancient History Trivia" \
    --description "Test product to verify API connection"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ API key works! Now let's create all your products..."
    echo ""
    
    # Create all products with the working API key
    echo "🚀 Creating subscription products..."
    
    echo "Creating Pro Monthly subscription..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Ancient History Trivia Pro - Monthly" \
        --description "Unlock all quiz bundles and premium features with monthly billing"
    
    echo ""
    echo "Creating Pro Annual subscription..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Ancient History Trivia Pro - Annual" \
        --description "Unlock all quiz bundles and premium features with annual billing - Save \$159/year!"
    
    echo ""
    echo "📚 Creating bundle products..."
    
    echo "Creating Ancient Egypt Bundle..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Ancient Egypt Bundle" \
        --description "Explore the mysteries of Ancient Egypt with 50+ quiz questions"
    
    echo ""
    echo "Creating Roman Empire Bundle..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Roman Empire Bundle" \
        --description "Test your knowledge of the mighty Roman Empire with 50+ quiz questions"
    
    echo ""
    echo "Creating Ancient Greece Bundle..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Ancient Greece Bundle" \
        --description "Discover the birthplace of democracy with 50+ quiz questions"
    
    echo ""
    echo "Creating Mesopotamia Bundle..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
        --name "Mesopotamia Bundle" \
        --description "Explore the cradle of civilization with 50+ quiz questions"
    
    echo ""
    echo "Creating Ancient China Bundle..."
    stripe products create \
        --api-key "$STRIPE_API_KEY" \
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
    
else
    echo ""
    echo "❌ API key test failed. Please check your key and try again."
fi
