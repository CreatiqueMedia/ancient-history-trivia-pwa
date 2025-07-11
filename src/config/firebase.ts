// Firebase Configuration - FIRESTORE RE-ENABLED + ANALYTICS ENABLED
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';

// Firebase Configuration for Ancient History Trivia PWA
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Validate required environment variables
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId) {
  throw new Error('Missing required Firebase environment variables. Please check your .env file.');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Initialize Analytics (only in production and if measurement ID is available)
export let analytics: Analytics | null = null;
if (import.meta.env.PROD && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } catch (error) {
    console.warn('Failed to initialize Firebase Analytics:', error);
  }
}

// Initialize Performance Monitoring (only in production)
export let performance: any = null;
if (import.meta.env.PROD) {
  try {
    performance = getPerformance(app);
    console.log('Firebase Performance Monitoring initialized');
  } catch (error) {
    console.warn('Failed to initialize Firebase Performance Monitoring:', error);
  }
}

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
