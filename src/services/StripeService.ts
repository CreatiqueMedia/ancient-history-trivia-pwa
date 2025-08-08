import { loadStripe, Stripe } from '@stripe/stripe-js';
import { getFunctions, httpsCallable, connectFunctionsEmulator } from 'firebase/functions';
import { getAuth } from 'firebase/auth';

// Initialize Stripe with live publishable key from environment
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY || '');

// Firebase Functions
const functions = getFunctions();

// Connect to emulator in development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

export interface CheckoutSessionData {
  priceId: string;
  planType: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

/**
 * Create a secure Stripe checkout session via Firebase Functions
 */
export const createCheckoutSession = async (data: CheckoutSessionData): Promise<CheckoutSessionResponse> => {
  const auth = getAuth();
  const user = auth.currentUser;
  
  if (!user) {
    throw new Error('User must be authenticated to create checkout session');
  }

  try {
    // Get ID token for authentication
    const idToken = await user.getIdToken();
    
    // Call Firebase Function
    const response = await fetch(`${getFunctionBaseUrl()}/createCheckoutSession`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create checkout session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
};

/**
 * Get user's subscription status
 */
export const getSubscriptionStatus = httpsCallable(functions, 'getSubscriptionStatus');

/**
 * Redirect to Stripe Checkout using URL
 */
export const redirectToCheckout = async (sessionId: string): Promise<void> => {
  const stripe = await stripePromise;
  
  if (!stripe) {
    throw new Error('Stripe failed to load');
  }

  // Use the newer approach with redirectToCheckout
  const result = await stripe.redirectToCheckout({ sessionId });
  
  if (result.error) {
    throw new Error(result.error.message);
  }
};

/**
 * Create checkout session and redirect
 */
export const createAndRedirectToCheckout = async (data: CheckoutSessionData): Promise<void> => {
  try {
    const session = await createCheckoutSession(data);
    await redirectToCheckout(session.sessionId);
  } catch (error) {
    console.error('Error in checkout process:', error);
    throw error;
  }
};

/**
 * Get the base URL for Firebase Functions
 */
function getFunctionBaseUrl(): string {
  if (import.meta.env.DEV) {
    return 'http://localhost:5001/ancient-history-trivia/us-central1';
  }
  return 'https://us-central1-ancient-history-trivia.cloudfunctions.net';
}

// Export Stripe instance for other uses
export { stripePromise };

// Live mode price IDs (secure - pulled from environment or config)
export const LIVE_PRICE_IDS = {
  // Subscription Plans
  monthly: 'price_1RkLzHATHmLCupn7s2EMRvAK',
  annual: 'price_1RkT3IATHmLCupn7E4so8uTJ', 
  biennial: 'price_1RkT3fATHmLCupn7KjRnoA8h',
  
  // Bundle Packs
  bundles: {
    easy: 'price_1RkLyZATHmLCupn7VWNVXhND',
    medium: 'price_1RkLyaATHmLCupn7d185LVnL',
    hard: 'price_1RkLybATHmLCupn7vpyYNNRU',
    all_bundles: 'price_1RkLybATHmLCupn71nEnpD5M',
    egypt: 'price_1RkLyYATHmLCupn7TX69zBYN',
    rome: 'price_1RkLyXATHmLCupn7xMIie47d',
    greece: 'price_1RkLyWATHmLCupn7cI6Jv1eM',
  }
};

/**
 * Secure utility to get price ID by plan type
 */
export const getPriceId = (planType: string): string => {
  if (planType in LIVE_PRICE_IDS) {
    return LIVE_PRICE_IDS[planType as keyof typeof LIVE_PRICE_IDS] as string;
  }
  
  if (planType in LIVE_PRICE_IDS.bundles) {
    return LIVE_PRICE_IDS.bundles[planType as keyof typeof LIVE_PRICE_IDS.bundles];
  }
  
  throw new Error(`Unknown plan type: ${planType}`);
};
