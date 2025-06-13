#!/bin/bash

# Git Workflow - Status Script
# Shows current repository status and available actions

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${PURPLE}======================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}======================================${NC}"
}

print_section() {
    echo -e "\n${CYAN}📋 $1${NC}"
    echo -e "${CYAN}-------------------${NC}"
}

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

print_header "GIT WORKFLOW STATUS"

# Basic repository info
print_section "Repository Information"
CURRENT_BRANCH=$(git branch --show-current)
print_status "Current Branch: $CURRENT_BRANCH"
print_status "Repository: $(basename $(git rev-parse --show-toplevel))"
print_status "Remote URL: $(git remote get-url origin 2>/dev/null || echo 'No remote configured')"

# Branch information
print_section "Branch Overview"
echo "Local branches:"
git branch --color=always | sed 's/^/  /'

echo -e "\nRemote branches:"
git branch -r --color=always | sed 's/^/  /' 2>/dev/null || echo "  No remote branches"

# Working directory status
print_section "Working Directory Status"
if git diff-index --quiet HEAD -- 2>/dev/null; then
    print_success "Working directory is clean"
else
    print_warning "You have uncommitted changes:"
    git status --short | sed 's/^/  /'
fi

# Staged changes
if git diff-index --quiet --cached HEAD -- 2>/dev/null; then
    if git rev-parse --verify HEAD >/dev/null 2>&1; then
        echo "No staged changes"
    fi
else
    print_warning "You have staged changes:"
    git diff --cached --name-only | sed 's/^/  /'
fi

# Feature branches
print_section "Active Feature Branches"
FEATURE_BRANCHES=$(git branch | grep feature/ | sed 's/*//' | xargs)
if [ -n "$FEATURE_BRANCHES" ]; then
    echo "$FEATURE_BRANCHES" | tr ' ' '\n' | sed 's/^/  /'
else
    echo "  No active feature branches"
fi

# Release branches
print_section "Active Release Branches"
RELEASE_BRANCHES=$(git branch | grep release/ | sed 's/*//' | xargs)
if [ -n "$RELEASE_BRANCHES" ]; then
    echo "$RELEASE_BRANCHES" | tr ' ' '\n' | sed 's/^/  /'
    print_warning "Release in progress!"
else
    echo "  No active release branches"
fi

# Hotfix branches
print_section "Active Hotfix Branches"
HOTFIX_BRANCHES=$(git branch | grep hotfix/ | sed 's/*//' | xargs)
if [ -n "$HOTFIX_BRANCHES" ]; then
    echo "$HOTFIX_BRANCHES" | tr ' ' '\n' | sed 's/^/  /'
    print_error "HOTFIX IN PROGRESS!"
else
    echo "  No active hotfix branches"
fi

# Recent commits
print_section "Recent Commits (Last 5)"
git log --oneline --color=always -5 | sed 's/^/  /'

# Tags
print_section "Recent Tags"
RECENT_TAGS=$(git tag --sort=-version:refname | head -5)
if [ -n "$RECENT_TAGS" ]; then
    echo "$RECENT_TAGS" | sed 's/^/  /'
else
    echo "  No tags found"
fi

# Suggested actions
print_section "Suggested Actions"
case $CURRENT_BRANCH in
    main)
        if [ -n "$HOTFIX_BRANCHES" ]; then
            print_error "Complete the hotfix first!"
        else
            echo "  • Switch to develop: git checkout develop"
            echo "  • Start new feature: ./scripts/start-feature.sh \"feature-name\""
            echo "  • Create hotfix: ./scripts/create-hotfix.sh \"version\" \"description\""
        fi
        ;;
    develop)
        if [ -n "$RELEASE_BRANCHES" ]; then
            print_warning "Complete the release first!"
        else
            echo "  • Start new feature: ./scripts/start-feature.sh \"feature-name\""
            echo "  • Create release: ./scripts/create-release.sh \"version\""
        fi
        ;;
    feature/*)
        FEATURE_NAME=$(echo $CURRENT_BRANCH | sed 's/feature\///')
        echo "  • Continue working on feature: $FEATURE_NAME"
        echo "  • Finish feature: ./scripts/finish-feature.sh \"$FEATURE_NAME\""
        ;;
    release/*)
        VERSION=$(echo $CURRENT_BRANCH | sed 's/release\/v//')
        echo "  • Continue preparing release: v$VERSION"
        echo "  • Finish release: ./scripts/finish-release.sh \"$VERSION\""
        ;;
    hotfix/*)
        VERSION=$(echo $CURRENT_BRANCH | sed 's/hotfix\/v//')
        print_error "🚨 HOTFIX MODE ACTIVE"
        echo "  • Complete critical fix for: v$VERSION"
        echo "  • Finish hotfix: ./scripts/finish-hotfix.sh \"$VERSION\""
        ;;
    *)
        print_warning "Unknown branch pattern"
        echo "  • Switch to develop: git checkout develop"
        ;;
esac

print_header "END STATUS REPORT"
