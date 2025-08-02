// Stripe Hosted Checkout Configuration - LIVE MODE
// Updated to use live product and price IDs

export const STRIPE_LIVE_PRICE_IDS = {
  // Subscription Plans - LIVE MODE
  monthly: 'price_1RkLzHATHmLCupn7s2EMRvAK', // $4.99/month
  annual: 'price_1RkT3IATHmLCupn7E4so8uTJ', // $39.99/year
  biennial: 'price_1RkT3fATHmLCupn7KjRnoA8h', // $69.99/2 years
  
  // Individual Bundles - LIVE MODE
  bundles: {
    easy: 'price_1RkLyZATHmLCupn7VWNVXhND', // $2.99 - Easy Pack
    medium: 'price_1RkLyaATHmLCupn7d185LVnL', // $2.99 - Medium Pack
    hard: 'price_1RkLybATHmLCupn7vpyYNNRU', // $2.99 - Hard Pack
    all_bundles: 'price_1RkLybATHmLCupn71nEnpD5M', // $30.49 - All Bundle Packs
    egypt: 'price_1RkLyYATHmLCupn7TX69zBYN', // $2.99 - Ancient Egypt
    rome: 'price_1RkLyXATHmLCupn7xMIie47d', // $2.99 - Roman Empire
    greece: 'price_1RkLyWATHmLCupn7cI6Jv1eM', // $2.99 - Ancient Greece
  }
};

// Live Stripe Payment Links - LIVE MODE ($USD)
// 🚨 WARNING: These links will charge real money!
const LIVE_STRIPE_PAYMENT_LINKS = {
  // Subscription Plans - LIVE MODE ($USD)
  monthly: 'https://buy.stripe.com/5kQ4gydp33YRgst6iJ9oc0h',      // $4.99/month
  annual: 'https://buy.stripe.com/5kQaEW98Nbrj0tv5eF9oc0i',        // $39.99/year
  biennial: 'https://buy.stripe.com/14AaEWgBf1QJ5NPbD39oc0j',    // $69.99/2 years
  
  // Bundle Packs - LIVE MODE ($USD)
  bundles: {
    easy: 'https://buy.stripe.com/dRmeVc0Ch2UNekl6iJ9oc0k',          // $2.99 - Easy Pack
    medium: 'https://buy.stripe.com/eVqeVc98Nbrj4JLgXn9oc0l',      // $2.99 - Medium Pack  
    hard: 'https://buy.stripe.com/8x2aEWckZ0MF4JLePf9oc0m',          // $2.99 - Hard Pack
    all_bundles: 'https://buy.stripe.com/3cI28q5WBbrjfopfTj9oc0n', // $30.49 - All Bundle Packs
    egypt: 'https://buy.stripe.com/8x2cN42Kp7b34JLfTj9oc0o',        // $2.99 - Ancient Egypt
    rome: 'https://buy.stripe.com/9B69AS0Chanf1xz36x9oc0p',          // $2.99 - Roman Empire
    greece: 'https://buy.stripe.com/28E5kCgBfdzr1xzfTj9oc0q',      // $2.99 - Ancient Greece
  }
};

// Helper function to get payment link by plan type
const getLivePaymentLink = (plan: string): string | null => {
  // Check top-level plans (subscriptions)
  if (plan === 'monthly' || plan === 'annual' || plan === 'biennial') {
    return LIVE_STRIPE_PAYMENT_LINKS[plan];
  }
  
  // Check bundle plans
  if (plan in LIVE_STRIPE_PAYMENT_LINKS.bundles) {
    return LIVE_STRIPE_PAYMENT_LINKS.bundles[plan as keyof typeof LIVE_STRIPE_PAYMENT_LINKS.bundles];
  }
  
  return null;
};
export const PRICING = {
  monthly: {
    price: 4.99,
    currency: 'USD',
    interval: 'month',
    description: 'Unlock all quiz bundles and premium features'
  },
  annual: {
    price: 39.99,
    currency: 'USD',
    interval: 'year',
    description: 'Unlock all quiz bundles and premium features - Save 33%!'
  },
  biennial: {
    price: 69.99,
    currency: 'USD',
    interval: '2 years',
    description: 'Unlock all quiz bundles and premium features - Save 42%!'
  },
  bundles: {
    easy: { price: 2.99, currency: 'USD', name: 'Easy Pack' },
    medium: { price: 2.99, currency: 'USD', name: 'Medium Pack' },
    hard: { price: 2.99, currency: 'USD', name: 'Hard Pack' },
    all_bundles: { price: 30.49, currency: 'USD', name: 'All Bundle Packs' },
    egypt: { price: 2.99, currency: 'USD', name: 'Ancient Egypt Bundle' },
    rome: { price: 2.99, currency: 'USD', name: 'Roman Empire Bundle' },
    greece: { price: 2.99, currency: 'USD', name: 'Ancient Greece Bundle' },
  }
};

// Redirect to Stripe Checkout - LIVE MODE WITH LIVE PAYMENT LINKS
export const redirectToStripeCheckout = async (plan: string) => {
  // CRITICAL: Ensure user is authenticated before allowing Stripe checkout
  const userId = localStorage.getItem('userId');
  if (!userId || userId === 'anonymous') {
    console.error('User must be authenticated before accessing Stripe checkout');
    throw new Error('Authentication required for purchase');
  }
  
  // Get the payment link for the plan using the helper function
  const paymentUrl = getLivePaymentLink(plan);
  
  if (!paymentUrl) {
    console.error('Payment link not found for plan:', plan);
    throw new Error('Product not configured for purchase');
  }
  
  console.log('Redirecting authenticated user to live Stripe payment link:', { plan, userId, paymentUrl });
  
  // Check if we're running in a test environment
  const currentURL = window.location.href;
  const hostname = window.location.hostname;
  const isTestEnvironment = currentURL.includes('localhost:5173') || 
                           hostname === 'localhost' ||
                           hostname === '127.0.0.1';
  
  console.log('Environment check:', { currentURL, hostname, isTestEnvironment });
  
  if (isTestEnvironment) {
    // For E2E tests, simulate the redirect by storing the intent and then navigating
    console.log('Test environment detected, simulating Stripe redirect');
    console.log('Setting sessionStorage stripe_redirect_url to:', paymentUrl);
    sessionStorage.setItem('stripe_redirect_url', paymentUrl);
    
    // Give a small delay and then redirect - this allows tests to capture the navigation intent
    setTimeout(() => {
      console.log('Test environment redirect timeout triggered');
      window.location.href = paymentUrl;
    }, 100);
  } else {
    // For production, use direct redirect
    console.log('Production environment, direct redirect to:', paymentUrl);
    window.location.href = paymentUrl;
  }
};

// Check if payment links are configured
export const arePaymentLinksConfigured = (): boolean => {
  // Check if live payment links are available
  try {
    return true; // Live payment links are now configured
  } catch {
    return false;
  }
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
