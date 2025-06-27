declare module '@stripe/stripe-js' {
  export interface Stripe {
    confirmCardPayment: (
      clientSecret: string,
      data?: {
        payment_method?: {
          card?: any;
          billing_details?: {
            name?: string;
            email?: string;
          };
        };
      }
    ) => Promise<{
      error?: {
        message?: string;
      };
      paymentIntent?: {
        status: string;
      };
    }>;
  }

  export function loadStripe(publishableKey: string): Promise<Stripe | null>;
}

declare module '@stripe/react-stripe-js' {
  import { Stripe } from '@stripe/stripe-js';
  import React from 'react';

  export interface ElementsProps {
    stripe: Promise<Stripe | null>;
    children: React.ReactNode;
  }

  export const Elements: React.FC<ElementsProps>;
  
  export function useStripe(): Stripe | null;
  
  export function useElements(): {
    getElement: (type: string) => any;
  } | null;
  
  export const CardElement: React.FC<{
    options?: {
      style?: {
        base?: {
          fontSize?: string;
          color?: string;
          '::placeholder'?: {
            color?: string;
          };
        };
        invalid?: {
          color?: string;
        };
      };
    };
  }>;
}
