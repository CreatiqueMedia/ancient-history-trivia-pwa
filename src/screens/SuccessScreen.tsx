import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { trackSubscriptionEvent } from '../config/stripe';
import { useAuth } from '../hooks/useAuth';
import { usePurchase } from '../context/PurchaseContext';
import AuthModal from '../components/AuthModal';

export const SuccessScreen: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [authRestored, setAuthRestored] = useState(false);
  const [paymentProcessed, setPaymentProcessed] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [needsAuthentication, setNeedsAuthentication] = useState(false);
  const { user, loading, updateUserProfile } = useAuth();
  const { ownedBundles, subscriptionTier, subscriptionPeriod } = usePurchase();
  
  const plan = searchParams.get('plan') || 'monthly';
  const sessionId = searchParams.get('session_id');

  // Wait for authentication to restore before processing payment
  useEffect(() => {
    if (!loading) {
      setAuthRestored(true);
      
      // CRITICAL: Check if user is authenticated after Stripe redirect
      if (!user) {
        console.log('🚨 User not authenticated after Stripe payment - forcing login');
        setNeedsAuthentication(true);
        setShowAuthModal(true);
        return;
      }
    }
  }, [loading, user]);

  // Process payment and update user profile once auth is restored AND user is authenticated
  useEffect(() => {
    if (!authRestored || paymentProcessed || needsAuthentication) return;
    
    // Double-check user is authenticated before processing payment
    if (!user) {
      console.log('🚨 Cannot process payment - user not authenticated');
      setNeedsAuthentication(true);
      setShowAuthModal(true);
      return;
    }

    const processPayment = async () => {
      try {
        console.log('Processing payment for plan:', plan);
        
        // Check if this is a subscription or bundle purchase
        if (plan === 'monthly' || plan === 'annual' || plan === 'biennial') {
          // Handle subscription purchase
          console.log('Processing subscription:', plan);
          
          // Update localStorage for immediate access
          localStorage.setItem('isPremium', 'true');
          localStorage.setItem('subscriptionPlan', plan);
          localStorage.setItem('subscriptionDate', new Date().toISOString());
          
          // Update subscription in localStorage (PurchaseContext will pick this up)
          const now = new Date();
          let expiryDate: Date;
          
          switch (plan) {
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
          
          localStorage.setItem('subscription', JSON.stringify({
            tier: 'pro',
            period: plan,
            expiry: expiryDate.toISOString()
          }));
          
          // Update user profile if authenticated
          if (user && updateUserProfile) {
            const subscriptionTier = plan === 'monthly' ? 'pro_monthly' : 
                                   plan === 'annual' ? 'pro_annual' : 
                                   plan === 'biennial' ? 'pro_biennial' : 'pro_monthly';
            
            await updateUserProfile({
              subscription: subscriptionTier,
              lastActive: new Date()
            });
          }
          
          // Track the successful subscription
          trackSubscriptionEvent(plan, 'completed');
        } else {
          // Handle individual bundle purchase
          console.log('Processing bundle purchase:', plan);
          
          // Check if there's a pending bundle purchase
          const pendingBundlePurchase = localStorage.getItem('pendingBundlePurchase');
          const bundleId = pendingBundlePurchase || plan;
          
          console.log('Bundle ID to purchase:', bundleId);
          
          // Add bundle to owned bundles
          const currentOwnedBundles = JSON.parse(localStorage.getItem('ownedBundles') || '[]');
          if (!currentOwnedBundles.includes(bundleId)) {
            currentOwnedBundles.push(bundleId);
            localStorage.setItem('ownedBundles', JSON.stringify(currentOwnedBundles));
            console.log('Added bundle to ownedBundles:', bundleId);
          }
          
          // Add to purchase history
          const purchaseRecord = {
            id: `bundle_${bundleId}_${Date.now()}`,
            date: new Date().toISOString(),
            type: 'bundle',
            description: getPlanDisplayName(bundleId),
            amount: 2.99, // Default bundle price
            method: 'Stripe Payment',
            bundleId: bundleId
          };
          
          const existingHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
          const updatedHistory = [purchaseRecord, ...existingHistory];
          localStorage.setItem('purchaseHistory', JSON.stringify(updatedHistory));
          
          // Clear pending purchase
          localStorage.removeItem('pendingBundlePurchase');
          
          // Track the bundle purchase
          trackSubscriptionEvent(bundleId, 'completed');
        }
        
        setPaymentProcessed(true);
        console.log('Payment processing completed successfully');
      } catch (error) {
        console.error('Error processing payment:', error);
        setPaymentProcessed(true); // Continue anyway
      }
    };

    processPayment();
  }, [authRestored, paymentProcessed, plan, user, updateUserProfile]);

  // Start countdown only after auth is restored and payment is processed
  useEffect(() => {
    if (!authRestored) return;

    // Small delay to ensure payment processing completes
    const startTimer = setTimeout(() => {
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
    }, 1000);

    return () => clearTimeout(startTimer);
  }, [authRestored, navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  const handleAuthModalClose = () => {
    setShowAuthModal(false);
    // Give a small delay to ensure auth state has updated
    setTimeout(() => {
      if (user) {
        console.log('✅ User authenticated successfully after payment');
        setNeedsAuthentication(false);
        // Reset payment processed to allow the useEffect to run again
        setPaymentProcessed(false);
      } else {
        console.log('⚠️ User still not authenticated after modal close');
        // Keep the authentication requirement active
        setNeedsAuthentication(true);
      }
    }, 500); // Give auth context time to update
  };

  const getPlanDisplayName = (planName: string) => {
    switch (planName) {
      case 'monthly': return 'Pro Monthly Subscription';
      case 'annual': return 'Pro Annual Subscription';
      case 'biennial': return 'Pro Biennial Subscription';
      case 'egypt': return 'Ancient Egypt Bundle';
      case 'rome': return 'Roman Empire Bundle';
      case 'greece': return 'Ancient Greece Bundle';
      case 'mesopotamia': return 'Mesopotamia Bundle';
      case 'china': return 'Ancient China Bundle';
      case 'india': return 'Ancient India Bundle';
      case 'americas': return 'Ancient Americas Bundle';
      case 'europe': return 'Ancient Europe Bundle';
      case 'bronze_age': return 'Bronze Age Bundle';
      case 'iron_age': return 'Iron Age Bundle';
      case 'prehistoric': return 'Prehistoric Age Bundle';
      case 'multiple_choice': return 'Multiple Choice Bundle';
      case 'true_false': return 'True/False Bundle';
      case 'fill_blank': return 'Fill-in-the-Blank Bundle';
      case 'easy': return 'Easy Difficulty Bundle';
      case 'medium': return 'Medium Difficulty Bundle';
      case 'hard': return 'Hard Difficulty Bundle';
      default: return 'Premium Content';
    }
  };

  // Show loading state while authentication is restoring
  if (!authRestored) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Loading Icon */}
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Processing Your Purchase...
          </h1>
          
          <p className="text-gray-600 mb-6">
            Please wait while we confirm your payment and restore your account.
          </p>

          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              🔐 Restoring your authentication session...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication required screen
  if (needsAuthentication) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Warning Icon */}
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              🔐 Authentication Required
            </h1>
            
            <p className="text-gray-700 mb-4">
              Your payment for <span className="font-semibold text-amber-600">{getPlanDisplayName(plan)}</span> was successful!
            </p>
            
            <p className="text-gray-600 mb-6">
              To complete your purchase and add it to your account, please sign in or create an account.
            </p>

            <div className="bg-amber-50 rounded-lg p-4 mb-6">
              <p className="text-amber-800 text-sm">
                💳 Your payment is secure and will be linked to your account once you authenticate.
              </p>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
            >
              Sign In / Create Account
            </button>

            {sessionId && (
              <p className="text-xs text-gray-500">
                Reference: {sessionId.slice(-8)}
              </p>
            )}
          </div>
        </div>

        {/* Authentication Modal */}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={handleAuthModalClose}
          initialMode="login"
        />
      </>
    );
  }

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
          {plan === 'monthly' || plan === 'annual' || plan === 'biennial'
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
          {(plan === 'monthly' || plan === 'annual' || plan === 'biennial') && (
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
