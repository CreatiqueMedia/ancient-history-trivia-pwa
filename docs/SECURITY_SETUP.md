# Security Configuration Guide

This document provides step-by-step instructions for enabling and configuring security features for the Ancient History PWA repository.

## 🔒 GitHub Security Features Setup

### 1. Enable Security Policy

✅ **Already configured** - `SECURITY.md` file has been created in the `docs/` folder.

**Manual steps required:**
1. Go to your repository: https://github.com/CreatiqueMedia/ancient-history-trivia-pwa
2. Click on the **"Security"** tab
3. Under "Security policy", click **"Start setup"**
4. GitHub will automatically detect the `SECURITY.md` file
5. Click **"Enable"** to activate the security policy

### 2. Enable Dependabot Alerts

✅ **Configuration ready** - `.github/dependabot.yml` has been created.

**Manual steps required:**
1. Go to **Settings** → **Security & analysis**
2. Enable **"Dependabot alerts"**
3. Enable **"Dependabot security updates"**
4. Enable **"Dependabot version updates"**

**What this does:**
- Automatically scans for known vulnerabilities in dependencies
- Creates pull requests to update vulnerable dependencies
- Weekly updates for all dependencies
- Grouped updates for better management

### 3. Enable Code Scanning (Limited for Personal Accounts)

**Note:** Advanced Security features are limited for personal accounts, but we can still implement basic security scanning.

✅ **Configuration ready** - `.github/workflows/security.yml` has been created.

**Manual steps:**
1. Go to **Settings** → **Security & analysis**
2. If available, enable **"Code scanning alerts"**
3. The security workflow will run automatically on push/PR

**What our security workflow includes:**
- Dependency vulnerability scanning
- Security-focused linting
- Secret scanning with TruffleHog
- Build security testing
- File permissions checking
- Package integrity verification

## 🛡️ Security Features Implemented

### Automated Security Scanning
- **Dependency auditing** with `yarn audit`
- **Secret detection** using TruffleHog
- **Security linting** with ESLint security plugins
- **Build security testing** for exposed sensitive data
- **Weekly scheduled scans**

### Dependency Management
- **Automatic updates** for security patches
- **Grouped updates** for related packages
- **Review assignments** to repository owner
- **Auto-merge** for security patches

### Security Monitoring
- **Permission checks** for files
- **Package integrity** verification
- **Build output** security analysis
- **Content Security Policy** recommendations

## 📋 Manual Security Configuration Steps

### Step 1: Repository Settings
1. Navigate to: `https://github.com/CreatiqueMedia/ancient-history-trivia-pwa/settings/security_analysis`
2. Enable the following:
   - ✅ **Dependabot alerts**
   - ✅ **Dependabot security updates** 
   - ✅ **Dependabot version updates**
   - ✅ **Secret scanning alerts** (if available)

### Step 2: Branch Protection
1. Go to **Settings** → **Branches**
2. Add protection rule for `main` branch:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass (security workflow)
   - ✅ Require branches to be up to date
   - ✅ Include administrators

### Step 3: Security Policy
1. Go to **Security** tab in your repository
2. Click **"Security policy"**
3. Click **"Start setup"** or **"Edit"**
4. The system should detect `docs/SECURITY.md`
5. Click **"Enable security policy"**

### Step 4: Verify Security Workflow
1. Push these changes to your repository
2. Check **Actions** tab for security workflow execution
3. Review any security findings in the workflow results

## 🚨 Security Alerts Management

### Dependabot Alerts
- **Location**: Security tab → Dependabot alerts
- **Action**: Review and merge security update PRs
- **Frequency**: Automatic detection, weekly updates

### Workflow Security Findings
- **Location**: Actions tab → Security Checks workflow
- **Action**: Review security scan results
- **Frequency**: On every push/PR + weekly schedule

### Secret Scanning
- **Location**: Security tab → Secret scanning
- **Action**: Revoke and rotate any detected secrets
- **Frequency**: Automatic on push

## 🔧 Additional Security Recommendations

### 1. Environment Variables
- Use GitHub Secrets for sensitive configuration
- Never commit API keys or tokens
- Use environment-specific configurations

### 2. Content Security Policy
Add to your HTML head:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;">
```

### 3. Security Headers
Configure your hosting to include:
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

### 4. Regular Security Maintenance
- Review security alerts weekly
- Update dependencies monthly
- Review access permissions quarterly
- Audit security configurations annually

## 📞 Security Incident Response

If you discover a security vulnerability:

1. **DO NOT** create a public issue
2. **USE** the security email in `SECURITY.md`
3. **OR** use GitHub Security Advisories
4. **INCLUDE** detailed reproduction steps
5. **EXPECT** response within 48 hours

## ✅ Security Checklist

- [ ] Enable Dependabot alerts
- [ ] Enable Dependabot security updates
- [ ] Enable Dependabot version updates
- [ ] Set up branch protection rules
- [ ] Configure security policy
- [ ] Review and test security workflows
- [ ] Set up secret scanning (if available)
- [ ] Configure environment variables properly
- [ ] Add security headers to deployment
- [ ] Regular security review schedule

---

*Last updated: June 13, 2025*
*Review this configuration monthly for updates and improvements.*
