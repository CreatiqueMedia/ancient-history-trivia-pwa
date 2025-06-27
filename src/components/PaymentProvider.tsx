import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { Stripe } from '@stripe/stripe-js';
import { initializeStripePayment } from '../config/payment';

interface PaymentProviderProps {
  children: React.ReactNode;
}

const PaymentProvider: React.FC<PaymentProviderProps> = ({ children }) => {
  const [stripePromise, setStripePromise] = React.useState<Promise<Stripe | null> | null>(null);

  React.useEffect(() => {
    // Initialize Stripe when the component mounts
    const initStripe = async () => {
      const promise = initializeStripePayment();
      setStripePromise(promise);
    };

    initStripe();
  }, []);

  if (!stripePromise) {
    // You could show a loading indicator here
    return <div>Loading payment system...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default PaymentProvider;
