#!/bin/bash

# Setup script for yarn-only environment
# This script creates aliases and functions to block npm/npx usage

echo "🔧 Setting up yarn-only environment..."

# Create npm blocking function
npm() {
    echo "🚫 NPM USAGE BLOCKED 🚫"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "                    YARN ONLY PROJECT                          "
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "❌ NPM is DISABLED in this project for consistency."
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
    echo "💡 Command attempted: npm $*"
    echo ""
    
    # Log the blocked attempt
    echo "$(date): Blocked npm usage attempt: npm $*" >> .npm-block.log
    
    return 1
}

# Create npx blocking function
npx() {
    echo "🚫 NPX USAGE BLOCKED 🚫"
    echo ""
    echo "❌ NPX is DISABLED in this project."
    echo "✅ Use 'yarn dlx <package>' instead of 'npx <package>'"
    echo ""
    echo "Examples:"
    echo "   yarn dlx create-react-app my-app"
    echo "   yarn dlx eslint --init"
    echo "   yarn dlx prettier --write ."
    echo ""
    echo "💡 Command attempted: npx $*"
    echo "💡 Try instead: yarn dlx $*"
    echo ""
    
    # Log the blocked attempt
    echo "$(date): Blocked npx usage attempt: npx $*" >> .npm-block.log
    
    return 1
}

# Export the functions so they're available in the shell
export -f npm
export -f npx

echo "✅ Yarn-only environment configured!"
echo "   - npm command blocked"
echo "   - npx command blocked"
echo "   - Use 'yarn' commands instead"
echo ""
echo "📝 Blocked attempts will be logged to .npm-block.log"
echo ""
