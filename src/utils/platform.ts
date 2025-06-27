/**
 * Platform detection utility for the Ancient History Trivia PWA
 * Used to determine the current platform for payment processing and other platform-specific features
 */

// Define platform types
export type Platform = 'ios' | 'android' | 'web' | 'pwa';

// Check if the app is running as a PWA
export const isPWA = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone || 
         document.referrer.includes('android-app://');
};

// Check if the app is running in a web browser
export const isWebBrowser = (): boolean => {
  return typeof window !== 'undefined' && !isPWA();
};

// Check if the app is running on a specific platform
export const isPlatform = (platform: Platform): boolean => {
  // For packaged apps, check for Capacitor/Cordova
  if (typeof window !== 'undefined') {
    // Check for Capacitor
    if ((window as any).Capacitor) {
      const capacitorPlatform = (window as any).Capacitor.getPlatform();
      if (platform === 'ios') return capacitorPlatform === 'ios';
      if (platform === 'android') return capacitorPlatform === 'android';
    }
    
    // Check for Cordova
    if ((window as any).cordova) {
      const device = (window as any).device;
      if (platform === 'ios') return device?.platform === 'iOS';
      if (platform === 'android') return device?.platform === 'Android';
    }
    
    // For PWA
    if (platform === 'pwa') return isPWA();
    
    // For web
    if (platform === 'web') return isWebBrowser();
    
    // Fallback detection using user agent
    const userAgent = navigator.userAgent.toLowerCase();
    if (platform === 'ios') return /iphone|ipad|ipod/.test(userAgent);
    if (platform === 'android') return /android/.test(userAgent);
  }
  
  // Default to false if window is not defined (SSR) or no match
  return false;
};

// Get the current platform
export const getCurrentPlatform = (): Platform => {
  if (isPlatform('ios')) return 'ios';
  if (isPlatform('android')) return 'android';
  if (isPlatform('pwa')) return 'pwa';
  return 'web';
};

// Check if the app is running in an app store environment
export const isAppStoreEnvironment = (): boolean => {
  return isPlatform('ios') || isPlatform('android');
};

// Check if the app is running in a web environment
export const isWebEnvironment = (): boolean => {
  return isPlatform('web') || isPlatform('pwa');
};

// Check if in-app purchases are required (App Store/Google Play)
export const requiresInAppPurchases = (): boolean => {
  // iOS always requires using App Store in-app purchases
  if (isPlatform('ios')) return true;
  
  // Android requires using Google Play in-app purchases if installed from Play Store
  if (isPlatform('android')) {
    // Check if installed from Play Store (simplified check)
    const userAgent = navigator.userAgent.toLowerCase();
    return userAgent.includes('android') && !userAgent.includes('browser');
  }
  
  return false;
};
