// Environment Configuration
export const isGitHubPages = window.location.hostname.includes('github.io');
export const isFirebaseHosting = window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com');
export const isLocalhost = window.location.hostname === 'localhost';

// Production Environment Validation
export const isProduction = import.meta.env.MODE === 'production';
export const isDevelopment = import.meta.env.MODE === 'development';
export const isStaging = import.meta.env.MODE === 'staging';

// Required Environment Variables Validation
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN', 
  'VITE_FIREBASE_PROJECT_ID'
];

// Get the appropriate Stripe key based on environment
export const getStripePublishableKey = () => {
  if (isProduction) {
    return import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY;
  } else {
    return import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY;
  }
};

// Validate required environment variables
function validateEnvironment() {
  const missing = requiredEnvVars.filter(varName => !import.meta.env[varName]);
  
  if (missing.length > 0) {
    const error = `Missing required environment variables: ${missing.join(', ')}`;
    console.error('[Environment] Validation failed:', error);
    if (isProduction) {
      throw new Error(error);
    }
  }
  
  // Validate Stripe key format
  const stripeKey = getStripePublishableKey();
  if (stripeKey && !stripeKey.startsWith('pk_')) {
    const error = 'Stripe publishable key must start with "pk_"';
    console.error('[Environment] Stripe validation failed:', error);
    if (isProduction) {
      throw new Error(error);
    }
  }
  
  // Check for production vs test keys
  if (isProduction && stripeKey?.includes('test')) {
    const error = 'Production environment detected but using test Stripe key';
    console.error('[Environment] Stripe key validation failed:', error);
    throw new Error(error);
  }
  
  // Warn if no Stripe key is configured (but don't throw)
  if (!stripeKey) {
    const keyType = isProduction ? 'VITE_STRIPE_LIVE_PUBLISHABLE_KEY' : 'VITE_STRIPE_TEST_PUBLISHABLE_KEY';
    console.warn(`[Environment] Warning: ${keyType} not configured. Payment features will be disabled.`);
  }
}

// Run validation
validateEnvironment();

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SUPABASE_STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'trivia-bundles';

// Now that creatiquemedia.github.io is authorized in Firebase, we can use Firebase Auth everywhere
export const useFirebaseAuth = true; // Always use Firebase auth now that domain is authorized

// No longer need GitHub Pages fallback mode
export const isGitHubPagesMode = false;

// Helper functions for getting correct paths
export const getBasePath = () => {
  return isGitHubPages ? '/ancient-history-trivia-pwa' : '';
};

export const getServiceWorkerPath = () => {
  return isGitHubPages ? '/ancient-history-trivia-pwa/sw.js' : '/sw.js';
};

// Environment detection for debugging (only shown in development)
if (import.meta.env.DEV) {
  console.log('[Environment] Detection:', {
    isGitHubPages,
    isFirebaseHosting,
    isLocalhost,
    useFirebaseAuth,
    isGitHubPagesMode,
    hostname: window.location.hostname,
    supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
    note: 'GitHub Pages domain now authorized in Firebase Console'
  });
}

// Initialize Supabase (if configured)
export const initializeSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
    return null;
  }
  
  // Dynamically import Supabase client to avoid loading it unnecessarily
  return import('@supabase/supabase-js').then(({ createClient }) => {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }).catch(error => {
    console.error('Failed to initialize Supabase:', error);
    return null;
  });
};

// Security Configuration
export const security = {
  enableCSP: isProduction,
  enableHSTS: isProduction, 
  enableSecureHeaders: isProduction,
  
  // Security utility functions
  sanitizeInput: (input: string): string => {
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  },
  
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
  
  generateSecureId: (): string => {
    return crypto.randomUUID();
  },
  
  isSafeUrl: (url: string): boolean => {
    try {
      const urlObj = new URL(url, window.location.origin);
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
    } catch {
      return false;
    }
  }
};
