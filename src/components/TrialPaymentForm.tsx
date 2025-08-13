import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../hooks/useAuth';
import { CreditCardIcon, XMarkIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import PaymentProvider from './PaymentProvider';

interface TrialPaymentFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const TrialPaymentFormContent: React.FC<TrialPaymentFormProps> = ({ onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!stripe || !elements) {
      setError('Stripe has not been initialized yet. Please try again.');
      return;
    }
    
    const cardElement = elements.getElement('card');
    
    if (!cardElement) {
      setError('Card element not found. Please refresh the page and try again.');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Create a payment method to attach to the customer
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod!({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user?.displayName || undefined,
          email: user?.email || undefined,
        },
      });
      
      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Failed to process payment method. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      if (!paymentMethod) {
        setError('Failed to create payment method. Please try again.');
        setIsProcessing(false);
        return;
      }
      
      // In a real implementation, you would:
      // 1. Send paymentMethod.id to your backend
      // 2. Create or retrieve Stripe customer
      // 3. Attach payment method to customer  
      // 4. Create subscription with trial period
      // 5. Return subscription details
      
      // For now, simulate the process
      console.log('Payment method created:', paymentMethod.id);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsProcessing(false);
      onSuccess();
      
    } catch (error) {
      console.error('Error processing payment method:', error);
      setError('An unexpected error occurred. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-2">
              <CreditCardIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Start Your Free Trial
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                3 days free, then $4.99/month
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Security Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <ShieldCheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm text-green-800 dark:text-green-200 font-medium mb-1">
                Secure Payment Setup
              </p>
              <p className="text-xs text-green-700 dark:text-green-300">
                Your payment method will be saved securely. You won't be charged during the trial period.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Method
            </label>
            <div className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <CardElement 
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#374151',
                      '::placeholder': {
                        color: '#9CA3AF',
                      },
                    },
                    invalid: {
                      color: '#EF4444',
                    },
                  },
                }}
              />
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Trial Terms */}
          <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Trial Terms:</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• 3 days completely free</li>
              <li>• Access to all premium features</li>
              <li>• No charges during trial period</li>
              <li>• Cancel anytime before trial ends</li>
              <li>• Auto-converts to $4.99/month after trial</li>
            </ul>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors flex items-center justify-center space-x-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Processing...</span>
                </>
              ) : (
                <span>Start Free Trial</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Wrapper component that provides Stripe context
const TrialPaymentForm: React.FC<TrialPaymentFormProps> = ({ onSuccess, onCancel }) => {
  return (
    <PaymentProvider>
      <TrialPaymentFormContent onSuccess={onSuccess} onCancel={onCancel} />
    </PaymentProvider>
  );
};

export default TrialPaymentForm;
