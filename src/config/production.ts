// Production Configuration for Ancient History Trivia PWA
// This file contains production-specific settings and optimizations

// Production Environment Detection
export const isProduction = import.meta.env.PROD;
export const isDevelopment = import.meta.env.DEV;

// Production API Endpoints
export const PRODUCTION_API_ENDPOINTS = {
  stripe: 'https://api.stripe.com/v1',
  firebase: 'https://ancient-history-trivia.firebaseapp.com',
  supabase: import.meta.env.VITE_SUPABASE_URL || '',
  analytics: 'https://www.google-analytics.com/mp/collect',
};

// Production Feature Flags
export const PRODUCTION_FEATURES = {
  // Analytics and tracking
  enableAnalytics: true,
  enableErrorReporting: true,
  enablePerformanceMonitoring: true,
  
  // Payment systems
  enableStripePayments: true,
  enableAppStorePurchases: false, // Will be true when packaged for app stores
  
  // Content and features
  enableDailyChallenges: true,
  enableTrialMode: true,
  enableOfflineMode: true,
  
  // Debug and development features (disabled in production)
  enableDebugMode: false,
  enableConsoleLogging: false,
  enableDevTools: false,
};

// Production Performance Settings
export const PERFORMANCE_CONFIG = {
  // Service Worker settings
  enableServiceWorker: true,
  cacheStrategy: 'cache-first' as const,
  maxCacheAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  
  // Bundle loading
  enableLazyLoading: true,
  enableCodeSplitting: true,
  preloadCriticalBundles: ['egypt', 'rome'], // Most popular bundles
  
  // Network settings
  requestTimeout: 10000, // 10 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
};

// Production Security Settings
export const SECURITY_CONFIG = {
  // Content Security Policy
  enableCSP: true,
  allowedDomains: [
    'ancient-history-trivia.firebaseapp.com',
    'ancient-history-trivia.web.app',
    'creatiquemedia.github.io',
    'js.stripe.com',
    'api.stripe.com',
  ],
  
  // HTTPS enforcement
  enforceHTTPS: true,
  
  // Authentication security
  sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
  requireEmailVerification: false, // Keep false for better UX
  
  // Data protection
  enableDataEncryption: true,
  sanitizeUserInput: true,
};

// Production Logging Configuration
export const LOGGING_CONFIG = {
  level: 'error' as const, // Only log errors in production
  enableRemoteLogging: true,
  maxLogEntries: 100,
  logRetentionDays: 7,
  
  // Error reporting
  enableCrashReporting: true,
  enableUserFeedback: true,
  
  // Performance logging
  enablePerformanceLogs: true,
  enableNetworkLogs: false, // Disabled for privacy
};

// Production Analytics Configuration
export const ANALYTICS_CONFIG = {
  // Google Analytics
  measurementId: 'G-P9L2L1ZGEM',
  enablePageViews: true,
  enableEvents: true,
  enableConversions: true,
  
  // Custom events to track
  trackEvents: {
    quizCompleted: true,
    bundlePurchased: true,
    subscriptionStarted: true,
    dailyChallengeCompleted: true,
    userRegistered: true,
  },
  
  // Privacy settings
  anonymizeIP: true,
  respectDoNotTrack: true,
  enableConsentMode: true,
};

// Production Payment Configuration
export const PAYMENT_CONFIG = {
  // Stripe settings
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51NxSampleKeyForTestingPurposesOnly',
  enableApplePay: true,
  enableGooglePay: true,
  
  // Pricing (in cents for Stripe)
  bundlePriceInCents: 499, // $4.99
  subscriptionPrices: {
    monthly: 499,   // $4.99
    annual: 3999,   // $39.99
    biennial: 6999, // $69.99
  },
  
  // Payment processing
  enablePaymentRetries: true,
  paymentTimeout: 30000, // 30 seconds
};

// Production Content Delivery
export const CDN_CONFIG = {
  // Asset delivery
  enableCDN: true,
  cdnBaseUrl: 'https://ancient-history-trivia.web.app',
  
  // Image optimization
  enableImageOptimization: true,
  imageFormats: ['webp', 'avif', 'jpg'],
  imageSizes: [320, 640, 1024, 1920],
  
  // Font loading
  enableFontPreloading: true,
  fontDisplay: 'swap' as const,
};

// Production Database Configuration (Supabase)
export const DATABASE_CONFIG = {
  // Connection settings
  maxConnections: 10,
  connectionTimeout: 5000,
  queryTimeout: 10000,
  
  // Caching
  enableQueryCaching: true,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  
  // Offline support
  enableOfflineSync: true,
  syncInterval: 30 * 60 * 1000, // 30 minutes
};

// Production Monitoring and Health Checks
export const MONITORING_CONFIG = {
  // Health check endpoints
  healthCheckInterval: 5 * 60 * 1000, // 5 minutes
  enableHealthChecks: true,
  
  // Performance monitoring
  enableWebVitals: true,
  enableResourceTiming: true,
  enableNavigationTiming: true,
  
  // Error boundaries
  enableErrorBoundaries: true,
  enableFallbackUI: true,
};

// Production Build Information
export const BUILD_INFO = {
  version: '1.0.0',
  buildDate: new Date().toISOString(),
  environment: 'production',
  commitHash: import.meta.env.VITE_COMMIT_HASH || 'unknown',
  buildNumber: import.meta.env.VITE_BUILD_NUMBER || '1',
};

// Function to initialize production configuration
export const initializeProductionConfig = () => {
  if (!isProduction) {
    console.warn('Production config loaded in non-production environment');
    return;
  }

  // Set up global error handling
  if (PRODUCTION_FEATURES.enableErrorReporting) {
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      // In a real app, this would send to error reporting service
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      // In a real app, this would send to error reporting service
    });
  }

  // Disable console logging in production
  if (!PRODUCTION_FEATURES.enableConsoleLogging) {
    console.log = () => {};
    console.info = () => {};
    console.warn = () => {};
    // Keep console.error for critical issues
  }

  // Initialize performance monitoring
  if (MONITORING_CONFIG.enableWebVitals) {
    // Web Vitals would be initialized here
    console.info('Web Vitals monitoring enabled');
  }

  console.info('Production configuration initialized', {
    version: BUILD_INFO.version,
    buildDate: BUILD_INFO.buildDate,
    features: Object.entries(PRODUCTION_FEATURES)
      .filter(([, enabled]) => enabled)
      .map(([feature]) => feature),
  });
};

// Function to get production-safe configuration
export const getProductionConfig = () => ({
  isProduction,
  features: PRODUCTION_FEATURES,
  performance: PERFORMANCE_CONFIG,
  security: SECURITY_CONFIG,
  logging: LOGGING_CONFIG,
  analytics: ANALYTICS_CONFIG,
  payment: PAYMENT_CONFIG,
  cdn: CDN_CONFIG,
  database: DATABASE_CONFIG,
  monitoring: MONITORING_CONFIG,
  build: BUILD_INFO,
});

// Export default configuration
export default {
  ...getProductionConfig(),
  initialize: initializeProductionConfig,
};
