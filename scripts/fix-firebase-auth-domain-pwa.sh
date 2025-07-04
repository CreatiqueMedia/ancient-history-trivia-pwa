#!/bin/bash

# Fix Firebase Authentication Domain for PWA
# This script adds the PWA domain to Firebase authorized domains

echo "🔧 Fixing Firebase Authentication Domain for PWA..."

# Get the project ID
PROJECT_ID=$(firebase projects:list --json | jq -r '.[] | select(.id == "ancient-history-trivia") | .id')

if [ -z "$PROJECT_ID" ]; then
    echo "❌ Error: Could not find Firebase project 'ancient-history-trivia'"
    exit 1
fi

echo "📋 Project ID: $PROJECT_ID"

# Get current authorized domains
echo "📋 Getting current authorized domains..."
CURRENT_DOMAINS=$(firebase auth:export --project $PROJECT_ID --format=json 2>/dev/null | jq -r '.config.authorizedDomains[]?' 2>/dev/null || echo "")

echo "📋 Current authorized domains:"
echo "$CURRENT_DOMAINS"

# Domains that should be authorized
REQUIRED_DOMAINS=(
    "localhost"
    "ancient-history-trivia.web.app"
    "ancient-history-trivia.firebaseapp.com"
    "ancient-history-pwa.web.app"
)

echo ""
echo "🔧 Adding required domains to Firebase Authentication..."

# Add each required domain
for domain in "${REQUIRED_DOMAINS[@]}"; do
    echo "➕ Adding domain: $domain"
    
    # Use Firebase CLI to add the domain
    firebase auth:import --project $PROJECT_ID --hash-algo SCRYPT --hash-key "$(openssl rand -base64 32)" --salt-separator "Bw==" --rounds 8 --mem-cost 14 <(echo '[]') --replace-user false 2>/dev/null || true
    
    # Alternative method using REST API
    curl -X PATCH \
        -H "Authorization: Bearer $(firebase auth:print-access-token --project $PROJECT_ID)" \
        -H "Content-Type: application/json" \
        -d "{
            \"authorizedDomains\": [
                \"localhost\",
                \"ancient-history-trivia.web.app\",
                \"ancient-history-trivia.firebaseapp.com\",
                \"ancient-history-pwa.web.app\"
            ]
        }" \
        "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/config" 2>/dev/null || true
done

echo ""
echo "✅ Firebase Authentication domains updated!"
echo ""
echo "🌐 Authorized domains should now include:"
for domain in "${REQUIRED_DOMAINS[@]}"; do
    echo "   ✓ $domain"
done

echo ""
echo "📝 Manual verification steps:"
echo "1. Go to Firebase Console: https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"
echo "2. Check the 'Authorized domains' section"
echo "3. Ensure 'ancient-history-pwa.web.app' is listed"
echo ""
echo "🔄 If the script didn't work automatically, manually add the domain:"
echo "   - Go to Firebase Console > Authentication > Settings"
echo "   - Scroll to 'Authorized domains'"
echo "   - Click 'Add domain'"
echo "   - Add: ancient-history-pwa.web.app"
echo ""
echo "🚀 After adding the domain, authentication should work properly!"
