import type { SubscriptionPlan } from '../types';

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Explorer',
    price: 0,
    period: 'monthly',
    features: [
      '3 question bundles',
      'Basic achievements',
      'Local progress tracking',
      'Limited daily questions (10/day)',
      'Basic statistics'
    ]
  },
  {
    id: 'scholar',
    name: 'Scholar',
    price: 4.99,
    period: 'monthly',
    trialDays: 7,
    popular: true,
    features: [
      'All 13 question bundles',
      'Unlimited questions',
      'Advanced achievements',
      'Detailed statistics',
      'Cloud sync',
      'No advertisements',
      'Friend challenges',
      'Leaderboards'
    ]
  },
  {
    id: 'historian',
    name: 'Historian',
    price: 8.99,
    period: 'monthly',
    trialDays: 14,
    features: [
      'Everything in Scholar',
      'Exclusive expert bundles',
      'Priority support',
      'Early access to new content',
      'Advanced analytics',
      'Custom study plans',
      'Spaced repetition system',
      'Offline mode'
    ]
  },
  {
    id: 'academy',
    name: 'Academy Biennial',
    price: 139.99,
    period: 'biennial',
    savings: 'Save 35%',
    features: [
      'Everything in Historian',
      '2-year commitment savings',
      'Educational institution features',
      'Priority customer success manager',
      'Custom branding options',
      'Advanced analytics dashboard',
      'Content creation tools',
      'Quarterly feature previews'
    ]
  }
];

export const YEARLY_PLANS: SubscriptionPlan[] = [
  {
    id: 'scholar',
    name: 'Scholar Annual',
    price: 39.99,
    period: 'yearly',
    trialDays: 7,
    savings: 'Save 33%',
    popular: true,
    features: SUBSCRIPTION_PLANS[1].features
  },
  {
    id: 'historian',
    name: 'Historian Annual',
    price: 79.99,
    period: 'yearly',
    trialDays: 14,
    savings: 'Save 26%',
    features: SUBSCRIPTION_PLANS[2].features
  }
];

// Feature gates for different subscription tiers
export const FEATURE_GATES = {
  free: {
    maxDailyQuestions: 10,
    maxBundles: 3,
    cloudSync: false,
    advancedStats: false,
    friendChallenges: false,
    customStudyPlans: false,
    prioritySupport: false,
    offlineMode: false
  },
  scholar: {
    maxDailyQuestions: Infinity,
    maxBundles: Infinity,
    cloudSync: true,
    advancedStats: true,
    friendChallenges: true,
    customStudyPlans: false,
    prioritySupport: false,
    offlineMode: false
  },
  historian: {
    maxDailyQuestions: Infinity,
    maxBundles: Infinity,
    cloudSync: true,
    advancedStats: true,
    friendChallenges: true,
    customStudyPlans: true,
    prioritySupport: true,
    offlineMode: true
  },
  academy: {
    maxDailyQuestions: Infinity,
    maxBundles: Infinity,
    cloudSync: true,
    advancedStats: true,
    friendChallenges: true,
    customStudyPlans: true,
    prioritySupport: true,
    offlineMode: true
  }
};

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
