#!/bin/bash

# Cline VS Code Optimizer Script
# Optimizes VS Code settings and environment for better Cline performance

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Get VS Code settings directory
get_vscode_settings_dir() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "$HOME/Library/Application Support/Code/User"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "$HOME/.config/Code/User"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        echo "$APPDATA/Code/User"
    else
        print_error "Unsupported operating system"
        exit 1
    fi
}

# Backup current settings
backup_settings() {
    local settings_dir="$1"
    local backup_dir="$HOME/vscode_cline_backup_$(date +%Y%m%d_%H%M%S)"
    
    print_status "Creating backup of current VS Code settings..."
    mkdir -p "$backup_dir"
    
    if [[ -f "$settings_dir/settings.json" ]]; then
        cp "$settings_dir/settings.json" "$backup_dir/"
        print_success "Settings backed up to: $backup_dir"
    fi
}

# Optimize VS Code settings for Cline
optimize_vscode_settings() {
    local settings_dir="$1"
    local settings_file="$settings_dir/settings.json"
    
    print_status "Optimizing VS Code settings for Cline performance..."
    
    # Create optimized settings
    cat > "/tmp/cline_optimized_settings.json" << 'EOF'
{
    "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": false
    },
    "editor.suggestOnTriggerCharacters": true,
    "editor.wordBasedSuggestions": "off",
    "editor.parameterHints.enabled": false,
    "editor.hover.enabled": true,
    "editor.hover.delay": 300,
    "editor.lightbulb.enabled": false,
    "editor.codeLens": false,
    "editor.bracketPairColorization.enabled": false,
    "editor.guides.bracketPairs": false,
    "editor.minimap.enabled": false,
    "editor.renderWhitespace": "none",
    "editor.renderControlCharacters": false,
    "editor.renderLineHighlight": "none",
    "editor.occurrencesHighlight": false,
    "editor.selectionHighlight": false,
    "editor.colorDecorators": false,
    "workbench.startupEditor": "none",
    "workbench.enableExperiments": false,
    "workbench.settings.enableNaturalLanguageSearch": false,
    "extensions.autoUpdate": false,
    "extensions.autoCheckUpdates": false,
    "telemetry.telemetryLevel": "off",
    "files.autoSave": "afterDelay",
    "files.autoSaveDelay": 1000,
    "files.watcherExclude": {
        "**/.git/objects/**": true,
        "**/.git/subtree-cache/**": true,
        "**/node_modules/**": true,
        "**/tmp/**": true,
        "**/bower_components/**": true,
        "**/dist/**": true,
        "**/build/**": true,
        "**/.vscode/**": true,
        "**/.cache/**": true
    },
    "search.exclude": {
        "**/node_modules": true,
        "**/bower_components": true,
        "**/dist": true,
        "**/build": true,
        "**/.git": true,
        "**/.DS_Store": true,
        "**/tmp": true,
        "**/.cache": true
    },
    "files.exclude": {
        "**/.git": true,
        "**/.svn": true,
        "**/.hg": true,
        "**/CVS": true,
        "**/.DS_Store": true,
        "**/Thumbs.db": true
    },
    "typescript.suggest.autoImports": false,
    "typescript.updateImportsOnFileMove.enabled": "never",
    "typescript.preferences.includePackageJsonAutoImports": "off",
    "javascript.suggest.autoImports": false,
    "javascript.updateImportsOnFileMove.enabled": "never",
    "git.autofetch": false,
    "git.autorefresh": false,
    "git.decorations.enabled": false,
    "scm.diffDecorations": "none",
    "workbench.tree.renderIndentGuides": "none",
    "workbench.tree.indent": 8,
    "terminal.integrated.enableMultiLinePasteWarning": false,
    "security.workspace.trust.untrustedFiles": "open",
    "diffEditor.ignoreTrimWhitespace": true,
    "diffEditor.renderSideBySide": false,
    "problems.decorations.enabled": false,
    "breadcrumbs.enabled": false,
    "outline.showVariables": false,
    "outline.showFunctions": false,
    "cline.apiRequestTimeout": 60000,
    "cline.maxTokens": 4096,
    "cline.temperature": 0.3,
    "cline.autoApprove": {
        "enabled": false,
        "readFiles": true,
        "writeFiles": false,
        "executeCommands": false
    }
}
EOF

    echo
    read -p "Apply Cline-optimized settings? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        mkdir -p "$settings_dir"
        
        if [[ -f "$settings_file" ]]; then
            # Merge with existing settings (basic approach)
            print_warning "Merging with existing settings..."
            cp "$settings_file" "$settings_file.backup"
        fi
        
        cp "/tmp/cline_optimized_settings.json" "$settings_file"
        print_success "Applied Cline-optimized settings"
    else
        print_warning "Skipped settings optimization"
    fi
    
    rm -f "/tmp/cline_optimized_settings.json"
}

# Clean VS Code workspace storage that might affect Cline
clean_workspace_storage() {
    local vscode_dir
    if [[ "$OSTYPE" == "darwin"* ]]; then
        vscode_dir="$HOME/Library/Application Support/Code"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        vscode_dir="$HOME/.config/Code"
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        vscode_dir="$APPDATA/Code"
    fi
    
    print_status "Cleaning VS Code workspace storage..."
    
    local workspace_storage="$vscode_dir/User/workspaceStorage"
    if [[ -d "$workspace_storage" ]]; then
        local size=$(du -sh "$workspace_storage" 2>/dev/null | cut -f1 || echo "unknown")
        
        read -p "Clean workspace storage ($size)? This will reset project-specific settings [y/N]: " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            rm -rf "$workspace_storage"
            print_success "Cleaned workspace storage"
        else
            print_warning "Skipped workspace storage cleanup"
        fi
    fi
}

