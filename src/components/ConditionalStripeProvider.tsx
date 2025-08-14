import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';

interface ConditionalStripeProviderProps {
  children: React.ReactNode;
  needsStripe: boolean;
  stripePromise?: Promise<Stripe | null>;
}

const ConditionalStripeProvider: React.FC<ConditionalStripeProviderProps> = ({ 
  children, 
  needsStripe, 
  stripePromise 
}) => {
  const [isStripeReady, setIsStripeReady] = useState(false);

  useEffect(() => {
    if (needsStripe && stripePromise) {
      stripePromise.then(() => {
        setIsStripeReady(true);
      }).catch((error) => {
        console.error('Failed to initialize Stripe:', error);
        setIsStripeReady(false);
      });
    } else {
      setIsStripeReady(true); // Ready without Stripe
    }
  }, [needsStripe, stripePromise]);

  if (needsStripe && stripePromise) {
    if (!isStripeReady) {
      return (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-2">Loading payment system...</span>
        </div>
      );
    }

    return (
      <Elements stripe={stripePromise}>
        {children}
      </Elements>
    );
  }

  // No Stripe needed, render children directly
  return <>{children}</>;
};

export default ConditionalStripeProvider;
