import type { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    period: 'monthly',
    features: [
      'Access to basic question set',
      'Standard quiz modes',
      'Basic statistics',
      'Limited daily challenges'
    ]
  },
  {
    id: 'pro_monthly',
    name: 'Pro Monthly',
    price: 4.99,
    period: 'monthly',
    features: [
      'Access to all question bundles',
      'Unlimited quiz modes',
      'Advanced statistics & analytics',
      'Daily challenges & streaks',
      'Spaced repetition learning',
      'Offline access',
      'No advertisements'
    ]
  },
  {
    id: 'pro_annual',
    name: 'Pro Annual',
    price: 39.99,
    period: 'yearly',
    features: [
      'Access to all question bundles',
      'Unlimited quiz modes',
      'Advanced statistics & analytics',
      'Daily challenges & streaks',
      'Spaced repetition learning',
      'Offline access',
      'No advertisements'
    ]
  }
];

// Pricing configuration for individual bundles (if needed)
export const BUNDLE_PRICING = {
  individual: 2.99,
  categoryDiscount: 0.20, // 20% off when buying all bundles in a category
  allBundlesDiscount: 0.30 // 30% off when buying all bundles
};

// Trial and promotion configuration
export const PRICING_CONFIG = {
  freeTrial: {
    scholar: 7, // days
    historian: 14 // days
  },
  promotions: {
    newUser: {
      discount: 0.50, // 50% off first month
      durationDays: 30
    },
    holiday: {
      discount: 0.25, // 25% off
      validUntil: '2025-12-31'
    }
  },
  refundPolicy: {
    periodDays: 30,
    description: '30-day money-back guarantee'
  }
};
