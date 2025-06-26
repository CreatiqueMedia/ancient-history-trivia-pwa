import React, { createContext, useContext, useState, useEffect } from 'react';

interface PurchaseContextType {
  ownedBundles: string[];
  subscriptionTier: 'free' | 'pro';
  subscriptionPeriod: 'none' | 'monthly' | 'annual' | 'biennial';
  subscriptionExpiry?: string;
  isProcessing: boolean;
  purchaseBundle: (bundleId: string) => Promise<boolean>;
  purchaseGroup: (bundleIds: string[]) => Promise<boolean>;
  subscribe: (tier: string, period: string) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  hasAccessToBundle: (bundleId: string) => boolean;
  isPremiumUser: boolean;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ownedBundles, setOwnedBundles] = useState<string[]>([]);
  const [subscriptionTier, setSubscriptionTier] = useState<'free' | 'pro'>('free');
  const [subscriptionPeriod, setSubscriptionPeriod] = useState<'none' | 'monthly' | 'annual' | 'biennial'>('none');
  const [subscriptionExpiry, setSubscriptionExpiry] = useState<string>();
  const [isProcessing, setIsProcessing] = useState(false);

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

  const purchaseBundle = async (bundleId: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Simulate purchase process - in a real app this would integrate with Stripe
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add bundle to owned bundles
      setOwnedBundles(prev => [...prev, bundleId]);
      
      return true;
    } catch (error) {
      console.error('Purchase failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const purchaseGroup = async (bundleIds: string[]): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Simulate group purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add all bundles to owned bundles
      setOwnedBundles(prev => [...prev, ...bundleIds]);
      
      return true;
    } catch (error) {
      console.error('Group purchase failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const subscribe = async (tier: string, period: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      // Simulate subscription purchase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const now = new Date();
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
      
      setSubscriptionTier(tier as 'free' | 'pro');
      setSubscriptionPeriod(period as any);
      setSubscriptionExpiry(expiryDate.toISOString());
      
      return true;
    } catch (error) {
      console.error('Subscription failed:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const restorePurchases = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      // Simulate restore purchases
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would contact the payment provider to restore purchases
      // Purchases restored successfully
    } catch (error) {
      console.error('Restore purchases failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAccessToBundle = (bundleId: string): boolean => {
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

  const isPremiumUser = subscriptionTier === 'pro' && subscriptionExpiry ? 
    new Date(subscriptionExpiry) > new Date() : false;

  const value: PurchaseContextType = {
    ownedBundles,
    subscriptionTier,
    subscriptionPeriod,
    subscriptionExpiry,
    isProcessing,
    purchaseBundle,
    purchaseGroup,
    subscribe,
    restorePurchases,
    hasAccessToBundle,
    isPremiumUser
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
