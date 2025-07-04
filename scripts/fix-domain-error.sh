#!/bin/bash

echo "🔧 FIXING DOMAIN AUTHENTICATION ERROR"
echo "===================================="
echo ""
echo "🚨 PROBLEM: You're getting this error:"
echo "   'Add your domain (ancient-history-pwa.web.app) to the OAuth redirect domains list'"
echo ""
echo "✅ SOLUTION: Clear browser cache and use correct domain"
echo ""

echo "🧹 STEP 1: Clear browser cache"
echo "1. Open Chrome/Safari"
echo "2. Press Cmd+Shift+Delete (Mac) or Ctrl+Shift+Delete (Windows)"
echo "3. Select 'All time' and check all boxes"
echo "4. Click 'Clear data'"
echo ""

echo "🎯 STEP 2: Use ONLY the correct domain"
echo "❌ NEVER use: https://ancient-history-pwa.web.app"
echo "✅ ALWAYS use: https://ancient-history-trivia.web.app"
echo ""

echo "🔍 STEP 3: Check your bookmarks"
echo "Make sure any bookmarks point to:"
echo "https://ancient-history-trivia.web.app"
echo ""

echo "🚀 STEP 4: Test authentication"
echo "1. Go to: https://ancient-history-trivia.web.app/store"
echo "2. Click a purchase button"
echo "3. Try to sign in"
echo "4. Should work without errors!"
echo ""

echo "💡 WHY THIS HAPPENS:"
echo "- Browser cached the old domain"
echo "- Old bookmarks pointing to wrong domain"
echo "- Accidentally typing wrong URL"
echo ""

echo "🎯 Opening correct domain now..."
open "https://ancient-history-trivia.web.app/store"

echo ""
echo "✅ If you still get the error after clearing cache:"
echo "   Check the URL bar - make sure it shows 'ancient-history-trivia.web.app'"
echo "   NOT 'ancient-history-pwa.web.app'"
