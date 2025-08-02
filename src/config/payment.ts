import { loadStripe } from '@stripe/stripe-js';
import { 
  isPlatform, 
  isAppStoreEnvironment, 
  isWebEnvironment 
} from '../utils/platform';

// Stripe publishable key - switches between test and live based on environment
const STRIPE_PUBLISHABLE_KEY = import.meta.env.PROD 
  ? import.meta.env.VITE_STRIPE_LIVE_PUBLISHABLE_KEY || 'pk_live_YOUR_LIVE_KEY_HERE'
  : import.meta.env.VITE_STRIPE_TEST_PUBLISHABLE_KEY || 'pk_test_51NxSampleKeyForTestingPurposesOnly';

// RevenueCat API keys (to be used when packaged for app stores)
const REVENUECAT_API_KEYS = {
  ios: 'ios_api_key_here',
  android: 'android_api_key_here'
};

// Initialize Stripe
export const initializeStripePayment = async () => {
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  return stripePromise;
};

// Product IDs for bundles - LIVE MODE
export const BUNDLE_PRODUCT_IDS = {
  egypt: 'prod_SfhNK2NCuvLNIF', // Ancient Egypt Bundle
  rome: 'prod_SfhNszstBNGKoD', // Roman Empire Bundle
  greece: 'prod_SfhNvg6LYviC1j', // Ancient Greece Bundle
  mesopotamia: 'prod_SfhN4JxycmUaXm', // All Bundle Packs (mega pack)
  china: 'prod_SfhNiL5asn81Kh', // Hard Pack
  easy: 'prod_SfhNCwUKsguTas', // Easy Pack
  medium: 'prod_SfhN0OpdM5Ij6p', // Medium Pack
  hard: 'prod_SfhNiL5asn81Kh', // Hard Pack
  all_bundles: 'prod_SfhN4JxycmUaXm', // All Bundle Packs
};

// Product IDs for subscriptions - LIVE MODE
export const SUBSCRIPTION_PRODUCT_IDS = {
  monthly: 'prod_SfhNsGhEc6DS2N', // Pro Monthly Subscription
  annual: 'prod_Sfmtvd0xa9jEK6', // Pro Annual
  biennial: 'prod_Sfogdh2ZQtxidS', // Pro Biennial
};

// Bundle prices (in USD) - LIVE MODE PRICING
export const BUNDLE_PRICES = {
  egypt: 2.99,
  rome: 2.99,
  greece: 2.99,
  mesopotamia: 2.99,
  china: 2.99,
  easy: 2.99,
  medium: 2.99,
  hard: 2.99,
  all_bundles: 30.49,
};

// Subscription prices (in USD) - LIVE MODE PRICING
export const SUBSCRIPTION_PRICES = {
  monthly: 4.99,
  annual: 39.99,
  biennial: 69.99,
};

// Function to get bundle price
export const getBundlePrice = (bundleId: string): number => {
  return BUNDLE_PRICES[bundleId as keyof typeof BUNDLE_PRICES] || 4.99;
};

// Function to get subscription price
export const getSubscriptionPrice = (period: string): number => {
  return SUBSCRIPTION_PRICES[period as keyof typeof SUBSCRIPTION_PRICES] || 4.99;
};

// Function to get bundle name
export const getBundleName = (bundleId: string): string => {
  const names: Record<string, string> = {
    egypt: 'Ancient Egypt',
    rome: 'Roman Empire',
    greece: 'Ancient Greece',
    mesopotamia: 'Mesopotamia',
    china: 'Ancient China',
  };
  
  return names[bundleId] || bundleId;
};

// Function to get subscription name
export const getSubscriptionName = (period: string): string => {
  const names: Record<string, string> = {
    monthly: 'Monthly Premium',
    annual: 'Annual Premium',
    biennial: 'Biennial Premium',
  };
  
  return names[period] || period;
};

// Function to determine which payment system to use
export const shouldUseAppStorePurchases = (): boolean => {
  return isAppStoreEnvironment();
};

