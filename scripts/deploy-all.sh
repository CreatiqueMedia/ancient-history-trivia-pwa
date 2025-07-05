#!/bin/bash

# =============================================================================
# DEPLOY ALL - Complete Deployment Script
# =============================================================================
# This script performs a complete deployment to all locations:
# 1. Builds the project
# 2. Commits and pushes to all Git branches
# 3. Deploys to Firebase hosting
# 4. Provides deployment summary
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
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
    echo -e "${PURPLE}=== $1 ===${NC}"
}

# Function to check if we're in the right directory
check_directory() {
    if [[ ! -f "package.json" ]] || [[ ! -f "firebase.json" ]]; then
        print_error "This script must be run from the project root directory"
        print_error "Make sure you're in the directory containing package.json and firebase.json"
        exit 1
    fi
}

# Function to check if there are uncommitted changes
check_git_status() {
    if [[ -n $(git status --porcelain) ]]; then
        print_warning "You have uncommitted changes. The script will commit them."
        git status --short
        echo
        read -p "Do you want to continue? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled by user"
            exit 1
        fi
    fi
}

# Function to get commit message
get_commit_message() {
    if [[ -n "$1" ]]; then
        COMMIT_MESSAGE="$1"
    else
        echo -e "${CYAN}Enter commit message (or press Enter for default):${NC}"
        read -r USER_MESSAGE
        if [[ -n "$USER_MESSAGE" ]]; then
            COMMIT_MESSAGE="$USER_MESSAGE"
        else
            COMMIT_MESSAGE="Deploy: $(date '+%Y-%m-%d %H:%M:%S')"
        fi
    fi
    print_status "Using commit message: $COMMIT_MESSAGE"
}

# Function to build the project
build_project() {
    print_header "BUILDING PROJECT"
    
    print_status "Running TypeScript compilation and Vite build..."
    if yarn build; then
        print_success "Build completed successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Function to commit and push to all branches
deploy_git() {
    print_header "GIT DEPLOYMENT"
    
    # Get current branch
    CURRENT_BRANCH=$(git branch --show-current)
    print_status "Current branch: $CURRENT_BRANCH"
    
    # Add all changes
    print_status "Adding all changes to git..."
    git add .
    
    # Check if there are changes to commit
    if git diff --staged --quiet; then
        print_warning "No changes to commit"
    else
        # Commit changes
        print_status "Committing changes..."
        git commit -m "$COMMIT_MESSAGE"
        print_success "Changes committed"
    fi
    
    # Push current branch
    print_status "Pushing to origin/$CURRENT_BRANCH..."
    git push origin "$CURRENT_BRANCH"
    print_success "Pushed to origin/$CURRENT_BRANCH"
    
    # Define branches to sync
    BRANCHES=("main" "develop" "gh-pages")
    
    # Sync other branches
    for branch in "${BRANCHES[@]}"; do
        if [[ "$branch" != "$CURRENT_BRANCH" ]]; then
            print_status "Switching to $branch..."
            if git checkout "$branch" 2>/dev/null; then
                print_status "Merging $CURRENT_BRANCH into $branch..."
                if git merge "$CURRENT_BRANCH" --no-edit; then
                    print_status "Pushing $branch..."
                    git push origin "$branch"
                    print_success "Successfully updated $branch"
                else
                    print_warning "Merge conflict in $branch - skipping"
                fi
            else
                print_warning "Branch $branch does not exist - skipping"
            fi
        fi
    done
    
    # Return to original branch
    print_status "Returning to $CURRENT_BRANCH..."
    git checkout "$CURRENT_BRANCH"
}

# Function to deploy to Firebase
deploy_firebase() {
    print_header "FIREBASE DEPLOYMENT"
    
    print_status "Deploying to Firebase hosting..."
    if firebase deploy --only hosting; then
        print_success "Firebase deployment completed"
    else
        print_error "Firebase deployment failed"
        exit 1
    fi
}

# Function to show deployment summary
show_summary() {
    print_header "DEPLOYMENT SUMMARY"
    
    echo -e "${GREEN}✅ Build completed${NC}"
    echo -e "${GREEN}✅ Git branches updated and pushed${NC}"
    echo -e "${GREEN}✅ Firebase hosting deployed${NC}"
    echo
    echo -e "${CYAN}🌐 Live site: https://ancient-history-trivia.web.app${NC}"
    echo -e "${CYAN}📊 Firebase Console: https://console.firebase.google.com/project/ancient-history-trivia${NC}"
    echo -e "${CYAN}📁 GitHub Repository: https://github.com/CreatiqueMedia/ancient-history-trivia-pwa${NC}"
    echo
    print_success "All deployments completed successfully!"
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [commit-message]"
    echo
    echo "Examples:"
    echo "  $0                                    # Use default commit message"
    echo "  $0 \"Fix Purchase button issue\"       # Use custom commit message"
    echo "  $0 \"Add new bundle packs\"            # Use custom commit message"
}

# Main execution
main() {
    print_header "ANCIENT HISTORY PWA - COMPLETE DEPLOYMENT"
    echo -e "${CYAN}This script will:${NC}"
    echo "1. Build the project"
    echo "2. Commit and push to all Git branches"
    echo "3. Deploy to Firebase hosting"
    echo

    # Check if help is requested
    if [[ "$1" == "-h" ]] || [[ "$1" == "--help" ]]; then
        show_usage
        exit 0
    fi

    # Verify we're in the right directory
    check_directory
    
    # Check git status
    check_git_status
    
    # Get commit message
    get_commit_message "$1"
    
    # Confirm deployment
    echo -e "${YELLOW}Ready to deploy with commit message: \"$COMMIT_MESSAGE\"${NC}"
    read -p "Continue with deployment? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Deployment cancelled by user"
        exit 1
    fi
    
    # Execute deployment steps
    build_project
    deploy_git
    deploy_firebase
    show_summary
}

# Run main function with all arguments
main "$@"
