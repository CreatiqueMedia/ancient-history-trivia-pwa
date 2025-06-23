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
let isFirestoreBlocked = false;
const MAX_ERRORS = 1; // Extremely aggressive - just 1 error triggers circuit breaker
const ERROR_WINDOW = 30000; // 30 seconds
const CIRCUIT_OPEN_TIME = 300000; // 5 minutes - much longer block time

let firestoreInstance: Firestore | null = null;
let isFirestoreInitialized = false;

// Function to check if Firestore should be blocked
const shouldBlockFirestore = (): boolean => {
  const now = Date.now();
  
  // Reset error count if enough time has passed
  if (now - lastErrorTime > ERROR_WINDOW) {
    firestoreErrorCount = 0;
    isCircuitOpen = false;
    isFirestoreBlocked = false;
  }
  
  // If circuit is open, check if we should try again
  if (isCircuitOpen && now - lastErrorTime > CIRCUIT_OPEN_TIME) {
    isCircuitOpen = false;
    isFirestoreBlocked = false;
    firestoreErrorCount = Math.max(0, firestoreErrorCount - 1); // Gradually reduce error count
  }
  
  return isFirestoreBlocked || isCircuitOpen || firestoreErrorCount >= MAX_ERRORS;
};

// Safe Firestore getter that returns null when blocked
const getFirestoreInstance = (): Firestore | null => {
  if (shouldBlockFirestore()) {
    // Force disconnect any existing instance when circuit breaker is open
    if (firestoreInstance) {
      try {
        disableNetwork(firestoreInstance).catch(() => {
          // Ignore errors when disabling network
        });
      } catch (error) {
        // Ignore errors
      }
    }
    return null;
  }
  
  if (!isFirestoreInitialized && typeof window !== 'undefined') {
    try {
      firestoreInstance = initializeFirestore(app, {
        localCache: persistentLocalCache({ 
          cacheSizeBytes: 50 * 1024 * 1024 // 50MB cache size
        }),
        // Add experimental settings to reduce connection issues
        experimentalForceLongPolling: true, // Force long polling to avoid WebSocket issues
        ignoreUndefinedProperties: true, // Ignore undefined properties to prevent errors
        // Add settings to prevent automatic listeners
        experimentalAutoDetectLongPolling: false
      });
      isFirestoreInitialized = true;
    } catch (error: any) {
      console.warn('Failed to initialize Firestore:', error);
      recordFirestoreError(error);
      return null;
    }
  } else if (!isFirestoreInitialized && typeof window === 'undefined') {
    try {
      firestoreInstance = initializeFirestore(app, {
        localCache: memoryLocalCache(), // Use memory cache for server-side
        ignoreUndefinedProperties: true,
        experimentalForceLongPolling: true
      });
      isFirestoreInitialized = true;
    } catch (error: any) {
      console.warn('Failed to initialize server-side Firestore:', error);
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
      
      if (errorMessage.includes('firestore') || 
          errorMessage.includes('transport') ||
          errorMessage.includes('400') ||
          errorMessage.includes('Listen') ||
          errorMessage.includes('UNAUTHENTICATED') ||
          errorMessage.includes('WebChannelConnection') ||
          errorString.includes('firestore') ||
          errorString.includes('Listen') ||
          errorString.includes('400')) {
        
        console.warn('[Circuit Breaker] Firestore error detected, triggering circuit breaker:', errorMessage);
        recordFirestoreError(error);
        
        // Prevent console noise and network spam
        event.preventDefault();
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
        errorString.includes('transport errored')) {
      console.warn('[Circuit Breaker] Firestore console error detected:', errorString);
      recordFirestoreError(new Error(errorString));
      return; // Suppress the error
    }
    originalConsoleError.apply(console, args);
  };

  // Intercept fetch requests to Firestore APIs
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    if (url.includes('firestore.googleapis.com')) {
      if (shouldBlockFirestore()) {
        console.warn('[Circuit Breaker] Blocking Firestore fetch request due to circuit breaker');
        throw new Error('Firestore circuit breaker is open');
      }
    }
    return originalFetch.call(window, input, init);
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
  
  // Open circuit immediately on first error
  isCircuitOpen = true;
  isFirestoreBlocked = true;
  
  console.warn('[Circuit Breaker] Firestore circuit breaker opened immediately due to error. Errors:', firestoreErrorCount);
  
  // Aggressively disconnect Firestore to prevent more attempts
  if (firestoreInstance) {
    try {
      disableNetwork(firestoreInstance).catch(() => {
        // Ignore disconnection errors
      });
    } catch (disconnectError) {
      // Ignore disconnection errors
    }
  }
  
  // Log specific error patterns in development
  if (process.env.NODE_ENV === 'development' && error) {
    if (error.code === 'unavailable' || error.code === 'failed-precondition') {
      console.warn('Firestore connectivity issue:', error.code, error.message);
    }
  }
};

export const resetFirestoreErrors = (): void => {
  firestoreErrorCount = 0;
  lastErrorTime = 0;
  isCircuitOpen = false;
  isFirestoreBlocked = false;
};

export const getFirestoreStatus = () => ({
  errorCount: firestoreErrorCount,
  isCircuitOpen,
  isBlocked: isFirestoreBlocked,
  lastErrorTime,
  canRetry: shouldRetryFirestore()
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
