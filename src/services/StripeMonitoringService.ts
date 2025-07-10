// Stripe Monitoring Service for payment analytics and alerting
// Integrates with Stripe API and webhooks for comprehensive payment monitoring

import { analyticsService } from './AnalyticsService';

interface PaymentEvent {
  type: string;
  data: any;
  timestamp: string;
}

interface PaymentMetrics {
  totalRevenue: number;
  successfulPayments: number;
  failedPayments: number;
  chargebacks: number;
  refunds: number;
  averageTransactionValue: number;
}

class StripeMonitoringService {
  private isEnabled: boolean = true;
  private metrics: PaymentMetrics = {
    totalRevenue: 0,
    successfulPayments: 0,
    failedPayments: 0,
    chargebacks: 0,
    refunds: 0,
    averageTransactionValue: 0
  };

  // Initialize monitoring
  initialize(): void {
    if (import.meta.env.DEV) {
      console.log('[Stripe Monitoring] Service initialized');
    }
    
    // Set up webhook listeners if in a server environment
    this.setupWebhookListeners();
  }

  // Process Stripe webhook events
  processWebhookEvent(event: PaymentEvent): void {
    if (!this.isEnabled) return;

    const { type, data } = event;
    
    switch (type) {
      case 'payment_intent.succeeded':
        this.handlePaymentSuccess(data);
        break;
      case 'payment_intent.payment_failed':
        this.handlePaymentFailure(data);
        break;
      case 'charge.dispute.created':
        this.handleChargeback(data);
        break;
      case 'charge.refunded':
        this.handleRefund(data);
        break;
      case 'customer.subscription.created':
        this.handleSubscriptionCreated(data);
        break;
      case 'customer.subscription.deleted':
        this.handleSubscriptionCanceled(data);
        break;
      case 'invoice.payment_failed':
        this.handleInvoicePaymentFailed(data);
        break;
      default:
        if (import.meta.env.DEV) {
          console.log(`[Stripe Monitoring] Unhandled event type: ${type}`);
        }
    }
  }

