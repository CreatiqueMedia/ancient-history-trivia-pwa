// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, enableNetwork, disableNetwork, initializeFirestore, memoryLocalCache, persistentLocalCache, Firestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

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

// KILL SWITCH: Firestore is COMPLETELY DISABLED by default
// This prevents any automatic initialization or connection attempts
const FIRESTORE_COMPLETELY_DISABLED = true; // Never enable Firestore in this session

// Enhanced circuit breaker for Firestore operations (legacy, but kept for compatibility)
let firestoreErrorCount = 0;
let lastErrorTime = 0;
let isCircuitOpen = false;
let isFirestoreBlocked = true; // Start blocked by default to prevent immediate initialization
const MAX_ERRORS = 1; // Extremely aggressive - just 1 error triggers circuit breaker
const ERROR_WINDOW = 30000; // 30 seconds
const CIRCUIT_OPEN_TIME = 300000; // 5 minutes - much longer block time

let firestoreInstance: Firestore | null = null;
let isFirestoreInitialized = false;
let firestoreInitializationAttempted = false;
let isFirestorePermanentlyBlocked = true; // Start permanently blocked
let hasAnyFirestoreError = false; // Track if we've ever had any Firestore error

// Function to check if Firestore should be blocked
const shouldBlockFirestore = (): boolean => {
  // KILL SWITCH: Always block if completely disabled
  if (FIRESTORE_COMPLETELY_DISABLED) {
    return true;
  }

  // If permanently blocked, never allow Firestore again
  if (isFirestorePermanentlyBlocked || hasAnyFirestoreError) {
    return true;
  }

  const now = Date.now();
  
  // Also block if circuit breaker conditions are met
  return isFirestoreBlocked || isCircuitOpen || firestoreErrorCount >= MAX_ERRORS;
};

// Safe Firestore getter that returns null when blocked
const getFirestoreInstance = (): Firestore | null => {
  // KILL SWITCH: Never allow Firestore initialization
  if (FIRESTORE_COMPLETELY_DISABLED) {
    console.warn('[KILL SWITCH] Firestore is completely disabled by design - no initialization allowed');
    return null;
  }

  // Always check if blocked first - permanent blocking takes precedence
  if (shouldBlockFirestore()) {
    console.warn('[Circuit Breaker] Firestore access permanently blocked due to previous errors');
    
    // Force complete cleanup of any existing instance
    if (firestoreInstance && isFirestoreInitialized) {
      try {
        disableNetwork(firestoreInstance).catch(() => {
          // Ignore errors when disabling network
        });
        // Clear the instance to prevent any lingering connections
        firestoreInstance = null;
        isFirestoreInitialized = false;
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    return null;
  }
  
  // This code should never execute due to KILL SWITCH, but kept for safety
  console.warn('[KILL SWITCH] Firestore initialization attempt blocked - should not reach here');
  return null;
};

// Export db as a dynamic getter to control access (DEPRECATED - use getFirestore() instead)
// This maintains backward compatibility but may return null when circuit breaker is open
export const db = null; // Force null to prevent automatic initialization

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Function to safely get Firestore instance
export const getFirestore = (): Firestore | null => {
  return getFirestoreInstance();
};

// Function to check if Firestore is available
export const isFirestoreAvailable = (): boolean => {
  return !shouldBlockFirestore() && getFirestoreInstance() !== null;
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

// Configure Firestore settings for better offline handling

// Add a function to ensure network connectivity
export const ensureFirestoreConnected = async () => {
  try {
    const firestore = getFirestoreInstance();
    if (firestore) {
      await enableNetwork(firestore);
    }
  } catch (error: any) {
    // Only log in development to avoid console noise in production
    if (process.env.NODE_ENV === 'development') {
      console.warn('Could not ensure Firestore network connection:', error);
    }
  }
};

// Enhanced function to handle network reconnection with timeout
export const reconnectFirestore = async (timeoutMs: number = 5000): Promise<boolean> => {
  try {
    const firestore = getFirestoreInstance();
    if (!firestore) {
      return false;
    }
    
    const reconnectPromise = enableNetwork(firestore);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Firestore reconnection timeout')), timeoutMs)
    );
    
    await Promise.race([reconnectPromise, timeoutPromise]);
    return true;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firestore reconnection failed:', error);
    }
    return false;
  }
};

// Function to gracefully disconnect Firestore
export const disconnectFirestore = async () => {
  try {
    const firestore = getFirestoreInstance();
    if (firestore) {
      await disableNetwork(firestore);
    }
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Could not disconnect Firestore:', error);
    }
  }
};

export const shouldRetryFirestore = (): boolean => {
  return !shouldBlockFirestore();
};

export const recordFirestoreError = (error?: any): void => {
  firestoreErrorCount++;
  lastErrorTime = Date.now();
  
  // Mark Firestore as permanently blocked after any error
  hasAnyFirestoreError = true;
  isFirestorePermanentlyBlocked = true;
  isCircuitOpen = true;
  isFirestoreBlocked = true;
  
  console.warn('[Circuit Breaker] Firestore permanently blocked due to error. This session will not attempt Firestore operations again.');
  
  // Aggressively clean up any existing Firestore instance
  if (firestoreInstance) {
    try {
      disableNetwork(firestoreInstance).then(() => {
        console.log('[Circuit Breaker] Firestore network disabled');
      }).catch(() => {
        // Ignore disconnection errors
      });
      
      // Clear the instance completely
      firestoreInstance = null;
      isFirestoreInitialized = false;
    } catch (disconnectError) {
      // Ignore disconnection errors
    }
  }
  
  // Log specific error patterns in development
  if (process.env.NODE_ENV === 'development' && error) {
    console.warn('Firestore error details:', error.code || 'unknown', error.message || 'no message');
  }
};

export const resetFirestoreErrors = (): void => {
  // Do NOT reset the permanent block - once blocked, stay blocked for the session
  console.warn('[Circuit Breaker] Reset requested, but permanent blocking remains in effect for this session');
  // Only reset counters for informational purposes
  firestoreErrorCount = 0;
  lastErrorTime = 0;
  // Keep permanent blocks in place:
  // hasAnyFirestoreError = true (unchanged)
  // isFirestorePermanentlyBlocked = true (unchanged)
};

export const getFirestoreStatus = () => ({
  errorCount: firestoreErrorCount,
  isCircuitOpen,
  isBlocked: isFirestoreBlocked,
  isPermanentlyBlocked: isFirestorePermanentlyBlocked,
  hasAnyError: hasAnyFirestoreError,
  isCompletelyDisabled: FIRESTORE_COMPLETELY_DISABLED,
  lastErrorTime,
  canRetry: false // Never retry - completely disabled
});

// Add a function to test Firestore connectivity
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    const firestore = getFirestoreInstance();
    if (!firestore) {
      return false;
    }
    // Try a lightweight operation to test connection
    await enableNetwork(firestore);
    return true;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firestore connection test failed:', error);
    }
    return false;
  }
};

// Function to attempt connection recovery
export const recoverFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Disconnect and reconnect
    await disconnectFirestore();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    return await reconnectFirestore(5000);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firestore connection recovery failed:', error);
    }
    return false;
  }
};

// For development, you can uncomment these lines to use Firebase emulators
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
//   connectFirestoreEmulator(db, 'localhost', 8080);
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
