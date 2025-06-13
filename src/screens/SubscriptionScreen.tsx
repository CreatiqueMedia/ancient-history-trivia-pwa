import React, { useState } from 'react';
import { CheckIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/MockAuthContext';
import { SUBSCRIPTION_PLANS, YEARLY_PLANS } from '../data/pricing';
import { analyticsService } from '../services/AnalyticsService';
import { errorHandler } from '../services/ErrorHandlingService';
import type { SubscriptionPlan } from '../types';

const SubscriptionScreen: React.FC = () => {
  const { userProfile, isSubscribed, updateUserProfile } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const currentPlans = billingPeriod === 'monthly' ? SUBSCRIPTION_PLANS : [...SUBSCRIPTION_PLANS.slice(0, 1), ...YEARLY_PLANS, SUBSCRIPTION_PLANS[3]];

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!userProfile) return;

    setIsLoading(true);
    
    try {
      // Track subscription attempt
      analyticsService.trackFunnelStep(`subscription_attempt_${plan.id}`);
      
      // In a real app, you would integrate with payment processor here
      // For demo purposes, we'll simulate the subscription
      
      if (plan.id === 'free') {
        await updateUserProfile({ subscription: 'free' });
        analyticsService.trackFunnelStep('subscription_downgrade_success');
      } else {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Update user subscription
        const currentTier = userProfile.subscription;
        await updateUserProfile({ subscription: plan.id });
        
        // Track successful subscription
        if (currentTier === 'free') {
          analyticsService.trackSubscriptionStart(plan.id, plan.trialDays);
        } else {
          analyticsService.trackSubscriptionUpgrade(currentTier, plan.id);
        }
        
        analyticsService.setUserProperties({
          subscription_tier: plan.id,
          last_activity: new Date().toISOString()
        });
        
        analyticsService.trackFunnelStep(`subscription_success_${plan.id}`);
        
        alert(`Successfully subscribed to ${plan.name}!`);
      }
    } catch (error: any) {
      console.error('Subscription error:', error);
      
      const friendlyError = errorHandler.handleSubscriptionError(error, `subscribe-${plan.id}`);
      analyticsService.trackError(error.message, `subscription-${plan.id}`);
      analyticsService.trackFunnelStep(`subscription_error_${plan.id}`, false);
      
      alert(friendlyError.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free':
        return '🌟';
      case 'scholar':
        return '📚';
      case 'historian':
        return '🏛️';
      case 'academy':
        return '👑';
      default:
        return '📖';
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free':
        return 'from-gray-400 to-gray-600';
      case 'scholar':
        return 'from-blue-400 to-blue-600';
      case 'historian':
        return 'from-purple-400 to-purple-600';
      case 'academy':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Learning Journey
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              Unlock the full potential of ancient history exploration
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center mb-8">
              <span className={`mr-3 ${billingPeriod === 'monthly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Monthly
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  billingPeriod === 'yearly' ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`ml-3 ${billingPeriod === 'yearly' ? 'text-gray-900 dark:text-white font-semibold' : 'text-gray-500'}`}>
                Yearly
              </span>
              {billingPeriod === 'yearly' && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                  Save up to 33%
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentPlans.map((plan) => {
            const isCurrentPlan = userProfile?.subscription === plan.id;
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl shadow-lg transition-transform hover:scale-105 ${
                  isPopular 
                    ? 'ring-2 ring-primary-500 shadow-primary-500/25' 
                    : 'ring-1 ring-gray-200 dark:ring-gray-700'
                } ${
                  isCurrentPlan 
                    ? 'bg-primary-50 dark:bg-primary-900/20' 
                    : 'bg-white dark:bg-gray-800'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center">
                      <StarIcon className="w-4 h-4 mr-1" />
                      Most Popular
                    </div>
                  </div>
                )}

                {isCurrentPlan && (
                  <div className="absolute -top-4 right-4">
                    <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${getPlanColor(plan.id)} flex items-center justify-center text-2xl`}>
                      {getPlanIcon(plan.id)}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900 dark:text-white">
                        ${plan.price}
                      </span>
                      {plan.period !== 'lifetime' && (
                        <span className="text-gray-500 dark:text-gray-400">
                          /{plan.period === 'monthly' ? 'mo' : 'yr'}
                        </span>
                      )}
                    </div>
                    {plan.savings && (
                      <div className="mt-2 text-green-600 dark:text-green-400 font-medium">
                        {plan.savings}
                      </div>
                    )}
                    {plan.trialDays && (
                      <div className="mt-2 text-primary-600 dark:text-primary-400 text-sm">
                        {plan.trialDays}-day free trial
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleSubscribe(plan)}
                    disabled={isLoading || isCurrentPlan}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : isPopular
                        ? 'bg-primary-600 hover:bg-primary-700 text-white'
                        : 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Processing...
                      </div>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : plan.id === 'free' ? (
                      'Downgrade to Free'
                    ) : (
                      `Get ${plan.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Can I cancel anytime?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes, you can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  What happens to my data if I cancel?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your progress and achievements are saved forever. You'll just lose access to premium features like unlimited questions and advanced statistics.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer student discounts?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Yes! We offer 50% discounts for verified students and educators. Contact support with your student ID or teaching credentials.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Is there a money-back guarantee?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Absolutely! We offer a 30-day money-back guarantee. If you're not satisfied, we'll refund your payment in full.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionScreen;
