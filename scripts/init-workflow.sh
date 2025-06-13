#!/bin/bash

# Git Workflow - Initialize Workflow Script
# Sets up the git workflow for a new project

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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
    echo -e "\n${PURPLE}===============================================${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}===============================================${NC}"
}

print_header "INITIALIZING GIT WORKFLOW"

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_status "Initializing git repository..."
    git init
    print_success "Git repository initialized!"
else
    print_status "Git repository already exists"
fi

# Ensure we're on main branch
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "$CURRENT_BRANCH" != "main" ] && [ -n "$CURRENT_BRANCH" ]; then
    print_status "Renaming current branch to main..."
    git branch -m main
fi

# Create develop branch if it doesn't exist
if ! git show-ref --verify --quiet refs/heads/develop 2>/dev/null; then
    print_status "Creating develop branch..."
    git checkout -b develop
    print_success "Develop branch created!"
else
    print_status "Develop branch already exists"
fi

# Switch to develop
git checkout develop

# Make scripts executable
print_status "Making scripts executable..."
chmod +x scripts/*.sh
print_success "Scripts are now executable!"

# Create initial commit if repository is empty
if ! git rev-parse --verify HEAD >/dev/null 2>&1; then
    print_status "Creating initial commit..."
    git add .
    git commit -m "Initial commit: Setup git workflow"
    print_success "Initial commit created!"
fi

# Create .gitignore if it doesn't exist
if [ ! -f ".gitignore" ]; then
    print_status "Creating .gitignore..."
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS files
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/
EOF
    git add .gitignore
    git commit -m "Add .gitignore"
    print_success ".gitignore created!"
fi

# Create CHANGELOG.md if it doesn't exist
if [ ! -f "CHANGELOG.md" ]; then
    print_status "Creating CHANGELOG.md..."
    cat > CHANGELOG.md << 'EOF'
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup
- Git workflow implementation

### Changed

### Deprecated

### Removed

### Fixed

### Security
EOF
    git add CHANGELOG.md
    git commit -m "Add CHANGELOG.md"
    print_success "CHANGELOG.md created!"
fi

print_header "WORKFLOW SETUP COMPLETE"

print_success "Git workflow is ready to use!"
print_status ""
print_status "📋 Quick Start Guide:"
print_status "   • Check status: ./scripts/status.sh"
print_status "   • Start feature: ./scripts/start-feature.sh \"feature-name\""
print_status "   • Create release: ./scripts/create-release.sh \"1.0.0\""
print_status "   • Emergency fix: ./scripts/create-hotfix.sh \"1.0.1\" \"bug-desc\""
print_status ""
print_status "📁 Available Scripts:"
print_status "   • status.sh - Show repository status"
print_status "   • start-feature.sh - Begin new feature"
print_status "   • finish-feature.sh - Complete feature"
print_status "   • create-release.sh - Start release process"
print_status "   • finish-release.sh - Complete release"
print_status "   • create-hotfix.sh - Emergency fix"
print_status "   • finish-hotfix.sh - Complete hotfix"
print_status "   • cleanup.sh - Clean old branches"
print_status ""
print_status "📖 Documentation:"
print_status "   • Read GIT_WORKFLOW_GUIDE.md for complete instructions"
print_status ""
print_warning "Next Steps:"
print_status "1. Set up your remote repository (GitHub/GitLab)"
print_status "2. Run: git remote add origin <your-repo-url>"
print_status "3. Run: git push -u origin main"
print_status "4. Run: git push -u origin develop"
print_status "5. Start your first feature!"

print_header "HAPPY CODING!"