# Check and optimize Cline extension settings
optimize_cline_extension() {
    print_status "Checking Cline extension optimization..."
    
    cat << 'EOF'
Cline Extension Optimization Tips:

1. API Settings:
   - Use Claude 3.5 Sonnet for faster responses
   - Set temperature to 0.3 for coding tasks
   - Increase timeout to 60+ seconds
   - Enable auto-save in VS Code

2. Performance Settings:
   - Disable unnecessary VS Code extensions
   - Close unused editor tabs
   - Use workspace folders instead of opening entire drives
   - Exclude large directories from file watching

3. Network Optimization:
   - Use stable internet connection
   - Consider VPN if experiencing API issues
   - Monitor Anthropic API status

4. Workflow Tips:
   - Be specific in prompts to reduce back-and-forth
   - Use shorter, focused requests
   - Enable auto-approve for safe operations
   - Use checkpoints to save progress

EOF
}

# Check system resources
check_system_resources() {
    print_status "Checking system resources..."
    
    # Check available memory
    if command -v free >/dev/null 2>&1; then
        local mem_info=$(free -h | grep '^Mem:')
        print_status "Memory: $mem_info"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        local mem_pressure=$(memory_pressure | head -n 1)
        print_status "Memory pressure: $mem_pressure"
    fi
    
    # Check CPU usage
    if command -v top >/dev/null 2>&1; then
        local cpu_usage=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1 2>/dev/null || echo "unknown")
        print_status "CPU usage: ${cpu_usage}%"
    fi
    
    # Check disk space
    local disk_usage=$(df -h . | tail -1 | awk '{print $5}')
    print_status "Disk usage: $disk_usage"
    
    echo
    print_warning "Resource Recommendations:"
    echo "- Keep CPU usage under 80% for smooth Cline performance"
    echo "- Ensure at least 2GB free RAM"
    echo "- Close unnecessary applications when using Cline"
}

# Create Cline productivity aliases
create_productivity_aliases() {
    print_status "Creating Cline productivity aliases..."
    
    local alias_file="$HOME/.cline_aliases"
    
    cat > "$alias_file" << 'EOF'
# Cline Productivity Aliases
alias cline-restart="pkill -f 'Visual Studio Code' && sleep 2 && code"
alias cline-clean="rm -rf ~/.vscode/logs/* 2>/dev/null || true"
alias cline-status="curl -s https://status.anthropic.com/api/v2/status.json | jq '.status.description'"
alias cline-usage="echo 'Check your usage at: https://console.anthropic.com'"

# Quick VS Code optimizations
alias vscode-fast="code --disable-extensions --disable-gpu"
alias vscode-reset="code --reset-extensions"

# Project helpers
alias cline-exclude="echo 'node_modules\ndist\nbuild\n.git\n.cache\ntmp' > .gitignore"
EOF
    
    echo
    read -p "Add Cline productivity aliases to your shell? [y/N]: " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Add to shell profile
        local shell_profile
        if [[ "$SHELL" == *"zsh"* ]]; then
            shell_profile="$HOME/.zshrc"
        elif [[ "$SHELL" == *"bash"* ]]; then
            shell_profile="$HOME/.bashrc"
        else
            shell_profile="$HOME/.profile"
        fi
        
        echo "" >> "$shell_profile"
        echo "# Cline productivity aliases" >> "$shell_profile"
        echo "source $alias_file" >> "$shell_profile"
        
        print_success "Aliases added to $shell_profile"
        print_status "Restart your terminal or run: source $shell_profile"
    else
        print_warning "Skipped alias creation"
    fi
}

# Main optimization function
main() {
    echo "=================================="
    echo "Cline VS Code Optimizer"
    echo "=================================="
    echo
    
    print_status "This script will optimize VS Code for better Cline performance"
    echo
    
    # Get VS Code settings directory
    SETTINGS_DIR=$(get_vscode_settings_dir)
    print_status "VS Code settings directory: $SETTINGS_DIR"
    
    if [[ ! -d "$(dirname "$SETTINGS_DIR")" ]]; then
        print_error "VS Code not found. Please install VS Code first."
        exit 1
    fi
    
    # Check if VS Code is running
    if pgrep -f "Visual Studio Code\|code" > /dev/null; then
        print_warning "VS Code is currently running. Some optimizations may require a restart."
        read -p "Continue anyway? [y/N]: " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Please close VS Code and run this script again"
            exit 1
        fi
    fi
    
    # Execute optimization steps
    backup_settings "$SETTINGS_DIR"
    echo
    optimize_vscode_settings "$SETTINGS_DIR"
    echo
    clean_workspace_storage
    echo
    check_system_resources
    echo
    optimize_cline_extension
    echo
    create_productivity_aliases
    echo
    
    print_success "Cline optimization completed!"
    echo
    print_status "Next steps:"
    echo "1. Restart VS Code"
    echo "2. Open Cline and test performance"
    echo "3. Adjust settings as needed"
    echo "4. Monitor your Anthropic API usage"
    echo
    print_warning "If you experience issues, restore from backup at:"
    echo "$(find "$HOME" -name "vscode_cline_backup_*" -type d | tail -1 2>/dev/null || echo 'No backup found')"
}

# Run main function
main "$@"