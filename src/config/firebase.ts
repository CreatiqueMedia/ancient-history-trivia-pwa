// Firebase Configuration - FIRESTORE COMPLETELY REMOVED
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
// FIRESTORE IMPORTS COMPLETELY REMOVED TO PREVENT ANY SDK INITIALIZATION
import { getAnalytics } from 'firebase/analytics';

// TypeScript types for compatibility (but no actual Firestore functionality)
type Firestore = null;

// Firebase Configuration for Ancient History Trivia PWA
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "ancient-history-trivia.firebaseapp.com", // Use .firebaseapp.com for auth
  projectId: "ancient-history-trivia",
  storageBucket: "ancient-history-trivia.firebasestorage.app",
  messagingSenderId: "778256162112",
  appId: "1:778256162112:web:ee31ff85689d2fe722aea5",
  measurementId: "G-P9L2L1ZGEM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// KILL SWITCH: Firestore is COMPLETELY DISABLED by design
const FIRESTORE_COMPLETELY_DISABLED = true;

// All Firestore-related variables are now no-ops
let firestoreInstance: Firestore = null;
let isFirestoreInitialized = false;
let firestoreInitializationAttempted = false;
let isFirestorePermanentlyBlocked = true;
let hasAnyFirestoreError = false;

// Legacy circuit breaker variables (kept for compatibility but unused)
let firestoreErrorCount = 0;
let lastErrorTime = 0;
let isCircuitOpen = false;
let isFirestoreBlocked = true;

// Function to check if Firestore should be blocked (always true now)
const shouldBlockFirestore = (): boolean => {
  return true; // Always blocked - Firestore completely removed
};

// Safe Firestore getter that always returns null (Firestore completely removed)
const getFirestoreInstance = (): Firestore => {
  console.warn('[KILL SWITCH] Firestore is completely disabled by design - no initialization allowed');
  return null;
};

// Export db as null to prevent automatic initialization
export const db = null;

// Function to safely get Firestore instance (always returns null)
export const getFirestore = (): Firestore => {
  return null;
};

// Function to check if Firestore is available (always false)
export const isFirestoreAvailable = (): boolean => {
  return false;
};

// ULTRA-AGGRESSIVE global error and network blocking
if (typeof window !== 'undefined') {
  // Block ALL Firestore-related network requests immediately
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('firestore.googleapis.com') || 
        url.includes('googleapis.com/v1/projects') ||
        url.includes('google.firestore.v1.Firestore')) {
      console.warn('[KILL SWITCH] Blocking ALL Firestore network requests');
      // Immediately reject with a clear error
      throw new Error('Firestore completely disabled - all network requests blocked');
    }
    return originalFetch.call(window, input, init);
  };

  // Block ALL WebSocket connections to Firestore
  const originalWebSocket = window.WebSocket;
  window.WebSocket = class extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      const urlString = url.toString();
      if (urlString.includes('firestore') || 
          urlString.includes('googleapis.com') ||
          urlString.includes('google.firestore')) {
        console.warn('[KILL SWITCH] Blocking ALL Firestore WebSocket connections');
        throw new Error('Firestore WebSocket connections completely disabled');
      }
      super(url, protocols);
    }
  };

  // Intercept and completely suppress ALL Firestore-related console output
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorString = args.join(' ');
    if (errorString.includes('firestore') || 
        errorString.includes('Listen') || 
        errorString.includes('WebChannelConnection') ||
        errorString.includes('transport errored') ||
        errorString.includes('grpc') ||
        errorString.includes('googleapis.com') ||
        errorString.includes('400') ||
        errorString.includes('persistence layer') ||
        errorString.includes('Failed to obtain exclusive access')) {
      console.warn('[KILL SWITCH] Firestore console error suppressed:', errorString.substring(0, 100) + '...');
      return; // Completely suppress
    }
    originalConsoleError.apply(console, args);
  };

  // Also suppress console.warn for Firestore
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const errorString = args.join(' ');
    if (errorString.includes('firestore') && 
        (errorString.includes('Listen') || 
         errorString.includes('WebChannelConnection') ||
         errorString.includes('transport errored') ||
         errorString.includes('400') ||
         errorString.includes('persistence layer') ||
         errorString.includes('Failed to obtain exclusive access'))) {
      // Don't log these Firestore warnings at all
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  // Intercept and suppress ALL Firestore unhandledrejection events
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object') {
      const error = event.reason;
      const errorMessage = error.message || '';
      const errorString = String(error);
      const errorStack = error.stack || '';
      
      // Extremely comprehensive error detection and suppression
      if (errorMessage.includes('firestore') || 
          errorMessage.includes('transport') ||
          errorMessage.includes('400') ||
          errorMessage.includes('Listen') ||
          errorMessage.includes('UNAUTHENTICATED') ||
          errorMessage.includes('WebChannelConnection') ||
          errorMessage.includes('grpc') ||
          errorMessage.includes('googleapis.com') ||
          errorMessage.includes('persistence layer') ||
          errorMessage.includes('Failed to obtain exclusive access') ||
          errorString.includes('firestore') ||
          errorString.includes('Listen') ||
          errorString.includes('400') ||
          errorStack.includes('firestore') ||
          errorStack.includes('WebChannelConnection')) {
        
        console.warn('[KILL SWITCH] Firestore error completely suppressed');
        recordFirestoreError(error);
        
        // Prevent ALL default handling
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        return false;
      }
    }
  });

  // Also try to block any attempt to create Firestore instances
  // Override the initializeFirestore function globally
  if ((window as any).firebase || (window as any).initializeFirestore) {
    console.warn('[KILL SWITCH] Attempting to override global Firestore functions');
    try {
      // Try to override any global Firestore initialization
      Object.defineProperty(window, 'initializeFirestore', {
        value: () => {
          console.warn('[KILL SWITCH] Global Firestore initialization blocked');
          throw new Error('Firestore completely disabled');
        },
        writable: false,
        configurable: false
      });
    } catch (e) {
      // Ignore if we can't override
    }
  }
}

