/**
 * Input Validation and Sanitization Utilities
 * Production-ready input validation for security and data integrity
 */

import { security } from '../config/environment';

// Common validation patterns
const VALIDATION_PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[1-9]\d{1,14}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  creditCard: /^\d{13,19}$/,
  cvv: /^\d{3,4}$/,
  zipCode: /^\d{5}(-\d{4})?$/,
} as const;

// Maximum input lengths
const MAX_LENGTHS = {
  name: 50,
  email: 254,
  message: 1000,
  title: 100,
  description: 500,
  address: 200,
  phone: 20,
  username: 20,
} as const;

// Dangerous input patterns to block
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
  /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
  /<embed\b[^<]*>/gi,
  /data:text\/html/gi,
];

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  sanitizedValue?: string;
}

export class InputValidator {
  /**
   * Validate and sanitize email input
   */
  static validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = email.trim().toLowerCase();

    // Length check
    if (sanitizedValue.length === 0) {
      errors.push('Email is required');
    } else if (sanitizedValue.length > MAX_LENGTHS.email) {
      errors.push(`Email must be less than ${MAX_LENGTHS.email} characters`);
    }

    // Format validation
    if (sanitizedValue && !VALIDATION_PATTERNS.email.test(sanitizedValue)) {
      errors.push('Please enter a valid email address');
    }

    // Security check
    if (this.containsDangerousContent(sanitizedValue)) {
      errors.push('Email contains invalid characters');
      sanitizedValue = security.sanitizeInput(sanitizedValue);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): ValidationResult {
    const errors: string[] = [];

    if (password.length === 0) {
      errors.push('Password is required');
    } else {
      if (password.length < 8) {
        errors.push('Password must be at least 8 characters long');
      }
      if (password.length > 128) {
        errors.push('Password must be less than 128 characters');
      }
      if (!/(?=.*[a-z])/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
      }
      if (!/(?=.*[A-Z])/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/(?=.*\d)/.test(password)) {
        errors.push('Password must contain at least one number');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate and sanitize general text input
   */
  static validateText(
    text: string, 
    fieldName: string, 
    options: {
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      allowHTML?: boolean;
    } = {}
  ): ValidationResult {
    const { required = false, minLength = 0, maxLength = 1000, allowHTML = false } = options;
    const errors: string[] = [];
    let sanitizedValue = text.trim();

    // Required check
    if (required && sanitizedValue.length === 0) {
      errors.push(`${fieldName} is required`);
    }

    // Length checks
    if (sanitizedValue.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters long`);
    }
    if (sanitizedValue.length > maxLength) {
      errors.push(`${fieldName} must be less than ${maxLength} characters`);
    }

    // Security sanitization
    if (!allowHTML && this.containsDangerousContent(sanitizedValue)) {
      sanitizedValue = security.sanitizeInput(sanitizedValue);
    }

    // Additional XSS protection
    if (!allowHTML) {
      sanitizedValue = this.removeHTMLTags(sanitizedValue);
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Validate URL input
   */
  static validateURL(url: string, required: boolean = false): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = url.trim();

    if (required && sanitizedValue.length === 0) {
      errors.push('URL is required');
    }

    if (sanitizedValue && !VALIDATION_PATTERNS.url.test(sanitizedValue)) {
      errors.push('Please enter a valid URL');
    }

    // Ensure HTTPS in production
    if (sanitizedValue && import.meta.env.MODE === 'production' && !sanitizedValue.startsWith('https://')) {
      errors.push('URL must use HTTPS');
    }

    // Security check
    if (!security.isSafeUrl(sanitizedValue)) {
      errors.push('URL is not safe');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Validate phone number
   */
  static validatePhone(phone: string, required: boolean = false): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = phone.replace(/\D/g, ''); // Remove non-digits

    if (required && sanitizedValue.length === 0) {
      errors.push('Phone number is required');
    }

    if (sanitizedValue && (sanitizedValue.length < 10 || sanitizedValue.length > 15)) {
      errors.push('Please enter a valid phone number');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Validate username
   */
  static validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    let sanitizedValue = username.trim().toLowerCase();

    if (sanitizedValue.length === 0) {
      errors.push('Username is required');
    } else if (!VALIDATION_PATTERNS.username.test(sanitizedValue)) {
      errors.push('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }

    // Check for reserved usernames
    const reservedUsernames = ['admin', 'root', 'api', 'www', 'mail', 'support'];
    if (reservedUsernames.includes(sanitizedValue)) {
      errors.push('This username is reserved');
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue
    };
  }

  /**
   * Check if input contains dangerous content
   */
  private static containsDangerousContent(input: string): boolean {
    return DANGEROUS_PATTERNS.some(pattern => pattern.test(input));
  }

  /**
   * Remove HTML tags from input
   */
  private static removeHTMLTags(input: string): string {
    return input.replace(/<[^>]*>/g, '');
  }

  /**
   * Validate multiple fields at once
   */
  static validateForm(
    fields: Record<string, any>,
    rules: Record<string, {
      type: 'email' | 'password' | 'text' | 'url' | 'phone' | 'username';
      required?: boolean;
      minLength?: number;
      maxLength?: number;
      allowHTML?: boolean;
    }>
  ): { isValid: boolean; errors: Record<string, string[]>; sanitizedValues: Record<string, string> } {
    const errors: Record<string, string[]> = {};
    const sanitizedValues: Record<string, string> = {};
    let isValid = true;

    for (const [fieldName, value] of Object.entries(fields)) {
      const rule = rules[fieldName];
      if (!rule) continue;

      let result: ValidationResult;

      switch (rule.type) {
        case 'email':
          result = this.validateEmail(value);
          break;
        case 'password':
          result = this.validatePassword(value);
          break;
        case 'url':
          result = this.validateURL(value, rule.required);
          break;
        case 'phone':
          result = this.validatePhone(value, rule.required);
          break;
        case 'username':
          result = this.validateUsername(value);
          break;
        case 'text':
        default:
          result = this.validateText(value, fieldName, rule);
          break;
      }

      if (!result.isValid) {
        errors[fieldName] = result.errors;
        isValid = false;
      }

      if (result.sanitizedValue !== undefined) {
        sanitizedValues[fieldName] = result.sanitizedValue;
      }
    }

    return { isValid, errors, sanitizedValues };
  }
}

/**
 * Rate limiting for form submissions
 */
export class RateLimiter {
  private static submissions: Map<string, number[]> = new Map();
  private static readonly MAX_SUBMISSIONS = 5;
  private static readonly TIME_WINDOW = 60000; // 1 minute

  static canSubmit(identifier: string): boolean {
    const now = Date.now();
    const submissions = this.submissions.get(identifier) || [];
    
    // Remove old submissions outside time window
    const recentSubmissions = submissions.filter(time => now - time < this.TIME_WINDOW);
    
    if (recentSubmissions.length >= this.MAX_SUBMISSIONS) {
      return false;
    }

    // Add current submission
    recentSubmissions.push(now);
    this.submissions.set(identifier, recentSubmissions);
    
    return true;
  }

  static getRemainingTime(identifier: string): number {
    const submissions = this.submissions.get(identifier) || [];
    if (submissions.length === 0) return 0;
    
    const oldestSubmission = Math.min(...submissions);
    const timeRemaining = this.TIME_WINDOW - (Date.now() - oldestSubmission);
    
    return Math.max(0, timeRemaining);
  }
}

export default InputValidator;
