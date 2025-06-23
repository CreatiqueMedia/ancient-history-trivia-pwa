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
      })
    })
  : initializeFirestore(app, {
      localCache: memoryLocalCache() // Use memory cache for server-side
    });

export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Configure Firestore settings for better offline handling

// Add a function to ensure network connectivity
export const ensureFirestoreConnected = async () => {
  try {
    await enableNetwork(db);
  } catch (error) {
    console.warn('Could not ensure Firestore network connection:', error);
  }
};

// Circuit breaker for Firestore operations
let firestoreErrorCount = 0;
let lastErrorTime = 0;
const MAX_ERRORS = 5;
const ERROR_WINDOW = 60000; // 1 minute

export const shouldRetryFirestore = (): boolean => {
  const now = Date.now();
  
  // Reset error count if enough time has passed
  if (now - lastErrorTime > ERROR_WINDOW) {
    firestoreErrorCount = 0;
  }
  
  return firestoreErrorCount < MAX_ERRORS;
};

export const recordFirestoreError = (): void => {
  firestoreErrorCount++;
  lastErrorTime = Date.now();
};

export const resetFirestoreErrors = (): void => {
  firestoreErrorCount = 0;
  lastErrorTime = 0;
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