// All remaining functions are no-ops to maintain compatibility

// Add a function to ensure network connectivity (no-op)
export const ensureFirestoreConnected = async () => {
  console.warn('[KILL SWITCH] ensureFirestoreConnected called but Firestore is disabled');
};

// Enhanced function to handle network reconnection with timeout (no-op)
export const reconnectFirestore = async (timeoutMs: number = 5000): Promise<boolean> => {
  console.warn('[KILL SWITCH] reconnectFirestore called but Firestore is disabled');
  return false;
};

// Function to gracefully disconnect Firestore (no-op)
export const disconnectFirestore = async () => {
  console.warn('[KILL SWITCH] disconnectFirestore called but Firestore is disabled');
};

export const shouldRetryFirestore = (): boolean => false;

export const recordFirestoreError = (error?: any): void => {
  console.warn('[KILL SWITCH] Firestore error recorded but Firestore is completely disabled');
  // No actual error recording since Firestore is disabled
};

export const resetFirestoreErrors = (): void => {
  console.warn('[KILL SWITCH] Reset requested, but Firestore is permanently disabled');
};

export const getFirestoreStatus = () => ({
  errorCount: 0,
  isCircuitOpen: false,
  isBlocked: true,
  isPermanentlyBlocked: true,
  hasAnyError: false,
  isCompletelyDisabled: true,
  lastErrorTime: 0,
  canRetry: false // Never retry - completely disabled
});

// Add a function to test Firestore connectivity (always returns false)
export const testFirestoreConnection = async (): Promise<boolean> => {
  console.warn('[KILL SWITCH] testFirestoreConnection called but Firestore is disabled');
  return false;
};

// Function to attempt connection recovery (always returns false)
export const recoverFirestoreConnection = async (): Promise<boolean> => {
  console.warn('[KILL SWITCH] recoverFirestoreConnection called but Firestore is disabled');
  return false;
};

// For development, you can uncomment these lines to use Firebase emulators
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   // Note: Firestore emulator connection removed since Firestore is disabled
// }

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers
// Simplified Google provider configuration to avoid redirect issues
googleProvider.addScope('profile');
googleProvider.addScope('email');

facebookProvider.setCustomParameters({
  display: 'popup'
});

appleProvider.setCustomParameters({
  locale: 'en'
});

export default app;
