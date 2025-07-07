// Firebase Configuration - FIRESTORE RE-ENABLED
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
// Google Analytics completely removed

// Firebase Configuration for Ancient History Trivia PWA
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "***REMOVED***",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ancient-history-trivia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ancient-history-trivia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ancient-history-trivia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "778256162112",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:778256162112:web:ee31ff85689d2fe722aea5"
  // measurementId removed - Google Analytics completely disabled
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// DISABLED: Firestore emulator connection
// Using production Firestore for development to avoid emulator dependency
// if (process.env.NODE_ENV === 'development' && window.location.hostname === 'localhost') {
//   try {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     console.log('Connected to Firestore emulator');
//   } catch (error) {
//     console.log('Firestore emulator not available, using production Firestore');
//   }
// }

console.log('Using production Firestore for all environments');

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
