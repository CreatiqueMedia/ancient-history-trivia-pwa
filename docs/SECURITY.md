# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depends on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

The Ancient History PWA team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them using one of the following methods:

#### Email
Send an email to: **[INSERT YOUR EMAIL HERE]**

Include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

#### GitHub Security Advisories
You can also report security vulnerabilities using [GitHub Security Advisories](https://github.com/CreatiqueMedia/ancient-history-trivia-pwa/security/advisories/new).

### Response Timeline

We will respond to your report within **48 hours** and provide regular updates about our progress.

### What to Expect

After the initial reply to your report, the security team will:

1. **Confirm the problem** and determine the affected versions
2. **Audit code** to find any potential similar problems
3. **Prepare fixes** for all releases still under support
4. **Release patches** as soon as possible

### Disclosure Policy

When the security team receives a security bug report, they will assign it to a primary handler. This person will coordinate the fix and release process, involving the following steps:

1. Confirm the problem and determine the affected versions
2. Audit code to find any potential similar problems
3. Prepare fixes for all releases still under support
4. Release new versions as fast as possible

### Security Update Communications

Security updates will be communicated through:
- GitHub Security Advisories
- Release notes in the CHANGELOG.md
- GitHub Releases page

### Preferred Languages

We prefer all communications to be in English.

## Security Features

This application implements several security best practices:

### Authentication Security
- Secure OAuth integration with Google, Facebook, and Apple
- No sensitive data stored in local storage
- Secure token handling
- Session management

### Data Protection
- No sensitive personal data collection beyond authentication
- Local data encryption where applicable
- Secure API communication (HTTPS only)

### Application Security
- Content Security Policy (CSP) headers
- Cross-Origin Resource Sharing (CORS) configuration
- Input validation and sanitization
- XSS protection

### Dependency Security
- Regular dependency updates
- Automated vulnerability scanning
- Minimal dependency footprint

## Scope

This security policy applies to:
- The main application codebase
- All dependencies listed in package.json
- Deployment configurations
- Documentation that could affect security

## Out of Scope

The following are generally considered out of scope:
- Social engineering attacks
- Physical attacks
- Denial of Service attacks
- Issues in third-party services (Google, Facebook, Apple OAuth)

## Comments on This Policy

If you have suggestions on how this process could be improved, please submit a pull request or open an issue to discuss.

---

*This security policy is effective as of June 13, 2025 and will be reviewed quarterly.*
