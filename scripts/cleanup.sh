#!/bin/bash

# Git Workflow - Cleanup Script
# Removes old merged branches and provides cleanup options

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

print_header() {
    echo -e "\n${BLUE}===============================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}===============================================${NC}"
}

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

print_header "GIT WORKFLOW CLEANUP"

# Switch to develop branch
print_status "Switching to develop branch..."
git checkout develop > /dev/null 2>&1 || {
    print_warning "develop branch doesn't exist, switching to main..."
    git checkout main > /dev/null 2>&1
}

# Update branches
print_status "Updating local branches..."
git pull > /dev/null 2>&1

# Find merged feature branches
print_status "Finding merged feature branches..."
MERGED_FEATURES=$(git branch --merged | grep feature/ | sed 's/*//' | xargs)

if [ -n "$MERGED_FEATURES" ]; then
    print_warning "Found merged feature branches:"
    echo "$MERGED_FEATURES" | tr ' ' '\n' | sed 's/^/  /'
    
    echo -e "\nDelete these branches? (y/N): "
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        for branch in $MERGED_FEATURES; do
            print_status "Deleting local branch: $branch"
            git branch -d "$branch"
        done
        print_success "Merged feature branches cleaned up!"
    else
        print_status "Skipping local branch cleanup"
    fi
else
    print_success "No merged feature branches to clean up"
fi

# Clean up remote tracking branches
print_status "Cleaning up remote tracking references..."
git remote prune origin

# Find remote branches that no longer exist
print_status "Finding stale remote branches..."
STALE_REMOTES=$(git branch -r --merged | grep origin/feature/ | grep -v HEAD | sed 's|origin/||' | xargs)

if [ -n "$STALE_REMOTES" ]; then
    print_warning "Found merged remote feature branches:"
    echo "$STALE_REMOTES" | tr ' ' '\n' | sed 's/^/  origin/'
    
    echo -e "\nDelete these remote branches? (y/N): "
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        for branch in $STALE_REMOTES; do
            print_status "Deleting remote branch: origin/$branch"
            git push origin --delete "$branch" 2>/dev/null || print_warning "Could not delete origin/$branch (may already be deleted)"
        done
        print_success "Remote feature branches cleaned up!"
    else
        print_status "Skipping remote branch cleanup"
    fi
else
    print_success "No merged remote feature branches to clean up"
fi

# Show current branch status after cleanup
print_header "CLEANUP SUMMARY"

print_status "Current local branches:"
git branch | sed 's/^/  /'

print_status "Current remote branches:"
git branch -r | sed 's/^/  /'

# Disk usage info
REPO_SIZE=$(du -sh .git 2>/dev/null | cut -f1)
print_status "Repository size: $REPO_SIZE"

print_status "Cleanup completed!"
print_success "Repository is clean and ready for development"

# Suggest running git gc for large repositories
GIT_OBJECTS=$(find .git/objects -type f | wc -l)
if [ "$GIT_OBJECTS" -gt 1000 ]; then
    print_warning "Repository has many objects ($GIT_OBJECTS)"
    echo "Consider running: git gc --aggressive --prune=now"
fi
