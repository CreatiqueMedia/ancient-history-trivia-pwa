#!/bin/bash

# Enhanced npm blocking script for yarn-only projects
# This script completely prevents npm and npx usage

echo "🚫 NPM USAGE COMPLETELY BLOCKED 🚫"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "                    YARN ONLY PROJECT                          "
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "❌ NPM and NPX are DISABLED in this project for consistency."
echo ""
echo "✅ Please use YARN commands instead:"
echo ""
echo "📦 Package Management:"
echo "   yarn install           → Install all dependencies"
echo "   yarn add <package>     → Add a package"
echo "   yarn add -D <package>  → Add dev dependency"
echo "   yarn remove <package>  → Remove a package"
echo "   yarn upgrade           → Upgrade packages"
echo ""
echo "🏃 Running Scripts:"
echo "   yarn dev              → Start development server"
echo "   yarn build            → Build for production"
echo "   yarn deploy           → Build and deploy"
echo "   yarn test             → Run tests"
echo "   yarn preview          → Preview build"
echo ""
echo "🔧 Tools & Utilities:"
echo "   yarn dlx <package>    → Run package (instead of npx)"
echo "   yarn create <template> → Create from template"
echo ""
echo "🔍 Information:"
echo "   yarn --version        → Check yarn version"
echo "   yarn list             → List installed packages"
echo ""
echo "💡 Why yarn-only?"
echo "   • Consistent lock file (yarn.lock)"
echo "   • Better dependency resolution"
echo "   • Faster installs with caching"
echo "   • Team consistency"
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Log the blocked attempt
echo "$(date): Blocked npm/npx usage attempt" >> .npm-block.log

exit 1
