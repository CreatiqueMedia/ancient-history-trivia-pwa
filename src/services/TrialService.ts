import { TrialStatus } from '../types/enhancements';
import { analyticsService } from './AnalyticsService';
import { notificationService } from './NotificationService';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

/**
 * Service for managing free trial periods and conversion tracking
 * Handles trial activation, tracking, and conversion opportunities
 */
export class TrialService {
  private static readonly STORAGE_KEY = 'trial_status';
  private static readonly TRIAL_DURATION_DAYS = 3;

  /**
   * Start a free trial for a new user
   */
  static async startTrial(userId: string): Promise<TrialStatus> {
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

    await this.storeTrialStatusToFirestore(userId, trialStatus);

    // Track trial start
    analyticsService.trackFeatureUsage('trial_started', `${userId}_${now.toISOString()}`);

    // Schedule trial reminder notifications
    this.scheduleTrialReminders(trialStatus);

    return trialStatus;
  }

  /**
   * Get current trial status
   */
  static getTrialStatus(): TrialStatus | null {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (!stored) return null;

    try {
      const trialStatus: TrialStatus = JSON.parse(stored);
      
      // Convert date strings back to Date objects
      trialStatus.startDate = new Date(trialStatus.startDate);
      trialStatus.endDate = new Date(trialStatus.endDate);
      
      // Update days remaining
      trialStatus.daysRemaining = this.calculateDaysRemaining(trialStatus.endDate);
      
      // Check if trial has expired
      if (trialStatus.daysRemaining <= 0) {
        trialStatus.isActive = false;
        
        // Auto-convert to Pro Monthly subscription when trial expires
        this.convertTrialToSubscription();
      }

      // Store updated status
      this.storeTrialStatus(trialStatus);

      return trialStatus;
    } catch {
      return null;
    }
  }

  /**
   * Convert expired trial to Pro Monthly subscription
   */
  static convertTrialToSubscription(): void {
    const now = new Date();
    const monthlyExpiry = new Date(now.setMonth(now.getMonth() + 1));
    
    // Set up Pro Monthly subscription
    const subscription = {
      tier: 'pro',
      period: 'monthly',
      expiry: monthlyExpiry.toISOString()
    };
    
    // Save subscription to localStorage
    localStorage.setItem('subscription', JSON.stringify(subscription));
    
    // Track the conversion
    analyticsService.trackFeatureUsage('trial_auto_converted', 'pro_monthly');
    
    console.log('Trial automatically converted to Pro Monthly subscription');
  }

  /**
   * Check if user is currently in trial period
   */
  static isInTrial(): boolean {
    const trialStatus = this.getTrialStatus();
    return trialStatus?.isActive === true && trialStatus.daysRemaining > 0;
  }

  /**
   * Check if user has access to premium content (trial or subscription)
   */
  static hasPremiumAccess(userSubscription?: string): boolean {
    // Check if user has active subscription
    if (userSubscription && userSubscription !== 'free') {
      return true;
    }

    // Check if user is in trial period
    return this.isInTrial();
  }

  /**
   * Track bundle access during trial
   */
  static trackBundleAccess(bundleId: string): void {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus || !trialStatus.isActive) return;

