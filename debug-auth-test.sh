#!/bin/bash

# Quick debug script to test authentication
echo "🔍 Testing Ancient History PWA Authentication"
echo "🌐 Production URL: https://ancient-history-trivia.web.app"
echo ""
echo "Please test the following:"
echo "1. Open the production URL"
echo "2. Open browser dev tools (F12)"
echo "3. Go to Console tab"
echo "4. Click Sign In button"
echo "5. Click Continue with Google"
echo "6. Watch console logs for debug output"
echo ""
echo "Expected behavior:"
echo "- No CSP errors in console"
echo "- Google popup should open"
echo "- After successful sign-in, user should be authenticated"
echo "- Console should show ✅ success messages"
echo ""
echo "If popup is blocked, it should automatically fallback to redirect method."
echo ""
echo "🔧 To check CSP headers:"
curl -I https://ancient-history-trivia.web.app | grep -i content-security-policy
