// Simple webhook endpoint for receiving Stripe webhooks
// This file simulates a backend endpoint for the PWA

import { stripeWebhookHandler } from '../services/StripeWebhookHandler';

/**
 * Handle incoming webhook from Stripe
 * This would typically be deployed as a serverless function
 */
export async function handleStripeWebhook(request: {
  body: string;
  headers: { [key: string]: string };
}): Promise<Response> {
  
  console.log('🔔 Stripe webhook received');
  
  try {
    const signature = request.headers['stripe-signature'] || '';
    const result = await stripeWebhookHandler.processWebhook(request.body, signature);
    
    if (result.success) {
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: result.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('❌ Webhook handler error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Mock webhook endpoint for testing (development only)
 */
export async function mockWebhookEndpoint(bundleId: string, userId?: string): Promise<void> {
  if (import.meta.env.PROD) {
    console.warn('⚠️ Mock webhook should not be used in production');
    return;
  }

  console.log(`🧪 Triggering mock webhook for bundle: ${bundleId}`);
  
  // Map bundle IDs to Stripe product IDs for testing
  const bundleToProductMap: Record<string, string> = {
    'region_pack_egypt': 'prod_Sc1cAYaPVIFRnm',
    'region_pack_rome': 'prod_Sc1cJRaC4oR6kR', 
    'region_pack_greece': 'prod_Sc1cheDu2aPo24',
    'region_pack_mesopotamia': 'prod_Sc1c49nwMU5uCa',
    'region_pack_china': 'prod_Sc1cjZLEoeLV59',
    'region_pack_india': 'prod_ScLQ5j27CiOLtK',
    'region_pack_americas': 'prod_ScLS6NZofkzkv3',
    'region_pack_europe': 'prod_ScLSh6yyVtIN11',
    'time_pack_bronze': 'prod_ScLSVWDcZ7gh5T',
    'time_pack_iron': 'prod_ScLSgqSFOxxnKH',
    'time_pack_prehistoric': 'prod_ScLSzGWRwaCj0F',
    'format_pack_multiple_choice': 'prod_ScLSPhinbppXHL',
    'format_pack_true_false': 'prod_ScLSsw9hXo49M7',
    'format_pack_fill_blank': 'prod_ScLSXDdQ9mNlVL',
    'difficulty_pack_easy': 'prod_ScLSJ73GbHZT1r',
    'difficulty_pack_medium': 'prod_ScLSgpeFtf9Pit',
    'difficulty_pack_hard': 'prod_ScLSskLoTVMOaW'
  };

  const stripeProductId = bundleToProductMap[bundleId];
  if (!stripeProductId) {
    console.error(`❌ No Stripe product mapping found for bundle: ${bundleId}`);
    return;
  }

  // Create mock webhook event
  const mockBody = JSON.stringify({
    id: `evt_test_${Date.now()}`,
    object: 'event',
    type: 'checkout.session.completed',
    data: {
      object: {
        id: `cs_test_${Date.now()}`,
        object: 'checkout.session',
        payment_status: 'paid',
        customer: `cus_test_${userId || 'anonymous'}`,
        client_reference_id: userId || 'test_user',
        line_items: {
          object: 'list',
          data: [{
            id: `li_test_${Date.now()}`,
            object: 'item',
            price: {
              id: `price_test_${Date.now()}`,
              object: 'price',
              product: stripeProductId
            },
            quantity: 1
          }]
        },
        metadata: {
          bundleId,
          userId: userId || 'test_user'
        }
      }
    },
    created: Math.floor(Date.now() / 1000),
    livemode: false
  });

  // Process the mock webhook
  await stripeWebhookHandler.processWebhook(mockBody, 'mock_signature');
  
  console.log(`✅ Mock webhook processed for ${bundleId}`);
}
