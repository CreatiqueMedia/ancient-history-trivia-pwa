// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, enableNetwork, disableNetwork, initializeFirestore, memoryLocalCache, persistentLocalCache } from 'firebase/firestore';
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

// Initialize Firestore with new cache settings (replaces deprecated enableIndexedDbPersistence)
export const db = typeof window !== 'undefined' 
  ? initializeFirestore(app, {
      localCache: persistentLocalCache({ 
        cacheSizeBytes: 50 * 1024 * 1024 // 50MB cache size
      }),
      // Add experimental settings to reduce connection issues
      experimentalForceLongPolling: false, // Use WebSockets when available
      ignoreUndefinedProperties: true // Ignore undefined properties to prevent errors
    })
  : initializeFirestore(app, {
      localCache: memoryLocalCache(), // Use memory cache for server-side
      ignoreUndefinedProperties: true
    });

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configure Firestore settings for better offline handling

// Add a function to ensure network connectivity
export const ensureFirestoreConnected = async () => {
  try {
    await enableNetwork(db);
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
    const reconnectPromise = enableNetwork(db);
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
    await disableNetwork(db);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Could not disconnect Firestore:', error);
    }
  }
};

// Enhanced circuit breaker for Firestore operations
let firestoreErrorCount = 0;
let lastErrorTime = 0;
let isCircuitOpen = false;
const MAX_ERRORS = 5;
const ERROR_WINDOW = 60000; // 1 minute
const CIRCUIT_OPEN_TIME = 30000; // 30 seconds

export const shouldRetryFirestore = (): boolean => {
  const now = Date.now();
  
  // Reset error count if enough time has passed
  if (now - lastErrorTime > ERROR_WINDOW) {
    firestoreErrorCount = 0;
    isCircuitOpen = false;
  }
  
  // If circuit is open, check if we should try again
  if (isCircuitOpen && now - lastErrorTime > CIRCUIT_OPEN_TIME) {
    isCircuitOpen = false;
    firestoreErrorCount = Math.floor(firestoreErrorCount / 2); // Gradually reduce error count
  }
  
  return !isCircuitOpen && firestoreErrorCount < MAX_ERRORS;
};

export const recordFirestoreError = (error?: any): void => {
  firestoreErrorCount++;
  lastErrorTime = Date.now();
  
  // Open circuit if too many errors
  if (firestoreErrorCount >= MAX_ERRORS) {
    isCircuitOpen = true;
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firestore circuit breaker opened due to repeated errors');
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
};

export const getFirestoreStatus = () => ({
  errorCount: firestoreErrorCount,
  isCircuitOpen,
  lastErrorTime,
  canRetry: shouldRetryFirestore()
});

// Add a function to test Firestore connectivity
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    // Try a lightweight operation to test connection
    await enableNetwork(db);
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
