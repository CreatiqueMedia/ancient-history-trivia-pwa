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

// Enhanced circuit breaker for Firestore operations
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
let isFirestorePermanentlyBlocked = false; // Permanently block after first error
let hasAnyFirestoreError = false; // Track if we've ever had any Firestore error

// Function to check if Firestore should be blocked
const shouldBlockFirestore = (): boolean => {
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
  
  // Never retry initialization if we've had any errors
  if (hasAnyFirestoreError || isFirestorePermanentlyBlocked) {
    console.warn('[Circuit Breaker] Firestore permanently disabled due to previous errors');
    return null;
  }
  
  // Only attempt initialization once per session
  if (firestoreInitializationAttempted && !isFirestoreInitialized) {
    console.warn('[Circuit Breaker] Firestore initialization was already attempted and failed');
    return null;
  }
  
  if (!isFirestoreInitialized && typeof window !== 'undefined') {
    firestoreInitializationAttempted = true;
    
    try {
      console.log('[Circuit Breaker] Attempting Firestore initialization...');
      
      // Use the most minimal configuration possible to reduce connection issues
      firestoreInstance = initializeFirestore(app, {
        localCache: memoryLocalCache(), // Use memory cache to avoid persistence issues
        ignoreUndefinedProperties: true
        // Removed all experimental settings that might trigger connections
      });
      
      isFirestoreInitialized = true;
      console.log('[Circuit Breaker] Firestore initialization successful');
      
    } catch (error: any) {
      console.warn('[Circuit Breaker] Failed to initialize Firestore:', error);
      hasAnyFirestoreError = true;
      isFirestorePermanentlyBlocked = true;
      recordFirestoreError(error);
      return null;
    }
  } else if (!isFirestoreInitialized && typeof window === 'undefined') {
    firestoreInitializationAttempted = true;
    
    try {
      firestoreInstance = initializeFirestore(app, {
        localCache: memoryLocalCache(),
        ignoreUndefinedProperties: true
      });
      isFirestoreInitialized = true;
    } catch (error: any) {
      console.warn('[Circuit Breaker] Failed to initialize server-side Firestore:', error);
      hasAnyFirestoreError = true;
      isFirestorePermanentlyBlocked = true;
      recordFirestoreError(error);
      return null;
    }
  }
  
  return firestoreInstance;
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

// Add global error handler for Firestore connection issues
if (typeof window !== 'undefined') {
  // Intercept and handle Firestore connection errors
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && typeof event.reason === 'object') {
      const error = event.reason;
      const errorMessage = error.message || '';
      const errorString = String(error);
      const errorStack = error.stack || '';
      
      // More comprehensive error detection
      if (errorMessage.includes('firestore') || 
          errorMessage.includes('transport') ||
          errorMessage.includes('400') ||
          errorMessage.includes('Listen') ||
          errorMessage.includes('UNAUTHENTICATED') ||
          errorMessage.includes('WebChannelConnection') ||
          errorMessage.includes('grpc') ||
          errorMessage.includes('googleapis.com') ||
          errorString.includes('firestore') ||
          errorString.includes('Listen') ||
          errorString.includes('400') ||
          errorStack.includes('firestore') ||
          errorStack.includes('WebChannelConnection')) {
        
        console.warn('[Circuit Breaker] Firestore-related error detected and suppressed:', errorMessage);
        recordFirestoreError(error);
        
        // Prevent console noise and network spam
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        
        // Return false to prevent default handling
        return false;
      }
    }
  });

  // Also intercept console errors that might be related to Firestore
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorString = args.join(' ');
    if (errorString.includes('firestore') || 
        errorString.includes('Listen') || 
        errorString.includes('WebChannelConnection') ||
        errorString.includes('transport errored') ||
        errorString.includes('grpc') ||
        errorString.includes('googleapis.com') ||
        errorString.includes('400')) {
      console.warn('[Circuit Breaker] Firestore console error detected and suppressed:', errorString);
      recordFirestoreError(new Error(errorString));
      return; // Suppress the error completely
    }
    originalConsoleError.apply(console, args);
  };

  // Intercept console.warn as well since some Firestore errors show up as warnings
  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const errorString = args.join(' ');
    if (errorString.includes('firestore') && 
        (errorString.includes('Listen') || 
         errorString.includes('WebChannelConnection') ||
         errorString.includes('transport errored') ||
         errorString.includes('400'))) {
      console.warn('[Circuit Breaker] Firestore console warning detected and suppressed:', errorString);
      recordFirestoreError(new Error(errorString));
      return; // Suppress the warning
    }
    originalConsoleWarn.apply(console, args);
  };

  // Intercept fetch requests to Firestore APIs
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('firestore.googleapis.com') || url.includes('googleapis.com/v1/projects')) {
      if (shouldBlockFirestore() || hasAnyFirestoreError || isFirestorePermanentlyBlocked) {
        console.warn('[Circuit Breaker] Blocking Firestore fetch request - Firestore is permanently disabled');
        // Throw an error to prevent the request
        throw new Error('Firestore permanently disabled due to previous errors');
      }
    }
    return originalFetch.call(window, input, init);
  };

  // Also try to intercept WebSocket connections to Firestore
  const originalWebSocket = window.WebSocket;
  window.WebSocket = class extends WebSocket {
    constructor(url: string | URL, protocols?: string | string[]) {
      const urlString = url.toString();
      if (urlString.includes('firestore') || urlString.includes('googleapis.com')) {
        if (shouldBlockFirestore() || hasAnyFirestoreError || isFirestorePermanentlyBlocked) {
          console.warn('[Circuit Breaker] Blocking Firestore WebSocket connection');
          throw new Error('Firestore WebSocket connections permanently disabled');
        }
      }
      super(url, protocols);
    }
  };
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
  lastErrorTime,
  canRetry: false // Never retry in this session after any error
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
