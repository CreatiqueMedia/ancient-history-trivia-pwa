import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { usePurchase } from '../context/PurchaseContext';
import { useAuth } from '../context/AuthContext';
import { getBundleName, getSubscriptionName } from '../config/payment';

interface PaymentFormProps {
  type: 'bundle' | 'subscription';
  id: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ type, id, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { isProcessing } = usePurchase();
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      setError('Stripe has not been initialized yet. Please try again.');
      return;
    }
    
    const cardElement = elements.getElement('card');
    
    if (!cardElement) {
      setError('Card element not found. Please refresh the page and try again.');
      return;
    }
    
    if (type === 'bundle') {
      // Handle bundle purchase
      const { error: stripeError } = await stripe.confirmCardPayment('client_secret_placeholder', {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || undefined,
            email: user?.email || undefined,
          },
        },
      });
      
      if (stripeError) {
        setError(stripeError.message || 'An error occurred with your payment. Please try again.');
      } else {
        onSuccess();
      }
    } else {
      // Handle subscription
      const { error: stripeError } = await stripe.confirmCardPayment('client_secret_placeholder', {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.displayName || undefined,
            email: user?.email || undefined,
          },
        },
      });
      
      if (stripeError) {
        setError(stripeError.message || 'An error occurred with your subscription. Please try again.');
      } else {
        onSuccess();
      }
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">
        {type === 'bundle' 
          ? `Purchase ${getBundleName(id)} Bundle` 
          : `Subscribe to ${getSubscriptionName(id)}`}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="p-3 border border-gray-300 rounded-md">
            <CardElement 
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                  invalid: {
                    color: '#9e2146',
                  },
                },
              }}
            />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
