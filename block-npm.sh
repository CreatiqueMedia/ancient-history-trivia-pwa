#!/bin/bash

# Enhanced npm blocking script for yarn-only projects
# This script prevents npm and npx usage and provides helpful guidance

echo "🚫 NPM USAGE BLOCKED 🚫"
echo ""
echo "This project uses YARN ONLY. NPM is not allowed."
echo ""
echo "Please use these yarn commands instead:"
echo ""
echo "📦 Package Management:"
echo "   yarn install           (instead of npm install)"
echo "   yarn add <package>      (instead of npm install <package>)"
echo "   yarn add -D <package>   (instead of npm install -D <package>)"
echo "   yarn remove <package>   (instead of npm uninstall <package>)"
echo ""
echo "🏃 Running Scripts:"
echo "   yarn dev               (instead of npm run dev)"
echo "   yarn build             (instead of npm run build)"
echo "   yarn test              (instead of npm run test)"
echo "   yarn deploy            (instead of npm run deploy)"
echo ""
echo "🔧 Tools:"
echo "   yarn dlx <package>     (instead of npx <package>)"
echo "   yarn create <template> (instead of npm create <template>)"
echo ""
echo "❌ If you see this message, you tried to use:"
if command -v npm &> /dev/null; then
    echo "   - npm (blocked)"
fi
if command -v npx &> /dev/null; then
    echo "   - npx (blocked)"
fi
echo ""
echo "✅ This project is configured for yarn-only usage for consistency and reliability."
echo ""
echo "Need help? Check the README.md or contact the project maintainer."
echo ""

exit 1
