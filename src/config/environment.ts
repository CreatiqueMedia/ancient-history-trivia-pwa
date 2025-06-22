// Environment Configuration
export const isGitHubPages = window.location.hostname.includes('github.io');
export const isFirebaseHosting = window.location.hostname.includes('web.app') || window.location.hostname.includes('firebaseapp.com');
export const isLocalhost = window.location.hostname === 'localhost';

// Determine if Firebase Auth should be used
export const useFirebaseAuth = isFirebaseHosting || isLocalhost;

// GitHub Pages fallback mode
export const isGitHubPagesMode = isGitHubPages && !useFirebaseAuth;

console.log('[Environment] Detection:', {
  isGitHubPages,
  isFirebaseHosting,
  isLocalhost,
  useFirebaseAuth,
  isGitHubPagesMode,
  hostname: window.location.hostname
});
