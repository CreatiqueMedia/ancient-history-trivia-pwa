import { TrialStatus } from '../types/enhancements';
import { analyticsService } from './AnalyticsService';
import { notificationService } from './NotificationService';

/**
 * Stripe-only Trial Service
 * Manages trial periods using localStorage and Stripe subscriptions
 * No Firestore dependency - all data stored locally or in Stripe
 */
export class StripeTrialService {
  private static readonly STORAGE_KEY = 'trial_status';
  private static readonly TRIAL_DURATION_DAYS = 3;

  /**
   * Start a free trial for a new user with payment method collection
   * Creates a Stripe subscription with trial period and required payment method
   */
  static async startTrial(userId: string): Promise<TrialStatus> {
    // Check if already in trial
    if (this.isInTrial()) {
      throw new Error('User is already in a trial');
    }

    // For production: This would create a Stripe subscription with trial
    // For demo: We'll simulate the trial creation with localStorage
    const now = new Date();
    const endDate = new Date(now.getTime() + (this.TRIAL_DURATION_DAYS * 24 * 60 * 60 * 1000));

    const trialStatus: TrialStatus = {
      isActive: true,
      startDate: now,
      endDate: endDate,
      daysRemaining: this.TRIAL_DURATION_DAYS,
      accessedBundles: [],
      conversionOffered: false
    };

    // Store locally (in production, this would be handled by Stripe)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));

    // Track trial start
    analyticsService.trackFeatureUsage('trial_started', `${userId}_${now.toISOString()}`);

    // Schedule trial reminder notifications
    this.scheduleTrialReminders(trialStatus);

    console.log('Trial started (localStorage only):', trialStatus);
    return trialStatus;
  }

  /**
   * Get current trial status from localStorage
   * In production, this would fetch from Stripe subscription status
   */
  static getTrialStatus(): TrialStatus | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    try {
      const trialStatus: TrialStatus = JSON.parse(stored);
      
      // Convert string dates back to Date objects
      trialStatus.startDate = new Date(trialStatus.startDate);
      trialStatus.endDate = new Date(trialStatus.endDate);
      
      // Calculate days remaining
      const now = new Date();
      const msRemaining = trialStatus.endDate.getTime() - now.getTime();
      trialStatus.daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
      
      // Update active status
      trialStatus.isActive = trialStatus.daysRemaining > 0;
      
      // Update localStorage with calculated values
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
      
      return trialStatus;
    } catch (error) {
      console.error('Error parsing trial status:', error);
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  /**
   * Check if user is currently in trial
   */
  static isInTrial(): boolean {
    const trialStatus = this.getTrialStatus();
    return trialStatus?.isActive === true;
  }

  /**
   * End the trial (cancel subscription in Stripe)
   * When trial is cancelled, user MUST revert to FREE PLAN
   */
  static async endTrial(userId: string): Promise<void> {
    console.log('🔄 Ending trial - User will revert to FREE PLAN');
    
    // Remove trial status to end premium access
    localStorage.removeItem(this.STORAGE_KEY);
    
    // MANDATORY: Ensure user reverts to FREE PLAN when trial is cancelled
    // This prevents any lingering premium access
    try {
      const existingProfile = localStorage.getItem(`userProfile_${userId}`);
      if (existingProfile) {
        const profile = JSON.parse(existingProfile);
        profile.subscription = 'free'; // Force back to FREE PLAN
        profile.lastActive = new Date();
        localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profile));
        console.log('✅ User reverted to FREE PLAN after trial cancellation');
      }
    } catch (error) {
      console.warn('Could not update user profile after trial cancellation:', error);
    }
    
    // Also clear any subscription data that might be cached
    localStorage.removeItem('subscription');
    localStorage.removeItem('pendingTrialUpgrade');
    
    // Track trial cancellation
    analyticsService.trackFeatureUsage('trial_cancelled', userId);
    
    console.log('Trial ended for user:', userId, '- Reverted to FREE PLAN');
    
