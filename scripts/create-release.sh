#!/bin/bash

# Git Workflow - Create Release Script
# Usage: ./scripts/create-release.sh "1.2.0"

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
    echo "Usage: ./scripts/create-release.sh \"1.2.0\""
    echo "Use semantic versioning: MAJOR.MINOR.PATCH"
    exit 1
fi

VERSION="$1"
BRANCH_NAME="release/v$VERSION"

# Validate version format (basic check)
if [[ ! $VERSION =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    print_error "Invalid version format! Use MAJOR.MINOR.PATCH (e.g., 1.2.0)"
    exit 1
fi

print_status "Creating release: v$VERSION"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Not in a git repository!"
    exit 1
fi

# Check if develop branch exists
if ! git show-ref --verify --quiet refs/heads/develop; then
    print_error "develop branch doesn't exist!"
    exit 1
fi

# Check if release branch already exists
if git show-ref --verify --quiet refs/heads/$BRANCH_NAME; then
    print_error "Release branch '$BRANCH_NAME' already exists!"
    exit 1
fi

# Check if tag already exists
if git tag -l | grep -q "^v$VERSION$"; then
    print_error "Tag 'v$VERSION' already exists!"
    exit 1
fi

# Switch to develop and pull latest changes
print_status "Switching to develop branch..."
git checkout develop

print_status "Pulling latest changes from develop..."
git pull origin develop

# Create release branch
print_status "Creating release branch: $BRANCH_NAME"
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
    git commit -m "chore: bump version to $VERSION"
fi

# Create/update CHANGELOG.md
print_status "Updating CHANGELOG.md..."
CHANGELOG_ENTRY="## [v$VERSION] - $(date +%Y-%m-%d)

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 

"

if [ -f "CHANGELOG.md" ]; then
    # Insert new entry after the first line (header)
    echo "$CHANGELOG_ENTRY" > changelog_temp.md
    tail -n +2 CHANGELOG.md >> changelog_temp.md
    head -n 1 CHANGELOG.md > CHANGELOG.md
    cat changelog_temp.md >> CHANGELOG.md
    rm changelog_temp.md
else
    # Create new CHANGELOG.md
    echo "# Changelog

All notable changes to this project will be documented in this file.

$CHANGELOG_ENTRY" > CHANGELOG.md
fi

print_warning "Please edit CHANGELOG.md to add your release notes!"

# Commit changelog
git add CHANGELOG.md
git commit -m "docs: update changelog for v$VERSION"

# Push release branch
print_status "Pushing release branch to remote..."
git push -u origin $BRANCH_NAME

print_success "Release v$VERSION created successfully!"
print_status "You are now on branch: $BRANCH_NAME"
print_status ""
print_status "Next steps:"
print_status "1. Review and test the release"
print_status "2. Edit CHANGELOG.md with release notes"
print_status "3. Make any last-minute fixes"
print_status "4. When ready, run: ./scripts/finish-release.sh \"$VERSION\""
print_status ""
print_status "Files to review:"
print_status "- CHANGELOG.md (add your release notes)"
if [ -f "package.json" ]; then
    print_status "- package.json (version updated to $VERSION)"
fi
