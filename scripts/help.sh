#!/bin/bash

# Git Workflow - Help Script
# Shows quick reference for all commands

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${PURPLE}===============================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}===============================================${NC}"
}

print_section() {
    echo -e "\n${CYAN}$1${NC}"
    echo -e "${CYAN}$(echo "$1" | sed 's/./-/g')${NC}"
}

print_command() {
    echo -e "${GREEN}$1${NC}"
    echo -e "  ${BLUE}$2${NC}"
}

print_example() {
    echo -e "  ${YELLOW}Example: $1${NC}"
}

print_header "GIT WORKFLOW QUICK REFERENCE"

print_section "📋 Status & Information"
print_command "./scripts/status.sh" "Show complete repository status and suggested actions"
print_example "./scripts/status.sh"

print_command "./scripts/help.sh" "Show this help guide"
print_example "./scripts/help.sh"

print_section "🚀 Feature Development"
print_command "./scripts/start-feature.sh \"feature-name\"" "Start a new feature branch from develop"
print_example "./scripts/start-feature.sh \"user-authentication\""

print_command "./scripts/finish-feature.sh \"feature-name\"" "Complete feature and merge to develop"
print_example "./scripts/finish-feature.sh \"user-authentication\""

print_section "📦 Release Management"
print_command "./scripts/create-release.sh \"version\"" "Start release preparation (semantic versioning)"
print_example "./scripts/create-release.sh \"1.2.0\""

print_command "./scripts/finish-release.sh \"version\"" "Complete release and deploy to main"
print_example "./scripts/finish-release.sh \"1.2.0\""

print_section "🚨 Emergency Hotfixes"
print_command "./scripts/create-hotfix.sh \"version\" \"description\"" "Create emergency fix from main"
print_example "./scripts/create-hotfix.sh \"1.2.1\" \"fix-critical-bug\""

print_command "./scripts/finish-hotfix.sh \"version\"" "Complete hotfix and deploy immediately"
print_example "./scripts/finish-hotfix.sh \"1.2.1\""

print_section "🧹 Maintenance"
print_command "./scripts/cleanup.sh" "Clean up old merged branches"
print_example "./scripts/cleanup.sh"

print_command "./scripts/init-workflow.sh" "Initialize workflow in new project"
print_example "./scripts/init-workflow.sh"

print_section "📖 Common Workflows"

echo -e "\n${YELLOW}🔹 Starting New Feature:${NC}"
echo "  1. ./scripts/start-feature.sh \"my-feature\""
echo "  2. Make your changes and commit normally"
echo "  3. ./scripts/finish-feature.sh \"my-feature\""

echo -e "\n${YELLOW}🔹 Creating Release:${NC}"
echo "  1. ./scripts/create-release.sh \"1.2.0\""
echo "  2. Test and finalize release"
echo "  3. ./scripts/finish-release.sh \"1.2.0\""

echo -e "\n${YELLOW}🔹 Emergency Fix:${NC}"
echo "  1. ./scripts/create-hotfix.sh \"1.2.1\" \"critical-fix\""
echo "  2. Make minimal fix and test"
echo "  3. ./scripts/finish-hotfix.sh \"1.2.1\""

print_section "📏 Version Numbering (Semantic Versioning)"
echo -e "${GREEN}MAJOR.MINOR.PATCH${NC} (e.g., 2.1.3)"
echo "  • MAJOR: Breaking changes (1.0.0 → 2.0.0)"
echo "  • MINOR: New features, backward compatible (1.0.0 → 1.1.0)"
echo "  • PATCH: Bug fixes (1.0.0 → 1.0.1)"

print_section "🌿 Branch Types"
echo "  • main: Production-ready code"
echo "  • develop: Integration branch"
echo "  • feature/name: New features"
echo "  • release/vX.Y.Z: Release preparation"
echo "  • hotfix/vX.Y.Z: Emergency fixes"

print_section "💡 Pro Tips"
echo "  • Always run ./scripts/status.sh to see current state"
echo "  • Use descriptive feature names (feature/payment-integration)"
echo "  • Test thoroughly before finishing releases/hotfixes"
echo "  • Keep hotfixes minimal - only critical fixes"
echo "  • Regular cleanup with ./scripts/cleanup.sh"

print_section "🆘 Need Help?"
echo "  • Read: GIT_WORKFLOW_GUIDE.md (complete documentation)"
echo "  • Check: ./scripts/status.sh (current state)"
echo "  • Clean: ./scripts/cleanup.sh (remove old branches)"

print_header "HAPPY CODING!"
echo -e "${BLUE}For complete documentation, see: ${GREEN}GIT_WORKFLOW_GUIDE.md${NC}"
