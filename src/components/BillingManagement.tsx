import React, { useState } from 'react';
import { 
  XMarkIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  ArrowRightIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../context/PurchaseContext';
import { StripeTrialService } from '../services/StripeTrialService';

interface BillingManagementProps {
  isOpen: boolean;
  onClose: () => void;
}

const BillingManagement: React.FC<BillingManagementProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { isPremiumUser, subscriptionTier, subscriptionPeriod, subscriptionExpiry } = usePurchase();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cancellationReason, setCancellationReason] = useState('');

  if (!isOpen || !user || !isPremiumUser) return null;

  const isInTrial = StripeStripeTrialService.isInTrial();
  const trialStatus = StripeStripeTrialService.getTrialStatus();

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

  const getNextBillingDate = () => {
    if (isInTrial && trialStatus) {
      return new Date(trialStatus.endDate).toLocaleDateString();
    }
    
    if (subscriptionExpiry) {
      return new Date(subscriptionExpiry).toLocaleDateString();
    }
    
    return 'N/A';
  };

  const handleCancelTrial = async () => {
    setIsProcessing(true);
    try {
      // Cancel trial immediately
      StripeStripeTrialService.endTrial(user.uid);
      
      // Clear subscription data
      localStorage.removeItem('subscription');
      localStorage.removeItem('trial_status');
      
      // Use navigation instead of reload to prevent refresh loops
      // window.location.reload(); // REMOVED - causes refresh loops
      
      // Trigger a state update to reflect the cancellation
      // The parent component should handle re-rendering based on auth/purchase context
    } catch (error) {
      console.error('Error cancelling trial:', error);
    }
    setIsProcessing(false);
  };

  const handleCancelSubscription = async () => {
    setIsProcessing(true);
    try {
      // Here you would call your backend to cancel the subscription
      // For now, we'll simulate the cancellation
      const cancellationData = {
        userId: user.uid,
        subscriptionId: subscriptionTier,
        reason: cancellationReason,
        cancelledAt: new Date().toISOString()
      };

      // Store cancellation in localStorage (in real app, this would be server-side)
      localStorage.setItem('cancellation_pending', JSON.stringify(cancellationData));
      
      console.log('Subscription cancellation requested:', cancellationData);
      
      // In a real app, you would make an API call here:
      // await fetch('/api/cancel-subscription', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(cancellationData)
      // });

      alert('Your subscription has been cancelled. You will retain access until the end of your current billing period.');
      onClose();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('There was an error cancelling your subscription. Please try again or contact support.');
    }
    setIsProcessing(false);
  };

  const cancellationReasons = [
    'Too expensive',
    'Not using the app enough',
    'Missing features I need',
    'Found a better alternative',
    'Technical issues',
    'No longer interested in the topic',
    'Other'
  ];

  if (showCancelConfirm) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-500" />
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {isInTrial ? 'Cancel Trial' : 'Cancel Subscription'}
              </h2>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isInTrial 
                  ? 'Are you sure you want to cancel your 3-day trial? You will lose access immediately.'
                  : 'Are you sure you want to cancel your subscription? You will retain access until the end of your current billing period.'
                }
              </p>

              {!isInTrial && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Help us improve - Why are you cancelling? (Optional)
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a reason...</option>
                    {cancellationReasons.map((reason) => (
                      <option key={reason} value={reason}>{reason}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Before you go...
                </h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                  <li>• Access to all premium question bundles</li>
                  <li>• Detailed progress analytics</li>
                  <li>• Offline study mode</li>
                  <li>• Daily challenges and achievements</li>
                  <li>• Priority support</li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Keep {isInTrial ? 'Trial' : 'Subscription'}
              </button>
              <button
                onClick={isInTrial ? handleCancelTrial : handleCancelSubscription}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isProcessing ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Billing Management
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XMarkIcon className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Current Plan Status */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
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
                  <h3 className="text-xl font-bold">
                    {isInTrial ? 'Active Trial' : 'Active Subscription'}
                  </h3>
                  <p className="opacity-90">
                    Current plan: <strong>{getSubscriptionDisplayName()}</strong>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm opacity-90">
                  {isInTrial ? 'Converts to Pro Monthly' : 'Next billing date'}
                </div>
                <div className="font-semibold">
                  {getNextBillingDate()}
                </div>
              </div>
            </div>
          </div>

          {/* Billing Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CreditCardIcon className="w-6 h-6 text-blue-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Payment Method</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {isInTrial ? 'No payment method required during trial' : '•••• •••• •••• 1234'}
              </p>
              {!isInTrial && (
                <button className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
                  Update payment method
                </button>
              )}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <CalendarDaysIcon className="w-6 h-6 text-purple-500" />
                <h4 className="font-semibold text-gray-900 dark:text-white">Billing Frequency</h4>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                {isInTrial ? 'Will convert to monthly billing' : `Billed ${subscriptionPeriod}`}
              </p>
              {!isInTrial && (
                <button className="text-blue-600 dark:text-blue-400 text-sm mt-2 hover:underline">
                  Change billing frequency
                </button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {!isInTrial && (
                <>
                  <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-gray-900 dark:text-white">Change Plan</span>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <span className="text-gray-900 dark:text-white">Download Invoice</span>
                    <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                  </button>
                </>
              )}
              <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-900 dark:text-white">Contact Support</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </button>
              <button className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <span className="text-gray-900 dark:text-white">Usage Statistics</span>
                <ArrowRightIcon className="w-4 h-4 text-gray-400" />
              </button>
            </div>
          </div>

          {/* Cancel Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                {isInTrial ? 'Cancel Trial' : 'Cancel Subscription'}
              </h4>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                {isInTrial 
                  ? 'You can cancel your trial at any time. Access will end immediately.'
                  : 'You can cancel your subscription at any time. You\'ll retain access until the end of your current billing period.'
                }
              </p>
              <button
                onClick={() => setShowCancelConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm font-medium"
              >
                {isInTrial ? 'Cancel Trial' : 'Cancel Subscription'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingManagement;
