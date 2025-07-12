# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | ✅ Yes             |
| < 1.0   | ❌ No              |

## Reporting a Vulnerability

We take the security of the Ancient History Trivia PWA seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them through GitHub's Security Advisory feature:

1. Go to the repository's Security tab
2. Click "Report a vulnerability"
3. Fill out the security advisory form with details

Alternatively, you can email security concerns to the maintainer.

### What to Include

Please include as much of the following information as possible:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths** of source file(s) related to the manifestation of the issue
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Special configuration** required to reproduce the issue
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept or exploit code** (if possible)
- **Impact** of the issue, including how an attacker might exploit it

### Response Timeline

- **Initial Response**: Within 48 hours of submission
- **Confirmation**: Within 7 days if the vulnerability is confirmed
- **Resolution**: Security patches released as soon as possible
- **Disclosure**: Public disclosure after fix is deployed (coordinated disclosure)

## Security Best Practices

When using this PWA template, please follow these security guidelines:

### Environment Variables
- Never commit API keys or secrets to version control
- Use Firebase security rules to protect database access
- Rotate API keys regularly
- Use different keys for development and production

### Content Security Policy
- Maintain strict CSP headers
- Regularly audit and update allowed domains
- Test CSP changes thoroughly

### Dependencies
- Keep all dependencies updated
- Regularly audit dependencies for vulnerabilities
- Use `yarn audit` to check for known issues

### Firebase Security
- Configure proper Firestore security rules
- Enable Firebase App Check for production
- Use Firebase Authentication for user management
- Regularly review Firebase project settings

### Payment Security
- Never store payment information locally
- Use Stripe's secure payment elements
- Validate all webhook signatures
- Implement proper error handling for payment flows

## Vulnerability Disclosure Policy

We believe in responsible disclosure of security vulnerabilities. We will:

1. Acknowledge receipt of your vulnerability report
2. Work with you to understand and validate the issue
3. Develop and test a fix
4. Release the security patch
5. Publicly disclose the vulnerability details after the fix is deployed

## Security Features

This PWA includes several security features:

- **Content Security Policy**: Strict CSP headers prevent XSS attacks
- **HTTPS Enforcement**: All traffic encrypted in transit
- **Input Validation**: Protection against injection attacks
- **Secure Headers**: Additional security headers for protection
- **Firebase Security Rules**: Database access control
- **Dependency Scanning**: Automated vulnerability scanning in CI/CD

## Contact

For security-related questions or concerns, please use the security advisory system or contact the maintainer directly.

---

Thank you for helping keep the Ancient History Trivia PWA and its users safe!
