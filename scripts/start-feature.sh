#!/bin/bash

# Git Workflow - Start Feature Script
# Usage: ./scripts/start-feature.sh "feature-name"

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
    echo "Usage: ./scripts/start-feature.sh \"feature-name\""
    echo "Example: ./scripts/start-feature.sh \"user-authentication\""
    exit 1
fi

FEATURE_NAME="$1"
BRANCH_NAME="feature/$FEATURE_NAME"

print_status "Starting new feature: $FEATURE_NAME"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if develop branch exists
if ! git show-ref --verify --quiet refs/heads/develop; then
    print_warning "develop branch doesn't exist. Creating it..."
    git checkout -b develop
    git push -u origin develop
fi

# Switch to develop and pull latest changes
print_status "Switching to develop branch..."
git checkout develop

print_status "Pulling latest changes from develop..."
git pull origin develop

# Check if feature branch already exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Feature branch '$BRANCH_NAME' already exists!"
    print_status "Existing branches:"
    git branch | grep feature/ || echo "No feature branches found"
    exit 1
fi

# Create and switch to feature branch
print_status "Creating feature branch: $BRANCH_NAME"
git checkout -b $BRANCH_NAME

# Push the branch to remote
print_status "Pushing feature branch to remote..."
git push -u origin $BRANCH_NAME

print_success "Feature '$FEATURE_NAME' started successfully!"
print_status "You are now on branch: $BRANCH_NAME"
print_status ""
print_status "Next steps:"
print_status "1. Make your changes and commit them"
print_status "2. Push regularly with: git push"
print_status "3. When done, run: ./scripts/finish-feature.sh \"$FEATURE_NAME\""
print_status ""
print_status "Current status:"
git status --short
