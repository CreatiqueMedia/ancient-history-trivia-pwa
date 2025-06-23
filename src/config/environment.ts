// Environment Configuration
export const isGitHubPages = window.location.hostname.includes('github.io');
export const isFirebaseHosting = window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com');
export const isLocalhost = window.location.hostname === 'localhost';

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
    note: 'GitHub Pages domain now authorized in Firebase Console'
  });
}
