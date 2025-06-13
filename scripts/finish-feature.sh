#!/bin/bash

# Git Workflow - Finish Feature Script
# Usage: ./scripts/finish-feature.sh "feature-name"

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

# Check if feature name is provided
if [ -z "$1" ]; then
    print_error "Feature name is required!"
    echo "Usage: ./scripts/finish-feature.sh \"feature-name\""
    echo ""
    echo "Available feature branches:"
    git branch | grep feature/ | sed 's/feature\///' | sed 's/*//' | xargs
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/$FEATURE_NAME"

print_status "Finishing feature: $FEATURE_NAME"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if feature branch exists
if ! git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Feature branch '$BRANCH_NAME' doesn't exist!"
    print_status "Available feature branches:"
    git branch | grep feature/ || echo "No feature branches found"
    exit 1
fi

# Check if there are uncommitted changes
if ! git diff-index --quiet HEAD --; then
    print_error "You have uncommitted changes!"
    print_status "Please commit or stash your changes first:"
    git status --short
    exit 1
fi

# Switch to feature branch and push latest changes
print_status "Switching to feature branch..."
git checkout $BRANCH_NAME

print_status "Pushing latest changes..."
git push origin $BRANCH_NAME

# Switch to develop and pull latest
print_status "Switching to develop branch..."
git checkout develop

print_status "Pulling latest changes from develop..."
git pull origin develop

# Merge feature into develop
print_status "Merging feature into develop..."
git merge --no-ff $BRANCH_NAME -m "Merge feature/$FEATURE_NAME into develop"

# Push develop
print_status "Pushing updated develop branch..."
git push origin develop

# Delete local feature branch
print_status "Cleaning up local feature branch..."
git branch -d $BRANCH_NAME

# Delete remote feature branch
print_status "Cleaning up remote feature branch..."
git push origin --delete $BRANCH_NAME

print_success "Feature '$FEATURE_NAME' completed successfully!"
print_status "Changes have been merged into develop branch"
print_status ""
print_status "Next steps:"
print_status "- Feature is now part of develop branch"
print_status "- When ready to release, run: ./scripts/create-release.sh \"version\""
print_status ""
print_status "Current develop status:"
git log --oneline -5
