// Firebase Configuration - HOSTING + AUTH ONLY (No Firestore)
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, OAuthProvider, connectAuthEmulator } from 'firebase/auth';

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

// Lazy-loaded Analytics and Performance
export let analytics: any = null;
export let performance: any = null;

// Function to initialize analytics when needed
export const initializeAnalytics = async () => {
  if (analytics || !import.meta.env.PROD || !firebaseConfig.measurementId) {
    return analytics;
  }
  
  try {
    const { getAnalytics } = await import('firebase/analytics');
    analytics = getAnalytics(app);
    console.log('Firebase Analytics initialized');
    return analytics;
  } catch (error) {
    console.warn('Failed to initialize Firebase Analytics:', error);
    return null;
  }
};

// Function to initialize performance monitoring when needed
export const initializePerformance = async () => {
  if (performance || !import.meta.env.PROD) {
    return performance;
  }
  
  try {
    const { getPerformance } = await import('firebase/performance');
    performance = getPerformance(app);
    console.log('Firebase Performance Monitoring initialized');
    return performance;
  } catch (error) {
    console.warn('Failed to initialize Firebase Performance:', error);
    return null;
  }
};

const isDevelopment = import.meta.env.DEV && window.location.hostname === 'localhost';
if (isDevelopment) {
  console.log('🔧 Development mode: Stripe-only backend with local storage');
} else {
  console.log('🚀 Production mode: Stripe-only backend');
}

// Auth providers
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Configure providers
// Simplified Google provider configuration to avoid redirect issues
googleProvider.addScope('profile');
googleProvider.addScope('email');

// For development: Add custom parameters to avoid localhost blocking
if (isDevelopment) {
  googleProvider.setCustomParameters({
    'prompt': 'select_account'
  });
}

// Configure Apple provider with proper scopes and parameters
appleProvider.addScope('email');
appleProvider.addScope('name');
appleProvider.setCustomParameters({
  locale: 'en'
});

export default app;
