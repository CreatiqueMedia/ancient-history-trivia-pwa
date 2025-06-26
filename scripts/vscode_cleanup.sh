#!/bin/bash

# VS Code Performance Cleanup Script
# This script cleans up VS Code bloat and optimizes performance
# Run with: ./vscode_cleanup.sh

set -e

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

# Function to get VS Code config directory based on OS
get_vscode_dir() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        echo "$HOME/Library/Application Support/Code"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux
        echo "$HOME/.config/Code"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows (Git Bash/WSL)
        echo "$APPDATA/Code"
    else
        print_error "Unsupported operating system"
        exit 1
    fi
}

# Function to calculate directory size
get_dir_size() {
    if [[ -d "$1" ]]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            du -sh "$1" 2>/dev/null | cut -f1
        else
            du -sh "$1" 2>/dev/null | cut -f1
        fi
    else
        echo "0B"
    fi
}

# Function to safely remove directory
safe_remove() {
    local dir="$1"
    local desc="$2"
    
    if [[ -d "$dir" ]]; then
        local size=$(get_dir_size "$dir")
        read -p "Remove $desc ($size)? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$dir"
            print_success "Removed $desc"
        else
            print_warning "Skipped $desc"
        fi
    else
        print_warning "$desc not found"
    fi
}

# Function to clean VS Code processes
cleanup_processes() {
    print_status "Checking for running VS Code processes..."
    
    # Check if VS Code is running
    if pgrep -f "Visual Studio Code\|code\|Code" > /dev/null; then
        print_warning "VS Code is currently running!"
        read -p "Kill all VS Code processes? [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            # Kill VS Code processes
            pkill -f "Visual Studio Code" 2>/dev/null || true
            pkill -f "code" 2>/dev/null || true
            pkill -f "Code" 2>/dev/null || true
            sleep 2
            print_success "VS Code processes terminated"
        else
            print_error "Please close VS Code manually and run this script again"
            exit 1
        fi
    else
        print_success "No VS Code processes running"
    fi
}

# Function to backup settings
backup_settings() {
    local vscode_dir="$1"
    local backup_dir="$HOME/vscode_backup_$(date +%Y%m%d_%H%M%S)"
    
    print_status "Creating backup of VS Code settings..."
    mkdir -p "$backup_dir"
    
    # Backup important files
    if [[ -f "$vscode_dir/User/settings.json" ]]; then
        cp "$vscode_dir/User/settings.json" "$backup_dir/"
    fi
    
    if [[ -f "$vscode_dir/User/keybindings.json" ]]; then
        cp "$vscode_dir/User/keybindings.json" "$backup_dir/"
    fi
    
    if [[ -d "$vscode_dir/User/snippets" ]]; then
        cp -r "$vscode_dir/User/snippets" "$backup_dir/"
    fi
    
    print_success "Backup created at: $backup_dir"
}

# Function to clean cache and logs
clean_cache_and_logs() {
    local vscode_dir="$1"
    
    print_status "Cleaning VS Code cache and logs..."
    
    # Cache directories to clean
    local cache_dirs=(
        "$vscode_dir/CachedData"
        "$vscode_dir/logs"
        "$vscode_dir/User/workspaceStorage"
        "$vscode_dir/User/History"
        "$vscode_dir/User/CachedExtensions"
        "$vscode_dir/User/CachedExtensionVSIXs"
        "$vscode_dir/clp"
    )
    
    for dir in "${cache_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            local size=$(get_dir_size "$dir")
            print_status "Found $(basename "$dir"): $size"
            safe_remove "$dir" "$(basename "$dir") cache"
        fi
    done
}

