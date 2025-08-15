import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../context/PurchaseContext';
import { StripeTrialService } from '../services/StripeTrialService';

interface TrialBannerProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const TrialBanner: React.FC<TrialBannerProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  const { user } = useAuth();
  const { isPremiumUser, subscriptionTier } = usePurchase();

  // Memoize expensive trial checks to prevent recalculation on every render
  const trialStatus = useMemo(() => {
    if (!user) return { showForPublic: true, isInTrial: false, isEligible: true };
    
    return {
      showForPublic: false,
      isInTrial: StripeTrialService.isInTrial(),
      isEligible: StripeTrialService.isEligibleForTrial(user.uid)
    };
  }, [user?.uid]);

  // Memoize the subscription URL to redirect to membership selection
  const subscriptionUrl = useMemo(() => '/store?tab=subscription', []);

  // Show for unauthenticated users (public view)
  if (!user) {
    // Show trial banner for public users
  } else {
    // For authenticated users, only show if they are on FREE plan
    // Don't show if user is already in trial
    if (trialStatus.isInTrial) {
      return null;
    }

    // Don't show if user has any premium subscription (not free)
    if (isPremiumUser) {
      return null;
    }

    // Don't show if user is not eligible for trial
    if (!trialStatus.isEligible) {
      return null;
    }
  }

  const handleSubscriptionClick = (e: React.MouseEvent) => {
    // Check if we're already on the store page
    if (window.location.pathname === '/store') {
      e.preventDefault();
      
      // Set the tab to subscription to show membership selection
      const tabEvent = new CustomEvent('setStoreTab', { 
        detail: 'subscription' 
      });
      window.dispatchEvent(tabEvent);
      
      // If user is not authenticated, show auth modal
      if (!user) {
        localStorage.setItem('pendingPurchase', JSON.stringify({
          type: 'subscription',
          action: 'choose_membership'
        }));
        
        const event = new CustomEvent('showAuthModal', { 
          detail: { context: 'subscription' } 
        });
        window.dispatchEvent(event);
      }
    }
    // If not on store page, let React Router handle navigation normally
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-emerald-600 to-teal-700 rounded-lg p-4 text-white shadow-md ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-6 h-6 text-yellow-300" />
            <div>
              <h3 className="font-bold text-sm text-white">Choose Premium Plan</h3>
              <p className="text-xs text-emerald-100">Get 3-day trial with credit card</p>
            </div>
          </div>
          <Link
            to={subscriptionUrl}
            onClick={handleSubscriptionClick}
            className="bg-white text-emerald-700 px-4 py-2 rounded-md text-sm font-bold hover:bg-emerald-50 transition-colors flex items-center space-x-1 shadow-sm"
          >
            <span>Premium Subscription</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-emerald-600 to-teal-700 rounded-xl p-6 text-white shadow-lg border border-emerald-500/20 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-emerald-500/30 rounded-full p-3 border border-emerald-400/30">
            <SparklesIcon className="w-8 h-8 text-yellow-300" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2 text-white">Choose Your Premium Plan</h3>
            <p className="text-emerald-100 mb-3 font-medium">
              Start with 3-day trial (credit card required) then continue with your chosen plan
            </p>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-yellow-300" />
              <span className="font-bold text-white">3 days free, then billing starts</span>
            </div>
          </div>
        </div>
        <Link
          to={subscriptionUrl}
          onClick={handleSubscriptionClick}
          className="bg-white text-emerald-700 px-6 py-3 rounded-lg font-bold hover:bg-emerald-50 transition-colors shadow-md flex items-center space-x-2 border border-emerald-200"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Premium Subscription</span>
        </Link>
      </div>
    </div>
  );
};

export default TrialBanner;
