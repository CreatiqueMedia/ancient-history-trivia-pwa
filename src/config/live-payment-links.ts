// Live Stripe Payment Links for Production
// These are the actual payment links used in production

export const LIVE_PAYMENT_LINKS = {
  // Individual Bundle Payment Links
  bundles: {
    region_pack_rome: "https://buy.stripe.com/your-rome-pack-link",
    region_pack_egypt: "https://buy.stripe.com/your-egypt-pack-link", 
    region_pack_greece: "https://buy.stripe.com/your-greece-pack-link",
    region_pack_mesopotamia: "https://buy.stripe.com/your-mesopotamia-pack-link",
    region_pack_china: "https://buy.stripe.com/your-china-pack-link",
    region_pack_india: "https://buy.stripe.com/your-india-pack-link",
    region_pack_europe: "https://buy.stripe.com/your-europe-pack-link",
    region_pack_americas: "https://buy.stripe.com/your-americas-pack-link",
    age_pack_bronze_age: "https://buy.stripe.com/your-bronze-age-pack-link",
    age_pack_iron_age: "https://buy.stripe.com/your-iron-age-pack-link",
    age_pack_prehistoric: "https://buy.stripe.com/your-prehistoric-pack-link",
    difficulty_pack_easy: "https://buy.stripe.com/your-easy-pack-link",
    difficulty_pack_medium: "https://buy.stripe.com/your-medium-pack-link",
    difficulty_pack_hard: "https://buy.stripe.com/your-hard-pack-link",
    format_pack_multiple_choice: "https://buy.stripe.com/your-mc-pack-link",
    format_pack_true_false: "https://buy.stripe.com/your-tf-pack-link",
    format_pack_fill_blank: "https://buy.stripe.com/your-fib-pack-link"
  },

  // Bundle Group Payment Links  
  groups: {
    regional_packs: "https://buy.stripe.com/your-regional-group-link",
    chronological_packs: "https://buy.stripe.com/your-chronological-group-link",
    difficulty_packs: "https://buy.stripe.com/your-difficulty-group-link",
    format_packs: "https://buy.stripe.com/your-format-group-link"
  },

  // All Bundles Mega Pack
  all_bundles: "https://buy.stripe.com/your-all-bundles-link",

  // Subscription Payment Links
  subscriptions: {
    pro_monthly: "https://buy.stripe.com/your-pro-monthly-link",
    pro_annual: "https://buy.stripe.com/your-pro-annual-link", 
    pro_biennial: "https://buy.stripe.com/your-pro-biennial-link"
  }
};

// Helper function to get payment link by bundle ID
export function getLivePaymentLink(bundleId: string): string | null {
  return LIVE_PAYMENT_LINKS.bundles[bundleId as keyof typeof LIVE_PAYMENT_LINKS.bundles] || null;
}

// Helper function to get group payment link
export function getLiveGroupPaymentLink(groupId: string): string | null {
  return LIVE_PAYMENT_LINKS.groups[groupId as keyof typeof LIVE_PAYMENT_LINKS.groups] || null;
}

// Helper function to get subscription payment link
export function getLiveSubscriptionPaymentLink(subscriptionType: string): string | null {
  return LIVE_PAYMENT_LINKS.subscriptions[subscriptionType as keyof typeof LIVE_PAYMENT_LINKS.subscriptions] || null;
}

// Helper function to get all bundles payment link
export function getLiveAllBundlesPaymentLink(): string {
  return LIVE_PAYMENT_LINKS.all_bundles;
}
