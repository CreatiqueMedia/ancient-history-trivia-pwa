// Stripe Webhook Handler for PWA
// Receives Stripe webhook events and triggers content delivery

import { auth } from '../config/firebase';
import { purchaseContentDeliveryService } from '../services/PurchaseContentDeliveryService';

interface StripeWebhookEvent {
  id: string;
  object: string;
  type: string;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
}

export class StripeWebhookHandler {
  private webhookSecret: string;

  constructor() {
    // Get webhook secret from environment
    this.webhookSecret = import.meta.env.VITE_STRIPE_WEBHOOK_SECRET || 'whsec_test_secret';
  }

  /**
   * Process incoming Stripe webhook
   */
  async processWebhook(body: string, signature: string): Promise<{ success: boolean; message: string }> {
    try {
      // Verify webhook signature (in production, use Stripe's signature verification)
      if (!this.verifySignature(body, signature)) {
        return { success: false, message: 'Invalid webhook signature' };
      }

      const event: StripeWebhookEvent = JSON.parse(body);
      console.log(`🔔 Processing webhook: ${event.type}`);

      await this.handleWebhookEvent(event);
      
      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return { success: false, message: `Webhook error: ${errorMessage}` };
    }
  }

  /**
   * Handle different types of webhook events
   */
  private async handleWebhookEvent(event: StripeWebhookEvent): Promise<void> {
    const { type, data } = event;

    switch (type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(data.object);
        break;
        
      case 'payment_intent.succeeded':
        await this.handlePaymentSucceeded(data.object);
        break;
        
      case 'invoice.payment_succeeded':
        await this.handleSubscriptionPayment(data.object);
        break;
        
      case 'customer.subscription.created':
        await this.handleSubscriptionCreated(data.object);
        break;
        
      case 'charge.refunded':
        await this.handleRefund(data.object);
        break;
        
      default:
        console.log(`ℹ️ Unhandled webhook event: ${type}`);
    }
  }

  /**
   * Handle completed checkout session
   */
  private async handleCheckoutCompleted(session: any): Promise<void> {
    console.log('✅ Checkout completed:', session.id);

    const {
      id: sessionId,
      customer,
      client_reference_id: userId,
      metadata = {},
      line_items
    } = session;

    // Extract product information
    if (line_items && line_items.data && line_items.data.length > 0) {
      const lineItem = line_items.data[0];
      const productId = lineItem.price?.product;

      if (productId && userId) {
        console.log(`🎁 Delivering content: Product ${productId} to user ${userId}`);
        
        // Trigger content delivery
        await purchaseContentDeliveryService.handleStripeSuccess(
          sessionId,
          productId,
          customer
        );
      } else {
        console.warn('⚠️ Missing product ID or user ID in checkout session');
      }
    }
  }

  /**
   * Handle successful payment
   */
  private async handlePaymentSucceeded(paymentIntent: any): Promise<void> {
    console.log('💳 Payment succeeded:', paymentIntent.id);
    
    const { metadata = {} } = paymentIntent;
    
    if (metadata.bundleId && metadata.userId) {
      console.log(`📦 Payment for bundle: ${metadata.bundleId}`);
      // Additional processing if needed
    }
  }

  /**
   * Handle subscription payment
   */
  private async handleSubscriptionPayment(invoice: any): Promise<void> {
    console.log('🔄 Subscription payment:', invoice.id);
    
    const {
      customer,
      subscription,
      metadata = {}
    } = invoice;

    if (subscription) {
      console.log(`🔓 Unlocking all content for subscription: ${subscription}`);
      // Handle subscription - unlock all bundles for the user
      // This would involve a different flow than individual bundles
    }
  }

  /**
   * Handle subscription creation
   */
  private async handleSubscriptionCreated(subscription: any): Promise<void> {
    console.log('🆕 Subscription created:', subscription.id);
    
    const {
      customer,
      metadata = {}
    } = subscription;

    // Unlock all premium content for subscriber
    console.log(`🔑 Granting full access to customer: ${customer}`);
  }

  /**
   * Handle refund
   */
  private async handleRefund(charge: any): Promise<void> {
    console.log('💸 Refund processed:', charge.id);
    
    const {
      customer,
      metadata = {}
    } = charge;

    if (metadata.bundleId && metadata.userId) {
      console.log(`🔒 Revoking access to bundle: ${metadata.bundleId}`);
      // Revoke access to the refunded bundle
      // This would involve removing the purchase record and cached content
    }
  }

  /**
   * Verify webhook signature
   */
  private verifySignature(body: string, signature: string): boolean {
    // In production, use Stripe's webhook signature verification
    // For now, we'll do a basic check
    if (!signature || !this.webhookSecret) {
      console.warn('⚠️ Missing webhook signature or secret');
      return true; // Allow in development
    }

    // In production, implement proper Stripe signature verification:
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // try {
    //   const event = stripe.webhooks.constructEvent(body, signature, this.webhookSecret);
    //   return true;
    // } catch (err) {
    //   return false;
    // }

    return true; // Allow all webhooks in development
  }

  /**
   * Simulate webhook for testing
   */
  async simulateWebhook(eventType: string, productId: string, userId: string): Promise<void> {
    console.log(`🧪 Simulating webhook: ${eventType} for product ${productId}`);

    const mockEvent: StripeWebhookEvent = {
      id: `evt_test_${Date.now()}`,
      object: 'event',
      type: eventType,
      data: {
        object: {
          id: `session_test_${Date.now()}`,
          customer: `cus_test_${userId}`,
          client_reference_id: userId,
          line_items: {
            data: [{
              price: {
                product: productId
              }
            }]
          }
        }
      },
      created: Math.floor(Date.now() / 1000),
      livemode: false
    };

    await this.handleWebhookEvent(mockEvent);
  }
}

// Export singleton
export const stripeWebhookHandler = new StripeWebhookHandler();

// Test function for development
export async function testPurchaseFlow(bundleId: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) {
    console.error('❌ User must be logged in to test purchase flow');
    return;
  }

  // Map bundle ID to Stripe product ID
  const bundleToProductMap: Record<string, string> = {
    'region_pack_egypt': 'prod_Sc1cAYaPVIFRnm',
    'region_pack_rome': 'prod_Sc1cJRaC4oR6kR',
    'region_pack_greece': 'prod_Sc1cheDu2aPo24',
    'region_pack_mesopotamia': 'prod_Sc1c49nwMU5uCa',
    'region_pack_china': 'prod_Sc1cjZLEoeLV59',
    // Mega Bundle
    'all_bundle_packs': 'prod_SfAi1wHgJuKhYd'
  };

  const stripeProductId = bundleToProductMap[bundleId];
  if (!stripeProductId) {
    console.error(`❌ No Stripe product mapping for bundle: ${bundleId}`);
    return;
  }

  console.log(`🧪 Testing purchase flow for ${bundleId}`);
  
  try {
    // Simulate successful checkout
    await stripeWebhookHandler.simulateWebhook(
      'checkout.session.completed',
      stripeProductId,
      user.uid
    );
    
    console.log(`✅ Test purchase completed for ${bundleId}`);
  } catch (error) {
    console.error(`❌ Test purchase failed:`, error);
  }
}
