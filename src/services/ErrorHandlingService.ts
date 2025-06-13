// Enhanced Error Handling Service for Authentication and Subscription System

interface ErrorDetails {
  code: string;
  message: string;
  context?: string;
  timestamp: Date;
  userId?: string;
  stackTrace?: string;
}

interface UserFriendlyError {
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
}

class ErrorHandlingService {
  private errorLog: ErrorDetails[] = [];

  // Authentication error handling
  handleAuthError(error: any, context: string = ''): UserFriendlyError {
    const errorDetails: ErrorDetails = {
      code: error.code || 'auth/unknown-error',
      message: error.message || 'Unknown authentication error',
      context,
      timestamp: new Date(),
      stackTrace: error.stack
    };

    this.logError(errorDetails);

    switch (error.code) {
      case 'auth/user-not-found':
        return {
          title: 'Account Not Found',
          message: 'No account exists with this email address. Would you like to create a new account?',
          action: 'signup',
          actionLabel: 'Sign Up'
        };

      case 'auth/wrong-password':
        return {
          title: 'Incorrect Password',
          message: 'The password you entered is incorrect. Please try again or reset your password.',
          action: 'reset-password',
          actionLabel: 'Reset Password'
        };

      case 'auth/email-already-in-use':
        return {
          title: 'Email Already Registered',
          message: 'An account with this email already exists. Please sign in instead.',
          action: 'signin',
          actionLabel: 'Sign In'
        };

      case 'auth/weak-password':
        return {
          title: 'Password Too Weak',
          message: 'Please choose a stronger password with at least 6 characters, including letters and numbers.',
        };

      case 'auth/invalid-email':
        return {
          title: 'Invalid Email',
          message: 'Please enter a valid email address.',
        };

      case 'auth/user-disabled':
        return {
          title: 'Account Disabled',
          message: 'This account has been disabled. Please contact support for assistance.',
          action: 'contact-support',
          actionLabel: 'Contact Support'
        };

      case 'auth/too-many-requests':
        return {
          title: 'Too Many Attempts',
          message: 'Too many failed login attempts. Please try again later or reset your password.',
          action: 'reset-password',
          actionLabel: 'Reset Password'
        };

      case 'auth/network-request-failed':
        return {
          title: 'Connection Error',
          message: 'Unable to connect to our servers. Please check your internet connection and try again.',
        };

      case 'auth/popup-closed-by-user':
        return {
          title: 'Sign-in Cancelled',
          message: 'The sign-in process was cancelled. Please try again.',
        };

      case 'auth/popup-blocked':
        return {
          title: 'Popup Blocked',
          message: 'Please enable pop-ups for this site to sign in with your social account.',
        };

      case 'auth/account-exists-with-different-credential':
        return {
          title: 'Account Exists',
          message: 'An account already exists with this email using a different sign-in method. Please use your original sign-in method.',
        };

      default:
        return {
          title: 'Authentication Error',
          message: 'Something went wrong during sign-in. Please try again.',
        };
    }
  }

  // Subscription error handling
  handleSubscriptionError(error: any, context: string = ''): UserFriendlyError {
    const errorDetails: ErrorDetails = {
      code: error.code || 'subscription/unknown-error',
      message: error.message || 'Unknown subscription error',
      context,
      timestamp: new Date(),
      stackTrace: error.stack
    };

    this.logError(errorDetails);

    switch (error.code) {
      case 'subscription/payment-failed':
        return {
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please check your payment method and try again.',
          action: 'update-payment',
          actionLabel: 'Update Payment'
        };

      case 'subscription/card-declined':
        return {
          title: 'Card Declined',
          message: 'Your payment card was declined. Please try a different payment method.',
          action: 'update-payment',
          actionLabel: 'Try Another Card'
        };

      case 'subscription/insufficient-funds':
        return {
          title: 'Insufficient Funds',
          message: 'Your account has insufficient funds. Please add funds or try a different payment method.',
          action: 'update-payment',
          actionLabel: 'Update Payment'
        };

      case 'subscription/expired-card':
        return {
          title: 'Card Expired',
          message: 'Your payment card has expired. Please update your payment information.',
          action: 'update-payment',
          actionLabel: 'Update Card'
        };

      case 'subscription/invalid-coupon':
        return {
          title: 'Invalid Coupon',
          message: 'The coupon code you entered is invalid or has expired.',
        };

      case 'subscription/already-subscribed':
        return {
          title: 'Already Subscribed',
          message: 'You already have an active subscription. You can manage it in your account settings.',
          action: 'manage-subscription',
          actionLabel: 'Manage Subscription'
        };

      case 'subscription/trial-expired':
        return {
          title: 'Trial Expired',
          message: 'Your free trial has expired. Subscribe now to continue enjoying premium features.',
          action: 'subscribe',
          actionLabel: 'Subscribe Now'
        };

      default:
        return {
          title: 'Subscription Error',
          message: 'Something went wrong with your subscription. Please try again or contact support.',
          action: 'contact-support',
          actionLabel: 'Contact Support'
        };
    }
  }

