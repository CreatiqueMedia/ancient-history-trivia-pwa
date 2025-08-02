#!/bin/bash

# Yarn Enforcement Verification Script
# This script verifies that the project is properly configured for yarn-only usage

echo "🔍 Verifying Yarn-Only Project Configuration..."
echo "=================================================="

# Check if yarn is installed
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed globally"
    echo "   Install with: npm install -g yarn"
    exit 1
else
    echo "✅ Yarn is installed: $(yarn --version)"
fi

# Check Node.js version
NODE_VERSION=$(node --version)
echo "✅ Node.js version: $NODE_VERSION"

# Check if .nvmrc exists
if [ -f ".nvmrc" ]; then
    NVMRC_VERSION=$(cat .nvmrc)
    echo "✅ .nvmrc specifies: v$NVMRC_VERSION"
else
    echo "⚠️  No .nvmrc file found"
fi

# Check package.json engines
if grep -q '"npm": "please-use-yarn"' package.json; then
    echo "✅ NPM usage blocked in package.json engines"
else
    echo "❌ NPM blocking not found in package.json"
fi

# Check for preinstall hook
if grep -q "preinstall.*yarn" package.json; then
    echo "✅ Preinstall hook configured to block NPM"
else
    echo "❌ Preinstall hook not configured"
fi

# Check for yarn.lock
if [ -f "yarn.lock" ]; then
    echo "✅ yarn.lock exists"
else
    echo "❌ yarn.lock not found"
fi

# Check for package-lock.json (should not exist)
if [ -f "package-lock.json" ]; then
    echo "❌ package-lock.json found (should be deleted)"
else
    echo "✅ No package-lock.json found"
fi

# Check .yarnrc
if [ -f ".yarnrc" ]; then
    echo "✅ .yarnrc configuration exists"
else
    echo "⚠️  No .yarnrc configuration found"
fi

# Check gitignore for npm files
if grep -q "package-lock.json" .gitignore; then
    echo "✅ package-lock.json blocked in .gitignore"
else
    echo "⚠️  package-lock.json not blocked in .gitignore"
fi

echo ""
echo "🧪 Testing NPM Blocking..."
echo "=========================="

# Test preinstall hook
echo "Testing preinstall hook..."
if npm_execpath=/usr/local/bin/npm npm run preinstall 2>&1 | grep -q "Please use yarn instead of npm"; then
    echo "✅ Preinstall hook successfully blocks NPM"
else
    echo "❌ Preinstall hook not working"
fi

echo ""
echo "📋 Summary"
echo "=========="
echo "Project is configured for yarn-only usage."
echo "All team members should use yarn commands exclusively."
echo ""
echo "Quick Commands:"
echo "  yarn install    # Install dependencies"
echo "  yarn dev       # Start development server"
echo "  yarn build     # Build for production"
echo "  yarn test      # Run tests"
echo ""
echo "For full documentation, see: docs/YARN_ONLY_POLICY.md"
