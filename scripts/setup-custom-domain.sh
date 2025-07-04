#!/bin/bash

# 🌐 Setup Custom Domain for Ancient History Trivia App
# This script helps configure the custom domain ancient-history-trivia.app

echo "🌐 Setting up custom domain: ancient-history-trivia.app"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Custom Domain Setup Instructions${NC}"
echo ""
echo -e "${YELLOW}🔧 Step 1: Add Custom Domain in Firebase Console${NC}"
echo "1. Go to: https://console.firebase.google.com/project/ancient-history-trivia/hosting/main"
echo "2. Click 'Add custom domain'"
echo "3. Enter: ancient-history-trivia.app"
echo "4. Follow the verification steps"
echo ""

echo -e "${YELLOW}🔧 Step 2: DNS Configuration${NC}"
echo "You'll need to add these DNS records to your domain registrar:"
echo ""
echo "For ancient-history-trivia.app:"
echo "Type: A"
echo "Name: @ (or leave blank)"
echo "Value: (Firebase will provide the IP addresses)"
echo ""
echo "Type: CNAME"
echo "Name: www"
echo "Value: ancient-history-trivia.web.app"
echo ""

echo -e "${YELLOW}🔧 Step 3: Update Stripe Payment Links${NC}"
echo "After the domain is active, you'll need to update your Stripe payment links"
echo "to redirect to: https://ancient-history-trivia.app/success"
echo ""
echo "Current Stripe redirect: https://ancient-history-trivia.web.app/success"
echo "New Stripe redirect: https://ancient-history-trivia.app/success"
echo ""

echo -e "${YELLOW}🔧 Step 4: Update Application URLs${NC}"
echo "The following files have been updated to use the new domain:"
echo "✅ public/redirect-success.html - Updated to redirect to ancient-history-trivia.app"
echo ""

echo -e "${GREEN}🎯 Benefits of Custom Domain:${NC}"
echo "✅ Professional branding (ancient-history-trivia.app)"
echo "✅ Better SEO and user trust"
echo "✅ Consistent domain across all platforms"
echo "✅ Easier to remember and share"
echo "✅ Solves Stripe redirect domain mismatch"
echo ""

echo -e "${BLUE}📱 Next Steps:${NC}"
echo "1. Purchase the domain 'ancient-history-trivia.app' if you haven't already"
echo "2. Follow Step 1 above to add it in Firebase Console"
echo "3. Configure DNS records as shown in Step 2"
echo "4. Wait for DNS propagation (can take up to 48 hours)"
echo "5. Update Stripe payment links to use the new domain"
echo "6. Test the complete payment flow"
echo ""

echo -e "${GREEN}💡 Your app will be available at:${NC}"
echo "🌐 https://ancient-history-trivia.app"
echo "🌐 https://www.ancient-history-trivia.app"
echo ""

echo -e "${YELLOW}⚠️  Important Notes:${NC}"
echo "• Make sure you own the domain 'ancient-history-trivia.app'"
echo "• DNS changes can take time to propagate globally"
echo "• Test thoroughly after DNS propagation is complete"
echo "• Keep the current .web.app domain as a backup during transition"
echo ""

echo -e "${GREEN}✨ Setup script completed!${NC}"