// Function to determine if we should use Stripe
export const shouldUseStripe = (): boolean => {
  return isWebEnvironment();
};

// Function to create a payment intent (to be called from a Firebase Cloud Function)
export const createPaymentIntent = async (
  bundleId: string, 
  amount: number, 
  userId: string
): Promise<{ clientSecret: string }> => {
  // In a real implementation, this would call a Firebase Cloud Function
  // For now, we'll simulate it
  console.log(`Creating payment intent for bundle ${bundleId}, amount ${amount}, user ${userId}`);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a fake client secret
  return { clientSecret: `pi_${Date.now()}_secret_${Math.random().toString(36).substring(2, 15)}` };
};

// Function to create a subscription (to be called from a Firebase Cloud Function)
export const createSubscription = async (
  tier: string,
  period: string,
  price: number,
  userId: string
): Promise<{ clientSecret: string }> => {
  // In a real implementation, this would call a Firebase Cloud Function
  // For now, we'll simulate it
  console.log(`Creating subscription for tier ${tier}, period ${period}, price ${price}, user ${userId}`);
  
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return a fake client secret
  return { clientSecret: `sub_${Date.now()}_secret_${Math.random().toString(36).substring(2, 15)}` };
};

// RevenueCat-specific functions for app store purchases
export const initializeRevenueCat = (userId: string): void => {
  // This would be implemented when packaging for app stores
  console.log('Initializing RevenueCat for user:', userId);
  
  // In a real implementation, this would initialize RevenueCat
  // Example (pseudo-code):
  // if (isPlatform('ios')) {
  //   Purchases.configure({ apiKey: REVENUECAT_API_KEYS.ios, appUserID: userId });
  // } else if (isPlatform('android')) {
  //   Purchases.configure({ apiKey: REVENUECAT_API_KEYS.android, appUserID: userId });
  // }
};

// Function to purchase a bundle using RevenueCat (for app store versions)
export const purchaseBundleWithRevenueCat = async (bundleId: string): Promise<boolean> => {
  // This would be implemented when packaging for app stores
  console.log('Purchasing bundle with RevenueCat:', bundleId);
  
  // Simulate successful purchase
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would use RevenueCat to make the purchase
  // Example (pseudo-code):
  // try {
  //   const purchaseResult = await Purchases.purchaseProduct(BUNDLE_PRODUCT_IDS[bundleId]);
  //   return purchaseResult.customerInfo.entitlements.active[bundleId] !== undefined;
  // } catch (error) {
  //   console.error('RevenueCat purchase error:', error);
  //   return false;
  // }
  
  return true;
};

// Function to subscribe using RevenueCat (for app store versions)
export const subscribeWithRevenueCat = async (tier: string, period: string): Promise<boolean> => {
  // This would be implemented when packaging for app stores
  console.log('Subscribing with RevenueCat:', tier, period);
  
  // Simulate successful subscription
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would use RevenueCat to make the subscription
  // Example (pseudo-code):
  // try {
  //   const packageId = SUBSCRIPTION_PRODUCT_IDS[period];
  //   const purchaseResult = await Purchases.purchasePackage({ identifier: packageId });
  //   return purchaseResult.customerInfo.entitlements.active['premium'] !== undefined;
  // } catch (error) {
  //   console.error('RevenueCat subscription error:', error);
  //   return false;
  // }
  
  return true;
};

// Function to restore purchases using RevenueCat (for app store versions)
export const restorePurchasesWithRevenueCat = async (): Promise<void> => {
  // This would be implemented when packaging for app stores
  console.log('Restoring purchases with RevenueCat');
  
  // Simulate restore process
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would use RevenueCat to restore purchases
  // Example (pseudo-code):
  // try {
  //   const customerInfo = await Purchases.restorePurchases();
  //   return customerInfo;
  // } catch (error) {
  //   console.error('RevenueCat restore error:', error);
  // }
};