# Function to clean extension data
clean_extensions() {
    local vscode_dir="$1"
    
    print_status "Analyzing extensions..."
    
    local ext_dir="$vscode_dir/extensions"
    if [[ -d "$ext_dir" ]]; then
        local size=$(get_dir_size "$ext_dir")
        print_status "Extensions directory size: $size"
        
        # Show largest extensions
        print_status "Largest extensions:"
        if [[ "$OSTYPE" == "darwin"* ]]; then
            du -sh "$ext_dir"/* 2>/dev/null | sort -hr | head -10
        else
            du -sh "$ext_dir"/* 2>/dev/null | sort -hr | head -10
        fi
        
        echo
        read -p "Remove all extensions? (This will require reinstalling) [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$ext_dir"
            print_success "Removed all extensions"
        else
            print_warning "Skipped extension removal"
        fi
    fi
}

# Function to clean workspace data
clean_workspace_data() {
    local vscode_dir="$1"
    
    print_status "Cleaning workspace data..."
    
    # Clean recent workspaces (but keep the list)
    local workspace_storage="$vscode_dir/User/workspaceStorage"
    if [[ -d "$workspace_storage" ]]; then
        local size=$(get_dir_size "$workspace_storage")
        safe_remove "$workspace_storage" "workspace storage ($size)"
    fi
    
    # Clean user data
    local user_data_dirs=(
        "$vscode_dir/User/History"
        "$vscode_dir/User/globalStorage"
    )
    
    for dir in "${user_data_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            local size=$(get_dir_size "$dir")
            safe_remove "$dir" "$(basename "$dir") ($size)"
        fi
    done
}

# Function to optimize settings
optimize_settings() {
    local vscode_dir="$1"
    local settings_file="$vscode_dir/User/settings.json"
    
    print_status "Optimizing VS Code settings for performance..."
    
    # Create optimized settings
    cat > "/tmp/vscode_performance_settings.json" << 'EOF'
{
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/.git/subtree-cache/**": true,
        "**/node_modules/**": true,
        "**/tmp/**": true,
        "**/bower_components/**": true,
        "**/dist/**": true,
        "**/build/**": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true,
        "**/build": true,
        "**/.git": true,
        "**/.DS_Store": true,
        "**/tmp": true
    },
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/node_modules": true
    },
    "extensions.autoUpdate": false,
    "extensions.autoCheckUpdates": false,
    "telemetry.telemetryLevel": "off",
    "workbench.enableExperiments": false,
    "workbench.settings.enableNaturalLanguageSearch": false,
    "typescript.suggest.autoImports": false,
    "typescript.updateImportsOnFileMove.enabled": "never",
    "git.autofetch": false,
    "git.autorefresh": false,
    "editor.minimap.enabled": false,
    "editor.renderWhitespace": "none",
    "editor.matchBrackets": "never",
    "editor.colorDecorators": false,
    "editor.lightbulb.enabled": false,
    "editor.selectionHighlight": false,
    "editor.occurrencesHighlight": false,
    "editor.renderLineHighlight": "none",
    "workbench.tree.renderIndentGuides": "none"
}
EOF

    echo
    read -p "Apply performance optimization settings? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [[ -f "$settings_file" ]]; then
            # Merge with existing settings (basic approach)
            cp "$settings_file" "$settings_file.backup"
            print_warning "Existing settings backed up to settings.json.backup"
        fi
        
        mkdir -p "$vscode_dir/User"
        cp "/tmp/vscode_performance_settings.json" "$settings_file"
        print_success "Applied performance optimization settings"
    else
        print_warning "Skipped settings optimization"
    fi
    
    rm -f "/tmp/vscode_performance_settings.json"
}

# Function to show summary
show_summary() {
    local vscode_dir="$1"
    
    print_status "Cleanup Summary:"
    echo "=================="
    
    if [[ -d "$vscode_dir" ]]; then
        local total_size=$(get_dir_size "$vscode_dir")
        echo "Current VS Code directory size: $total_size"
    fi
    
    echo
    print_success "Cleanup completed!"
    print_status "Recommendations:"
    echo "- Restart your computer to clear any remaining memory usage"
    echo "- Only install extensions you actively use"
    echo "- Regularly close unused VS Code windows"
    echo "- Consider using VS Code Insiders for testing new features"
}

# Main execution
main() {
    echo "================================"
    echo "VS Code Performance Cleanup Tool"
    echo "================================"
    echo
    
    # Get VS Code directory
    VSCODE_DIR=$(get_vscode_dir)
    print_status "VS Code directory: $VSCODE_DIR"
    
    if [[ ! -d "$VSCODE_DIR" ]]; then
        print_error "VS Code directory not found. Is VS Code installed?"
        exit 1
    fi
    
    # Show current size
    local current_size=$(get_dir_size "$VSCODE_DIR")
    print_status "Current VS Code directory size: $current_size"
    echo
    
    # Confirm before proceeding
    read -p "Continue with cleanup? [y/N]: " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Cleanup cancelled"
        exit 0
    fi
    
    # Execute cleanup steps
    cleanup_processes
    backup_settings "$VSCODE_DIR"
    clean_cache_and_logs "$VSCODE_DIR"
    clean_workspace_data "$VSCODE_DIR"
    clean_extensions "$VSCODE_DIR"
    optimize_settings "$VSCODE_DIR"
    show_summary "$VSCODE_DIR"
}

# Run main function
main "$@"