  // Network error handling
  handleNetworkError(error: any, context: string = ''): UserFriendlyError {
    const errorDetails: ErrorDetails = {
      code: 'network/connection-error',
      message: error.message || 'Network connection failed',
      context,
      timestamp: new Date(),
      stackTrace: error.stack
    };

    this.logError(errorDetails);

    if (!navigator.onLine) {
      return {
        title: 'No Internet Connection',
        message: 'You appear to be offline. Please check your internet connection and try again.',
      };
    }

    return {
      title: 'Connection Error',
      message: 'Unable to connect to our servers. Please try again in a moment.',
    };
  }

  // General error handling
  handleGenericError(error: any, context: string = ''): UserFriendlyError {
    const errorDetails: ErrorDetails = {
      code: error.code || 'generic/unknown-error',
      message: error.message || 'An unexpected error occurred',
      context,
      timestamp: new Date(),
      stackTrace: error.stack
    };

    this.logError(errorDetails);

    // Check for specific error patterns
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return {
        title: 'Service Temporarily Unavailable',
        message: 'Our service is experiencing high demand. Please try again in a few minutes.',
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The request took too long to complete. Please try again.',
      };
    }

    return {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred. Please try again, and contact support if the problem continues.',
      action: 'contact-support',
      actionLabel: 'Contact Support'
    };
  }

  // Validation error handling
  handleValidationError(field: string, value: any): UserFriendlyError {
    const errorDetails: ErrorDetails = {
      code: 'validation/invalid-input',
      message: `Invalid ${field}: ${value}`,
      context: 'form-validation',
      timestamp: new Date()
    };

    this.logError(errorDetails);

    switch (field) {
      case 'email':
        return {
          title: 'Invalid Email',
          message: 'Please enter a valid email address.',
        };

      case 'password':
        return {
          title: 'Invalid Password',
          message: 'Password must be at least 6 characters long and contain letters and numbers.',
        };

      case 'displayName':
        return {
          title: 'Invalid Name',
          message: 'Please enter your full name (at least 2 characters).',
        };

      default:
        return {
          title: 'Invalid Input',
          message: `Please check your ${field} and try again.`,
        };
    }
  }

  // Log error for analytics and debugging
  private logError(error: ErrorDetails): void {
    // Add to local error log
    this.errorLog.push(error);

    // Keep only last 100 errors to prevent memory issues
    if (this.errorLog.length > 100) {
      this.errorLog = this.errorLog.slice(-100);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Handler]', error);
    }

    // In production, send to error tracking service
    // Examples: Sentry, LogRocket, Bugsnag
    if (process.env.NODE_ENV === 'production') {
      this.sendToErrorTracking(error);
    }

    // Send to analytics for conversion funnel analysis
    if (typeof gtag !== 'undefined') {
      gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        custom_map: {
          error_code: error.code,
          context: error.context || 'unknown'
        }
      });
    }
  }

  // Send error to external error tracking service
  private sendToErrorTracking(error: ErrorDetails): void {
    // Example Sentry integration
    if (typeof Sentry !== 'undefined') {
      Sentry.captureException(new Error(error.message), {
        tags: {
          error_code: error.code,
          context: error.context || 'unknown'
        },
        extra: {
          timestamp: error.timestamp,
          userId: error.userId
        }
      });
    }

    // Example custom API integration
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error)
    }).catch(() => {
      // Silently fail if error tracking is unavailable
    });
  }

  // Get error statistics
  getErrorStats(): { totalErrors: number; errorsByCode: Record<string, number>; recentErrors: ErrorDetails[] } {
    const errorsByCode: Record<string, number> = {};
    
    this.errorLog.forEach(error => {
      errorsByCode[error.code] = (errorsByCode[error.code] || 0) + 1;
    });

    return {
      totalErrors: this.errorLog.length,
      errorsByCode,
      recentErrors: this.errorLog.slice(-10)
    };
  }

  // Clear error log (for testing or privacy)
  clearErrorLog(): void {
    this.errorLog = [];
  }

  // Retry mechanism for failed operations
  async retryOperation<T>(
    operation: () => Promise<T>,
    maxAttempts: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: any;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;
        
        if (attempt === maxAttempts) {
          throw error;
        }

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)));
      }
    }

    throw lastError;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandlingService();
export default errorHandler;
