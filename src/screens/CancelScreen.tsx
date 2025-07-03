import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { trackSubscriptionEvent } from '../config/stripe';

export const CancelScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);
  
  const plan = searchParams.get('plan') || 'monthly';

  useEffect(() => {
    // Track the cancelled subscription attempt
    trackSubscriptionEvent(plan, 'cancelled');

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/subscription');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [plan, navigate]);

  const handleTryAgain = () => {
    navigate('/subscription');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Cancel Icon */}
        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        
        <p className="text-lg text-gray-700 mb-2">
          Your payment for <span className="font-semibold text-amber-600">{getPlanDisplayName(plan)}</span> was cancelled.
        </p>
        
        <p className="text-gray-600 mb-6">
          No charges were made to your account. You can try again anytime or continue exploring with our free content.
        </p>

        {/* Countdown */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <p className="text-orange-800">
            Redirecting to subscription page in <span className="font-bold">{countdown}</span> seconds...
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTryAgain}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Try Again
          </button>
          
          <button
            onClick={handleGoHome}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Continue with Free Version
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            💡 <strong>Why upgrade?</strong>
          </p>
          <ul className="text-sm text-gray-600 mt-2 space-y-1">
            <li>• Access to all quiz bundles</li>
            <li>• Detailed explanations for every question</li>
            <li>• Progress tracking and achievements</li>
            <li>• Ad-free experience</li>
          </ul>
        </div>

        {/* Support */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble? Contact us at support@ancient-history-trivia.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelScreen;
