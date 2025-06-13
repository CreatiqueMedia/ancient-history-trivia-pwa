#!/bin/bash

# Git Workflow - Finish Release Script
# Usage: ./scripts/finish-release.sh "1.2.0"

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
    echo "Usage: ./scripts/finish-release.sh \"1.2.0\""
    echo ""
    echo "Available release branches:"
    git branch | grep release/ | sed 's/release\/v//' | sed 's/*//' | xargs
    exit 1
fi

VERSION="$1"
BRANCH_NAME="release/v$VERSION"

print_status "Finishing release: v$VERSION"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if release branch exists
if ! git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Release branch '$BRANCH_NAME' doesn't exist!"
    print_status "Available release branches:"
    git branch | grep release/ || echo "No release branches found"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes!"
    print_status "Please commit your changes first:"
    git status --short
    exit 1
fi

# Switch to release branch and push latest changes
print_status "Switching to release branch..."
git checkout $BRANCH_NAME

print_status "Pushing any final changes..."
git push origin $BRANCH_NAME

# Switch to main and pull latest
print_status "Switching to main branch..."
git checkout main

print_status "Pulling latest changes from main..."
git pull origin main

# Merge release into main
print_status "Merging release into main..."
git merge --no-ff $BRANCH_NAME -m "Release v$VERSION"

# Create tag
print_status "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release version $VERSION"

# Push main and tags
print_status "Pushing main branch and tags..."
git push origin main
git push origin "v$VERSION"

# Switch to develop and merge release
print_status "Switching to develop branch..."
git checkout develop

print_status "Pulling latest changes from develop..."
git pull origin develop

print_status "Merging release into develop..."
git merge --no-ff $BRANCH_NAME -m "Merge release v$VERSION into develop"

# Push develop
print_status "Pushing updated develop branch..."
git push origin develop

# Delete local release branch
print_status "Cleaning up local release branch..."
git branch -d $BRANCH_NAME

# Delete remote release branch
print_status "Cleaning up remote release branch..."
git push origin --delete $BRANCH_NAME

print_success "Release v$VERSION completed successfully!"
print_status ""
print_status "✅ Release Summary:"
print_status "   • Version v$VERSION is now live on main branch"
print_status "   • Tag v$VERSION created for easy reference"
print_status "   • Changes merged back to develop"
print_status "   • Release branch cleaned up"
print_status ""
print_status "🚀 Deployment Information:"
print_status "   • Main branch: Ready for production deployment"
print_status "   • Tag: v$VERSION (use this for deployment)"
print_status "   • Commit: $(git rev-parse --short HEAD)"
print_status ""
print_status "📋 Recent commits on main:"
git log --oneline -5 main
