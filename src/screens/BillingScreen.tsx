import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  CreditCardIcon,
  CalendarDaysIcon,
  DocumentTextIcon,
  LifebuoyIcon,
  ChartBarIcon
} from '@heroicons/react/24/solid';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../context/PurchaseContext';
import { StripeTrialService } from '../services/StripeTrialService';
import BillingManagement from '../components/BillingManagement';

const BillingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isPremiumUser, subscriptionTier, subscriptionPeriod, subscriptionExpiry, refreshSubscriptionData } = usePurchase();
  const [showBillingModal, setShowBillingModal] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    navigate('/');
    return null;
  }

  const isInTrial = StripeTrialService.isInTrial();
  const trialStatus = StripeTrialService.getTrialStatus();

  // Refresh subscription data when component mounts - ONCE
  useEffect(() => {
    if (user) {
      console.log('BillingScreen mounted, refreshing subscription data...');
      refreshSubscriptionData();
    }
  }, []); // Remove dependencies to prevent infinite loops

  const getSubscriptionDisplayName = () => {
    if (isInTrial) {
      return `3-Day Trial (${trialStatus?.daysRemaining || 0} days left)`;
    }
    
    if (subscriptionTier === 'free') {
      return 'Free Plan';
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
    
    if (subscriptionTier === 'free') {
      return 'No billing - Free plan';
    }
    
    if (subscriptionExpiry) {
      return new Date(subscriptionExpiry).toLocaleDateString();
    }
    
    return 'N/A';
  };

  const billingActions = (() => {
    // Common actions for all users
    const commonActions = [
      {
        icon: ChartBarIcon,
        title: 'Usage Statistics',
        description: 'View your learning progress and app usage analytics',
        action: () => navigate('/stats'),
        color: 'purple'
      },
      {
        icon: LifebuoyIcon,
        title: 'Contact Support',
        description: 'Get help with account questions or technical issues',
        action: () => window.open('mailto:support@ancienthistorytrivia.com?subject=Account Support', '_blank'),
        color: 'orange'
      }
    ];

    // Premium-specific actions
    if (isPremiumUser) {
      return [
        {
          icon: CreditCardIcon,
          title: 'Manage Billing',
          description: 'Update payment methods, view invoices, and cancel subscription',
          action: () => setShowBillingModal(true),
          color: 'blue'
        },
        {
          icon: DocumentTextIcon,
          title: 'Download Invoices',
          description: 'Get receipts for your subscription payments',
          action: () => window.open('mailto:billing@ancienthistorytrivia.com?subject=Invoice Request&body=Please provide my subscription invoices.', '_blank'),
          color: 'green'
        },
        ...commonActions
      ];
    }

    // Free user actions
    return [
      {
        icon: CreditCardIcon,
        title: 'Upgrade to Pro',
        description: 'Unlock premium features and unlimited access',
        action: () => navigate('/store'),
        color: 'blue'
      },
      ...commonActions
    ];
  })();

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue':
        return 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700';
      case 'green':
        return 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700';
      case 'purple':
        return 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700';
      case 'orange':
        return 'from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700';
      default:
        return 'from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => navigate('/store?tab=subscription')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6 text-gray-500" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Billing & Account Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your subscription, payments, and account settings
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Current Plan Overview */}
        <div className={`rounded-xl p-6 text-white mb-8 ${
          subscriptionTier === 'free' 
            ? 'bg-gradient-to-r from-gray-500 to-gray-600' 
            : 'bg-gradient-to-r from-green-500 to-emerald-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-full p-3">
                {isInTrial ? (
                  <ClockIcon className="w-8 h-8" />
                ) : subscriptionTier === 'free' ? (
                  <CreditCardIcon className="w-8 h-8" />
                ) : (
                  <CheckCircleIcon className="w-8 h-8" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">
                  {isInTrial ? 'Active Trial' : 
                   subscriptionTier === 'free' ? 'Free Account' : 'Active Subscription'}
                </h2>
                <p className="opacity-90 mb-2">
                  Current plan: <strong>{getSubscriptionDisplayName()}</strong>
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>
                    {isInTrial 
                      ? `Converts to Pro Monthly on ${getNextBillingDate()}`
                      : subscriptionTier === 'free'
                      ? 'Upgrade anytime to unlock premium features'
                      : `Next billing date: ${getNextBillingDate()}`
                    }
                  </span>
                </div>
              </div>
            </div>
            {subscriptionTier === 'free' && (
              <button
                onClick={() => navigate('/store')}
                className="bg-white/20 hover:bg-white/30 transition-colors px-4 py-2 rounded-lg font-medium"
              >
                Upgrade Now
              </button>
            )}
          </div>
        </div>

        {/* Trial Warning */}
        {isInTrial && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
            <div className="flex items-start space-x-3">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  Trial Auto-Conversion Notice
                </h3>
                <p className="text-yellow-700 dark:text-yellow-300 text-sm mb-4">
                  Your trial will automatically convert to Pro Monthly ($4.99/month) when it expires in {trialStatus?.daysRemaining || 0} days. 
                  You can cancel anytime before then to avoid being charged.
                </p>
                <button
                  onClick={() => setShowBillingModal(true)}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors text-sm font-medium"
                >
                  Cancel Trial Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {billingActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`bg-gradient-to-r ${getColorClasses(action.color)} text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg`}
            >
              <div className="flex items-start space-x-4">
                <div className="bg-white/20 rounded-full p-3">
                  <action.icon className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                  <p className="text-sm opacity-90">{action.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Account Status</h4>
            <p className="text-2xl font-bold text-green-600">Active</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isInTrial ? 'Trial period' : 
               subscriptionTier === 'free' ? 'Free account' : 'Paid subscription'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Method</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {isInTrial ? 'None' : 
               subscriptionTier === 'free' ? 'None' : '••••1234'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isInTrial ? 'No payment required' : 
               subscriptionTier === 'free' ? 'Free plan' : 'Credit card'}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Member Since</h4>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Registration date</p>
          </div>
        </div>

        {/* Support Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Billing Questions</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Questions about charges, refunds, or payment methods? Our billing team is here to help.
              </p>
              <button 
                onClick={() => window.open('mailto:billing@ancienthistorytrivia.com?subject=Billing Support Request', '_blank')}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Contact Billing Support →
              </button>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Technical Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                Having trouble with the app or features? Get technical assistance from our team.
              </p>
              <button 
                onClick={() => window.open('mailto:support@ancienthistorytrivia.com?subject=Technical Support Request', '_blank')}
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
              >
                Get Technical Help →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Management Modal - Only for premium users */}
      {isPremiumUser && (
        <BillingManagement 
          isOpen={showBillingModal} 
          onClose={() => setShowBillingModal(false)} 
        />
      )}
    </div>
  );
};

export default BillingScreen;
