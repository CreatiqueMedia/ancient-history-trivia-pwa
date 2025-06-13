#!/bin/bash

# Git Workflow - Finish Hotfix Script
# Usage: ./scripts/finish-hotfix.sh "1.2.1"

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
    echo "Usage: ./scripts/finish-hotfix.sh \"1.2.1\""
    echo ""
    echo "Available hotfix branches:"
    git branch | grep hotfix/ | sed 's/hotfix\/v//' | sed 's/*//' | xargs
    exit 1
fi

VERSION="$1"
BRANCH_NAME="hotfix/v$VERSION"

print_status "Finishing hotfix: v$VERSION"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if hotfix branch exists
if ! git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Hotfix branch '$BRANCH_NAME' doesn't exist!"
    print_status "Available hotfix branches:"
    git branch | grep hotfix/ || echo "No hotfix branches found"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes!"
    print_status "Please commit your changes first:"
    git status --short
    exit 1
fi

# Switch to hotfix branch and push latest changes
print_status "Switching to hotfix branch..."
git checkout $BRANCH_NAME

print_status "Pushing final hotfix changes..."
git push origin $BRANCH_NAME

# Switch to main and pull latest
print_status "Switching to main branch..."
git checkout main

print_status "Pulling latest changes from main..."
git pull origin main

# Merge hotfix into main
print_status "Merging hotfix into main..."
git merge --no-ff $BRANCH_NAME -m "Hotfix v$VERSION"

# Create tag
print_status "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Hotfix version $VERSION"

# Push main and tags
print_status "Pushing main branch and tags..."
git push origin main
git push origin "v$VERSION"

# Switch to develop and merge hotfix (if develop exists)
if git show-ref --verify --quiet refs/heads/develop; then
    print_status "Switching to develop branch..."
    git checkout develop

    print_status "Pulling latest changes from develop..."
    git pull origin develop

    print_status "Merging hotfix into develop..."
    git merge --no-ff $BRANCH_NAME -m "Merge hotfix v$VERSION into develop"

    # Push develop
    print_status "Pushing updated develop branch..."
    git push origin develop
else
    print_warning "develop branch doesn't exist, skipping merge to develop"
fi

# Delete local hotfix branch
print_status "Cleaning up local hotfix branch..."
git branch -d $BRANCH_NAME

# Delete remote hotfix branch
print_status "Cleaning up remote hotfix branch..."
git push origin --delete $BRANCH_NAME

print_success "🚀 Hotfix v$VERSION deployed successfully!"
print_status ""
print_status "✅ Hotfix Summary:"
print_status "   • Critical fix v$VERSION is now live on main branch"
print_status "   • Tag v$VERSION created for deployment"
print_status "   • Changes merged back to develop (if exists)"
print_status "   • Hotfix branch cleaned up"
print_status ""
print_status "🚨 URGENT DEPLOYMENT READY:"
print_status "   • Main branch: Immediate production deployment recommended"
print_status "   • Tag: v$VERSION"
print_status "   • Commit: $(git rev-parse --short HEAD)"
print_status ""
print_status "📋 Recent commits on main:"
git log --oneline -3 main
