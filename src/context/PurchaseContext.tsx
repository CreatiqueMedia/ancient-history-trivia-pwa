import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { StripeTrialService } from '../services/StripeTrialService';
import { 
  getBundlePrice, 
  getSubscriptionPrice, 
  getBundleName,
  createPaymentIntent,
  createSubscription,
  purchaseBundleWithRevenueCat,
  subscribeWithRevenueCat,
  restorePurchasesWithRevenueCat,
  shouldUseAppStorePurchases,
  shouldUseStripe
} from '../config/payment';
import {
  isPlatform,
  isAppStoreEnvironment,
  isWebEnvironment
} from '../utils/platform';
import { 
  createAndRedirectToCheckout, 
  getPriceId 
} from '../services/StripeService';

interface PurchaseContextType {
  ownedBundles: string[];
  subscriptionTier: 'free' | 'pro';
  subscriptionPeriod: 'none' | 'monthly' | 'annual' | 'biennial';
  subscriptionExpiry?: string;
  isProcessing: boolean;
  showPaymentModal: boolean;
  currentPurchase: { type: 'bundle' | 'subscription', id: string } | null;
  purchaseBundle: (bundleId: string) => Promise<boolean>;
  purchaseGroup: (bundleIds: string[]) => Promise<boolean>;
  subscribe: (tier: string, period: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  hasAccessToBundle: (bundleId: string) => boolean;
  isPremiumUser: boolean;
  closePaymentModal: () => void;
  handlePaymentSuccess: () => void;
  refreshSubscriptionData: () => void;
  calculateLoyaltyDiscount: () => { discount: number; message: string };
  getDiscountedSubscriptionPrice: (originalPrice: number) => { price: number; discount: number; message: string };
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, userProfile } = useAuth();
  const [ownedBundles, setOwnedBundles] = useState<string[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro'>('free');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<'none' | 'monthly' | 'annual' | 'biennial'>('none');
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingItems, setProcessingItems] = useState<Set<string>>(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentPurchase, setCurrentPurchase] = useState<{ type: 'bundle' | 'subscription', id: string } | null>(null);

  // Reset subscription state when user logs out
  useEffect(() => {
    if (!user) {
      setOwnedBundles([]);
      setSubscriptionTier('free');
      setSubscriptionPeriod('none');
      setSubscriptionExpiry(undefined);
      
      // Clear localStorage data when user logs out
      localStorage.removeItem('ownedBundles');
      localStorage.removeItem('subscription');
      localStorage.removeItem('purchaseHistory');
    }
  }, [user?.uid]); // Only depend on user ID, not the entire user object

  // Load saved purchase data on initialization
  useEffect(() => {
    const loadPurchaseData = async () => {
      // Only load data if user is authenticated
      if (!user) return;
      
      try {
        const savedBundles = localStorage.getItem('ownedBundles');
        const savedSubscription = localStorage.getItem('subscription');
        
        if (savedBundles) {
          setOwnedBundles(JSON.parse(savedBundles));
        }
        
        if (savedSubscription) {
          const sub = JSON.parse(savedSubscription);
          // Only set subscription if it's valid and not expired
          if (sub.tier && sub.tier !== 'free' && sub.expiry) {
            const expiryDate = new Date(sub.expiry);
            if (expiryDate > new Date()) {
              setSubscriptionTier(sub.tier);
              setSubscriptionPeriod(sub.period);
              setSubscriptionExpiry(sub.expiry);
            } else {
              // Subscription expired, reset to free
            }
          }
        }
      } catch (error) {
        console.error('Error loading purchase data:', error);
      }
    };

    loadPurchaseData();
  }, [user?.uid]); // Only depend on user ID, not the entire user object

  // Listen for localStorage changes (e.g., from SuccessScreen or other components)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'subscription' && user) {
        console.log('Subscription data changed in localStorage, refreshing...');
        // Call refreshSubscriptionData directly to avoid dependency issues
        if (user) {
          try {
            const savedSubscription = localStorage.getItem('subscription');
            if (savedSubscription) {
              const sub = JSON.parse(savedSubscription);
              if (sub.tier && sub.expiry) {
                const expiryDate = new Date(sub.expiry);
                if (expiryDate > new Date()) {
                  setSubscriptionTier(sub.tier);
                  setSubscriptionPeriod(sub.period);
                  setSubscriptionExpiry(sub.expiry);
                } else {
                  setSubscriptionTier('free');
                  setSubscriptionPeriod('none');
                  setSubscriptionExpiry(undefined);
                }
              }
            }
          } catch (error) {
            console.error('Error refreshing subscription data:', error);
          }
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [user?.uid]); // Only depend on user ID

