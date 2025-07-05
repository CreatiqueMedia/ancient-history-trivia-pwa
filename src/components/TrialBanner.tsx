import React from 'react';
import { Link } from 'react-router-dom';
import { 
  SparklesIcon, 
  ClockIcon,
  ArrowRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import { usePurchase } from '../context/PurchaseContext';
import { TrialService } from '../services/TrialService';

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

  // Show for unauthenticated users (public view)
  if (!user) {
    // Show trial banner for public users
  } else {
    // For authenticated users, only show if they are on FREE plan
    // Don't show if user is already in trial
    if (TrialService.isInTrial()) {
      return null;
    }

    // Don't show if user has any premium subscription (not free)
    if (isPremiumUser) {
      return null;
    }

    // Don't show if user is not eligible for trial
    if (!TrialService.isEligibleForTrial(user.uid)) {
      return null;
    }
  }

  const trialUrl = `/store?action=start_trial&tab=subscription`;

  if (variant === 'compact') {
    return (
      <div className={`bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg p-4 text-white ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-6 h-6" />
            <div>
              <h3 className="font-semibold text-sm">Try 3-Day Free Trial</h3>
              <p className="text-xs opacity-90">Unlock all premium features</p>
            </div>
          </div>
          <Link
            to={trialUrl}
            className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-1"
          >
            <span>Start Trial</span>
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl p-6 text-white shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-3">
            <SparklesIcon className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Start Your 3-Day Free Trial</h3>
            <p className="text-white mb-3">
              Get unlimited access to all premium features and question bundles
            </p>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-green-400" />
              <span className="font-medium text-white">3 days free</span>
            </div>
          </div>
        </div>
        <Link
          to={trialUrl}
          className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-md flex items-center space-x-2"
        >
          <SparklesIcon className="w-5 h-5" />
          <span>Start Free Trial</span>
        </Link>
      </div>
    </div>
  );
};

export default TrialBanner;
