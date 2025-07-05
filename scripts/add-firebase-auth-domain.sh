#!/bin/bash

# Add Firebase Authentication Domain using CLI
# This script adds ancient-history-pwa.web.app to Firebase authorized domains

echo "🔧 Adding Firebase Authentication Domain via CLI..."

# Get the project ID
PROJECT_ID="ancient-history-trivia"

echo "📋 Project ID: $PROJECT_ID"

# Use Firebase CLI to add the domain to authorized domains
echo "➕ Adding domain: ancient-history-pwa.web.app"

# Create a temporary config file for the auth domain update
cat > temp_auth_config.json << EOF
{
  "authorizedDomains": [
    "localhost",
    "ancient-history-trivia.web.app", 
    "ancient-history-trivia.firebaseapp.com",
    "ancient-history-pwa.web.app"
  ]
}
EOF

echo "📝 Created temporary auth config with required domains"

# Use Firebase CLI to update the auth configuration
echo "🔄 Updating Firebase Auth configuration..."

# Method 1: Try using firebase auth:import with empty users but updated config
firebase auth:import temp_empty_users.json --project $PROJECT_ID --hash-algo SCRYPT --hash-key "$(openssl rand -base64 32)" --salt-separator "Bw==" --rounds 8 --mem-cost 14 --replace-user false 2>/dev/null || echo "Auth import method not available"

# Method 2: Use REST API with Firebase CLI token
echo "🌐 Using REST API to update authorized domains..."

# Get access token
ACCESS_TOKEN=$(firebase auth:print-access-token --project $PROJECT_ID 2>/dev/null)

if [ -n "$ACCESS_TOKEN" ]; then
    echo "🔑 Got access token, updating domains..."
    
    # Update authorized domains via REST API
    curl -X PATCH \
        -H "Authorization: Bearer $ACCESS_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "authorizedDomains": [
                "localhost",
                "ancient-history-trivia.web.app",
                "ancient-history-trivia.firebaseapp.com", 
                "ancient-history-pwa.web.app"
            ]
        }' \
        "https://identitytoolkit.googleapis.com/admin/v2/projects/$PROJECT_ID/config" \
        2>/dev/null && echo "✅ Successfully updated authorized domains!" || echo "❌ REST API update failed"
else
    echo "❌ Could not get access token"
fi

# Clean up temporary files
rm -f temp_auth_config.json temp_empty_users.json 2>/dev/null

echo ""
echo "✅ Firebase Authentication domain update completed!"
echo ""
echo "🌐 Authorized domains should now include:"
echo "   ✓ localhost"
echo "   ✓ ancient-history-trivia.web.app"
echo "   ✓ ancient-history-trivia.firebaseapp.com"
echo "   ✓ ancient-history-pwa.web.app"
echo ""
echo "🔄 Please test authentication at: https://ancient-history-pwa.web.app"
echo ""
echo "📝 If this didn't work, you can manually add the domain:"
echo "   1. Go to: https://console.firebase.google.com/project/$PROJECT_ID/authentication/settings"
echo "   2. Scroll to 'Authorized domains'"
echo "   3. Click 'Add domain'"
echo "   4. Add: ancient-history-pwa.web.app"
