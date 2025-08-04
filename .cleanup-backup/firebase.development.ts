// Firebase Development Configuration
// Handles localhost development with proper security rules and fallbacks

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, Firestore } from 'firebase/firestore';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Development Firebase Configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Development-specific configurations
const isDevelopment = window.location.hostname === 'localhost';

// Configure emulators for development (optional)
if (isDevelopment && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  try {
    // Only connect if emulators are explicitly enabled
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    console.log('🔧 Connected to Firebase emulators');
  } catch (error) {
    console.log('⚠️ Firebase emulators not available, using production services');
  }
}

// Analytics (disabled in development)
export let analytics: Analytics | null = null;
if (!isDevelopment && firebaseConfig.measurementId) {
  try {
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
  } catch (error) {
    console.warn('Failed to initialize Firebase Analytics:', error);
  }
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers for development
googleProvider.addScope('profile');
googleProvider.addScope('email');

appleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.setCustomParameters({
  locale: 'en'
});

// Development mode helpers
export const isDevelopmentMode = (): boolean => {
  return isDevelopment;
};

export const isFirestoreAvailable = (): boolean => {
  return true;
};

export const getFirestoreInstance = (): Firestore => {
  return db;
};

// Safe Firestore operations for development
export const safeFirestoreOperation = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | null> => {
  if (!isDevelopment) {
    // In production, run operations normally
    return await operation();
  }

  try {
    // In development, attempt operation but handle failures gracefully
    return await operation();
  } catch (error: any) {
    console.warn('🔧 Development Firestore operation failed (this is expected):', error.message);
    
    // Return fallback value or null
    return fallback || null;
  }
};

export default app;