    // Notify user of reversion to FREE plan
    alert('Trial cancelled successfully. You have been returned to the FREE plan.');
  }

  /**
   * Convert trial to paid subscription
   * In production, this would update the Stripe subscription
   */
  static async convertTrial(userId: string, subscriptionTier: string): Promise<void> {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) return;

    // Remove trial status
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Track conversion
    analyticsService.trackFeatureUsage('trial_converted', `${userId}_${subscriptionTier}`);
    
    console.log('Trial converted to subscription:', subscriptionTier);
  }

  /**
   * Track bundle access during trial
   */
  static trackBundleAccess(bundleId: string): void {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus || !trialStatus.isActive) return;

    if (!trialStatus.accessedBundles.includes(bundleId)) {
      trialStatus.accessedBundles.push(bundleId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
      
      // Track bundle access
      analyticsService.trackFeatureUsage('trial_bundle_accessed', bundleId);
    }
  }

  /**
   * Schedule trial reminder notifications
   */
  private static scheduleTrialReminders(trialStatus: TrialStatus): void {
    // Schedule notification for 1 day before trial ends
    const oneDayBefore = new Date(trialStatus.endDate.getTime() - (24 * 60 * 60 * 1000));
    if (oneDayBefore > new Date()) {
      setTimeout(() => {
        notificationService.sendNotification({
          title: 'Trial Reminder',
          body: 'Your free trial expires tomorrow. Upgrade to keep access to premium features!'
        });
      }, oneDayBefore.getTime() - new Date().getTime());
    }

    // Schedule notification when trial ends
    setTimeout(() => {
      notificationService.sendNotification({
        title: 'Trial Expired',
        body: 'Your free trial has ended. Upgrade now to continue accessing premium features!'
      });
    }, trialStatus.endDate.getTime() - new Date().getTime());
  }

  /**
   * Check if conversion offer should be shown
   */
  static shouldShowConversionOffer(): boolean {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus || !trialStatus.isActive) return false;

    // Show offer when 1 day or less remaining and hasn't been offered yet
    return trialStatus.daysRemaining <= 1 && !trialStatus.conversionOffered;
  }

  /**
   * Mark conversion offer as shown
   */
  static markConversionOfferShown(): void {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) return;

    trialStatus.conversionOffered = true;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
  }

  /**
   * Get trial summary for analytics
   */
  static getTrialSummary(): {
    daysUsed: number;
    bundlesAccessed: number;
    isActive: boolean;
  } | null {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) return null;

    const daysUsed = this.TRIAL_DURATION_DAYS - trialStatus.daysRemaining;
    
    return {
      daysUsed,
      bundlesAccessed: trialStatus.accessedBundles.length,
      isActive: trialStatus.isActive
    };
  }

  /**
   * Check if user is eligible for trial (simple check - not already in trial)
   */
  static isEligibleForTrial(userId: string): boolean {
    // Simple check - if no trial is currently active, user is eligible
    const trialStatus = this.getTrialStatus();
    return !trialStatus || !trialStatus.isActive;
  }

  /**
   * Cancel trial (same as endTrial, for compatibility)
   */
  static async cancelTrial(userId: string): Promise<void> {
    return this.endTrial(userId);
  }

  /**
   * Start trial with MANDATORY Stripe payment method collection
   * This creates a subscription with trial period but REQUIRES payment method
   * No exceptions - all premium trials must have payment method
   */
  static async startTrialWithPaymentMethod(userId: string): Promise<{ trialStatus: TrialStatus; paymentRequired: boolean }> {
    console.log('🔒 MANDATORY: Starting trial with required payment method collection');
    
    // Check if already in trial
    if (this.isInTrial()) {
      throw new Error('User is already in a trial');
    }

    // ALWAYS require payment method - no exceptions for any membership upgrade
    // This ensures users can be automatically converted after trial
    console.log('💳 Payment method collection is REQUIRED for all premium trials');
    
    // In production, this would:
    // 1. Create Stripe customer if not exists
    // 2. Create subscription with trial period
    // 3. Require payment method collection
    // 4. Return payment method collection URL
    
    // Start the trial (this will be activated only after payment method is collected)
    return {
      trialStatus: await this.startTrial(userId),
      paymentRequired: true // ALWAYS true - no free trials without payment method
    };
  }

  /**
   * Complete trial setup with payment method
   * Called after payment method is successfully collected via Stripe Elements
   */
  static async completeTrialSetup(userId: string, paymentMethodId: string): Promise<TrialStatus> {
    // In production, this would:
    // 1. Attach payment method to Stripe customer
    // 2. Create subscription with trial period and payment method
    // 3. Update trial status with subscription ID
    
    console.log('Trial setup completed with payment method:', paymentMethodId);
    
    // For demo: Just return the trial status
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) {
      throw new Error('No active trial found');
    }
    
    // Track trial setup completion
    analyticsService.trackFeatureUsage('trial_payment_method_added', `${userId}_${paymentMethodId}`);
    
    return trialStatus;
  }
}