    // Add bundle to accessed list if not already there
    if (!trialStatus.accessedBundles.includes(bundleId)) {
      trialStatus.accessedBundles.push(bundleId);
      this.storeTrialStatus(trialStatus);

      // Track bundle access analytics
      analyticsService.trackFeatureUsage('trial_bundle_accessed', `${bundleId}_${trialStatus.daysRemaining}`);
    }
  }

  /**
   * Get trial conversion message based on usage
   */
  static getConversionMessage(): {
    title: string;
    message: string;
    urgency: 'low' | 'medium' | 'high';
    cta: string;
  } {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) {
      return {
        title: 'Start Your Free Trial',
        message: 'Get 3 days of unlimited access to all premium content.',
        urgency: 'low',
        cta: 'Start Free Trial'
      };
    }

    const daysRemaining = trialStatus.daysRemaining;
    const bundlesAccessed = trialStatus.accessedBundles.length;

    if (daysRemaining <= 0) {
      return {
        title: 'Trial Expired',
        message: 'Your free trial has ended. Subscribe now to continue accessing premium content.',
        urgency: 'high',
        cta: 'Subscribe Now'
      };
    } else if (daysRemaining === 1) {
      return {
        title: 'Trial Expires Tomorrow!',
        message: `You've explored ${bundlesAccessed} premium bundles. Don't lose access - subscribe today!`,
        urgency: 'high',
        cta: 'Subscribe Before It Expires'
      };
    } else if (daysRemaining <= 3) {
      return {
        title: `${daysRemaining} Days Left`,
        message: `You're enjoying the premium features! Secure your access with a subscription.`,
        urgency: 'medium',
        cta: 'Continue with Subscription'
      };
    } else {
      return {
        title: `${daysRemaining} Days Remaining`,
        message: `Explore all premium content during your trial period.`,
        urgency: 'low',
        cta: 'Upgrade Early & Save'
      };
    }
  }

  /**
   * Mark conversion offer as shown
   */
  static markConversionOffered(): void {
    const trialStatus = this.getTrialStatus();
    if (trialStatus) {
      trialStatus.conversionOffered = true;
      this.storeTrialStatus(trialStatus);
    }
  }

  /**
   * End trial (when user subscribes or trial expires)
   */
  static endTrial(reason: 'subscribed' | 'expired' | 'cancelled'): void {
    const trialStatus = this.getTrialStatus();
    if (trialStatus) {
      trialStatus.isActive = false;
      this.storeTrialStatus(trialStatus);

      // Track trial end
      analyticsService.trackFeatureUsage('trial_ended', `${reason}_${trialStatus.accessedBundles.length}_${this.TRIAL_DURATION_DAYS - trialStatus.daysRemaining}`);
    }
  }

  /**
   * Cancel trial manually by user
   */
  static async cancelTrial(userId: string): Promise<void> {
    const trialStatus = this.getTrialStatus();
    if (trialStatus && trialStatus.isActive) {
      // End the trial
      this.endTrial('cancelled');
      
      // Remove from localStorage
      localStorage.removeItem(this.STORAGE_KEY);
      
      // Remove from Firestore
      try {
        await this.removeTrialStatusFromFirestore(userId);
      } catch (error) {
        console.error('Error removing trial from Firestore:', error);
      }
      
      // Track cancellation
      analyticsService.trackFeatureUsage('trial_cancelled_by_user', userId);
      
      console.log('Trial cancelled successfully');
    }
  }

  /**
   * Get trial statistics for analytics
   */
  static getTrialStats(): {
    isActive: boolean;
    daysUsed: number;
    bundlesAccessed: number;
    conversionOffered: boolean;
    timeRemaining: string;
  } {
    const trialStatus = this.getTrialStatus();
    
    if (!trialStatus) {
      return {
        isActive: false,
        daysUsed: 0,
        bundlesAccessed: 0,
        conversionOffered: false,
        timeRemaining: '0 days'
      };
    }

    const daysUsed = this.TRIAL_DURATION_DAYS - trialStatus.daysRemaining;
    const timeRemaining = this.formatTimeRemaining(trialStatus.endDate);

    return {
      isActive: trialStatus.isActive,
      daysUsed,
      bundlesAccessed: trialStatus.accessedBundles.length,
      conversionOffered: trialStatus.conversionOffered,
      timeRemaining
    };
  }

  /**
   * Check if user should see conversion prompt
   */
  static shouldShowConversionPrompt(): boolean {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus || !trialStatus.isActive) return false;

    // Show prompt if:
    // 1. Trial expires in 3 days or less
    // 2. User has accessed at least 2 bundles
    // 3. Conversion offer hasn't been shown yet
    return (
      trialStatus.daysRemaining <= 3 &&
      trialStatus.accessedBundles.length >= 2 &&
      !trialStatus.conversionOffered
    );
  }

  /**
   * Get recommended subscription based on trial usage
   */
  static getRecommendedSubscription(): {
    plan: 'monthly' | 'annual' | 'biennial';
    reason: string;
    discount?: string;
  } {
    const trialStatus = this.getTrialStatus();
    
    if (!trialStatus) {
      return {
        plan: 'monthly',
        reason: 'Start with our most popular plan'
      };
    }

    const bundlesAccessed = trialStatus.accessedBundles.length;
    const daysUsed = this.TRIAL_DURATION_DAYS - trialStatus.daysRemaining;

    // Heavy usage suggests annual plan
    if (bundlesAccessed >= 5 || daysUsed >= 5) {
      return {
        plan: 'annual',
        reason: 'Based on your usage, annual plan offers the best value',
        discount: '16% savings vs monthly'
      };
    }

    // Moderate usage suggests monthly to start
    if (bundlesAccessed >= 2 || daysUsed >= 3) {
      return {
        plan: 'monthly',
        reason: 'Perfect for continued learning'
      };
    }

    // Light usage - encourage with monthly
    return {
      plan: 'monthly',
      reason: 'Continue exploring at your own pace'
    };
  }

  /**
   * Schedule trial reminder notifications
   */
  private static scheduleTrialReminders(trialStatus: TrialStatus): void {
    const now = new Date();

    // Schedule reminders for day 3, day 6, and day 7
    const reminderDays = [3, 6, 7];

    reminderDays.forEach(day => {
      const reminderDate = new Date(trialStatus.startDate.getTime() + (day * 24 * 60 * 60 * 1000));
      
      if (reminderDate > now) {
        const timeUntilReminder = reminderDate.getTime() - now.getTime();
        
        setTimeout(() => {
          const daysLeft = this.TRIAL_DURATION_DAYS - day;
          notificationService.sendTrialReminderNotification(daysLeft);
        }, timeUntilReminder);
      }
    });
  }

  /**
   * Calculate days remaining in trial
   */
  private static calculateDaysRemaining(endDate: Date): number {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    const daysRemaining = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  }

  /**
   * Format time remaining for display
   */
  private static formatTimeRemaining(endDate: Date): string {
    const now = new Date();
    const timeDiff = endDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return 'Expired';

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      return `${days} day${days === 1 ? '' : 's'}`;
    } else if (hours > 0) {
      return `${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      return `${minutes} minute${minutes === 1 ? '' : 's'}`;
    }
  }

  /**
   * Store trial status to Firestore
   */
  private static async storeTrialStatusToFirestore(userId: string, trialStatus: TrialStatus): Promise<void> {
    // Always store in localStorage first for immediate access
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
    
    try {
      // Only attempt Firestore if we're not in localhost development
      if (window.location.hostname !== 'localhost') {
        const trialDoc = doc(db, 'trials', userId);
        await setDoc(trialDoc, {
          ...trialStatus,
          startDate: trialStatus.startDate.toISOString(),
          endDate: trialStatus.endDate.toISOString(),
          updatedAt: new Date().toISOString()
        });
        console.log('Trial status saved to Firestore successfully');
      } else {
        console.log('Development mode: Trial status saved to localStorage only');
      }
    } catch (error) {
      console.warn('Firestore unavailable, using localStorage only:', error);
    }
  }

  /**
   * Get trial status from Firestore
   */
  static async getTrialStatusFromFirestore(userId: string): Promise<TrialStatus | null> {
    try {
      const trialDoc = doc(db, 'trials', userId);
      const docSnap = await getDoc(trialDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const trialStatus: TrialStatus = {
          isActive: data.isActive,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          daysRemaining: this.calculateDaysRemaining(new Date(data.endDate)),
          accessedBundles: data.accessedBundles || [],
          conversionOffered: data.conversionOffered || false
        };
        
        // Update days remaining and check if expired
        if (trialStatus.daysRemaining <= 0) {
          trialStatus.isActive = false;
        }
        
        // Store in localStorage for offline access
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
        
        return trialStatus;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting trial status from Firestore:', error);
      // Fallback to localStorage
      return this.getTrialStatus();
    }
  }

  /**
   * Remove trial status from Firestore
   */
  private static async removeTrialStatusFromFirestore(userId: string): Promise<void> {
    try {
      // Only attempt Firestore if we're not in localhost development
      if (window.location.hostname !== 'localhost') {
        const trialDoc = doc(db, 'trials', userId);
        await deleteDoc(trialDoc);
        console.log('Trial status removed from Firestore successfully');
      } else {
        console.log('Development mode: Trial status removed from localStorage only');
      }
    } catch (error) {
      console.warn('Error removing trial from Firestore:', error);
    }
  }

  /**
   * Store trial status to localStorage
   */
  private static storeTrialStatus(trialStatus: TrialStatus): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trialStatus));
  }

  /**
   * Clear trial data (for testing or when user subscribes)
   */
  static clearTrialData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Extend trial (admin function for customer service)
   */
  static extendTrial(additionalDays: number): boolean {
    const trialStatus = this.getTrialStatus();
    if (!trialStatus) return false;

    const newEndDate = new Date(trialStatus.endDate.getTime() + (additionalDays * 24 * 60 * 60 * 1000));
    trialStatus.endDate = newEndDate;
    trialStatus.daysRemaining = this.calculateDaysRemaining(newEndDate);
    trialStatus.isActive = true;

    this.storeTrialStatus(trialStatus);

    // Track trial extension
    analyticsService.trackFeatureUsage('trial_extended', `${additionalDays}_days`);

    return true;
  }

  /**
   * Check if user is eligible for trial (hasn't had one before)
   */
  static isEligibleForTrial(userId: string): boolean {
    // If no userId provided, user is not eligible
    if (!userId) return false;
    
    // Developer override - always allow trials for developer account
    if (userId === 'ron@theawakenedhybrid.com') {
      return true;
    }
    
    // In a real app, this would check against a backend database
    // For now, we'll check if there's any trial data in localStorage
    const existingTrial = this.getTrialStatus();
    return existingTrial === null;
  }

  /**
   * Clear all trial and subscription data (called on logout)
   */
  static clearAllUserData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem('subscription');
    localStorage.removeItem('purchaseHistory');
    console.log('All user trial and subscription data cleared');
  }

  /**
   * Get trial conversion rate data (for analytics)
   */
  static getConversionMetrics(): {
    trialStarted: boolean;
    daysActive: number;
    bundlesExplored: number;
    conversionShown: boolean;
    timeToConversion?: number;
  } {
    const trialStatus = this.getTrialStatus();
    
    if (!trialStatus) {
      return {
        trialStarted: false,
        daysActive: 0,
        bundlesExplored: 0,
        conversionShown: false
      };
    }

    const daysActive = this.TRIAL_DURATION_DAYS - trialStatus.daysRemaining;
    
    return {
      trialStarted: true,
      daysActive,
      bundlesExplored: trialStatus.accessedBundles.length,
      conversionShown: trialStatus.conversionOffered,
      timeToConversion: trialStatus.isActive ? undefined : daysActive
    };
  }
}

export default TrialService;
