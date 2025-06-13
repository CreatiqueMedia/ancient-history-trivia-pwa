# Professional Git Workflow System
## Complete Guide for Feature Development, Versioning & Releases

### Table of Contents
1. [Overview](#overview)
2. [Branch Structure](#branch-structure)
3. [Workflow Process](#workflow-process)
4. [Automation Scripts](#automation-scripts)
5. [Quick Commands](#quick-commands)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## Overview

This system implements **Git Flow** with automation to make professional development workflows simple and consistent across all your projects.

### Key Benefits:
- ✅ **Consistent**: Same process for all apps
- ✅ **Safe**: Never break production
- ✅ **Automated**: Scripts handle the complexity
- ✅ **Professional**: Industry-standard practices
- ✅ **Easy**: Simple commands for everything

---

## Branch Structure

```
main (production)
├── develop (integration)
│   ├── feature/login-improvements
│   ├── feature/new-quiz-categories
│   └── feature/performance-optimization
├── release/v1.2.0
└── hotfix/critical-auth-bug
```

### Branch Types:

| Branch | Purpose | Lifetime | Merges To |
|--------|---------|----------|-----------|
| `main` | Production code | Permanent | - |
| `develop` | Integration/staging | Permanent | main |
| `feature/*` | New features | Temporary | develop |
| `release/*` | Release preparation | Temporary | main + develop |
| `hotfix/*` | Emergency fixes | Temporary | main + develop |

---

## Workflow Process

### 1. Starting a New Feature
```bash
./scripts/start-feature.sh "feature-name"
```
**What it does:**
- Creates `feature/feature-name` from latest `develop`
- Switches to the new branch
- Sets up tracking

### 2. Working on Features
```bash
# Regular commits
git add .
git commit -m "Add user authentication logic"

# Push progress
./scripts/push-feature.sh
```

### 3. Finishing a Feature
```bash
./scripts/finish-feature.sh "feature-name"
```
**What it does:**
- Merges feature into `develop`
- Deletes the feature branch
- Pushes changes

### 4. Creating a Release
```bash
./scripts/create-release.sh "1.2.0"
```
**What it does:**
- Creates `release/v1.2.0` from `develop`
- Updates version numbers
- Creates changelog

### 5. Finishing a Release
```bash
./scripts/finish-release.sh "1.2.0"
```
**What it does:**
- Merges release to `main` and `develop`
- Creates git tag `v1.2.0`
- Deletes release branch
- Pushes everything

### 6. Emergency Hotfix
```bash
./scripts/create-hotfix.sh "1.2.1" "critical-bug-description"
```

---

## Automation Scripts

All scripts are located in the `scripts/` directory and handle the complexity for you.

### Available Scripts:

| Script | Purpose | Usage |
|--------|---------|-------|
| `start-feature.sh` | Begin new feature | `./scripts/start-feature.sh "feature-name"` |
| `finish-feature.sh` | Complete feature | `./scripts/finish-feature.sh "feature-name"` |
| `create-release.sh` | Start release process | `./scripts/create-release.sh "1.2.0"` |
| `finish-release.sh` | Complete release | `./scripts/finish-release.sh "1.2.0"` |
| `create-hotfix.sh` | Emergency fix | `./scripts/create-hotfix.sh "1.2.1" "bug-desc"` |
| `status.sh` | Show current state | `./scripts/status.sh` |
| `cleanup.sh` | Clean old branches | `./scripts/cleanup.sh` |

---

## Quick Commands

### Daily Development
```bash
# Check what's happening
./scripts/status.sh

# Start new feature
./scripts/start-feature.sh "user-profile-page"

# Work on feature (normal git)
git add .
git commit -m "Add profile form validation"

# Push progress
git push

# Finish feature
./scripts/finish-feature.sh "user-profile-page"
```

### Release Process
```bash
# When ready to release
./scripts/create-release.sh "1.3.0"

# Test the release branch, fix any issues, then:
./scripts/finish-release.sh "1.3.0"
```

### Emergency Fixes
```bash
# Critical bug in production
./scripts/create-hotfix.sh "1.2.1" "fix-login-crash"

# Make the fix, test, then:
./scripts/finish-hotfix.sh "1.2.1"
```

---

## Best Practices

### Commit Messages
Use conventional commits:
```
feat: add user authentication
fix: resolve login button styling
docs: update API documentation
style: format code with prettier
refactor: simplify user validation logic
test: add unit tests for auth service
```

### Branch Naming
```
feature/user-authentication
feature/payment-integration
feature/quiz-timer
release/v1.2.0
hotfix/critical-auth-bug
```

### Version Numbers (Semantic Versioning)
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backwards compatible
- **PATCH** (1.1.1): Bug fixes

---

## Workflow Examples

### Example 1: Adding a New Feature
```bash
# 1. Start the feature
./scripts/start-feature.sh "social-sharing"

# 2. Make your changes
# ... code, code, code ...

# 3. Commit regularly
git add .
git commit -m "feat: add Facebook sharing button"

# 4. Push progress
git push

# 5. Finish when done
./scripts/finish-feature.sh "social-sharing"
```

### Example 2: Releasing Version 2.0.0
```bash
# 1. Create release
./scripts/create-release.sh "2.0.0"

# 2. Test everything on release branch
# 3. Fix any last-minute issues

# 4. Finish release
./scripts/finish-release.sh "2.0.0"

# Now v2.0.0 is live on main branch!
```

### Example 3: Emergency Hotfix
```bash
# Production is broken! Quick fix needed
./scripts/create-hotfix.sh "1.5.1" "fix-payment-crash"

# Make the minimal fix
git add .
git commit -m "fix: prevent null pointer in payment flow"

# Deploy the fix
./scripts/finish-hotfix.sh "1.5.1"

# Fixed and deployed in minutes!
```

---

## Integration with CI/CD

### GitHub Actions Triggers
```yaml
# Automatic deployments
on:
  push:
    branches: [ main ]        # Deploy to production
    branches: [ develop ]     # Deploy to staging
  tags: [ 'v*' ]             # Deploy tagged releases
```

### Deployment Environments
- `main` branch → Production
- `develop` branch → Staging/QA
- `feature/*` → Development previews

---

## Troubleshooting

### Common Issues

**Q: I'm on the wrong branch!**
```bash
# Check current status
./scripts/status.sh

# Switch to correct branch
git checkout develop
```

**Q: I need to switch features mid-work**
```bash
# Save current work
git stash

# Switch branches
git checkout feature/other-feature

# Resume later
git stash pop
```

**Q: I made a mistake in the last commit**
```bash
# Fix the last commit
git commit --amend -m "corrected commit message"
```

**Q: I need to undo a merge**
```bash
# Find the merge commit hash
git log --oneline

# Revert the merge
git revert -m 1 <merge-commit-hash>
```

---

## Setup Instructions

1. **Copy this system to any project:**
   ```bash
   # Copy the scripts folder to your new project
   cp -r scripts/ /path/to/new-project/
   
   # Make scripts executable
   chmod +x scripts/*.sh
   ```

2. **Initialize the workflow:**
   ```bash
   ./scripts/init-workflow.sh
   ```

3. **Start developing:**
   ```bash
   ./scripts/start-feature.sh "my-first-feature"
   ```

---

## Summary

This system gives you:
- 🚀 **Professional workflow** used by top companies
- 🛡️ **Safe releases** that never break production
- ⚡ **Automated scripts** that handle complexity
- 📝 **Clear documentation** for your team
- 🔄 **Consistent process** across all projects

**Remember:** 
- Always start features from `develop`
- Never commit directly to `main`
- Use the scripts - they prevent mistakes
- Follow semantic versioning
- Write good commit messages

---

*This workflow scales from solo projects to enterprise teams. Use it consistently and your development process will be bulletproof!*
