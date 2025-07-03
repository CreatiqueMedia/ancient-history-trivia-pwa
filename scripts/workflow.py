#!/usr/bin/env python3
"""
Git Workflow Manager - Python Version
A professional git workflow automation tool

Usage:
  python workflow.py status
  python workflow.py start-feature "feature-name"
  python workflow.py finish-feature "feature-name"  
  python workflow.py create-release "1.2.0"
  python workflow.py finish-release "1.2.0"
  python workflow.py create-hotfix "1.2.1" "description"
  python workflow.py finish-hotfix "1.2.1"
  python workflow.py cleanup
  python workflow.py help
"""

import os
import sys
import subprocess
import re
from datetime import datetime
from typing import List, Optional

class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    PURPLE = '\033[0;35m'
    CYAN = '\033[0;36m'
    NC = '\033[0m'  # No Color

class GitWorkflow:
    def __init__(self):
        self.check_git_repo()
    
    def check_git_repo(self):
        """Check if we're in a git repository"""
        try:
            subprocess.run(['git', 'rev-parse', '--git-dir'], 
                         check=True, capture_output=True)
        except subprocess.CalledProcessError:
            self.print_error("Not in a git repository!")
            sys.exit(1)
    
    def print_status(self, message: str):
        print(f"{Colors.BLUE}[INFO]{Colors.NC} {message}")
    
    def print_success(self, message: str):
        print(f"{Colors.GREEN}[SUCCESS]{Colors.NC} {message}")
    
    def print_warning(self, message: str):
        print(f"{Colors.YELLOW}[WARNING]{Colors.NC} {message}")
    
    def print_error(self, message: str):
        print(f"{Colors.RED}[ERROR]{Colors.NC} {message}")
    
    def print_header(self, message: str):
        print(f"\n{Colors.PURPLE}{'='*50}{Colors.NC}")
        print(f"{Colors.PURPLE}  {message}{Colors.NC}")
        print(f"{Colors.PURPLE}{'='*50}{Colors.NC}")
    
    def run_git_command(self, command: List[str], check_output: bool = False) -> Optional[str]:
        """Run a git command and handle errors"""
        try:
            if check_output:
                result = subprocess.run(command, check=True, capture_output=True, text=True)
                return result.stdout.strip()
            else:
                subprocess.run(command, check=True)
                return None
        except subprocess.CalledProcessError as e:
            self.print_error(f"Git command failed: {' '.join(command)}")
            if hasattr(e, 'stderr') and e.stderr:
                self.print_error(e.stderr.strip())
            sys.exit(1)
    
    def get_current_branch(self) -> str:
        """Get the current branch name"""
        return self.run_git_command(['git', 'branch', '--show-current'], check_output=True)
    
    def branch_exists(self, branch_name: str) -> bool:
        """Check if a branch exists"""
        try:
            subprocess.run(['git', 'show-ref', '--verify', '--quiet', f'refs/heads/{branch_name}'], 
                         check=True, capture_output=True)
            return True
        except subprocess.CalledProcessError:
            return False
    
    def tag_exists(self, tag_name: str) -> bool:
        """Check if a tag exists"""
        try:
            result = subprocess.run(['git', 'tag', '-l'], check=True, capture_output=True, text=True)
            return tag_name in result.stdout.split('\n')
        except subprocess.CalledProcessError:
            return False
    
    def has_uncommitted_changes(self) -> bool:
        """Check if there are uncommitted changes"""
        try:
            subprocess.run(['git', 'diff-index', '--quiet', 'HEAD', '--'], 
                         check=True, capture_output=True)
            return False
        except subprocess.CalledProcessError:
            return True
    
    def validate_version(self, version: str) -> bool:
        """Validate semantic version format"""
        pattern = r'^\d+\.\d+\.\d+$'
        return re.match(pattern, version) is not None
    
    def start_feature(self, feature_name: str):
        """Start a new feature branch"""
        if not feature_name:
            self.print_error("Feature name is required!")
            sys.exit(1)
        
        branch_name = f"feature/{feature_name}"
        
        self.print_status(f"Starting new feature: {feature_name}")
        
        # Ensure develop branch exists
        if not self.branch_exists('develop'):
            self.print_warning("develop branch doesn't exist. Creating it...")
            self.run_git_command(['git', 'checkout', '-b', 'develop'])
            self.run_git_command(['git', 'push', '-u', 'origin', 'develop'])
        
        # Switch to develop and pull latest
        self.print_status("Switching to develop branch...")
        self.run_git_command(['git', 'checkout', 'develop'])
        
        self.print_status("Pulling latest changes from develop...")
        self.run_git_command(['git', 'pull', 'origin', 'develop'])
        
        # Check if feature branch already exists
        if self.branch_exists(branch_name):
            self.print_error(f"Feature branch '{branch_name}' already exists!")
            sys.exit(1)
        
        # Create and switch to feature branch
        self.print_status(f"Creating feature branch: {branch_name}")
        self.run_git_command(['git', 'checkout', '-b', branch_name])
        
        # Push branch to remote
        self.print_status("Pushing feature branch to remote...")
        self.run_git_command(['git', 'push', '-u', 'origin', branch_name])
        
        self.print_success(f"Feature '{feature_name}' started successfully!")
        self.print_status(f"You are now on branch: {branch_name}")
    
    def finish_feature(self, feature_name: str):
        """Finish a feature branch"""
        if not feature_name:
            self.print_error("Feature name is required!")
            sys.exit(1)
        
        branch_name = f"feature/{feature_name}"
        
        if not self.branch_exists(branch_name):
            self.print_error(f"Feature branch '{branch_name}' doesn't exist!")
            sys.exit(1)
        
        if self.has_uncommitted_changes():
            self.print_error("You have uncommitted changes! Please commit or stash them first.")
            sys.exit(1)
        
        self.print_status(f"Finishing feature: {feature_name}")
        
        # Switch to feature branch and push
        self.run_git_command(['git', 'checkout', branch_name])
        self.run_git_command(['git', 'push', 'origin', branch_name])
        
        # Switch to develop and merge
        self.run_git_command(['git', 'checkout', 'develop'])
        self.run_git_command(['git', 'pull', 'origin', 'develop'])
        self.run_git_command(['git', 'merge', '--no-ff', branch_name, '-m', f'Merge feature/{feature_name} into develop'])
        self.run_git_command(['git', 'push', 'origin', 'develop'])
        
        # Clean up branches
        self.run_git_command(['git', 'branch', '-d', branch_name])
        self.run_git_command(['git', 'push', 'origin', '--delete', branch_name])
        
        self.print_success(f"Feature '{feature_name}' completed successfully!")
    
    def create_release(self, version: str):
        """Create a new release branch"""
        if not version or not self.validate_version(version):
            self.print_error("Valid version number is required! (e.g., 1.2.0)")
            sys.exit(1)
        
        branch_name = f"release/v{version}"
        
        if self.branch_exists(branch_name):
            self.print_error(f"Release branch '{branch_name}' already exists!")
            sys.exit(1)
        
        if self.tag_exists(f"v{version}"):
            self.print_error(f"Tag 'v{version}' already exists!")
            sys.exit(1)
        
        self.print_status(f"Creating release: v{version}")
        
        # Switch to develop and create release branch
        self.run_git_command(['git', 'checkout', 'develop'])
        self.run_git_command(['git', 'pull', 'origin', 'develop'])
        self.run_git_command(['git', 'checkout', '-b', branch_name])
        
        # Update version in package.json if it exists
        if os.path.exists('package.json'):
            self.update_package_version(version)
        
        # Update CHANGELOG.md
        self.update_changelog(version)
        
        self.run_git_command(['git', 'push', '-u', 'origin', branch_name])
        
        self.print_success(f"Release v{version} created successfully!")
        self.print_warning("Please edit CHANGELOG.md to add your release notes!")
    
    def finish_release(self, version: str):
        """Finish a release branch"""
        if not version:
            self.print_error("Version number is required!")
            sys.exit(1)
        
        branch_name = f"release/v{version}"
        
        if not self.branch_exists(branch_name):
            self.print_error(f"Release branch '{branch_name}' doesn't exist!")
            sys.exit(1)
        
        if self.has_uncommitted_changes():
            self.print_error("You have uncommitted changes! Please commit them first.")
            sys.exit(1)
        
        self.print_status(f"Finishing release: v{version}")
        
        # Merge to main
        self.run_git_command(['git', 'checkout', 'main'])
        self.run_git_command(['git', 'pull', 'origin', 'main'])
        self.run_git_command(['git', 'merge', '--no-ff', branch_name, '-m', f'Release v{version}'])
        self.run_git_command(['git', 'tag', '-a', f'v{version}', '-m', f'Release version {version}'])
        self.run_git_command(['git', 'push', 'origin', 'main'])
        self.run_git_command(['git', 'push', 'origin', f'v{version}'])
        
        # Merge back to develop
        self.run_git_command(['git', 'checkout', 'develop'])
        self.run_git_command(['git', 'pull', 'origin', 'develop'])
        self.run_git_command(['git', 'merge', '--no-ff', branch_name, '-m', f'Merge release v{version} into develop'])
        self.run_git_command(['git', 'push', 'origin', 'develop'])
        
        # Clean up
        self.run_git_command(['git', 'branch', '-d', branch_name])
        self.run_git_command(['git', 'push', 'origin', '--delete', branch_name])
        
        self.print_success(f"Release v{version} completed successfully!")
    
    def update_package_version(self, version: str):
        """Update version in package.json"""
        try:
            import json
            with open('package.json', 'r') as f:
                package_data = json.load(f)
            
            package_data['version'] = version
            
            with open('package.json', 'w') as f:
                json.dump(package_data, f, indent=2)
            
            self.run_git_command(['git', 'add', 'package.json'])
            self.run_git_command(['git', 'commit', '-m', f'chore: bump version to {version}'])
            
        except Exception as e:
            self.print_warning(f"Could not update package.json: {e}")
    
    def update_changelog(self, version: str):
        """Update CHANGELOG.md with new version"""
        changelog_entry = f"""## [v{version}] - {datetime.now().strftime('%Y-%m-%d')}

### Added
- 

### Changed
- 

### Fixed
- 

### Removed
- 

"""
        
        if os.path.exists('CHANGELOG.md'):
            with open('CHANGELOG.md', 'r') as f:
                content = f.read()
            
            # Insert new entry after the first line
            lines = content.split('\n')
            new_content = lines[0] + '\n\n' + changelog_entry + '\n'.join(lines[1:])
        else:
            new_content = f"""# Changelog

All notable changes to this project will be documented in this file.

{changelog_entry}"""
        
        with open('CHANGELOG.md', 'w') as f:
            f.write(new_content)
        
        self.run_git_command(['git', 'add', 'CHANGELOG.md'])
        self.run_git_command(['git', 'commit', '-m', f'docs: update changelog for v{version}'])
    
    def show_status(self):
        """Show repository status"""
        self.print_header("GIT WORKFLOW STATUS")
        
        current_branch = self.get_current_branch()
        self.print_status(f"Current Branch: {current_branch}")
        
        # Show branch information
        branches = self.run_git_command(['git', 'branch'], check_output=True)
        self.print_status("Local branches:")
        for line in branches.split('\n'):
            print(f"  {line}")
        
        # Show working directory status
        if self.has_uncommitted_changes():
            self.print_warning("You have uncommitted changes")
        else:
            self.print_success("Working directory is clean")
        
        # Show recent commits
        recent_commits = self.run_git_command(['git', 'log', '--oneline', '-5'], check_output=True)
        self.print_status("Recent commits:")
        for line in recent_commits.split('\n'):
            print(f"  {line}")
    
    def show_help(self):
        """Show help information"""
        help_text = """
Git Workflow Manager - Python Version

USAGE:
  python workflow.py COMMAND [ARGS...]

COMMANDS:
  status                           Show repository status
  start-feature FEATURE_NAME       Start a new feature branch
  finish-feature FEATURE_NAME      Complete and merge feature
  create-release VERSION           Create release branch (e.g., 1.2.0)
  finish-release VERSION           Complete release and deploy
  create-hotfix VERSION DESC       Create emergency hotfix
  finish-hotfix VERSION            Complete hotfix deployment
  cleanup                          Clean up old branches
  help                             Show this help

EXAMPLES:
  python workflow.py status
  python workflow.py start-feature "user-authentication"
  python workflow.py finish-feature "user-authentication"
  python workflow.py create-release "1.2.0"
  python workflow.py finish-release "1.2.0"
  python workflow.py create-hotfix "1.2.1" "fix-critical-bug"

VERSION FORMAT:
  Use semantic versioning: MAJOR.MINOR.PATCH (e.g., 1.2.0)

For complete documentation, see: GIT_WORKFLOW_GUIDE.md
        """
        print(help_text)

