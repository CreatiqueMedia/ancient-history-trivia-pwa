// Environment Configuration
export const isGitHubPages = window.location.hostname.includes('github.io');
export const isFirebaseHosting = window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com');
export const isLocalhost = window.location.hostname === 'localhost';

// Supabase Configuration
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const SUPABASE_STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'trivia-bundles';

// Now that creatiquemedia.github.io is authorized in Firebase, we can use Firebase Auth everywhere
export const useFirebaseAuth = true; // Always use Firebase auth now that domain is authorized

// No longer need GitHub Pages fallback mode
export const isGitHubPagesMode = false;

// Helper functions for getting correct paths
export const getBasePath = () => {
  return isGitHubPages ? '/ancient-history-trivia-pwa' : '';
};

export const getServiceWorkerPath = () => {
  return isGitHubPages ? '/ancient-history-trivia-pwa/sw.js' : '/sw.js';
};

// Environment detection for debugging (only shown in development)
if (import.meta.env.DEV) {
  console.log('[Environment] Detection:', {
    isGitHubPages,
    isFirebaseHosting,
    isLocalhost,
    useFirebaseAuth,
    isGitHubPagesMode,
    hostname: window.location.hostname,
    supabaseConfigured: Boolean(SUPABASE_URL && SUPABASE_ANON_KEY),
    note: 'GitHub Pages domain now authorized in Firebase Console'
  });
}

// Initialize Supabase (if configured)
export const initializeSupabase = () => {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    console.warn('Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
    return null;
  }
  
  // Dynamically import Supabase client to avoid loading it unnecessarily
  return import('@supabase/supabase-js').then(({ createClient }) => {
    return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }).catch(error => {
    console.error('Failed to initialize Supabase:', error);
    return null;
  });
};