  // Save purchase data whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('ownedBundles', JSON.stringify(ownedBundles));
    }
  }, [ownedBundles, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('subscription', JSON.stringify({
        tier: subscriptionTier,
        period: subscriptionPeriod,
        expiry: subscriptionExpiry
      }));
    }
  }, [subscriptionTier, subscriptionPeriod, subscriptionExpiry, user]);

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentPurchase(null);
  };

  const refreshSubscriptionData = () => {
    // Force reload subscription data from localStorage
    if (!user) return;
    
    try {
      const savedBundles = localStorage.getItem('ownedBundles');
      const savedSubscription = localStorage.getItem('subscription');
      
      if (savedBundles) {
        setOwnedBundles(JSON.parse(savedBundles));
      }
      
      if (savedSubscription) {
        const sub = JSON.parse(savedSubscription);
        if (sub.tier && sub.expiry) {
          const expiryDate = new Date(sub.expiry);
          if (expiryDate > new Date()) {
            setSubscriptionTier(sub.tier);
            setSubscriptionPeriod(sub.period);
            setSubscriptionExpiry(sub.expiry);
          } else {
            // Subscription expired, reset to free
            setSubscriptionTier('free');
            setSubscriptionPeriod('none');
            setSubscriptionExpiry(undefined);
          }
        }
      }
      
      console.log('Subscription data refreshed');
    } catch (error) {
      console.error('Error refreshing subscription data:', error);
    }
  };

  const handlePaymentSuccess = () => {
    if (!currentPurchase) return;
    
    const now = new Date();
    
    if (currentPurchase.type === 'bundle') {
      if (currentPurchase.id === 'all_bundles') {
        // Special handling for all bundles purchase - add all individual bundles
        const allBundleIds = ['easy', 'medium', 'hard', 'egypt', 'rome', 'greece'];
        setOwnedBundles(prev => {
          const newBundles = [...prev];
          allBundleIds.forEach(bundleId => {
            if (!newBundles.includes(bundleId)) {
              newBundles.push(bundleId);
            }
          });
          // Also add the all_bundles identifier
          if (!newBundles.includes('all_bundles')) {
            newBundles.push('all_bundles');
          }
          return newBundles;
        });
        
        // Save to localStorage
        const existingBundles = [...ownedBundles];
        allBundleIds.forEach(bundleId => {
          if (!existingBundles.includes(bundleId)) {
            existingBundles.push(bundleId);
          }
        });
        if (!existingBundles.includes('all_bundles')) {
          existingBundles.push('all_bundles');
        }
        localStorage.setItem('ownedBundles', JSON.stringify(existingBundles));
        
        // Add to purchase history
        const purchaseRecord = {
          id: `bundle_all_bundles_${now.getTime()}`,
          date: now.toISOString(),
          type: 'bundle',
          description: getBundleName('all_bundles'),
          amount: getBundlePrice('all_bundles'),
          method: 'Stripe Payment',
          bundleId: 'all_bundles'
        };
        
        savePurchaseToHistory(purchaseRecord);
        
        console.log('Successfully purchased All Bundle Packs');
      } else {
        // Regular single bundle purchase
        setOwnedBundles(prev => [...prev, currentPurchase.id]);
        
        // Save to localStorage
        const updatedBundles = [...ownedBundles, currentPurchase.id];
        localStorage.setItem('ownedBundles', JSON.stringify(updatedBundles));
        
        // Add to purchase history
        const purchaseRecord = {
          id: `bundle_${currentPurchase.id}_${now.getTime()}`,
          date: now.toISOString(),
          type: 'bundle',
          description: getBundleName(currentPurchase.id),
          amount: getBundlePrice(currentPurchase.id),
          method: 'Stripe Payment',
          bundleId: currentPurchase.id
        };
        
        savePurchaseToHistory(purchaseRecord);
        
        console.log(`Successfully purchased ${getBundleName(currentPurchase.id)} bundle`);
      }
    } else {
      // Handle subscription success
      const period = currentPurchase.id;
      let expiryDate: Date;
      
      switch (period) {
        case 'monthly':
          expiryDate = new Date(now.setMonth(now.getMonth() + 1));
          break;
        case 'annual':
          expiryDate = new Date(now.setFullYear(now.getFullYear() + 1));
          break;
        case 'biennial':
          expiryDate = new Date(now.setFullYear(now.getFullYear() + 2));
          break;
        default:
          expiryDate = now;
      }
      
      setSubscriptionTier('pro');
      setSubscriptionPeriod(period as any);
      setSubscriptionExpiry(expiryDate.toISOString());
      
      // Add to purchase history
      const subscriptionRecord = {
        id: `sub_${period}_${now.getTime()}`,
        date: now.toISOString(),
        type: 'subscription',
        description: `Pro ${period.charAt(0).toUpperCase() + period.slice(1)} Subscription`,
        amount: getSubscriptionPrice(period),
        method: 'Stripe Payment',
        subscriptionPeriod: period
      };
      
      savePurchaseToHistory(subscriptionRecord);
      
      console.log(`Successfully subscribed to ${period} plan`);
    }
    
    // Close the payment modal
    closePaymentModal();
  };

  const savePurchaseToHistory = (purchaseRecord: any) => {
    try {
      // Get existing purchase history
      const existingHistoryStr = localStorage.getItem('purchaseHistory');
      const existingHistory = existingHistoryStr ? JSON.parse(existingHistoryStr) : [];
      
      // Add new purchase to history
      const updatedHistory = [purchaseRecord, ...existingHistory];
      
      // Save back to localStorage
      localStorage.setItem('purchaseHistory', JSON.stringify(updatedHistory));
      
      console.log('Purchase saved to history:', purchaseRecord);
    } catch (error) {
      console.error('Error saving purchase to history:', error);
    }
  };

  const purchaseBundle = async (bundleId: string): Promise<boolean> => {
    if (!user) {
      console.error('User must be logged in to make purchases');
      throw new Error('Authentication required for purchase');
    }
    
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, use RevenueCat
        return await purchaseBundleWithRevenueCat(bundleId);
      } else {
        // For web/PWA, use secure Firebase Functions + Stripe Checkout
        console.log('Creating secure checkout session for bundle:', bundleId);
        
        try {
          const priceId = getPriceId(bundleId);
          const currentUrl = window.location.origin;
          
          await createAndRedirectToCheckout({
            priceId,
            planType: bundleId,
            successUrl: `${currentUrl}/store?purchase=success&type=bundle&id=${bundleId}`,
            cancelUrl: `${currentUrl}/store?purchase=cancelled`
          });
          
          // This won't execute because we redirect, but for type safety
          setIsProcessing(false);
          return true;
        } catch (error) {
          console.error('Failed to create checkout session:', error);
          setIsProcessing(false);
          throw new Error('Failed to initiate secure checkout');
        }
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      setIsProcessing(false);
      throw error; // Re-throw to let the calling component handle the error
    }
  };

  const purchaseGroup = async (bundleIds: string[]): Promise<boolean> => {
    if (!user) {
      console.error('User must be logged in to make purchases');
      return false;
    }
    
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, we'll process them one by one using RevenueCat
        let allSuccessful = true;
        
        for (const bundleId of bundleIds) {
          const success = await purchaseBundleWithRevenueCat(bundleId);
          if (!success) {
            allSuccessful = false;
          }
        }
        
        return allSuccessful;
      } else {
        // For web/PWA, use the "all_bundles" product for group purchases
        console.log('Creating secure checkout session for all bundles group purchase');
        
        try {
          const priceId = getPriceId('all_bundles');
          const currentUrl = window.location.origin;
          
          await createAndRedirectToCheckout({
            priceId,
            planType: 'all_bundles',
            successUrl: `${currentUrl}/store?purchase=success&type=bundle&id=all_bundles`,
            cancelUrl: `${currentUrl}/store?purchase=cancelled`
          });
          
          // This won't execute because we redirect, but for type safety
          setIsProcessing(false);
          return true;
        } catch (error) {
          console.error('Failed to create checkout session for group purchase:', error);
          setIsProcessing(false);
          throw new Error('Failed to initiate secure checkout');
        }
      }
    } catch (error) {
      console.error('Group purchase failed:', error);
      setIsProcessing(false);
      throw error; // Re-throw to let the calling component handle the error
    }
  };

  const subscribe = async (tier: string, period: string): Promise<boolean> => {
    if (!user) {
      console.error('User must be logged in to subscribe');
      throw new Error('Authentication required for subscription');
    }
    
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, use RevenueCat
        return await subscribeWithRevenueCat(tier, period);
      } else {
        // For web/PWA, use secure Firebase Functions + Stripe Checkout
        console.log('Creating secure checkout session for subscription:', period);
        
        try {
          const priceId = getPriceId(period);
          const currentUrl = window.location.origin;
          
          await createAndRedirectToCheckout({
            priceId,
            planType: period,
            successUrl: `${currentUrl}/store?purchase=success&type=subscription&id=${period}`,
            cancelUrl: `${currentUrl}/store?purchase=cancelled`
          });
          
          // This won't execute because we redirect, but for type safety
          setIsProcessing(false);
          return true;
        } catch (error) {
          console.error('Failed to create checkout session:', error);
          setIsProcessing(false);
          throw new Error('Failed to initiate secure checkout');
        }
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setIsProcessing(false);
      throw error; // Re-throw to let the calling component handle the error
    }
  };

  const restorePurchases = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, use RevenueCat
        await restorePurchasesWithRevenueCat();
      } else {
        // For web/PWA, we would need to implement a server-side solution
        // to restore purchases based on the user's account
        console.log('Restoring web purchases for user:', user?.uid);
        
        // Simulate restore process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real implementation, this would fetch the user's purchases from the server
        // and update the local state accordingly
      }
    } catch (error) {
      console.error('Restore purchases failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAccessToBundle = (bundleId: string): boolean => {
    // User must be authenticated to have access to any premium content
    if (!user) {
      return false;
    }
    
    // Check if user has an active trial (gives access to all bundles)
    if (StripeTrialService.isInTrial()) {
      return true;
    }
    
    // Pro users have access to all bundles
    if (subscriptionTier === 'pro' && subscriptionExpiry) {
      const expiry = new Date(subscriptionExpiry);
      if (expiry > new Date()) {
        return true;
      }
    }
    
    // Check if user owns the All Bundle Pack (gives access to all individual bundles)
    if (ownedBundles.includes('all_bundle_packs')) {
      return true;
    }
    
    // Check if bundle is individually owned
    return ownedBundles.includes(bundleId);
  };

  // Calculate loyalty discount for subscription based on previous purchases
  const calculateLoyaltyDiscount = (): { discount: number; message: string } => {
    if (!user) return { discount: 0, message: '' };
    
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    const bundlePurchases = purchaseHistory.filter((p: any) => p.type === 'bundle');
    const totalSpent = bundlePurchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
    
    if (totalSpent >= 50) {
      return { discount: 0.25, message: 'Loyal Customer: 25% off subscription!' };
    } else if (totalSpent >= 30) {
      return { discount: 0.20, message: 'Valued Customer: 20% off subscription!' };
    } else if (totalSpent >= 15) {
      return { discount: 0.15, message: 'Thank You: 15% off subscription!' };
    } else if (totalSpent >= 5) {
      return { discount: 0.10, message: 'Welcome Back: 10% off subscription!' };
    }
    
    return { discount: 0, message: '' };
  };

  // Get discounted subscription price
  const getDiscountedSubscriptionPrice = (originalPrice: number): { price: number; discount: number; message: string } => {
    const loyalty = calculateLoyaltyDiscount();
    const discountedPrice = originalPrice * (1 - loyalty.discount);
    return {
      price: discountedPrice,
      discount: loyalty.discount,
      message: loyalty.message
    };
  };

  const isPremiumUser = (() => {
    // User must be authenticated to be premium
    if (!user) {
      return false;
    }
    
    // Check if user has an active trial
    if (StripeTrialService.isInTrial()) {
      return true;
    }
    
    // Check if user has active subscription
    return subscriptionTier === 'pro' && subscriptionExpiry ? 
      new Date(subscriptionExpiry) > new Date() : false;
  })();

  const value: PurchaseContextType = {
    ownedBundles,
    subscriptionTier,
    subscriptionPeriod,
    subscriptionExpiry,
    isProcessing,
    showPaymentModal,
    currentPurchase,
    purchaseBundle,
    purchaseGroup,
    subscribe,
    restorePurchases,
    hasAccessToBundle,
    isPremiumUser,
    closePaymentModal,
    handlePaymentSuccess,
    refreshSubscriptionData,
    calculateLoyaltyDiscount,
    getDiscountedSubscriptionPrice
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

// Hook to use purchase context
const usePurchase = (): PurchaseContextType => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};

export { usePurchase };
