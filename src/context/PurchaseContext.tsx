import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { TrialService } from '../services/TrialService';
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
import { redirectToStripeCheckout } from '../config/stripe';

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

  // Load saved purchase data on initialization
  useEffect(() => {
    const loadPurchaseData = async () => {
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
              console.log('Loaded valid subscription:', sub);
            } else {
              // Subscription expired, reset to free
              console.log('Subscription expired, reset to free');
            }
          }
        }
        
        console.log('Subscription state loaded:', {
          tier: subscriptionTier,
          period: subscriptionPeriod,
          expiry: subscriptionExpiry,
          isPremium: isPremiumUser
        });
      } catch (error) {
        console.error('Error loading purchase data:', error);
      }
    };

    loadPurchaseData();
  }, []);

  // Save purchase data whenever it changes
  useEffect(() => {
    localStorage.setItem('ownedBundles', JSON.stringify(ownedBundles));
  }, [ownedBundles]);

  useEffect(() => {
    localStorage.setItem('subscription', JSON.stringify({
      tier: subscriptionTier,
      period: subscriptionPeriod,
      expiry: subscriptionExpiry
    }));
  }, [subscriptionTier, subscriptionPeriod, subscriptionExpiry]);

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setCurrentPurchase(null);
  };

  const handlePaymentSuccess = () => {
    if (!currentPurchase) return;
    
    const now = new Date();
    
    if (currentPurchase.type === 'bundle') {
      // Add bundle to owned bundles
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
      return false;
    }
    
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, use RevenueCat
        return await purchaseBundleWithRevenueCat(bundleId);
      } else {
        // For web/PWA, redirect to Stripe Checkout
        console.log('Redirecting to Stripe checkout for bundle:', bundleId);
        
        // Store user ID for tracking
        localStorage.setItem('userId', user.uid);
        
        // Redirect to Stripe payment link
        redirectToStripeCheckout(bundleId);
        
        // Return false since we're redirecting (purchase will complete on return)
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      console.error('Purchase failed:', error);
      setIsProcessing(false);
      return false;
    }
  };

  const purchaseGroup = async (bundleIds: string[]): Promise<boolean> => {
    if (!user) {
      console.error('User must be logged in to make purchases');
      return false;
    }
    
    setIsProcessing(true);
    try {
      // For group purchases, we'll process them one by one
      let allSuccessful = true;
      
      for (const bundleId of bundleIds) {
        // Check if we should use app store purchases (iOS/Android)
        if (shouldUseAppStorePurchases()) {
          // For app store versions, use RevenueCat
          const success = await purchaseBundleWithRevenueCat(bundleId);
          if (!success) {
            allSuccessful = false;
          }
        } else {
          // For web/PWA, show payment modal for each bundle
          setCurrentPurchase({ type: 'bundle', id: bundleId });
          setShowPaymentModal(true);
          
          // Wait for the payment to complete (this is a simplified approach)
          // In a real implementation, you would need to handle this more robustly
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          // Check if the bundle was added to ownedBundles
          if (!ownedBundles.includes(bundleId)) {
            allSuccessful = false;
          }
        }
      }
      
      return allSuccessful;
    } catch (error) {
      console.error('Group purchase failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
      closePaymentModal();
    }
  };

  const subscribe = async (tier: string, period: string): Promise<boolean> => {
    if (!user) {
      console.error('User must be logged in to subscribe');
      return false;
    }
    
    setIsProcessing(true);
    try {
      // Check if we should use app store purchases (iOS/Android)
      if (shouldUseAppStorePurchases()) {
        // For app store versions, use RevenueCat
        return await subscribeWithRevenueCat(tier, period);
      } else {
        // For web/PWA, redirect to Stripe Checkout
        console.log('Redirecting to Stripe checkout for subscription:', period);
        
        // Store user ID for tracking
        localStorage.setItem('userId', user.uid);
        
        // Redirect to Stripe payment link for subscription
        redirectToStripeCheckout(period);
        
        // Return false since we're redirecting (subscription will complete on return)
        setIsProcessing(false);
        return false;
      }
    } catch (error) {
      console.error('Subscription failed:', error);
      setIsProcessing(false);
      return false;
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
    // Check if user has an active trial (gives access to all bundles)
    if (TrialService.isInTrial()) {
      return true;
    }
    
    // Pro users have access to all bundles
    if (subscriptionTier === 'pro' && subscriptionExpiry) {
      const expiry = new Date(subscriptionExpiry);
      if (expiry > new Date()) {
        return true;
      }
    }
    
    // Check if bundle is individually owned
    return ownedBundles.includes(bundleId);
  };

  const isPremiumUser = (() => {
    // Check if user has an active trial
    if (TrialService.isInTrial()) {
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
    handlePaymentSuccess
  };

  return (
    <PurchaseContext.Provider value={value}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = (): PurchaseContextType => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error('usePurchase must be used within a PurchaseProvider');
  }
  return context;
};
