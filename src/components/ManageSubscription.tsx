import React from 'react';
import { Link } from 'react-router-dom';
import { 
  CogIcon, 
  ArrowRightIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { TrialService } from '../services/TrialService';

interface ManageSubscriptionProps {
  variant?: 'compact' | 'full';
  className?: string;
}

const ManageSubscription: React.FC<ManageSubscriptionProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  const { user } = useAuth();
  const { isPremiumUser, subscriptionTier, subscriptionPeriod, subscriptionExpiry } = usePurchase();

  // Don't show if user is not authenticated
  if (!user) {
    return null;
  }

  // Only show if user has premium access (trial or subscription)
  if (!isPremiumUser) {
    return null;
  }

  const isInTrial = TrialService.isInTrial();
  const trialStatus = TrialService.getTrialStatus();
  
  const getSubscriptionDisplayName = () => {
    if (isInTrial) {
      return `3-Day Trial (${trialStatus?.daysRemaining || 0} days left)`;
    }
    
    switch (subscriptionPeriod) {
      case 'monthly':
        return 'Pro Monthly';
      case 'annual':
        return 'Pro Annual';
      case 'biennial':
        return 'Pro Biennial';
      default:
        return 'Premium Plan';
    }
  };

  const getExpiryInfo = () => {
    if (isInTrial && trialStatus) {
      return `Converts to Pro Monthly on ${new Date(trialStatus.endDate).toLocaleDateString()}`;
    }
    
    if (subscriptionExpiry) {
      return `Renews on ${new Date(subscriptionExpiry).toLocaleDateString()}`;
    }
    
    return '';
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircleIcon className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-sm">{getSubscriptionDisplayName()}</h3>
              <p className="text-xs opacity-90">Manage your subscription</p>
            </div>
          </div>
          <Link
            to="/store?tab=subscription"
            className="bg-white text-green-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1"
          >
            <span>Manage</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-3">
            {isInTrial ? (
              <ClockIcon className="w-8 h-8" />
            ) : (
              <CheckCircleIcon className="w-8 h-8" />
            )}
          </div>
          <div>
            <h3 className="text-xl font-bold mb-1">
              {isInTrial ? 'Active Trial' : 'Active Subscription'}
            </h3>
            <p className="text-white mb-2">
              You're currently on: <strong>{getSubscriptionDisplayName()}</strong>
            </p>
            {getExpiryInfo() && (
              <div className="flex items-center space-x-2 text-sm">
                <ClockIcon className="w-4 h-4" />
                <span>{getExpiryInfo()}</span>
              </div>
            )}
          </div>
        </div>
        <Link
          to="/store?tab=subscription"
          className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors shadow-md flex items-center space-x-2"
        >
          <CogIcon className="w-5 h-5" />
          <span>Manage Subscription</span>
        </Link>
      </div>
    </div>
  );
};

export default ManageSubscription;
