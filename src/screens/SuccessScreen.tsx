import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { trackSubscriptionEvent } from '../config/stripe';

export const SuccessScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  const plan = searchParams.get('plan') || 'monthly';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Grant premium access based on the plan
    if (plan === 'monthly' || plan === 'annual') {
      localStorage.setItem('isPremium', 'true');
      localStorage.setItem('subscriptionPlan', plan);
      localStorage.setItem('subscriptionDate', new Date().toISOString());
      
      // Track the successful subscription
      trackSubscriptionEvent(plan, 'completed');
    } else {
      // Handle individual bundle purchases
      const purchasedBundles = JSON.parse(localStorage.getItem('purchasedBundles') || '[]');
      if (!purchasedBundles.includes(plan)) {
        purchasedBundles.push(plan);
        localStorage.setItem('purchasedBundles', JSON.stringify(purchasedBundles));
      }
      
      // Track the bundle purchase
      trackSubscriptionEvent(plan, 'completed');
    }

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [plan, navigate, sessionId]);

  const handleGoHome = () => {
    navigate('/');
  };

  const getPlanDisplayName = (planName: string) => {
    switch (planName) {
      case 'monthly': return 'Pro Monthly Subscription';
      case 'annual': return 'Pro Annual Subscription';
      case 'egypt': return 'Ancient Egypt Bundle';
      case 'rome': return 'Roman Empire Bundle';
      case 'greece': return 'Ancient Greece Bundle';
      case 'mesopotamia': return 'Mesopotamia Bundle';
      case 'china': return 'Ancient China Bundle';
      default: return 'Premium Content';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          🎉 Payment Successful!
        </h1>
        
        <p className="text-lg text-gray-700 mb-2">
          Welcome to <span className="font-semibold text-amber-600">{getPlanDisplayName(plan)}</span>!
        </p>
        
        <p className="text-gray-600 mb-6">
          {plan === 'monthly' || plan === 'annual' 
            ? 'You now have access to all premium features and quiz bundles.'
            : 'You can now access this quiz bundle and test your knowledge!'
          }
        </p>

        {/* Session ID for reference */}
        {sessionId && (
          <p className="text-xs text-gray-500 mb-6">
            Reference: {sessionId.slice(-8)}
          </p>
        )}

        {/* Countdown */}
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <p className="text-amber-800">
            Redirecting to home in <span className="font-bold">{countdown}</span> seconds...
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={handleGoHome}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          Start Exploring Now
        </button>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            📧 A receipt has been sent to your email address.
          </p>
          {(plan === 'monthly' || plan === 'annual') && (
            <p className="text-sm text-gray-600 mt-2">
              💳 Manage your subscription anytime in your account settings.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
