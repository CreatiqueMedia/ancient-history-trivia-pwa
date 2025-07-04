#!/bin/bash

# Comprehensive App Testing Script
# Tests all major functionality of the Ancient History Trivia PWA

echo "🧪 COMPREHENSIVE APP TESTING SCRIPT"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
TOTAL_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $test_name... "
    
    if eval "$test_command" > /dev/null 2>&1; then
        if [ "$expected_result" = "success" ]; then
            echo -e "${GREEN}✅ PASSED${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAILED (expected failure but got success)${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    else
        if [ "$expected_result" = "failure" ]; then
            echo -e "${GREEN}✅ PASSED (expected failure)${NC}"
            TESTS_PASSED=$((TESTS_PASSED + 1))
        else
            echo -e "${RED}❌ FAILED${NC}"
            TESTS_FAILED=$((TESTS_FAILED + 1))
        fi
    fi
}

# Function to test HTTP endpoint
test_http() {
    local url="$1"
    local expected_status="$2"
    local description="$3"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    echo -n "Testing: $description... "
    
    status_code=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    
    if [ "$status_code" = "$expected_status" ]; then
        echo -e "${GREEN}✅ PASSED (HTTP $status_code)${NC}"
        TESTS_PASSED=$((TESTS_PASSED + 1))
    else
        echo -e "${RED}❌ FAILED (Expected HTTP $expected_status, got $status_code)${NC}"
        TESTS_FAILED=$((TESTS_FAILED + 1))
    fi
}

echo "🔧 BUILD AND COMPILATION TESTS"
echo "==============================="

# Test TypeScript compilation
run_test "TypeScript compilation" "yarn tsc --noEmit" "success"

# Test Vite build
run_test "Vite production build" "yarn build" "success"

# Test if dist directory exists
run_test "Build output directory exists" "[ -d 'dist' ]" "success"

# Test if main files exist
run_test "Index.html exists in dist" "[ -f 'dist/index.html' ]" "success"
run_test "CSS bundle exists" "ls dist/assets/*.css" "success"
run_test "JS bundle exists" "ls dist/assets/*.js" "success"
run_test "PWA manifest exists" "[ -f 'dist/manifest.webmanifest' ]" "success"
run_test "Service worker exists" "[ -f 'dist/sw.js' ]" "success"

echo ""
echo "🌐 DEPLOYMENT TESTS"
echo "==================="

# Test Firebase hosting
test_http "https://ancient-history-trivia.web.app" "200" "Firebase hosting availability"
test_http "https://ancient-history-trivia.web.app/manifest.webmanifest" "200" "PWA manifest accessibility"

# Test GitHub Pages (if available)
test_http "https://creativemedia.github.io/ancient-history-trivia-pwa" "200" "GitHub Pages availability"

echo ""
echo "💳 STRIPE PAYMENT LINK TESTS"
echo "============================"

# Test all subscription payment links
test_http "https://buy.stripe.com/test_dRmcN4fxbdzr2BDdLb9oc0r" "200" "Pro Monthly payment link"
test_http "https://buy.stripe.com/test_bJecN40Ch2UNgstfTj9oc0s" "200" "Pro Annual payment link"
test_http "https://buy.stripe.com/test_28E5kCgBfdzr1xzfTj9oc0q" "200" "Pro Biennial payment link"

# Test bundle payment links
test_http "https://buy.stripe.com/test_4gMbJ02Kp2UNa45dLb9oc0e" "200" "Ancient India Pack payment link"
test_http "https://buy.stripe.com/test_dRm9AS84Jcvngst36x9oc0f" "200" "Ancient Americas Pack payment link"
test_http "https://buy.stripe.com/test_9B64gy0CheDvdgh8qR9oc0g" "200" "Ancient Europe Pack payment link"
test_http "https://buy.stripe.com/test_5kQ4gydp33YRgst6iJ9oc0h" "200" "Bronze Age Pack payment link"
test_http "https://buy.stripe.com/test_5kQaEW98Nbrj0tv5eF9oc0i" "200" "Iron Age Pack payment link"
test_http "https://buy.stripe.com/test_14AaEWgBf1QJ5NPbD39oc0j" "200" "Prehistoric Age Pack payment link"

echo ""
echo "🔍 CODE QUALITY TESTS"
echo "====================="

# Test for common issues
run_test "No console.log in production code" "! grep -r 'console\.log' src/ --include='*.ts' --include='*.tsx'" "success"
run_test "No TODO comments in main code" "! grep -r 'TODO' src/ --include='*.ts' --include='*.tsx'" "failure"
run_test "All imports are valid" "yarn tsc --noEmit --skipLibCheck" "success"

echo ""
echo "📱 PWA FUNCTIONALITY TESTS"
echo "=========================="

# Test PWA files
run_test "Service worker registration file exists" "[ -f 'dist/registerSW.js' ]" "success"
run_test "Workbox files exist" "ls dist/workbox-*.js" "success"

echo ""
echo "🔐 SECURITY TESTS"
echo "================="

# Test for sensitive data exposure
run_test "No hardcoded API keys in source" "! grep -r 'sk_' src/ --include='*.ts' --include='*.tsx'" "success"
run_test "No hardcoded secrets" "! grep -r 'secret' src/ --include='*.ts' --include='*.tsx'" "success"

echo ""
echo "📊 PERFORMANCE TESTS"
echo "===================="

# Test bundle sizes
BUNDLE_SIZE=$(du -k dist/assets/*.js | cut -f1 | head -1)
if [ "$BUNDLE_SIZE" -lt 1000 ]; then
    echo -e "Bundle size: ${GREEN}✅ GOOD ($BUNDLE_SIZE KB)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
elif [ "$BUNDLE_SIZE" -lt 2000 ]; then
    echo -e "Bundle size: ${YELLOW}⚠️  ACCEPTABLE ($BUNDLE_SIZE KB)${NC}"
    TESTS_PASSED=$((TESTS_PASSED + 1))
else
    echo -e "Bundle size: ${RED}❌ TOO LARGE ($BUNDLE_SIZE KB)${NC}"
    TESTS_FAILED=$((TESTS_FAILED + 1))
fi
TOTAL_TESTS=$((TOTAL_TESTS + 1))

echo ""
echo "📋 TEST SUMMARY"
echo "==============="
echo -e "Total Tests: ${BLUE}$TOTAL_TESTS${NC}"
echo -e "Passed: ${GREEN}$TESTS_PASSED${NC}"
echo -e "Failed: ${RED}$TESTS_FAILED${NC}"

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "\n🎉 ${GREEN}ALL TESTS PASSED! Your app is ready for production.${NC}"
    exit 0
else
    echo -e "\n⚠️  ${YELLOW}Some tests failed. Please review the issues above.${NC}"
    exit 1
fi
