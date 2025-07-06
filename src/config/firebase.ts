// Firebase Configuration - FIRESTORE RE-ENABLED
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
// Google Analytics completely removed

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

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// For development, use Firestore emulator to avoid connection issues
if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('Connected to Firestore emulator');
  } catch (error) {
    console.warn('Firestore emulator not available, using production Firestore');
  }
}

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

// Firestore helper functions
export const isFirestoreAvailable = (): boolean => {
  return true; // Firestore is now enabled
};

// Function to safely get Firestore instance
export const getFirestoreInstance = (): Firestore => {
  return db;
};

export default app;
