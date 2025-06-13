#!/bin/bash

# Git Workflow - Create Hotfix Script
# Usage: ./scripts/create-hotfix.sh "1.2.1" "bug-description"

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if version is provided
if [ -z "$1" ]; then
    print_error "Version number is required!"
    echo "Usage: ./scripts/create-hotfix.sh \"1.2.1\" \"bug-description\""
    echo "Use semantic versioning: increment PATCH version"
    exit 1
fi

VERSION="$1"
DESCRIPTION="${2:-hotfix}"
BRANCH_NAME="hotfix/v$VERSION"

# Validate version format (basic check)
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format! Use MAJOR.MINOR.PATCH (e.g., 1.2.1)"
    exit 1
fi

print_status "Creating hotfix: v$VERSION"
print_status "Description: $DESCRIPTION"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if main branch exists
if ! git show-ref --verify --quiet refs/heads/main; then
    print_error "main branch doesn't exist!"
    exit 1
fi

# Check if hotfix branch already exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Hotfix branch '$BRANCH_NAME' already exists!"
    exit 1
fi

# Check if tag already exists
if git tag -l | grep -q "^v$VERSION$"; then
    print_error "Tag 'v$VERSION' already exists!"
    exit 1
fi

# Switch to main and pull latest changes
print_status "Switching to main branch..."
git checkout main

print_status "Pulling latest changes from main..."
git pull origin main

# Create hotfix branch
print_status "Creating hotfix branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Update version in package.json if it exists
if [ -f "package.json" ]; then
    print_status "Updating version in package.json..."
    if command -v jq > /dev/null; then
        # Use jq if available
        jq ".version = \"$VERSION\"" package.json > package.json.tmp && mv package.json.tmp package.json
    else
        # Fallback to sed
        sed -i.bak "s/\"version\": \".*\"/\"version\": \"$VERSION\"/" package.json && rm package.json.bak
    fi
    git add package.json
    git commit -m "chore: bump version to $VERSION for hotfix"
fi

# Push hotfix branch
print_status "Pushing hotfix branch to remote..."
git push -u origin $BRANCH_NAME

print_success "Hotfix v$VERSION created successfully!"
print_warning "🚨 HOTFIX MODE - This is for CRITICAL production fixes only!"
print_status "You are now on branch: $BRANCH_NAME"
print_status ""
print_status "Next steps:"
print_status "1. Make your MINIMAL fix (only critical changes!)"
print_status "2. Test thoroughly"
print_status "3. Commit with: git commit -m \"fix: $DESCRIPTION\""
print_status "4. When ready, run: ./scripts/finish-hotfix.sh \"$VERSION\""
print_status ""
print_status "⚠️  IMPORTANT HOTFIX GUIDELINES:"
print_status "   • Only fix the critical issue"
print_status "   • Don't add new features"
print_status "   • Keep changes minimal"
print_status "   • Test extensively before finishing"
