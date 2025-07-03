// Stripe Hosted Checkout Configuration
// This file contains payment links for Stripe Hosted Checkout

export const STRIPE_PAYMENT_LINKS = {
  // Subscription Plans
  monthly: 'https://buy.stripe.com/YOUR_MONTHLY_LINK_HERE',
  annual: 'https://buy.stripe.com/YOUR_ANNUAL_LINK_HERE',
  
  // Individual Bundles
  bundles: {
    egypt: 'https://buy.stripe.com/YOUR_EGYPT_BUNDLE_LINK',
    rome: 'https://buy.stripe.com/YOUR_ROME_BUNDLE_LINK',
    greece: 'https://buy.stripe.com/YOUR_GREECE_BUNDLE_LINK',
    mesopotamia: 'https://buy.stripe.com/YOUR_MESOPOTAMIA_BUNDLE_LINK',
    china: 'https://buy.stripe.com/YOUR_CHINA_BUNDLE_LINK'
  }
};

// Pricing information for display
export const PRICING = {
  monthly: {
    price: 29.99,
    currency: 'USD',
    interval: 'month',
    description: 'Unlock all quiz bundles and premium features'
  },
  annual: {
    price: 199.99,
    currency: 'USD',
    interval: 'year',
    description: 'Unlock all quiz bundles and premium features - Save $159/year!'
  },
  bundles: {
    egypt: { price: 4.99, currency: 'USD', name: 'Ancient Egypt Bundle' },
    rome: { price: 4.99, currency: 'USD', name: 'Roman Empire Bundle' },
    greece: { price: 4.99, currency: 'USD', name: 'Ancient Greece Bundle' },
    mesopotamia: { price: 4.99, currency: 'USD', name: 'Mesopotamia Bundle' },
    china: { price: 4.99, currency: 'USD', name: 'Ancient China Bundle' }
  }
};

// Redirect to Stripe Checkout
export const redirectToStripeCheckout = (plan: string) => {
  let link: string | undefined;
  
  if (plan === 'monthly' || plan === 'annual') {
    link = STRIPE_PAYMENT_LINKS[plan];
  } else if (plan in STRIPE_PAYMENT_LINKS.bundles) {
    link = STRIPE_PAYMENT_LINKS.bundles[plan as keyof typeof STRIPE_PAYMENT_LINKS.bundles];
  }
  
  if (link && link !== 'https://buy.stripe.com/YOUR_MONTHLY_LINK_HERE') {
    // Add user ID to the checkout URL for tracking
    const userId = localStorage.getItem('userId') || 'anonymous';
    const urlWithParams = `${link}?client_reference_id=${userId}`;
    window.location.href = urlWithParams;
  } else {
    console.error('Payment link not configured for plan:', plan);
    alert('Payment link not configured. Please contact support.');
  }
};

// Check if payment links are configured
export const arePaymentLinksConfigured = (): boolean => {
  return STRIPE_PAYMENT_LINKS.monthly !== 'https://buy.stripe.com/YOUR_MONTHLY_LINK_HERE';
};

// Customer Portal URL (to be configured after setting up Stripe Customer Portal)
export const CUSTOMER_PORTAL_URL = 'https://billing.stripe.com/p/login/YOUR_PORTAL_LINK';

// Open customer portal for subscription management
export const openCustomerPortal = () => {
  if (CUSTOMER_PORTAL_URL !== 'https://billing.stripe.com/p/login/YOUR_PORTAL_LINK') {
    window.open(CUSTOMER_PORTAL_URL, '_blank');
  } else {
    alert('Customer portal not configured yet. Please contact support.');
  }
};

// Track subscription events for analytics
export const trackSubscriptionEvent = (plan: string, event: 'started' | 'completed' | 'cancelled') => {
  // Get price for the plan
  let price = 0;
  if (plan === 'monthly') {
    price = PRICING.monthly.price;
  } else if (plan === 'annual') {
    price = PRICING.annual.price;
  } else if (plan in PRICING.bundles) {
    price = PRICING.bundles[plan as keyof typeof PRICING.bundles].price;
  }

  // Google Analytics tracking (if available)
  if (typeof gtag !== 'undefined') {
    gtag('event', event === 'completed' ? 'purchase' : 'subscription_' + event, {
      transaction_id: `${plan}_${Date.now()}`,
      value: price,
      currency: 'USD',
      items: [{
        item_id: plan,
        item_name: plan === 'monthly' ? 'Pro Monthly' : plan === 'annual' ? 'Pro Annual' : `${plan} Bundle`,
        category: plan === 'monthly' || plan === 'annual' ? 'subscription' : 'bundle',
        quantity: 1,
        price: price
      }]
    });
  }
  
  // Console log for debugging
  console.log(`Subscription ${event}:`, plan, `$${price}`);
};
