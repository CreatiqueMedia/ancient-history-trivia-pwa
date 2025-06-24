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

// Minimal Firestore blocking - ONLY block actual Firestore endpoints  
if (typeof window !== 'undefined') {
  // Block ONLY very specific Firestore endpoints
  const originalFetch = window.fetch;
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString();
    
    // Only block the most specific Firestore API endpoints
    if (url.includes('firestore.googleapis.com/v1/projects/')) {
      console.warn('[FIRESTORE BLOCKED] Request to Firestore API blocked:', url.substring(0, 80) + '...');
      throw new Error('Firestore API disabled');
    }
    
    // Allow ALL other requests including Auth
    return originalFetch.call(window, input, init);
  };
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
