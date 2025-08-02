/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  
  // Firebase config
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_FIREBASE_MEASUREMENT_ID: string
  
  // Stripe config
  readonly VITE_STRIPE_TEST_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_LIVE_PUBLISHABLE_KEY: string
  readonly VITE_STRIPE_WEBHOOK_SECRET: string
  
  // Supabase config
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_SUPABASE_STORAGE_BUCKET: string
  
  // App config
  readonly VITE_ENV: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_ENV: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_NAME: string
  
  // Feature flags
  readonly VITE_ENABLE_PUSH_NOTIFICATIONS: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_ERROR_TRACKING: string
  readonly VITE_ENABLE_EMAIL_NOTIFICATIONS: string
  
  // Debug flags
  readonly VITE_DEBUG_REDUX: string
  readonly VITE_DEBUG_ANALYTICS: string
  readonly VITE_DEBUG_AUTH: string
  
  // Development config
  readonly VITE_HMR_PORT: string
  readonly VITE_DEV_SERVER_PORT: string
  
  // Mock flags
  readonly VITE_USE_MOCK_AUTH: string
  readonly VITE_USE_MOCK_PAYMENTS: string
  readonly VITE_USE_MOCK_ANALYTICS: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google Analytics types
declare function gtag(...args: any[]): void;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
  
  // Extended Notification API for PWA features
  interface NotificationOptions {
    vibrate?: number | number[];
  }
}

export {};
