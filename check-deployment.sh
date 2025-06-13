#!/bin/bash
# Ancient History PWA - Deployment Readiness Check

echo "🏛️  Ancient History PWA - Deployment Readiness Check"
echo "=================================================="
echo ""

# Check if yarn is available
if ! command -v yarn &> /dev/null; then
    echo "❌ Yarn is not installed. Please install yarn first."
    exit 1
fi

echo "✅ Yarn is available"

# Check dependencies
echo "📦 Checking dependencies..."
if yarn check --verify-tree; then
    echo "✅ All dependencies are correctly installed"
else
    echo "⚠️  Running yarn install to fix dependencies..."
    yarn install
fi

# Check for TypeScript errors
echo "🔍 Checking TypeScript compilation..."
if yarn tsc --noEmit; then
    echo "✅ TypeScript compilation successful"
else
    echo "❌ TypeScript errors found. Please fix before deployment."
    exit 1
fi

# Check build process
echo "🏗️  Testing build process..."
if yarn build; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Please fix build errors."
    exit 1
fi

# Check if dev server starts
echo "🚀 Testing development server..."
timeout 10s yarn dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 5

if kill -0 $SERVER_PID 2>/dev/null; then
    echo "✅ Development server starts successfully"
    kill $SERVER_PID
else
    echo "❌ Development server failed to start"
    exit 1
fi

# Check key files exist
echo "📁 Checking critical files..."
CRITICAL_FILES=(
    "src/App.tsx"
    "src/screens/StoreScreen.tsx"
    "src/screens/AchievementsScreen.tsx"
    "src/context/PurchaseContext.tsx"
    "src/data/bundles.ts"
    "src/types/bundles.ts"
)

for file in "${CRITICAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file is missing"
        exit 1
    fi
done

# Check bundle data
echo "🎯 Checking bundle configuration..."
BUNDLE_COUNT=$(grep -c "id.*region_pack\|id.*age_pack\|id.*format_pack\|id.*difficulty_pack" src/data/bundles.ts)
if [ "$BUNDLE_COUNT" -ge 10 ]; then
    echo "✅ Bundle configuration looks good ($BUNDLE_COUNT bundles found)"
else
    echo "⚠️  Warning: Only $BUNDLE_COUNT bundles found in configuration"
fi

# Check achievement system
echo "🏆 Checking achievement system..."
if grep -q "achievements.*AchievementType" src/context/StatsContext.tsx; then
    echo "✅ Achievement system is integrated"
else
    echo "❌ Achievement system integration issue"
    exit 1
fi

echo ""
echo "🎉 Deployment Readiness Check Complete!"
echo "✅ PWA is ready for deployment"
echo ""
echo "Next steps:"
echo "1. yarn build (for production build)"
echo "2. Deploy dist/ folder to your hosting service"
echo "3. Configure PWA manifest and service worker if needed"
echo "4. Set up SSL certificate for HTTPS (required for PWA)"