def main():
    if len(sys.argv) < 2:
        print("Usage: python workflow.py COMMAND [ARGS...]")
        print("Run 'python workflow.py help' for more information")
        sys.exit(1)
    
    workflow = GitWorkflow()
    command = sys.argv[1]
    
    try:
        if command == 'status':
            workflow.show_status()
        elif command == 'start-feature':
            if len(sys.argv) < 3:
                workflow.print_error("Feature name is required!")
                sys.exit(1)
            workflow.start_feature(sys.argv[2])
        elif command == 'finish-feature':
            if len(sys.argv) < 3:
                workflow.print_error("Feature name is required!")
                sys.exit(1)
            workflow.finish_feature(sys.argv[2])
        elif command == 'create-release':
            if len(sys.argv) < 3:
                workflow.print_error("Version is required!")
                sys.exit(1)
            workflow.create_release(sys.argv[2])
        elif command == 'finish-release':
            if len(sys.argv) < 3:
                workflow.print_error("Version is required!")
                sys.exit(1)
            workflow.finish_release(sys.argv[2])
        elif command == 'help':
            workflow.show_help()
        else:
            workflow.print_error(f"Unknown command: {command}")
            workflow.show_help()
            sys.exit(1)
    except KeyboardInterrupt:
        workflow.print_warning("\nOperation cancelled by user")
        sys.exit(1)
    except Exception as e:
        workflow.print_error(f"Unexpected error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