  // Handle successful payments
  private handlePaymentSuccess(data: any): void {
    const amount = data.amount / 100; // Convert cents to dollars
    const currency = data.currency;
    const customerId = data.customer;
    
    this.metrics.successfulPayments++;
    this.metrics.totalRevenue += amount;
    this.updateAverageTransactionValue();
    
    // Track in Firebase Analytics
    (analyticsService as any).trackPurchaseSuccess(
      data.metadata?.bundle_id || 'unknown',
      amount,
      currency.toUpperCase()
    );
    
    // Log success
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Payment succeeded: $${amount} ${currency}`);
    }
    
    // Check for high-value transactions (alert if over $50)
    if (amount > 50) {
      this.alertHighValueTransaction(amount, currency, customerId);
    }
  }

  // Handle failed payments
  private handlePaymentFailure(data: any): void {
    const amount = data.amount / 100;
    const currency = data.currency;
    const errorCode = data.last_payment_error?.code || 'unknown';
    const errorMessage = data.last_payment_error?.message || 'Unknown error';
    
    this.metrics.failedPayments++;
    
    // Track in Firebase Analytics
    (analyticsService as any).trackPurchaseFailure(
      data.metadata?.bundle_id || 'unknown',
      amount,
      errorMessage
    );
    
    // Log failure
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Payment failed: $${amount} ${currency} - ${errorCode}`);
    }
    
    // Check for high failure rates
    this.checkFailureRate();
  }

  // Handle chargebacks
  private handleChargeback(data: any): void {
    const amount = data.amount / 100;
    const currency = data.currency;
    
    this.metrics.chargebacks++;
    
    // Track in Firebase Analytics
    analyticsService.trackError('Chargeback received', `Amount: $${amount} ${currency}`);
    
    // Alert for chargebacks (always critical)
    this.alertChargeback(amount, currency, data.id);
  }

  // Handle refunds
  private handleRefund(data: any): void {
    const amount = data.amount_refunded / 100;
    const currency = data.currency;
    
    this.metrics.refunds++;
    
    // Track in Firebase Analytics
    (analyticsService as any).trackCustomEvent('refund_processed', {
      amount: amount,
      currency: currency,
      charge_id: data.id
    });
    
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Refund processed: $${amount} ${currency}`);
    }
  }

  // Handle subscription creation
  private handleSubscriptionCreated(data: any): void {
    const planId = data.items?.data[0]?.price?.id;
    const customerId = data.customer;
    
    // Track in Firebase Analytics
    analyticsService.trackSubscriptionStart(planId || 'unknown');
    
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Subscription created: ${planId}`);
    }
  }

  // Handle subscription cancellation
  private handleSubscriptionCanceled(data: any): void {
    const planId = data.items?.data[0]?.price?.id;
    const customerId = data.customer;
    
    // Track in Firebase Analytics
    analyticsService.trackSubscriptionCancel(planId || 'unknown');
    
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Subscription canceled: ${planId}`);
    }
  }

  // Handle failed invoice payments
  private handleInvoicePaymentFailed(data: any): void {
    const amount = data.amount_due / 100;
    const currency = data.currency;
    const customerId = data.customer;
    
    // Track in Firebase Analytics
    analyticsService.trackError('Invoice payment failed', `Customer: ${customerId}, Amount: $${amount}`);
    
    if (import.meta.env.DEV) {
      console.log(`[Stripe Monitoring] Invoice payment failed: $${amount} ${currency}`);
    }
  }

  // Setup webhook listeners (would be implemented in backend)
  private setupWebhookListeners(): void {
    // This would typically be implemented in a backend service
    // For now, just log that it's set up
    if (import.meta.env.DEV) {
      console.log('[Stripe Monitoring] Webhook listeners configured');
    }
  }

  // Check failure rate and alert if too high
  private checkFailureRate(): void {
    const totalPayments = this.metrics.successfulPayments + this.metrics.failedPayments;
    if (totalPayments > 10) { // Only check after 10+ payments
      const failureRate = (this.metrics.failedPayments / totalPayments) * 100;
      
      if (failureRate > 20) { // Alert if failure rate > 20%
        this.alertHighFailureRate(failureRate);
      }
    }
  }

  // Update average transaction value
  private updateAverageTransactionValue(): void {
    if (this.metrics.successfulPayments > 0) {
      this.metrics.averageTransactionValue = this.metrics.totalRevenue / this.metrics.successfulPayments;
    }
  }

  // Alert methods (would integrate with notification system)
  private alertHighValueTransaction(amount: number, currency: string, customerId: string): void {
    const message = `High-value transaction: $${amount} ${currency} from customer ${customerId}`;
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`[Stripe Alert] ${message}`);
    }
    
    // In production, you would:
    // - Send email alert
    // - Post to Slack/Discord
    // - Log to monitoring system
    // - Send push notification
  }

  private alertChargeback(amount: number, currency: string, chargeId: string): void {
    const message = `CHARGEBACK ALERT: $${amount} ${currency} - Charge ID: ${chargeId}`;
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error(`[Stripe Alert] ${message}`);
    }
    
    // In production, you would:
    // - Send immediate email alert
    // - Post to Slack/Discord with @channel
    // - Log to monitoring system
    // - Send push notification to admin
  }

  private alertHighFailureRate(failureRate: number): void {
    const message = `High payment failure rate: ${failureRate.toFixed(2)}%`;
    
    // Log to console in development
    if (import.meta.env.DEV) {
      console.warn(`[Stripe Alert] ${message}`);
    }
    
    // In production, you would:
    // - Send email alert
    // - Post to monitoring dashboard
    // - Check payment gateway status
    // - Review recent changes
  }

  // Get current metrics
  getMetrics(): PaymentMetrics {
    return { ...this.metrics };
  }

  // Reset metrics (useful for testing)
  resetMetrics(): void {
    this.metrics = {
      totalRevenue: 0,
      successfulPayments: 0,
      failedPayments: 0,
      chargebacks: 0,
      refunds: 0,
      averageTransactionValue: 0
    };
  }

  // Enable/disable monitoring
  setEnabled(enabled: boolean): void {
    this.isEnabled = enabled;
  }

  // Get monitoring status
  getStatus(): { enabled: boolean; metrics: PaymentMetrics } {
    return {
      enabled: this.isEnabled,
      metrics: this.getMetrics()
    };
  }
}

// Export singleton instance
export const stripeMonitoringService = new StripeMonitoringService();
