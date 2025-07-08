// Enhanced Input Validation & Sanitization
import DOMPurify from 'dompurify';

interface ValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedValue?: string;
}

export class InputValidator {
  // Email validation with additional security checks
  static validateEmail(email: string): ValidationResult {
    const sanitized = email.trim().toLowerCase();
    
    // Basic format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(sanitized)) {
      return { isValid: false, error: 'Invalid email format' };
    }
    
    // Check for suspicious patterns
    const suspiciousPatterns = [
      /\+.*\+/, // Multiple + signs
      /\.{2,}/, // Multiple consecutive dots
      /@.*@/, // Multiple @ signs
      /[<>]/, // Angle brackets
    ];
    
    if (suspiciousPatterns.some(pattern => pattern.test(sanitized))) {
      return { isValid: false, error: 'Email contains invalid characters' };
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  }

  // Password validation with strength requirements
  static validatePassword(password: string): ValidationResult {
    if (password.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters long' };
    }
    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!hasLower || !hasUpper || !hasNumber) {
      return { 
        isValid: false, 
        error: 'Password must contain uppercase, lowercase, and numeric characters' 
      };
    }
    
    // Check for common passwords
    const commonPasswords = [
      'password', '123456', 'password123', 'admin123', 'qwerty'
    ];
    
    if (commonPasswords.includes(password.toLowerCase())) {
      return { isValid: false, error: 'Please choose a more secure password' };
    }
    
    return { isValid: true };
  }

  // Display name validation and sanitization
  static validateDisplayName(name: string): ValidationResult {
    const sanitized = DOMPurify.sanitize(name.trim());
    
    if (sanitized.length < 2) {
      return { isValid: false, error: 'Name must be at least 2 characters long' };
    }
    
    if (sanitized.length > 50) {
      return { isValid: false, error: 'Name must be less than 50 characters' };
    }
    
    // Allow only letters, spaces, hyphens, and apostrophes
    const nameRegex = /^[a-zA-Z\s\-']+$/;
    if (!nameRegex.test(sanitized)) {
      return { isValid: false, error: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
    }
    
    return { isValid: true, sanitizedValue: sanitized };
  }

  // General text input sanitization
  static sanitizeText(input: string, maxLength: number = 1000): string {
    const sanitized = DOMPurify.sanitize(input.trim());
    return sanitized.substring(0, maxLength);
  }

  // URL validation for external links
  static validateURL(url: string): ValidationResult {
    try {
      const parsedUrl = new URL(url);
      
      // Only allow HTTPS
      if (parsedUrl.protocol !== 'https:') {
        return { isValid: false, error: 'Only HTTPS URLs are allowed' };
      }
      
      // Block known malicious domains (basic list)
      const blockedDomains = ['bit.ly', 'tinyurl.com', 'goo.gl'];
      if (blockedDomains.some(domain => parsedUrl.hostname.includes(domain))) {
        return { isValid: false, error: 'URL from this domain is not allowed' };
      }
      
      return { isValid: true, sanitizedValue: url };
    } catch {
      return { isValid: false, error: 'Invalid URL format' };
    }
  }

  // Prevent XSS in user input
  static sanitizeForDisplay(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br'],
      ALLOWED_ATTR: []
    });
  }
}

// CSRF Token generation for sensitive operations
export class CSRFProtection {
  private static token: string | null = null;
  
  static generateToken(): string {
    this.token = crypto.randomUUID();
    sessionStorage.setItem('csrf_token', this.token);
    return this.token;
  }
  
  static validateToken(providedToken: string): boolean {
    const storedToken = sessionStorage.getItem('csrf_token');
    return storedToken === providedToken && providedToken === this.token;
  }
  
  static getToken(): string {
    if (!this.token) {
      return this.generateToken();
    }
    return this.token;
  }
}
