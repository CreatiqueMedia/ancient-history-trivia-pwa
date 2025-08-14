import { useState, useCallback } from 'react';
import { Stripe } from '@stripe/stripe-js';
import { initializeStripePayment } from '../config/payment';

export const useStripeLoader = () => {
  const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const loadStripe = useCallback(async () => {
    if (stripePromise) {
      return stripePromise; // Already loading or loaded
    }

    setIsLoading(true);
    const promise = initializeStripePayment();
    setStripePromise(promise);

    try {
      await promise;
      setIsLoaded(true);
    } catch (error) {
      console.error('Failed to load Stripe:', error);
      setStripePromise(null); // Reset on error so it can be retried
    } finally {
      setIsLoading(false);
    }

    return promise;
  }, [stripePromise]);

  return {
    stripePromise,
    isLoading,
    isLoaded,
    loadStripe
  };
};
