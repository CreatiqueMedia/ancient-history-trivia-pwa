#!/bin/bash

# Stripe Webhook Setup Script
# Creates webhook endpoint for Ancient History PWA content delivery

echo "🔧 Setting up Stripe webhook for content delivery..."

# Check if user is logged into Stripe CLI
if ! stripe projects list > /dev/null 2>&1; then
    echo "❌ Please log into Stripe CLI first: stripe login"
    exit 1
fi

# Your PWA URL (update this to your actual deployed URL)
PWA_URL="https://ancient-history-trivia.web.app"
WEBHOOK_URL="${PWA_URL}/api/webhook"

echo "📡 Creating webhook endpoint: ${WEBHOOK_URL}"

# Create webhook endpoint
WEBHOOK_RESPONSE=$(stripe webhook_endpoints create \
  --url="${WEBHOOK_URL}" \
  --enabled-events="checkout.session.completed,payment_intent.succeeded,invoice.payment_succeeded,customer.subscription.created,customer.subscription.updated,customer.subscription.deleted,charge.refunded" \
  --description="Ancient History PWA Content Delivery" \
  --format=json 2>/dev/null)

if [ $? -eq 0 ]; then
    WEBHOOK_ID=$(echo $WEBHOOK_RESPONSE | jq -r '.id')
    WEBHOOK_SECRET=$(echo $WEBHOOK_RESPONSE | jq -r '.secret')
    
    echo "✅ Webhook created successfully!"
    echo "📋 Webhook ID: ${WEBHOOK_ID}"
    echo "🔐 Webhook Secret: ${WEBHOOK_SECRET}"
    echo ""
    echo "📝 Add this to your environment variables:"
    echo "VITE_STRIPE_WEBHOOK_SECRET=${WEBHOOK_SECRET}"
    echo ""
    echo "🔗 Webhook URL: ${WEBHOOK_URL}"
    echo "📊 View in Stripe Dashboard: https://dashboard.stripe.com/webhooks/${WEBHOOK_ID}"
else
    echo "❌ Failed to create webhook. Using Stripe CLI listen instead..."
    echo ""
    echo "🎧 Starting Stripe CLI listener for local development..."
    echo "💡 This will forward webhooks to your local development server"
    echo ""
    
    # Start Stripe CLI listener for local development
    stripe listen --forward-to localhost:5173/api/webhook --events checkout.session.completed,payment_intent.succeeded,invoice.payment_succeeded
fi

echo ""
echo "🎯 Webhook Events Configured:"
echo "  • checkout.session.completed - Triggers content delivery"
echo "  • payment_intent.succeeded - Payment confirmation"
echo "  • invoice.payment_succeeded - Subscription payments"
echo "  • customer.subscription.* - Subscription management"
echo "  • charge.refunded - Handle refunds"
echo ""
echo "🚀 Content delivery system is ready!"
