// Firebase Configuration - FIRESTORE COMPLETELY REMOVED
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
// FIRESTORE IMPORTS COMPLETELY REMOVED TO PREVENT ANY SDK INITIALIZATION
// Google Analytics completely removed

// TypeScript types for compatibility (but no actual Firestore functionality)
type Firestore = null;

// Firebase Configuration for Ancient History Trivia PWA
const firebaseConfig = {
  apiKey: "***REMOVED***",
  authDomain: "ancient-history-trivia.firebaseapp.com", // Use .firebaseapp.com for auth
  projectId: "ancient-history-trivia",
  storageBucket: "ancient-history-trivia.firebasestorage.app",
  messagingSenderId: "778256162112",
  appId: "1:778256162112:web:ee31ff85689d2fe722aea5"
  // measurementId removed - Google Analytics completely disabled
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Firestore is completely disabled - export null
export const db: Firestore = null;

// For development, you can uncomment these lines to use Firebase emulators
// if (process.env.NODE_ENV === 'development') {
//   connectAuthEmulator(auth, 'http://localhost:9099');
// }

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers
// Simplified Google provider configuration to avoid redirect issues
googleProvider.addScope('profile');
googleProvider.addScope('email');

// Configure Apple provider with proper scopes and parameters
appleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.setCustomParameters({
  locale: 'en'
});

// Firestore helper functions (disabled)
export const isFirestoreAvailable = (): boolean => {
  return false; // Firestore is completely disabled
};

// Function to safely get Firestore instance (returns null)
export const getFirestoreInstance = (): Firestore => {
  return null;
};

export default app;
